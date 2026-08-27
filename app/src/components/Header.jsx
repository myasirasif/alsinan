import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// the breakpoint where styles.css swaps the nav for the hamburger
const MOBILE = "(max-width: 1024px)";

export default function Header() {
  const { pathname } = useLocation();
  const here = pathname.endsWith("/") ? pathname : pathname + "/";
  const navRef = useRef(null);

  // WordPress reloaded the page on every click, which closed the menu for free.
  // Client-side routing does not, so the menu has to close itself.
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);

  // On WordPress a click reloaded the page, so the hovered sub-menu vanished.
  // Here the cursor is still sitting on the parent after navigating and CSS
  // :hover keeps the panel open over the new page. Suppress hover until the
  // pointer actually moves again.
  const [hoverOff, setHoverOff] = useState(false);

  const close = () => {
    setMenuOpen(false);
    setOpenSub(null);
  };

  useEffect(() => {
    close();
    setHoverOff(true);
  }, [pathname]);

  useEffect(() => {
    if (!hoverOff) return;
    const release = () => setHoverOff(false);
    document.addEventListener("mousemove", release, { once: true });
    document.addEventListener("touchstart", release, { once: true });
    return () => {
      document.removeEventListener("mousemove", release);
      document.removeEventListener("touchstart", release);
    };
  }, [hoverOff]);

  // clicking away from the nav closes it, as navigation.js used to do
  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [menuOpen]);

  // Rebuilds the active-state classes WordPress renders server-side, plus the
  // .focus class the theme uses to reveal a sub-menu.
  const mi = (base, to) => {
    const target = to.endsWith("/") ? to : to + "/";
    let cls = base;
    if (here === target) cls += " current-menu-item current_page_item";
    else if (target !== "/" && here.startsWith(target)) cls += " current-menu-ancestor current-menu-parent";
    if (openSub === to) cls += " focus";
    return cls;
  };

  // On mobile a parent item opens its sub-menu instead of navigating, matching
  // the theme's touchstart behaviour. On desktop the CSS hover still applies.
  const onParentClick = (e, to) => {
    if (typeof window === "undefined" || !window.matchMedia(MOBILE).matches) return;
    e.preventDefault();
    setOpenSub((cur) => (cur === to ? null : to));
  };

  // any ordinary menu link closes the whole thing, including same-page links
  const onNavClick = (e) => {
    const link = e.target.closest("a");
    if (!link || !navRef.current?.contains(link)) return;
    if (link.parentElement?.classList.contains("menu-item-has-children")) return;
    close();
  };

  return (
    <>
      <div className="header_top">
      <div className="container">
      <div className="row">
      <div className="col-lg-9">
      <div className="contact_top_details">
      <ul>
      <li><a href="mailto:alsinantransport@gmail.com"><img src="/wp-content/uploads/2025/09/icon_mail.svg" alt="" />alsinantransport@gmail.com</a></li>
      <li><a href=""><img src="/wp-content/uploads/2025/09/icon_pin_map.svg" alt="" />P2AG-L03, Bur Dubai - United Arab Emirates</a></li>
      </ul>
      </div>
      </div>
      <div className="col-lg-3 text-end">
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
      <header id="masthead" className="site-header">
      <div className="container">
      <div className="row">
      <div className="col-lg-2 col-5 col-logo">
      <div className="site-branding">
      <Link className="custom-logo-link" rel="home" to="/"><img src="/wp-content/uploads/2025/09/logo.svg" className="custom-logo" alt="Alsinan Transport Dubai company logo" decoding="async" /></Link>
      </div>
      </div>
      <div className="col-lg-10 col-7 col-menu">
      <div className="menu_wrap">
      <div className="menu_box">
      <nav id="site-navigation" ref={navRef} onClick={onNavClick}
           className={"main-navigation" + (menuOpen ? " toggled" : "") + (hoverOff ? " hover-suppressed" : "")}>
      <button className="menu-toggle" aria-controls="primary-menu"
              aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}><img src="/wp-content/uploads/2025/09/icon_hamburger.png" alt="icon menu" /></button>
      <div className="menu-menu-1-container"><ul id="primary-menu" className="menu"><li id="menu-item-47" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-home menu-item-47", "/")}><Link to="/">Home</Link></li>
      <li id="menu-item-48" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-48", "/about/")}><Link to="/about/">About</Link></li>
      <li id="menu-item-52" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-has-children menu-item-52", "/services/")}><Link to="/services/" onClick={(e) => onParentClick(e, "/services/")}>Services</Link>
      <ul className="sub-menu">
      <li id="menu-item-258" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-258", "/services/dubai-tours-transport-services/")}><Link to="/services/dubai-tours-transport-services/">For Tours &#038; Excursions</Link></li>
      <li id="menu-item-259" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-259", "/services/private-car-rental-in-dubai/")}><Link to="/services/private-car-rental-in-dubai/">For Private Travellers</Link></li>
      <li id="menu-item-260" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-260", "/services/staff-transport-in-dubai/")}><Link to="/services/staff-transport-in-dubai/">For Staff</Link></li>
      <li id="menu-item-261" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-261", "/services/hotel-transport-service-in-dubai/")}><Link to="/services/hotel-transport-service-in-dubai/">For Hotel</Link></li>
      <li id="menu-item-262" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-262", "/services/airport-transport-in-dubai/")}><Link to="/services/airport-transport-in-dubai/">For Airport</Link></li>
      <li id="menu-item-263" className={mi("menu-item menu-item-type-custom menu-item-object-custom menu-item-263", "/services/school-transport-in-dubai/")}><Link to="/services/school-transport-in-dubai/">For School</Link></li>
      </ul>
      </li>
      <li id="menu-item-50" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-50", "/our-fleet/")}><Link to="/our-fleet/">Our Fleet</Link></li>
      <li id="menu-item-333" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-333", "/blogs/")}><Link to="/blogs/">Blogs</Link></li>
      <li id="menu-item-49" className={mi("menu-item menu-item-type-post_type menu-item-object-page menu-item-49", "/contact-us/")}><Link to="/contact-us/">Contact us</Link></li>
      </ul></div>								</nav>
      </div>
      <div className="whatsapp_num">
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
      </div>
      </div>
      </header>
    </>
  );
}
