import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { ServicesSection, ServiceBox } from "../components/sections/ServicesSection";
import { WhyChoose, ChoosePoint } from "../components/sections/WhyChoose";
import AboutPanel from "../components/sections/AboutPanel";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function Home() {
  useThemeScripts(["jQuery(document).ready(function($){\n  $('.fleet_carousel').owlCarousel({\n    loop: true,\n    margin: 10,\n    responsiveClass: true,\n    responsive: {\n      0: {\n        items: 1,\n        center: false\n      },\n      1024: {\n        items: 2,\n        center: false\n      },\n      1200: {\n        items: 3,\n        center: true\n      }\n    }\n  });\n});"]);

  return (
    <>
      <Seo {...seo["/"]} />
      <section className="banner_home" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="banner_bottm_img">
      <img src="/wp-content/uploads/2025/10/vehcle_banner.webp" alt="Alsinan Transport coach bus and car against the Dubai skyline" style={{ aspectRatio: "3 / 2.675" }} loading="eager" fetchPriority="high" width="1058" height="944" />
      </div>
      <div className="container h-100">
      <div className="row h-100">
      <div className="col-xl-7 col-lg-9 my-auto">
      <div className="content_banner">
      <span className="sub_head">Reliable Transport Services in Dubai for Daily, Monthly and Trip Based Travel</span>
      <h1>Alsinan Rental Transport Services in Dubai for Businesses, Schools and Travellers</h1>
      <div className="banner_list_cont">
      <span>Flexible Rental Transport In Dubai:</span>
      <ul>
      <li>Daily</li>
      <li>Monthly</li>
      <li>Trip-based</li>
      </ul>
      </div>
      <Link className="btn btn-primary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      </div>
      </div>
      </section>


      <AboutPanel
        image="/wp-content/uploads/2025/10/about_large.webp"
        alt="Grey Mercedes Sprinter passenger van with its side door open"
        mirrored>
        <div className="about_content">
      <span className="sub_head">About Us</span>
      <h2>We Make Your Trips Comfortable; Every Time</h2>
      <p>Alsinan Transport is based in Dubai, and that matters because timing is everything here. In this city, the biggest challenge is not finding a vehicle. It is making sure it arrives on time. One traffic issue, a delayed flight or a late school pickup can easily affect an entire day.</p>
      <p>That is where we come in. People come to us because they want <Link to="/services/">Transport Services in Dubai</Link> that work the right way. They want staff routes that leave on time. School buses that follow fixed routines. Airport pickups that adjust to real flight timings. Private trips that do not require constant calling and chasing drivers.</p>
      <p>We operate cars, Hiace vans, minibuses and full size coaches. Every vehicle is cleaned, checked and kept ready for daily use. Our drivers understand the areas they handle including industrial zones, residential communities, airports, hotels and schools. For us, school schedules, airport transfers and staff commutes are not occasional work. They are our everyday responsibility.</p>
      <p>Where many operators focus on short term jobs, our Transport Rental Services in Dubai are built for long term dependability. We manage ongoing staff transport, regular school routes and consistent group travel requirements. Routes can be refined when your needs change. Pricing stays clear and practical. And when plans shift, someone from our team supports you instead of leaving you stuck.</p>
      <p>If you want rental transport in Dubai that grows with your requirements, Alsinan Transport is ready to support you.</p>
      <Link className="btn btn-primary" to="/about/">read more</Link>
        </div>
      </AboutPanel>


      <ServicesSection
        heading={<><span className="sub_head">Our Services</span>
      <h2>Top Quality Transport Rental Services in Dubai</h2>
      <p>Getting around Dubai should not feel like managing a project. Whether you are moving a small group or a large number of people, occasionally or daily, the goal is simple. Your Transport Services in Dubai should run smoothly without constant follow ups or confusion about where the vehicle is. Our services are structured exactly for that.</p></>}>
        <ServiceBox col="6">
      <h3>School Bus Rental in Dubai</h3>
      <p>School transport depends on routine. Routes are planned, timings are fixed and punctuality matters. <b><Link target="_blank" to="/services/school-transport-in-dubai/">Our school bus rental in Dubai</Link></b> is built around organised schedules, reliable pickup and drop timings and trained drivers who understand school safety expectations. For smaller setups, we also arrange minibuses with drivers so you get what suits your student numbers.
      </p>
      <Link to="/services/school-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Airport Car Rental in Dubai</h3>
      <p>Flights do not always follow fixed timing. Delays and changes happen. Our <Link target="_blank" to="/services/airport-transport-in-dubai/">airport related rental transport in Dubai</Link> supports pickups and drop offs across the UAE including early mornings and late nights. Drivers monitor flight updates and adjust where possible so passengers are not left waiting.
      </p>
      <Link to="/services/airport-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Hotel Transfers</h3>
      <p>Hotels run continuously. Guests arrive and leave at all hours. Our <Link target="_blank" to="/services/hotel-transport-service-in-dubai/">hotel transfer services</Link> blend naturally with that routine. Vehicles reach on time, luggage is handled carefully and guests travel comfortably between airports, hotels, venues and attractions. Transport supports hotel operations instead of complicating them.</p>
      <Link to="/services/hotel-transport-service-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Staff Transport Services</h3>
      <p>Different businesses need different staff movement solutions. Offices, factories, construction sites and shifting workforce schedules all require planning. We handle small teams to large groups using cars, vans, minibuses and buses. Routes are created using real traffic understanding. For companies seeking <Link target="_blank" to="/services/staff-transport-in-dubai/">reliable corporate Transport Rental Services in Dubai</Link>, we manage fixed monthly systems that keep running smoothly.</p>
      <Link to="/services/staff-transport-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Car Rental in Dubai for Private Travellers</h3>
      <p>Some travellers want premium comfort while others need something simple and dependable. We provide both luxury and budget friendly options with clear pricing. Whether it is personal travel, a family outing or business meetings, you get the vehicle suited to your plan with or without a driver.</p>
      <Link to="/services/private-car-rental-in-dubai/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Car Booking in Dubai for Tours & Excursions</h3>
      <p>Tours do not always stay rigid. Plans often change. Our tour friendly transport services in Dubai provide flexibility so your day flows at your pace instead of forcing you to follow strict timings.</p>
      <Link to="/services/dubai-tours-transport-services/">Read more</Link>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Flexible Packages</h3>
      <p>Some clients need Transport Services in Dubai for one day. Others need long term arrangements. Staff transport often works best monthly while long projects need vehicles positioned in specific areas. Pricing remains straightforward. Terms stay clear. Whether short or ongoing rental transport in Dubai, you know exactly what is included.</p>
        </ServiceBox>
      </ServicesSection>


      <section className="services_area_section">
      <div className="container">
      <div className="row">
      <div className="col-12">
      <h2 className="text-center">Our Top Service Areas</h2>
      </div>
      </div>
      <div className="row justify-content-between g-4">
      <div className="col-lg-6">
      <div className="service_area_box">
      <h3>Jabal Ali Industrial Area 1 & 2</h3>
      <p>We handle daily labour and staff transport for factories, warehouses, hotels and businesses in Jabal Ali. Many clients continue with us because service stays consistent, vehicles reach on time and shift changes run smoothly.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="service_area_box">
      <h3>Jabal Ali Free Zone</h3>
      <p>In JAFZA, timing is critical. Staff movement and operational schedules depend on reliability. Our vans and buses help companies maintain predictability.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="service_area_box">
      <h3>Dubai Industrial City (DIC)</h3>
      <p>In DIC, staff transport needs to be punctual and direct. We connect facilities with staff accommodation using routes that minimise unnecessary travel.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-6">
      <div className="service_area_box">
      <h3>UAE-Wide Service</h3>
      <p>If your route goes beyond Dubai, we operate intercity transfers, long distance staff movement, airport work and private trips across the UAE.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="fleet_section">
      <div className="container-fluid p-0">
      <div className="row">
      <div className="col-12">
      <h2 className="text-center">Our Fleet</h2>
      <div className="carousel_wrap">
      <div className="owl-carousel fleet_carousel">
      <div className="item">
      <div className="content_service_provider">
      <h3>cars</h3>
      <div className="img_fleet">
      <img src="/wp-content/uploads/2025/09/e58f33d6b68636dd830cb3cede724d823788f6b3-scaled.webp" alt="Red BMW coupe available for private car rental in Dubai" />
      </div>
      <Link target="_blank" className="btn btn-primary" to="/our-fleet/">learn more</Link>
      </div>
      </div>
      <div className="item">
      <div className="content_service_provider">
      <h3>hiace</h3>
      <div className="img_fleet">
      <img src="/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-18.33.09_51e9ed5f.webp" alt="Toyota Hiace vans parked as part of the Alsinan Transport fleet in Dubai" width="960" height="1280" />
      </div>
      <Link target="_blank" className="btn btn-primary" to="/our-fleet/">learn more</Link>
      </div>
      </div>
      <div className="item">
      <div className="content_service_provider">
      <h3>Buses</h3>
      <div className="img_fleet">
      <img src="/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-18.33.11_24296a51.jpg" alt="White Ashok Leyland bus from the Alsinan Transport fleet parked in Dubai" width="1280" height="960" />
      </div>
      <Link target="_blank" className="btn btn-primary" to="/our-fleet/">learn more</Link>
      </div>
      </div>
      <div className="item">
      <div className="content_service_provider">
      <h3>cars</h3>
      <div className="img_fleet">
      <img src="/wp-content/uploads/2025/09/e58f33d6b68636dd830cb3cede724d823788f6b3-scaled.webp" alt="Red BMW coupe available for private car rental in Dubai" />
      </div>
      <Link target="_blank" className="btn btn-primary" to="/our-fleet/">learn more</Link>
      </div>
      </div>
      <div className="item">
      <div className="content_service_provider">
      <h3>hiace</h3>
      <div className="img_fleet">
      <img src="/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-18.33.10_41bbae53.webp" alt="White Toyota Hiace high-roof van with Alsinan Passengers Transport branding, parked in Dubai" />
      </div>
      <Link target="_blank" className="btn btn-primary" to="/our-fleet/">learn more</Link>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>


      <WhyChoose
        variant="ledger"
        heading={<><span className="sub_head">
                              Reliable and Stress-Free Rides
                          </span>
      <h2>Why Choose Alsinan Transport Services in Dubai</h2>
      <p>When we agree on a pickup time, that’s the time the vehicle shows up. Routes are followed, and trips stay predictable. No chasing drivers. No wondering where the bus is. If something changes along the way, it’s handled quickly so your day doesn’t start slipping behind schedule.</p></>}
        footer={<><Link className="btn btn-primary" to="/about/">read more</Link></>}
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
      <h3>Plans That Fit Your Schedule</h3>
      </div>
      <p>Some clients need Transport Services in Dubai for one day. Others rely on us every month. Shifts change. Flights change. Plans evolve. Our rental transport in Dubai is designed to support these changes smoothly.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_ontime.svg" alt="" width="67" height="61" />
      <h3>Always On Time</h3>
      </div>
      <p>Being late causes problems fast, especially for schools, hotels, and staff routes. Our drivers plan around traffic patterns and peak hours so arrivals and drop-offs happen when they should. Even in busy industrial areas, sticking to the schedule is treated as part of the job, not a bonus.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_professional_drivers.svg" alt="" width="65" height="61" />
      <h3>Friendly and Professional Drivers</h3>
      </div>
      <p>Drivers are licensed, experienced and familiar with roads, school routes, airport work and industrial areas. They stay calm, helpful and professional.</p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_maintenance.svg" alt="" width="64" height="60" />
      <h3>A Fleet You Can Count On</h3>
      </div>
      <p>Vehicles are clean, air-conditioned, and checked regularly. Whether it’s a car for a private trip or a full-size bus for staff transport, everything is kept ready for daily use. No last-minute issues, no uncomfortable rides.</p>
        </ChoosePoint>
      </WhyChoose>


      <section className="faqs_section">
      <div className="container">
      <div className="row">
      <div className="col-md-12">
      <h2>FAQs About Our Rental Transports in Dubai</h2>
      </div>
      <div className="col-md-12">
      <div className="accordion" id="faqAccordion">

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingOne">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                      How do I book a vehicle?
                    </button>
      </h2>
      <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Easy. Most people just message us on WhatsApp or call directly. The online form works as well. We’ll ask for the pickup point, destination, timing, and the type of vehicle you’re looking for. Once that’s clear, we check availability and share the price. No long back-and-forth.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingTwo">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                       Do you only operate in Dubai?
                    </button>
      </h2>
      <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      No. Dubai is where most of our daily routes are, but we operate across the UAE. That includes Abu Dhabi, industrial zones, and longer intercity runs. It really depends on where your route starts and ends.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingThree">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Are your drivers licensed?
                    </button>
      </h2>
      <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Yes. All drivers are RTA-licensed and cleared to operate professionally. Most of them handle the same types of routes regularly—staff transport, school runs, airport pickups, so they’re familiar with how those trips usually go.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingFour">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                      Can I book a one day car rental in Dubai or a single trip?
                    </button>
      </h2>
      <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Yes. Our Transport Services in Dubai support both short and long term requirements.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingFive">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                     Do you handle staff transport contracts?
                    </button>
      </h2>
      <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Yes. This is one of our main services. We manage fixed routes, shift timings, and monthly arrangements for companies. Our <Link target="_blank" to="/services/staff-transport-in-dubai/">staff transport services in Dubai</Link> ensure smooth, reliable, and well-organized employee movement. Once routes are set, they usually run consistently without needing daily coordination.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingSix">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                      What vehicles do you have?
                    </button>
      </h2>
      <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      We operate cars, Hiace vans, minibuses, and full-size buses. Vehicle selection usually depends on group size, route length, and timing. <Link target="_blank" to="/our-fleet/">All vehicles</Link> are air-conditioned and maintained on a regular schedule.

                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingSeven">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                       How early should I book?
                    </button>
      </h2>
      <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                       For monthly routes or corporate transport, a few days’ notice makes things easier. For short trips, same-day bookings sometimes work, but availability can change quickly.
                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingEight">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
                       Do you do late-night or early-morning airport pickups?
                    </button>
      </h2>
      <div id="collapseEight" className="accordion-collapse collapse" aria-labelledby="headingEight" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Yes. Airport work runs around the clock. Our <Link target="_blank" to="/services/airport-transport-in-dubai/">airport transfer service in Dubai</Link> tracks flight timings and adjusts pickups if there are delays, so the driver isn’t relying on fixed landing times.

                    </div>
      </div>
      </div>

      <div className="accordion-item">
      <h2 className="accordion-header" id="headingNine">
      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
                       Can routes or plans be adjusted?
                    </button>
      </h2>
      <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine" data-bs-parent="#faqAccordion">
      <div className="accordion-body">
                      Yes. Routes, pickup times, or even vehicle types can usually be adjusted. Most changes depend on notice and availability, but we’re flexible where possible.
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
