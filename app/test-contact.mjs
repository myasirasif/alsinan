// Exercises api/contact.js without deploying: fetch is stubbed, so no real
// email is sent and no API key is needed.
import handler from "./api/contact.js";

let sentPayload = null;
let recaptchaCalls = 0;

globalThis.fetch = async (url, opts) => {
  if (String(url).includes("recaptcha")) {
    recaptchaCalls++;
    return { ok: true, json: async () => ({ success: true, score: 0.9 }) };
  }
  sentPayload = JSON.parse(opts.body);
  return { ok: true, text: async () => "", json: async () => ({ id: "test" }) };
};

function mockRes() {
  const r = { statusCode: 0, body: null, headers: {} };
  r.status = (c) => ((r.statusCode = c), r);
  r.json = (b) => ((r.body = b), r);
  r.setHeader = (k, v) => (r.headers[k] = v);
  return r;
}

const call = async (body, { method = "POST", ip = "1.2.3.4" } = {}) => {
  const res = mockRes();
  await handler({ method, body, headers: { "x-forwarded-for": ip }, socket: {} }, res);
  return res;
};

const results = [];
const check = (name, ok, detail = "") => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? "  -- " + detail : ""}`);
};

const valid = {
  firstName: "Yasir",
  lastName: "Asif",
  email: "yasir@example.com",
  phone: "+971555252397",
  message: "Need a Hiace for staff transport, Jabal Ali route.",
  page: "/services/staff-transport-in-dubai/",
};

process.env.RESEND_API_KEY = "test-key-not-real";

// wrong method
let r = await call(valid, { method: "GET" });
check("GET is rejected", r.statusCode === 405, `got ${r.statusCode}`);

// missing fields
r = await call({}, { ip: "10.0.0.1" });
check("empty submission returns field errors",
  r.statusCode === 400 && r.body.errors.firstName && r.body.errors.email &&
  r.body.errors.phone && r.body.errors.message,
  JSON.stringify(r.body.errors));

// bad email
r = await call({ ...valid, email: "not-an-email" }, { ip: "10.0.0.2" });
check("invalid email rejected", r.statusCode === 400 && !!r.body.errors.email);

// honeypot
sentPayload = null;
r = await call({ ...valid, company: "spam-bot" }, { ip: "10.0.0.3" });
check("honeypot silently accepted, nothing sent",
  r.statusCode === 200 && r.body.ok === true && sentPayload === null);

// happy path
sentPayload = null;
r = await call(valid, { ip: "10.0.0.4" });
check("valid submission succeeds", r.statusCode === 200 && r.body.ok === true);
check("email addressed correctly",
  // TEMP (testing): matches the temporary default in api/contact.js. Revert to
  // "alsinantransport@gmail.com" alongside it.
  sentPayload?.to?.[0] === "yasirasif222@gmail.com",
  String(sentPayload?.to));
check("reply_to is the customer", sentPayload?.reply_to === valid.email);
check("subject names the sender", sentPayload?.subject?.includes("Yasir Asif"), sentPayload?.subject);
check("source page included in email", sentPayload?.text?.includes(valid.page));
check("message body included", sentPayload?.html?.includes("Jabal Ali"));

// html injection must not survive into the email
sentPayload = null;
await call({ ...valid, firstName: "<script>alert(1)</script>", message: "<img onerror=x>" },
  { ip: "10.0.0.5" });
check("html in input is escaped",
  !sentPayload.html.includes("<script>") && !sentPayload.html.includes("<img onerror"),
  "escaped");

// rate limit: 5 allowed per window, 6th blocked
let blocked = 0;
for (let i = 0; i < 8; i++) {
  const rr = await call(valid, { ip: "9.9.9.9" });
  if (rr.statusCode === 429) blocked++;
}
check("rate limit kicks in after 5", blocked >= 2, `${blocked} of 8 blocked`);

// recaptcha only runs when a secret is configured
recaptchaCalls = 0;
await call(valid, { ip: "10.0.0.6" });
check("recaptcha skipped when no secret set", recaptchaCalls === 0);
process.env.RECAPTCHA_SECRET_KEY = "secret";
await call({ ...valid, recaptchaToken: "tok" }, { ip: "10.0.0.7" });
check("recaptcha verified when secret set", recaptchaCalls === 1);
delete process.env.RECAPTCHA_SECRET_KEY;

// missing key is reported, not silently swallowed
delete process.env.RESEND_API_KEY;
r = await call(valid, { ip: "10.0.0.8" });
check("missing RESEND_API_KEY returns 500", r.statusCode === 500, r.body.error);


// the domain-not-verified fallback: Resend refuses the custom sender, so the
// lead must still go out through the shared sender rather than 502
let attempts = [];
globalThis.fetch = async (url, opts) => {
  if (String(url).includes("recaptcha")) {
    recaptchaCalls++;
    return { ok: true, json: async () => ({ success: true, score: 0.9 }) };
  }
  const payload = JSON.parse(opts.body);
  attempts.push(payload.from);
  if (payload.from.includes("alsinantransport.com")) {
    return { ok: false, status: 403, text: async () => "domain is not verified" };
  }
  sentPayload = payload;
  return { ok: true, text: async () => "", json: async () => ({ id: "test" }) };
};

process.env.RESEND_API_KEY = "test-key-not-real";
attempts = [];
sentPayload = null;
r = await call(valid, { ip: "10.0.0.9" });
check("unverified domain falls back instead of failing",
  r.statusCode === 200 && r.body.ok === true, `attempts: ${attempts.length}`);
check("fallback used the shared sender",
  attempts.length === 2 && attempts[1].includes("resend.dev"), attempts.join(" -> "));
check("fallback still replies to the customer", sentPayload?.reply_to === valid.email);
check("degraded flag set so it is visible", r.body.degraded === true);

const failed = results.filter((x) => !x.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
