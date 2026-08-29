import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="colophon" className="site-footer">
    <div className="container">
    <div className="row row justify-content-between d-flex">
    <div className="col-lg-4">
    <div className="footer_logo">
    <div className="site-branding">
    <Link className="custom-logo-link" rel="home" to="/"><img src="/wp-content/uploads/2025/09/logo.svg" className="custom-logo" alt="Alsinan Transport Dubai company logo" decoding="async" width="209" height="75" /></Link>
    </div>
    <p>Alsinan Transports is proud to call Dubai home.</p>
    <div className="whatsapp_num white_num">
    <div className="whatsapp_box">
    <div className="icon_wp">
    <img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" width="37" height="36" />
    </div>
    <div className="num_wp">
    <span>Whasapp</span>
    <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" target="_blank">+971 55 525 2397</a>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="col-lg-6">
    <div className="row">
    <div className="col-lg-5">
    <div className="list_col">
    <h3>Our Services</h3>
    <ul>
    <li><Link to="/services/school-transport-in-dubai/">For School</Link></li>
    <li><Link to="/services/airport-transport-in-dubai/">For Airport</Link></li>
    <li><Link to="/services/hotel-transport-service-in-dubai/">For Hotel</Link></li>
    <li><Link to="/services/staff-transport-in-dubai/">For Staff</Link></li>
    <li><Link to="/services/private-car-rental-in-dubai/">Private Travelers</Link></li>
    <li><Link to="/services/dubai-tours-transport-services/">Tours & Excursion</Link></li>
    </ul>
    </div>
    </div>
    <div className="col-lg-7">
    <div className="list_col">
    <h3>Get in Touch</h3>
    <ul>
    <li><a href="tel:+971555252397"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" width="19" height="19" /> +971 55 525 2397</a></li>
    <li><a href="mailto:alsinantransport@gmail.com"><img src="/wp-content/uploads/2025/09/icon_mail.svg" alt="" width="19" height="14" /> alsinantransport@gmail.com</a></li>
    <li><a href="https://www.google.com/maps/search/?api=1&query=25.0760224,55.2274879" target="_blank" rel="noopener"><img src="/wp-content/uploads/2025/09/icon_pin_map.svg" alt="" width="15" height="19" /> P2AG-L03, Bur Dubai - United Arab Emirates</a></li>
    </ul>
    <h3>Follow Us On:</h3>
    <div className="social_icons">
    <ul>
    <li><a href="https://www.facebook.com/share/17Kka81PY8/?mibextid=wwXIfr" target="_blank"><img src="/wp-content/uploads/2025/09/icon_fb.svg" alt="Alsinan Transport on Facebook" width="8" height="14" /></a></li>
    <li><a href="https://www.instagram.com/al_sinan_passengers_tranaport?igsh=MW4xaTU1NmFueHhibA%3D%3D&utm_source=qr" target="_blank"><img src="/wp-content/uploads/2025/09/icon_insta.svg" alt="Alsinan Transport on Instagram" width="15" height="14" /></a></li>

    </ul>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    <div className="row">
    <div className="col-12">
    <hr />
    </div>
    </div>
    <div className="copyright_wrap">
    <div className="row">
    <div className="col-lg-6">
    <div className="copyright_line"><p className="mb-0">Copyright © 2026. ALSINAN TRANSPORT</p><div className="list_col">
    <ul className="d-inline-flex gap-3 mb-0">
    <li><Link style={{ lineHeight: "20px" }} to="/blogs/">Blogs</Link></li>
    <li><Link style={{ lineHeight: "20px" }} to="/terms-and-conditions/">Terms & Conditions</Link></li>
    <li><Link style={{ lineHeight: "20px" }} to="/privacy-policy/">Privacy Policy</Link></li>
    </ul>
    </div></div>
    </div>
    <div className="col-lg-6 text-end"><p className="mb-0 site_credit">Design and developed with <span className="site_credit__heart">&#9829;</span> by <a href="https://yasirafridi.dev/" target="_blank" rel="noopener">Yasir</a></p>
    <div className="footer_call_btn">
    <a href="tel:+971555252397" className="btn btn-primary" target="_blank"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" width="19" height="19" /></a>
    </div>
    <div className="footer_btn">
    <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" className="btn btn-primary" target="_blank"><img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" width="37" height="36" /></a>
    </div>
    </div>
    </div>
    </div>
    </div>
    </footer>
  );
}
