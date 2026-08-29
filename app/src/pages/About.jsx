import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { ServicesSection, ServiceBox } from "../components/sections/ServicesSection";
import { WhyChoose, ChoosePoint } from "../components/sections/WhyChoose";
import AboutPanel from "../components/sections/AboutPanel";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function About() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/about/"]} />
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>About</h1>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="why_choose about-us-sec">
      <div className="container">
      <div className="row">
      <div className="col-lg-6">
      <h2>Reliable Transport for Every Journey</h2>
      </div>
      <div className="col-lg-6">
      <div className="about_content">
      <span className="sub_head">About Us</span>
      <p>Getting around Dubai or anywhere in the UAE does not need to feel complicated. At Alsinan Transport, we keep your travel simple and well organised. Our focus is straightforward. Comfortable travel, calm journeys and timing that you can genuinely rely on.</p>
      <p>Whether it is a short city trip or regular movement for people who depend on you, we make sure things run smoothly. From your first message to the final drop off, every detail is handled carefully so you can focus on your purpose instead of worrying about the travel.</p>
      <Link className="btn btn-primary" to="/contact-us/">Contact Us</Link>
      </div>
      </div>
      </div>
      </div>
      </section>

      <AboutPanel
        image="/wp-content/uploads/2025/09/about_large.webp"
        alt="Grey Mercedes Sprinter passenger van with its side door open">
        <div className="about_content">
      <h2>Who We Are</h2>
      <p>Alsinan Transport supports individuals, families, educational institutions and businesses with dependable movement across Dubai and the UAE. We provide vehicles and professional driving support that match real schedules, real situations and everyday requirements.</p>
      <p>We are trusted for more than occasional bookings. Daily movement, routine travel needs, organised trips and well structured commuting support, this is our everyday work, and our operations are built around it.</p>
      <p>With sensible planning, reliable coordination and experienced drivers, every journey is designed to feel steady, organised and reassuring, whether it is a one time need or an ongoing requirement.</p>

      <Link className="btn btn-primary" to="/contact-us/">Contact Us</Link>
        </div>
      </AboutPanel>


      <WhyChoose
        variant="ledger"
        tone="plain"
        heading={<><span className="sub_head">
                              Our Values
                          </span>
      <h2>Our Mission & Values</h2>
      <p>Alsinan Transport works with one simple commitment. Every ride should feel safe, comfortable and confidently on time. A few core principles guide how we operate every day.</p></>}
        footer={<><Link className="btn btn-primary" to="/contact-us/">Contact Us</Link></>}
        media={<><div className="col-lg-6">
      <div className="why_choose_img">
      <div className="choose_img_small">
      <img src="/wp-content/uploads/2025/09/choose_small.webp" alt="Orange BMW M3 parked on a palm-lined street" />
      </div>
      <div className="why_choose_img_lg">
      <img src="/wp-content/uploads/2025/09/choose_large.webp" alt="Rear view of a white Toyota Hiace Premio passenger van" />
      </div>
      </div>
      </div></>}>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_safety_security.svg" alt="" width="61" height="61" />
      <h3>Safety and Professionalism</h3>
      </div>
      <p>Passengers travel with trained, licensed drivers in vehicles that go through proper checks and follow local regulations.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_ontime.svg" alt="" width="67" height="61" />
      <h3>Reliability and Timing</h3>
      </div>
      <p>We understand how delays affect everything. That is why routes and timings are planned carefully so journeys remain predictable.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_professional_drivers.svg" alt="" width="65" height="61" />
      <h3>Flexibility and Practical Support</h3>
      </div>
      <p>Short journeys, routine movement, schedules or extended arrangements, we shape our service around your situation instead of forcing fixed patterns.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_maintenance.svg" alt="" width="64" height="60" />
      <h3>Customer-First Mindset</h3>
      </div>
      <p>Clear communication, honest handling and focus on comfort remain at the centre of how we work.</p>
        </ChoosePoint>
      </WhyChoose>


      <ServicesSection
        className="services_section why-we-offer-sec"
        heading={<><h2>What We Offer</h2></>}
        intro={<><p>Travel across the city and between emirates becomes easier when planning is thoughtful. Our services are designed to support organised, dependable movement.</p></>}>
        <ServiceBox col="6">
      <h3>Staff Transport and School Runs</h3>
      <p>Regular and well-structured <Link target="_blank" to="/services/staff-transport-in-dubai/">staff transport service</Link> solutions with planned movement and consistent timing, so daily routines remain stable.</p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Airport Transfers</h3>
      <p>Comfortable rides supported with sensible timing management for early departures, late arrivals and changing plans through our 
      <Link target="_blank" to="/services/airport-transport-in-dubai/">airport transfer service</Link>.</p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Car, Van and Bus Rentals</h3>
      <p>Whatever your journey calls for, we have the right vehicle. Cars for individuals, vans for small groups, and buses for larger groups. We also provide 
      <Link target="_blank" to="/services/dubai-tours-transport-services/">tour and trip transport</Link> so your travel becomes easier, organised and comfortable.</p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Corporate and Group Support</h3>
      <p>Arrangements tailored for organisations with clear pricing and dependable planning.</p>
        </ServiceBox>
        <ServiceBox col="12">
      <h3>Day Trips and Excursions</h3>
      <p>Travel support for private plans, tours and inter emirate journeys. From planning to execution, everything is designed to make travel simple, organised and stress free.</p>
        </ServiceBox>
      </ServicesSection>

      <section className="why-choose-us-infographic">
      <div className="container">
      <div className="row align-items-center">

      <div className="col-md-6 mb-4 mb-md-0 text-center">
      <div className="servcies_content">

      <h2>Why Choose Us</h2>

      </div>
      </div>

      <div className="col-md-6">
      <div className="step-item mb-5">
      <div className="step-icon"><i className="fas fa-id-card-alt"></i></div>
      <div className="step-text">
      <h5>Licensed and Responsible Drivers</h5>
      <p>Trained, polite and route aware drivers focused on passenger safety and comfort.</p>
      </div>
      </div>
      <div className="step-item mb-5">
      <div className="step-icon"><i className="fas fa-car-side"></i></div>
      <div className="step-text">
      <h5>Well Maintained Vehicles</h5>
      <p>Clean, comfortable and prepared vehicles available daily.</p>
      </div>
      </div>
      <div className="step-item mb-5">
      <div className="step-icon"><i className="fas fa-headset"></i></div>
      <div className="step-text">
      <h5>Support When You Need It</h5>
      <p>Early mornings, late nights or unexpected changes, help is available when required.</p>
      </div>
      </div>
      <div className="step-item mb-5">
      <div className="step-icon"><i className="fas fa-map-marked-alt"></i></div>
      <div className="step-text">
      <h5>Local Experience</h5>
      <p>Understanding of busy times, sensible roads and practical travel routes helps avoid unnecessary delays.</p>
      </div>
      </div>
      <div className="step-item">
      <div className="step-icon"><i className="fas fa-cogs"></i></div>
      <div className="step-text">
      <h5>Tailored Solutions</h5>
      <p>Small groups or large arrangements, short term or ongoing needs, plans are shaped around what actually suits you. With Alsinan Transport, travel feels organised instead of stressful.</p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="about_section meet-our-team">
      <div className="container">
      <div className="row d-flex justify-content-center">
      <div className="col-lg-6 content-section">
      <div className="about_content">
      <h2>Meet Our Team</h2>
      <p>Behind every successful journey is a team that genuinely cares about how it goes. Our drivers, coordinators and support staff do more than manage bookings. They pay attention to timing, changing needs, comfort and smooth execution. Professional, approachable and experienced, they help keep journeys calm and well managed from start to finish.</p>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="why_choose meet-our-journey">
      <div className="container">
      <div className="row d-flex justify-content-between">
      <div className="col-lg-5">

      <h2>The Support You Need</h2>
      </div>
      <div className="col-lg-6">
      <div className="about_content">
      <p>Need dependable travel assistance in Dubai or across the UAE A car, van or bus for your people Movement that feels organised instead of uncertain Alsinan Transport is ready to help.</p>
      <p>Every ride is planned to feel safe, comfortable and on time.</p>
      <p>Get in touch to plan your next journey. We will take care of the travel so you do not have to.</p>
      <Link className="btn btn-primary" to="/contact-us/">Contact Us</Link>
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
      <img src="/wp-content/uploads/2025/09/red_area.png" alt="" width="980" height="652" />
      </div>
      <div className="content_middle">
      <span className="sub_head">Looking for a safe and reliable transport services in Dubai?</span>
      <h2>Contact us today to book your ride!</h2>
      </div>
      <div className="whatsapp_num white_num">
      <div className="whatsapp_box">
      <div className="icon_wp">
      <img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" width="37" height="36" />
      </div>
      <div className="num_wp">
      <span>Whatsapp</span>
      <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan" target="_blank">+971 55 525 2397</a>
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
