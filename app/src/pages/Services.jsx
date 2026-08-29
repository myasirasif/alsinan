import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { ServicesSection, ServiceBox } from "../components/sections/ServicesSection";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function Services() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/services/"]} />
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>Services</h1>
      </div>
      </div>
      </div>
      </div>
      </section>


      <ServicesSection
        className="services_section mt-0 mb-5 pb-5"
        heading={<><span className="sub_head">Our Services</span>
      <h2>Top-Quality Rental Services In Dubai For Every Trip</h2>
      <p>From vans for hire to bus rentals in Dubai, we make group travel easy. Staff shuttles, school runs, airport transfers, hotel pickups, weekend tours; whatever the plan, we’ll get you there.</p></>}>
        <ServiceBox col="6">
      <h3>School Bus Rental in Dubai</h3>
      <p>Getting kids to school on time is a big deal. That’s why our trained drivers follow safe routes and stick to schedules. If you need something a little smaller, we’ve got the best mini bus rentals in Dubai, plus the option to book a rental with a driver for flexible daily runs.</p>
      <Link to="/services/school-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Airport Car Rental in Dubai</h3>
      <p>Flights don’t wait and neither do we. Our drivers handle meet-and-greet pickups and direct drop-offs at every UAE airport. For a simple and smooth ride, choose one of our airport car rentals in Dubai.</p>
      <Link to="/services/airport-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Hotel Transfers</h3>
      <p>Guests, staff, luggage, corporate teams — we move them all. With our rental transport in Dubai, hotel pickups and staff commutes are straightforward. No delays. No hassle.</p>
      <Link to="/services/hotel-transport-service-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Staff Transport Services</h3>
      <p>Shift changes, daily routes, factory staff, or office teams; we’ve seen it all. Whether it’s a compact car, a Hiace van, or a full-size bus, we’ll match the right vehicle to your needs. Bigger crowd? Simply rent a bus for a day in Dubai.
      </p>
      <Link to="/services/staff-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Car Rental in Dubai for Private Travellers</h3>
      <p>Tour the UAE your way. Go stylish with a luxury car rental in Dubai or stick to something simple and budget-friendly. Either way, our clear car rental prices mean no surprises.
      </p>
      <Link to="/services/private-car-rental-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Car Booking in Dubai for Tours & Excursions</h3>
      <p>Planning a desert trip? A city tour? Maybe a weekend getaway? With our easy car booking in Dubai, you’ll get a local driver and a custom route without the fuss.
      </p>
      <Link to="/services/dubai-tours-transport-services/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Flexible Packages</h3>
      <p>Pick what suits you — daily hires, monthly contracts, or one-off trips. Need regular staff shuttles? Our monthly car rentals in Dubai are a solid choice. Long-term project? Go with van rentals in Dubai for ongoing needs. Pricing is simple. No extras or hidden fees.</p>
        </ServiceBox>
      </ServicesSection>


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
