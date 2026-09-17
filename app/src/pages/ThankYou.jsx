import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

// Where ContactForm sends people after a successful submit. Its URL is what
// GA4 and Google Ads count as a conversion, so it is kept out of the index.
export default function ThankYou() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/thank-you/"]} />
      <main id="primary" className="site-main">
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>Thank You</h1>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="py-5">
      <div className="container">
      <div className="row justify-content-center">
      <div className="col-lg-7 text-center">
      <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true" className="mb-4">
      <circle cx="12" cy="12" r="12" fill="#e30613" />
      <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <h2 className="mb-3">Your message has been sent</h2>
      <p className="mb-4" style={{ fontSize: "18px" }}>We have received your enquiry and will get back to you shortly. For anything urgent, call or WhatsApp us on <a href="tel:+971555252397"><strong>+971 55 525 2397</strong></a>.</p>
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-center gap-3">
      <Link className="btn btn-primary" style={{ width: "230px", height: "50px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }} to="/">Back to Home</Link>
      <Link className="btn btn-primary" style={{ width: "230px", height: "50px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", background: "#1d1d1b", borderColor: "#1d1d1b", color: "#fff" }} to="/services/">Our Services</Link>
      <a className="btn btn-secondary btn-whatsapp" style={{ width: "230px", height: "50px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }} href="https://wa.me/971555252397" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> WhatsApp Us</a>
      </div>
      </div>
      </div>
      </div>
      </section>
      </main>
    </>
  );
}
