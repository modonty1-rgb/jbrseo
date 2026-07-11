// Run the LIVE library function to see what the landing gets
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
for (const [k, v] of Object.entries(env)) process.env[k] = v;

const { createSign } = await import('node:crypto');

// EXACT copy of the library logic, no cache wrapper
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL;
const SINCE = "2025-01-01";
const ENGAGEMENT = new Set(["outbound_click","article_like","article_favorite","article_share","comment_submit","comment_reply","client_favorite","client_share","client_comment_submit","follow_client","ask_client_submit","contact_submit","newsletter_subscribe","conversion_complete"]);

function getPK(){
  const b64 = process.env.GA4_PRIVATE_KEY_BASE64;
  if (b64) return Buffer.from(b64, 'base64').toString('utf8');
  const raw = process.env.GA4_PRIVATE_KEY;
  return raw ? raw.replace(/\\n/g, '\n').trim() : null;
}
function b64u(x){return Buffer.from(x).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')}
async function tok(){
  const now=Math.floor(Date.now()/1000);
  const h=b64u(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const p=b64u(JSON.stringify({iss:CLIENT_EMAIL,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const s=createSign('RSA-SHA256');s.update(`${h}.${p}`);
  const jwt=`${h}.${p}.${b64u(s.sign(getPK()))}`;
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt})});
  const j=await r.json();
  console.log('token status:', r.status, r.ok ? 'OK' : JSON.stringify(j).slice(0,200));
  return j.access_token;
}
async function run(t,b){
  const r=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROPERTY_ID}:runReport`,{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify(b)});
  const j=await r.json();
  if(!r.ok) console.log('report err:', JSON.stringify(j).slice(0,300));
  return j;
}
console.log('property:', PROPERTY_ID);
console.log('email:', CLIENT_EMAIL);
console.log('PK len:', getPK()?.length);
const t = await tok();
const [totals, events] = await Promise.all([
  run(t,{dateRanges:[{startDate:SINCE,endDate:'today'}],metrics:[{name:'sessions'},{name:'screenPageViews'},{name:'eventCount'},{name:'averageSessionDuration'},{name:'totalUsers'}]}),
  run(t,{dateRanges:[{startDate:SINCE,endDate:'today'}],dimensions:[{name:'eventName'}],metrics:[{name:'eventCount'}],limit:100}),
]);
const m=totals.rows?.[0]?.metricValues??[];
const sessions=Number(m[0]?.value??0);
const pageViews=Number(m[1]?.value??0);
const eventCount=Number(m[2]?.value??0);
const users=Number(m[4]?.value??0);
let interactions=0;
for(const r of events.rows??[]){
  const n=r.dimensionValues?.[0]?.value??'';
  if(ENGAGEMENT.has(n)) interactions+=Number(r.metricValues?.[0]?.value??0);
}
const grandTotal = sessions + pageViews + eventCount + interactions;
console.log(`\n📊 (reading env from .env.local):`);
console.log(`  users: ${users}`);
console.log(`  sessions: ${sessions}`);
console.log(`  pageViews: ${pageViews}`);
console.log(`  events: ${eventCount}`);
console.log(`  interactions: ${interactions}`);
console.log(`  grandTotal: ${grandTotal}`);
