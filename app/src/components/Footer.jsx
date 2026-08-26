import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer id="colophon" className="site-footer">
    <div className="container">
    <div className="row row justify-content-between d-flex">
    <div className="col-lg-4">
    <div className="footer_logo">
    <div className="site-branding">
    <Link className="custom-logo-link" rel="home" to="/"><img src="/wp-content/uploads/2025/09/logo.svg" className="custom-logo" alt="Alsinan Transport Dubai company logo" decoding="async" /></Link>
    </div>
    <p>Alsinan Transports is proud to call Dubai home.</p>
    <div className="whatsapp_num white_num">
    <div className="whatsapp_box">
    <div className="icon_wp">
    <img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" />
    </div>
    <div className="num_wp">
    <span>Whasapp</span>
    <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" target="_blank">+97155 525 2397</a>
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
    <li><a href="tel:+97155 525 2397"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" /> +97155 525 2397</a></li>
    <li><a href="mailto:alsinantransport@gmail.com"><img src="/wp-content/uploads/2025/09/icon_mail.svg" alt="" /> alsinantransport@gmail.com</a></li>
    <li><a href=""><img src="/wp-content/uploads/2025/09/icon_pin_map.svg" alt="" /> P2AG-L03, Bur Dubai - United Arab Emirates</a></li>
    </ul>
    <h3>Follow Us On:</h3>
    <div className="social_icons">
    <ul>
    <li><a href="https://www.facebook.com/share/17Kka81PY8/?mibextid=wwXIfr" target="_blank"><img src="/wp-content/uploads/2025/09/icon_fb.svg" alt="Alsinan Transport on Facebook" /></a></li>
    <li><a href="https://www.instagram.com/al_sinan_passengers_tranaport?igsh=MW4xaTU1NmFueHhibA%3D%3D&utm_source=qr" target="_blank"><img src="/wp-content/uploads/2025/09/icon_insta.svg" alt="Alsinan Transport on Instagram" /></a></li>

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
    <p className="mb-0">Copyright © 2026. ALSINAN TRANSPORT</p>
    </div>
    <div className="col-lg-6 text-end">
    <div className="list_col">
    <ul className="d-inline-flex gap-3 mb-0">
    <li><Link style={{ lineHeight: "20px" }} to="/blogs/">Blogs</Link></li>
    <li><Link style={{ lineHeight: "20px" }} to="/terms-and-conditions/">Terms & Conditions</Link></li>
    <li><Link style={{ lineHeight: "20px" }} to="/privacy-policy/">Privacy Policy</Link></li>
    </ul>
    </div>
    <div className="footer_call_btn">
    <a href="tel:+97155 525 2397" className="btn btn-primary" target="_blank"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" /></a>
    </div>
    <div className="footer_btn">
    <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" className="btn btn-primary" target="_blank"><img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" /></a>
    </div>
    </div>
    </div>
    </div>
    </div>
    </footer>
  );
}
