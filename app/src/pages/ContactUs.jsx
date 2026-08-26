import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ContactForm from "../components/ContactForm";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function ContactUs() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/contact-us/"]} />
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>Contact us</h1>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="needbox_section">
      <div className="form_section_inner">
      <div className="container">
      <div className="row">
      <div className="col-lg-8">
      <div className="form_top_row">
      <div className="content_middle_contact_form">

      <span className="sub_head">
                              Contact Us
                          </span>
      <h2>We’re Here When You Need Us</h2>
      <p>Got questions about bookings or want some details? Whatever you need, our team’s ready to help with our trusted transport services across Dubai and the UAE.
      </p>
      </div>
      </div>
      </div>
      </div>
      <div className="row">
      <div className="col-lg-4">
      <div className="form_middle_row">
      <div className="contact_frm_content">
      <h3>Get in Touch</h3>

      <ul>
      <li><a href="tel:+97155 525 2397"><img src="/wp-content/uploads/2025/09/icon_ph.svg" alt="" /> +97155 525 2397</a></li>
      <li><a href="mailto:alsinantransport@gmail.com"><img src="/wp-content/uploads/2025/09/icon_mail.svg" alt="" /> alsinantransport@gmail.com</a></li>
      <li><a href=""><img src="/wp-content/uploads/2025/09/icon_pin_map.svg" alt="" /> P2AG-L03, Bur Dubai - United Arab Emirates</a></li>
      </ul>
      </div>
      </div>
      </div>
      <div className="col-lg-8">
      <div className="form_middle_row">
      <div className="contact_form">
      <h3>Message Us</h3>
      <div className="wpcf7 no-js" id="wpcf7-f77-o1" lang="en-US" dir="ltr" data-wpcf7-id="77">
      <div className="screen-reader-response"><p role="status" aria-live="polite" aria-atomic="true"></p> <ul></ul></div>
      <ContactForm variant="contact" />
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      <div className="map-section">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d462563.03270743275!2d54.897829829826904!3d25.075658397988125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai!5e0!3m2!1sen!2sae!4v1767152903040!5m2!1sen!2sae" style={{ width: "100%", maxWidth: "100%", height: "450px", border: "0" }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
      </section>



      <section className="services_section why-we-offer-sec">
      <div className="container">
      <div className="row">
      <div className="col-lg-6">
      <div className="servcies_content">

      <h2>What We Offer</h2>
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
      <div className="col-lg-6">
      <div className="servies_fields">
      <div className="row">
      <div className="col-lg-6">
      <div className="services_box">
      <h3>Available 24/7</h3>
      <p>Day or night, bookings and support are always open.</p>

      </div>
      </div>
      <div className="col-lg-6">
      <div className="services_box">
      <h3>Let’s Get You Moving</h3>
      <p>Drop us a call or message anytime, and we’ll make sure you’re on the road in no time.
      </p>

      </div>
      </div>
      <div className="col-lg-12">
      <div className="services_box">
      <h3>Serving Dubai & Across the UAE
      </h3>
      <p>Need a private car for a quick trip or a <b>bus rental in Dubai</b> for your team? Just drop us a message and we’ll sort it out.</p>

      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>



      <section className="needbox_section">
      <div className="container">
      <div className="row">
      <div className="col-12">
      <div className="need_box_wrap" style={{ backgroundImage: "url('/wp-content/uploads/2025/09/banner_bg.webp')" }}>
      <div className="img_car">
      <img src="/wp-content/uploads/2025/09/red_area.png" alt="" />
      </div>
      <div className="content_middle">
      <span className="sub_head">Looking for a safe and reliable transport services in Dubai?</span>
      <h2>Contact us today to book your ride!</h2>
      </div>
      <div className="whatsapp_num white_num">
      <div className="whatsapp_box">
      <div className="icon_wp">
      <img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" />
      </div>
      <div className="num_wp">
      <span>Whatsapp</span>
      <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" target="_blank">+97155 525 2397</a>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
    </>
  );
}
