/**
 * A phone field that accepts letters collects unusable leads. Anything that is
 * not a digit is dropped as it is typed, except a "+", which is kept only in
 * the first position - the one place it means anything in a phone number.
 *
 * Filtering on input rather than validating on submit means the field cannot
 * hold a wrong character, so there is no error state to explain to the visitor.
 *
 * It lives in its own module, not inside ContactForm.jsx, so test-contact.mjs
 * can import it: Node will not load a .jsx file.
 *
 * 15 digits is the E.164 maximum, so nothing real is ever truncated.
 */
export const cleanPhone = (raw) => {
  const plus = raw.trimStart().startsWith("+") ? "+" : "";
  return plus + raw.replace(/[^0-9]/g, "").slice(0, 15);
};
