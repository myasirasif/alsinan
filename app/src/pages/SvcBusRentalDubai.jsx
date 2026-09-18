import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ContactForm from "../components/ContactForm";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

// DRAFT: noindex and not linked from anywhere. Prices are left out until the
// client confirms them.

const fleet = [
  ["Family van", "7", "Airport runs, small families"],
  ["Hiace minibus", "12 to 15", "Small teams, city tours"],
  ["Toyota Coaster", "22 to 30", "Staff transport, school trips"],
  ["Mid-size bus", "35", "Company outings, weddings"],
  ["Luxury coach", "50", "Events, large groups, intercity"],
];

const faqs = [
  ["How much does it cost to rent a bus in Dubai?", "It depends on bus size, rental hours, distance and whether the trip leaves Dubai. Share your date, route and group size for a fixed quote."],
  ["Is the driver included in the bus rental?", "Yes. Every bus comes with a licensed driver. Fuel is included, and Salik and parking are shown in your quote."],
  ["Can I rent a bus for just a few hours?", "Yes. Hourly bookings work well for airport transfers and short trips. Contact us with your timings and we will confirm availability."],
  ["Do you offer monthly staff bus contracts?", "Yes. We run fixed daily routes for companies on monthly contracts, with backup vehicles if a bus is under maintenance."],
  ["Can the bus go from Dubai to Abu Dhabi or other emirates?", "Yes. We run intercity trips to all seven emirates, one way or return."],
  ["How early should I book?", "As early as you can, especially in peak season or for larger buses. Same-day bookings depend on availability."],
  ["Are your buses air-conditioned?", "Yes. All our minibuses, Coasters and coaches have full AC."],
  ["Do you provide buses for school trips?", "Yes. We handle school runs, excursions and sports trips, with drivers experienced with children."],
];

const Cta = () => (
  <div className="d-flex flex-wrap gap-3 my-4">
    <a className="btn btn-secondary btn-whatsapp" href="https://wa.me/971555252397" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> Get a Quote on WhatsApp</a>
    <a className="btn btn-primary" href="tel:+971555252397">Call 055 525 2397</a>
  </div>
);

