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
      <h1>Thank you</h1>
      <p>We have your message and will get back to you shortly. For anything urgent, call us on <a href="tel:+971555252397">+971 55 525 2397</a>.</p>
      <Link className="btn btn-primary me-2" to="/">Back to Home</Link>
      <Link className="btn btn-secondary" to="/services/">Our Services</Link>
      </div>
      </div>
      </div>
      </div>
      </section>
      </main>
    </>
  );
}
