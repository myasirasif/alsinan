import { useState } from "react";
import { useLocation } from "react-router-dom";
import { cleanPhone } from "../lib/phone";

/**
 * Replaces the Contact Form 7 markup with a working form.
 *
 * The classes and structure are kept byte-for-byte from the WordPress output so
 * the theme CSS still applies. Two variants exist on the live site:
 *   "contact" - the full form on /contact-us/ (split first/last name, 2 columns)
 *   "compact" - the shorter form in the blog sidebar (single name, 1 column)
 */
const EMPTY = { firstName: "", lastName: "", email: "", phone: "", message: "", company: "" };


export default function ContactForm({ variant = "contact" }) {
  const { pathname } = useLocation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("init"); // init | sending | sent | error
  const [notice, setNotice] = useState("");

  const split = variant === "contact";
  const col = split ? "col-lg-6" : "col-lg-12";
  const submitClass = split ? "btn btn-primary" : "btn btn-secondary";

  // Contact Form 7 drives the response box entirely through these state classes:
  // init/submitting hide it, sent turns it green, invalid yellow, failed red.
  const cf7Status =
    status === "sending"
      ? "submitting"
      : status === "sent"
      ? "sent"
      : status === "error"
      ? (Object.keys(errors).length ? "invalid" : "failed")
      : "init";

  // A phone field that accepts letters collects unusable leads. Anything that
  // is not a digit is dropped as it is typed, except a "+", which is kept only
  // in the first position - the one place it means anything in a phone number.
  // Filtering on input rather than validating on submit means the field simply
  // cannot hold a wrong character, so there is no error state to explain.
  const set = (field) => (e) => {
    const value = field === "phone" ? cleanPhone(e.target.value) : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    setErrors({});
    setNotice("");

    try {
      // trailing slash on purpose: vercel.json sets trailingSlash, so
      // "/api/contact" answers with a 308 and costs an extra round trip
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, page: pathname }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("sent");
        setValues(EMPTY);
        setNotice("Thank you. We have your message and will get back to you shortly.");
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "generate_lead", form_variant: variant, page_path: pathname });
        return;
      }

      setStatus("error");
      setErrors(data.errors || {});
      setNotice(data.errors ? "Please check the fields marked below." : data.error || "Something went wrong.");
    } catch {
      setStatus("error");
      setNotice("Could not reach the server. Please check your connection or WhatsApp us.");
    }
  }

  const field = (name, type, placeholder, extraClass) => (
    <div className={col}>
      <p>
        <span className="wpcf7-form-control-wrap" data-name={name}>
          <input
            size="40"
            maxLength={name === "phone" ? 16 : 400}
            {...(name === "phone"
              ? { inputMode: "tel", autoComplete: "tel", pattern: "[+]?[0-9]*" }
              : {})}
            {...(name === "email" ? { autoComplete: "email" } : {})}
            className={`wpcf7-form-control wpcf7-text${extraClass ? " " + extraClass : ""}${
              errors[name] ? " wpcf7-not-valid" : ""
            }`}
            aria-required="true"
            aria-invalid={errors[name] ? "true" : "false"}
            placeholder={placeholder}
            type={type}
            name={name}
            value={values[name]}
            onChange={set(name)}
          />
          {errors[name] ? (
            <span className="wpcf7-not-valid-tip" aria-hidden="true">{errors[name]}</span>
          ) : null}
        </span>
      </p>
    </div>
  );

  return (
    <form
      className={`wpcf7-form ${cf7Status}`}
      aria-label="Contact form"
      noValidate
      onSubmit={onSubmit}
      data-status={cf7Status}
    >
      {/* bots fill this in, people never see it */}
      <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex="-1" autoComplete="off"
                 value={values.company} onChange={set("company")} />
        </label>
      </div>

      <div className="row">
        {split ? (
          <>
            {field("firstName", "text", "First Name")}
            {field("lastName", "text", "Last Name")}
          </>
        ) : (
          field("firstName", "text", "Full Name")
        )}
        {field("email", "email", "Email", "wpcf7-email wpcf7-validates-as-email")}
        {field("phone", "tel", "Phone", "wpcf7-tel wpcf7-validates-as-tel")}

        <div className="col-lg-12">
          <p>
            <span className="wpcf7-form-control-wrap" data-name="message">
              <textarea
                cols="40"
                rows="10"
                maxLength="2000"
                className={`wpcf7-form-control wpcf7-textarea${errors.message ? " wpcf7-not-valid" : ""}`}
                aria-required="true"
                aria-invalid={errors.message ? "true" : "false"}
                placeholder="Message"
                name="message"
                value={values.message}
                onChange={set("message")}
              />
              {errors.message ? (
                <span className="wpcf7-not-valid-tip" aria-hidden="true">{errors.message}</span>
              ) : null}
            </span>
          </p>
        </div>

        <div className="col-lg-12">
          <p>
            <input
              className={`wpcf7-form-control wpcf7-submit has-spinner ${submitClass}`}
              type="submit"
              value={status === "sending" ? "Sending..." : "Send"}
              disabled={status === "sending"}
            />
          </p>
        </div>
      </div>

      <div
        className="wpcf7-response-output"
        role="status"
        aria-live="polite"
        aria-hidden={notice ? undefined : "true"}
      >
        {notice}
      </div>
    </form>
  );
}