export default function SvcBusRentalDubai() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/services/bus-rental-dubai/"]} />
      <section className="banner_home banner_inner banner_inner_services" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-8 my-auto">
      <div className="content_banner text-center">
      <span className="h1_head">Services</span>
      <h1>Bus Rental Dubai with Driver for Groups, Staff and Events</h1>
      </div>
      </div>
      </div>
      </div>
      </section>

      <div className="container py-5">
      <div className="row">
      <div className="col-lg-8">
      <div className="post-content bus-rental-content">
      <style>{`.bus-rental-content h2{font-size:clamp(26px,3vw,34px);line-height:1.25;margin:44px 0 16px}.bus-rental-content h3{font-size:22px;font-weight:600;margin:26px 0 8px}.bus-rental-content .h5{font-size:19px}.bus-rental-content ul,.bus-rental-content ol{margin:0 0 20px;padding-left:22px}.bus-rental-content li,.bus-rental-content td,.bus-rental-content th{font-family:Poppins,sans-serif;font-size:16px;line-height:26px}.bus-rental-content li{margin-bottom:10px;padding-left:4px}.bus-rental-content li::marker{color:#dd0a1b;font-weight:700}.bus-rental-content th,.bus-rental-content td{padding:12px 14px}.bus-rental-content th{font-weight:600}.bus-rental-content p a:not(.btn){color:#dd0a1b;font-weight:600;text-decoration:none;white-space:nowrap}.bus-rental-content p a:not(.btn):hover{text-decoration:underline}`}</style>
      <p>Need to move 15 people or 150? Alsinan Passengers Transport offers bus rental in Dubai with a licensed driver, fuel and insurance included. Book a minibus for a family trip, a Coaster for daily staff runs, or a 50 seater coach for a company event. We run 24/7, and one call or WhatsApp is enough to get a quote.</p>
      <Cta />

      <h2>Why Companies and Families Book Our Buses</h2>
      <ul>
      <li><strong>Licensed Dubai operator.</strong> Registered as Passengers Transport by Rented Buses with Dubai Economy and Tourism.</li>
      <li><strong>Experienced drivers.</strong> They know the Dubai routes, the airport drop-off rules and the labour camp roads.</li>
      <li><strong>Clean, maintained buses.</strong> Every vehicle is air-conditioned and checked before each trip.</li>
      <li><strong>One price, no surprises.</strong> Driver, fuel, Salik and parking are shown clearly in your quote.</li>
      <li><strong>Available 24/7.</strong> Early airport pickups, night shifts and last-minute bookings are all covered.</li>
      </ul>

      <h2>Choose Your Bus by Group Size</h2>
      <div className="table-responsive">
      <table className="table table-bordered align-middle">
      <thead className="table-dark">
      <tr><th>Vehicle</th><th>Seats</th><th>Best for</th></tr>
      </thead>
      <tbody>
      {fleet.map(([vehicle, seats, use]) => (
        <tr key={vehicle}><td><strong>{vehicle}</strong></td><td>{seats}</td><td>{use}</td></tr>
      ))}
      </tbody>
      </table>
      </div>
      <p>Not sure which size fits? Tell us your headcount and luggage, and we will suggest the right bus. It is usually cheaper than booking two smaller vans.</p>

      <h2>Bus Hire in Dubai for Every Need</h2>
      <h3>Staff Bus Rental</h3>
      <p>Daily pick and drop for offices, construction sites, hotels and warehouses. We plan the route around your shift timings and offer monthly contracts at a fixed rate. <Link to="/services/staff-transport-in-dubai/">Staff transport in Dubai &rarr;</Link></p>
      <h3>School Transport</h3>
      <p>Safe buses for school runs, field trips and sports days. Our drivers are experienced with children, and every bus is inspected regularly. <Link to="/services/school-transport-in-dubai/">School transport in Dubai &rarr;</Link></p>
      <h3>Airport Transfers</h3>
      <p>Group pickups from DXB and DWC for delegations, tour groups and hotel guests. Your driver tracks the flight, so a delay will not cost you waiting charges. <Link to="/services/airport-transport-in-dubai/">Airport transport in Dubai &rarr;</Link></p>
      <h3>Events and Weddings</h3>
      <p>Move guests between hotels and venues on time, and let the bus wait for the return trip.</p>
      <h3>Tours and Intercity Trips</h3>
      <p>Desert safari pickups, Dubai city tours and day trips to Abu Dhabi, Sharjah, Fujairah or Ras Al Khaimah. <Link to="/services/dubai-tours-transport-services/">Dubai tours transport &rarr;</Link></p>

      <h2>Hourly, Daily and Monthly Bus Rental</h2>
      <ul>
      <li><strong>Hourly:</strong> short transfers and airport runs</li>
      <li><strong>Daily:</strong> events, tours and full-day trips</li>
      <li><strong>Monthly contract:</strong> staff and school transport at the best rate</li>
      </ul>

      <h2>Bus Rental Price in Dubai: What Affects the Cost</h2>
      <p>Your bus rental price depends on four things: bus size, rental hours, distance, and whether the trip leaves Dubai. Weekend, holiday and peak season bookings can cost more. Monthly contracts bring the daily rate down. Send us your date, route and group size for a fixed quote.</p>

      <h2>How to Book a Bus in Dubai</h2>
      <ol>
      <li>Send your date, pickup point, drop point and number of passengers on WhatsApp.</li>
      <li>Get a fixed quote with the vehicle details.</li>
      <li>Confirm the booking, and we share the driver&rsquo;s name and number before the trip.</li>
      </ol>

      <h2>Areas We Cover</h2>
      <p>Our buses run across Dubai, including Deira, Bur Dubai, Business Bay, Dubai Marina, JLT, Al Quoz, Jebel Ali, DIP and Dubai South. We also cover Sharjah, Abu Dhabi, Ajman, Umm Al Quwain, Ras Al Khaimah and Fujairah.</p>

      <h2>Frequently Asked Questions</h2>
      {faqs.map(([q, a]) => (
        <div key={q} className="mb-3">
        <h3 className="h5 mb-1">{q}</h3>
        <p>{a}</p>
        </div>
      ))}

      <h2>Book Your Bus Rental in Dubai Today</h2>
      <p>Tell us where you are going and how many people are travelling. We will send the right bus with a driver who knows the road.</p>
      <Cta />
      </div>
      </div>

      <div className="col-lg-4">
      <section className="services_area_section sticky-top p-0 bg-transparent" style={{ top: "110px" }}>
      <div className="service_area_box">
      <h3 className="mb-0">Get a Quote</h3>
      <div className="form_section_inner">
      <div className="form_middle_row">
      <div className="contact_form">
      <div className="wpcf7 no-js" lang="en-US" dir="ltr">
      <ContactForm variant="compact" />
      </div>
      </div>
      </div>
      </div>
      </div>
      </section>
      </div>
      </div>
      </div>
    </>
  );
}
