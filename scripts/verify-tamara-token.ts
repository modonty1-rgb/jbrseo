/**
 * Proves the webhook door only opens for Tamara.
 *
 * Run: `npx tsx scripts/verify-tamara-token.ts`
 *
 * It signs tokens the way an attacker would have to and asserts each one is refused. The
 * secret below is a throwaway used only to sign the test tokens — the real notification
 * token is never needed to check this logic, which is the point of keeping the verifier
 * free of environment reads.
 */
import { verifyTamaraToken } from "../lib/tamara/webhook-token";
import { createHmac } from "node:crypto";

const SECRET = "test-secret-not-the-real-one";
const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");

function sign(header: object, payload: object, secret = SECRET): string {
  const head = `${b64(header)}.${b64(payload)}`;
  return `${head}.${createHmac("sha256", secret).update(head).digest("base64url")}`;
}

const future = Math.floor(Date.now() / 1000) + 3600;
const past = Math.floor(Date.now() / 1000) - 10;

const cases: [string, string, boolean][] = [
  ["توقيع صحيح من تمارا", sign({ alg: "HS256", typ: "JWT" }, { iss: "Tamara", exp: future }), true],
  ["بلا exp (صالح كذلك)", sign({ alg: "HS256" }, { iss: "Tamara" }), true],
  ["وقّعه مهاجم بسرّ آخر", sign({ alg: "HS256" }, { iss: "Tamara", exp: future }, "attacker"), false],
  ["alg: none لتجاوز التوقيع", `${b64({ alg: "none" })}.${b64({ iss: "Tamara", exp: future })}.`, false],
  ["مُصدِر مزوّر", sign({ alg: "HS256" }, { iss: "NotTamara", exp: future }), false],
  ["منتهي الصلاحية", sign({ alg: "HS256" }, { iss: "Tamara", exp: past }), false],
  [
    "حمولة عُدّلت بعد التوقيع",
    (() => {
      const t = sign({ alg: "HS256" }, { iss: "Tamara", exp: future }).split(".");
      t[1] = b64({ iss: "Tamara", exp: future, hacked: 1 });
      return t.join(".");
    })(),
    false,
  ],
  ["نص عشوائي", "not-a-jwt", false],
];

let passed = 0;
for (const [label, token, shouldAccept] of cases) {
  const verdict = verifyTamaraToken(token, SECRET);
  const correct = verdict.ok === shouldAccept;
  if (correct) passed++;
  const outcome = verdict.ok ? "قُبل" : `رُفض (${verdict.reason})`;
  console.log(`${correct ? "✅" : "❌"} ${label.padEnd(26)} → ${outcome}`);
}

// A missing secret must refuse everything, including an otherwise-perfect token.
const noSecret = verifyTamaraToken(sign({ alg: "HS256" }, { iss: "Tamara" }), "");
const noSecretOk = !noSecret.ok;
if (noSecretOk) passed++;
console.log(`${noSecretOk ? "✅" : "❌"} ${"بلا سرّ مُعَدّ".padEnd(26)} → ${noSecret.ok ? "قُبل" : `رُفض (${noSecret.reason})`}`);

const total = cases.length + 1;
console.log(`\n${passed}/${total} نجحت`);
process.exit(passed === total ? 0 : 1);
