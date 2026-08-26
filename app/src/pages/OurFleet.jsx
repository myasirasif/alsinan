import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function OurFleet() {
  useThemeScripts(["jQuery(document).ready(function($){\n  $('.fleet_carousel').owlCarousel({\n    loop: true,\n    margin: 10,\n    responsiveClass: true,\n    responsive: {\n      0: {\n        items: 1,\n        center: false\n      },\n      1024: {\n        items: 2,\n        center: false\n      },\n      1200: {\n        items: 3,\n        center: true\n      }\n    }\n  });\n});"]);

  return (
    <>
      <Seo {...seo["/our-fleet/"]} />
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>Our Fleet</h1>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="needbox_section out-fleet-needbox">
      <div className="form_section_inner">
      <div className="container">
      <div className="row">
      <div className="col-lg-8">
      <div className="form_top_row">
      <div className="content_middle_contact_form">

      <span className="sub_head">
                              Our Fleet
                          </span>
      <h2>Fleet for Every Kind of Trip</h2>
      <p>Need a transport service in Dubai? From quick airport runs to school drops, hotel pickups, or moving a whole team for an event — we’ve got you covered.
      </p>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="why_choose Comfort-section">
      <div className="container">
      <div className="row d-flex justify-content-between">
      <div className="col-lg-5">

      <h2>Comfort, Safety, and Flexibility Built In</h2>
      </div>
      <div className="col-lg-6">
      <div className="about_content">
      <p>Our fleet really does have it all — from compact city cars to roomy Hiace vans for rent in Dubai and full-size coaches. Every ride comes with cool air-conditioning, regular servicing, and a driver who’s licensed and carefully vetted.
      </p>
      <p>Looking for something specific? Maybe it’s a simple car rental for a short trip, a passenger van to move your staff, or a bus big enough for a conference crowd. Whatever the plan, we’ll set you up with the right vehicle.
      </p>
      <Link className="btn btn-primary" to="/contact-us/">Contact Us</Link>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="our-fleet our-fleet-new py-5">
      <div className="container">
      <div className="row">
      <div className="col-12">
      <h2 className="our-fleet-title">
      				Explore Our Fleet
      			</h2>
      </div>

      <div className="col-md-6 col-lg-4 mb-5">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/09/e58f33d6b68636dd830cb3cede724d823788f6b3-scaled.webp" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">Executive & Standard Cars
      </h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">Great for business trips, airport transfers, or when you just need to get across the city with zero fuss.</p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-5">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/10/about_large.webp" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">SUVs & Family Cars</h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">With our SUVs for rent in Dubai you get extra space for families, luggage, or those longer drives when comfort matters most.</p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-5">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-18.33.10_41bbae53.webp" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">Vans & Hiace Models</h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">Reliable workhorses for medium groups, hotel shuttles, and project runs. Need flexibility? Choose our van rentals. (We recommend going with a Hiace van for rent in Dubai when you need something sturdy and practical.)</p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4 mt-4">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/10/staff-transport-op.webp" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">Minibuses</h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">Perfect for school runs, mid-sized corporate groups, or local tours. Our minibus rentals in Dubai strike the right balance between cost and comfort.</p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4 mt-4">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/10/coaster.jpg" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">Full-Size Coaches</h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">Designed for large groups, long distances, or big events. From company outings to conferences, our coach and charter bus rentals in Dubai keep everyone traveling together, smoothly.
      </p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>

      <div className="col-md-6 col-lg-4 mb-4 mt-4">
      <div className="fleet-card card h-100 border-0 shadow-sm">
      <img src="/wp-content/uploads/2025/10/hiace.webp" className="card-img-top fleet-img" alt="Toyota Hiace" />
      <div className="card-body">
      <div className="d-flex justify-content-between align-items-center title">
      <h5 className="card-title mb-0">Toyota Hiace</h5>
      <span className="fleet-subtitle text-danger fw-bold">12-Passenger</span>
      </div>
      <p className="card-text">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accus.</p>
      <a href="#" className="btn btn-danger w-100 mt-3">BOOK NOW</a>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="services_area_section">
      <div className="container">
      <div className="row">
      </div>
      <div className="row justify-content-center g-4">
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Extras That Make Life Easier</h3>
      <p>Want a little more on the ride? Ask for a chauffeur, GPS, child seats, Wi-Fi, or even a custom route. Hiring is simple — take it by the day, for the month, or just a single trip.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Why Travel With Us?</h3>
      <p><li>Vehicles that are checked, cleaned, and cared for.</li>
      <li>Interiors that keep passengers cool and comfortable.</li>
      <li>Drivers who know the roads and take safety seriously.</li>
      <li>Flexible plans and real support, day or night.</li></p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Ready to Roll?</h3>
      <p>Scroll down to see the fleet in detail, or drop us a message for a quote. With Alsinan, transport in Dubai feels easy, safe, and hassle-free.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
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
      <span className="sub_head">If you need any car in rental</span>
      <h2>Give a call to Alsinan Transport</h2>
      </div>
      <div className="whatsapp_num white_num">
      <div className="whatsapp_box">
      <div className="icon_wp">
      <img src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" />
      </div>
      <div className="num_wp">
      <span>Whatsapp</span>
      <a href="https://wa.me/971555252397?text=I%20want%20to%20know%20more%20about%20Alsinan">+97155 525 2397</a>
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
