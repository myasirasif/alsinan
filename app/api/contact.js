// Contact form handler. Replaces the Contact Form 7 endpoint the WordPress
// site used. Runs on Vercel; the Resend key never leaves the environment.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// read lazily so the module can be exercised without a cold start
const toAddress = () => process.env.CONTACT_TO_EMAIL || "alsinantransport@gmail.com";
const fromAddress = () =>
  process.env.CONTACT_FROM_EMAIL || "Alsinan Website <noreply@alsinantransport.com>";
const recaptchaSecret = () => process.env.RECAPTCHA_SECRET_KEY;

const LIMITS = { name: 120, email: 200, phone: 40, message: 2000, page: 300 };

// Best-effort burst protection. Serverless instances are recycled, so this
// slows down a hammering client rather than enforcing a hard global quota.
const hits = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v, max) =>
  typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "";

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

async function verifyRecaptcha(token, ip) {
  const secret = recaptchaSecret();
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing token" };
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip || "" }),
    });
    const data = await res.json();
    // v3 returns a 0-1 score; 0.5 is Google's suggested cut-off
    return { ok: data.success === true && (data.score ?? 1) >= 0.5, score: data.score };
  } catch {
    // never lose a lead because Google timed out
    return { ok: true, degraded: true };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ ok: false, error: "Email is not configured yet." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  // hidden field a human never sees, so anything in it is a bot
  if (clean(body.company, 50)) {
    return res.status(200).json({ ok: true });
  }

  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many messages. Please try again later." });
  }

  const firstName = clean(body.firstName, LIMITS.name);
  const lastName = clean(body.lastName, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const phone = clean(body.phone, LIMITS.phone);
  const message = clean(body.message, LIMITS.message);
  const page = clean(body.page, LIMITS.page);

  const errors = {};
  if (!firstName) errors.firstName = "Please enter your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "That email does not look right.";
  if (!phone) errors.phone = "Please enter your phone number.";
  if (!message) errors.message = "Please tell us what you need.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ ok: false, errors });
  }

  const captcha = await verifyRecaptcha(body.recaptchaToken, ip);
  if (!captcha.ok) {
    return res.status(400).json({ ok: false, error: "Could not verify you are human. Please try again." });
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const rows = [
    ["Name", fullName],
    ["Email", email],
    ["Phone", phone],
    ["Submitted from", page || "unknown"],
  ];

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;color:#111">
      <h2 style="margin:0 0 16px">New enquiry from alsinantransport.com</h2>
      <table cellpadding="6" style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="color:#666">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`
          )
          .join("")}
      </table>
      <div style="white-space:pre-wrap;padding:12px;background:#f6f6f6;border-radius:6px">${escapeHtml(
        message
      )}</div>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${message}`;

  const send = (from, to = toAddress()) =>
    fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email, // replying in Gmail goes straight to the customer
        subject: `New enquiry from ${fullName}`,
        html,
        text,
      }),
    });

  try {
    let resend = await send(fromAddress());

    // Until the domain is verified in Resend, sending from it is refused and
    // every lead would be lost. Resend's shared sender always works, so fall
    // back to it rather than dropping the enquiry. reply_to still points at the
    // customer, so replying works either way.
    if (!resend.ok && (resend.status === 403 || resend.status === 422)) {
      const detail = await resend.text();
      console.error(
        `Resend refused ${fromAddress()} (${resend.status}): ${detail}. ` +
          "Verify the domain in Resend. Retrying via onboarding@resend.dev."
      );
      // Resend's shared sender will only deliver to the address the account was
      // registered with, so allow that to be set separately from the real
      // recipient. Without it the fallback bounces too.
      resend = await send("Alsinan Website <onboarding@resend.dev>",
                          process.env.CONTACT_FALLBACK_TO || toAddress());
      if (resend.ok) {
        return res.status(200).json({ ok: true, degraded: true });
      }
    }

    if (!resend.ok) {
      const detail = await resend.text();
      console.error("Resend rejected the message:", resend.status, detail);
      return res
        .status(502)
        .json({ ok: false, error: "We could not send your message. Please WhatsApp us instead." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact form failed:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Something went wrong. Please WhatsApp us instead." });
  }
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
