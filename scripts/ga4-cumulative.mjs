// Cumulative numbers since 2025-01-01 (same window Modonty footer uses)
import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
const s = JSON.parse(readFileSync('scripts/.ga4-secrets.json', 'utf8'));
const PROP = s.GA4_PROPERTY_ID;
const EMAIL = s.GA4_CLIENT_EMAIL;
const PK = Buffer.from(s.GA4_PRIVATE_KEY_BASE64, 'base64').toString('utf8');

function b64url(x){return Buffer.from(x).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')}
async function getToken(){
  const now=Math.floor(Date.now()/1000);
  const h=b64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const p=b64url(JSON.stringify({iss:EMAIL,scope:'https://www.googleapis.com/auth/analytics.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const sig=createSign('RSA-SHA256');sig.update(`${h}.${p}`);
  const jwt=`${h}.${p}.${sig.sign(PK).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')}`;
  const r=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt})});
  return (await r.json()).access_token;
}
async function run(t,b){
  const r=await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${PROP}:runReport`,{method:'POST',headers:{Authorization:`Bearer ${t}`,'Content-Type':'application/json'},body:JSON.stringify(b)});
  return await r.json();
}

const ENGAGEMENT=new Set(['outbound_click','article_like','article_favorite','article_share','comment_submit','comment_reply','client_favorite','client_share','client_comment_submit','follow_client','ask_client_submit','contact_submit','newsletter_subscribe','conversion_complete']);

const t=await getToken();
const [totals,events]=await Promise.all([
  run(t,{dateRanges:[{startDate:'2025-01-01',endDate:'today'}],metrics:[{name:'sessions'},{name:'screenPageViews'},{name:'eventCount'},{name:'averageSessionDuration'},{name:'totalUsers'},{name:'newUsers'}]}),
  run(t,{dateRanges:[{startDate:'2025-01-01',endDate:'today'}],dimensions:[{name:'eventName'}],metrics:[{name:'eventCount'}],limit:100}),
]);

const m=totals.rows?.[0]?.metricValues??[];
const sessions=Number(m[0]?.value??0);
const pageViews=Number(m[1]?.value??0);
const eventCount=Number(m[2]?.value??0);
const avgSecs=Math.round(Number(m[3]?.value??0));
const totalUsers=Number(m[4]?.value??0);
const newUsers=Number(m[5]?.value??0);

let interactions=0;
for(const r of events.rows??[]){
  const n=r.dimensionValues?.[0]?.value??'';
  if(ENGAGEMENT.has(n)) interactions+=Number(r.metricValues?.[0]?.value??0);
}

const grandTotal=sessions+pageViews+eventCount+interactions;

console.log(`\n═══ MODONTY — تراكمي من ٢٠٢٥/١/١ إلى اليوم ═══\n`);
console.log(`  الأثر الرقمي (grand total): ${grandTotal.toLocaleString('en-US')}`);
console.log(`  ─────────────────────────────`);
console.log(`  👥 المستخدمون: ${totalUsers.toLocaleString('en-US')}`);
console.log(`  🆕 مستخدم جديد: ${newUsers.toLocaleString('en-US')}`);
console.log(`  🔗 الجلسات: ${sessions.toLocaleString('en-US')}`);
console.log(`  👁️  المشاهدات: ${pageViews.toLocaleString('en-US')}`);
console.log(`  ⚡ الأحداث الكلية: ${eventCount.toLocaleString('en-US')}`);
console.log(`  🎯 التفاعلات الحقيقية: ${interactions.toLocaleString('en-US')}`);
console.log(`  ⏱️  متوسط الجلسة: ${Math.floor(avgSecs/60)}:${String(avgSecs%60).padStart(2,'0')} دقيقة`);
