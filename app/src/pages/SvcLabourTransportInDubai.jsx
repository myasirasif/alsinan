import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import ContactForm from "../components/ContactForm";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

// DRAFT: noindex and not linked from anywhere. No prices, timings or seat
// counts until the client confirms them.

const faqs = [
  ["Do you provide daily labour transport in Dubai?", "Yes. We run daily pick and drop between labour accommodation and work sites, on monthly contracts or daily bookings."],
  ["Can you transport workers to sites outside Dubai?", "Yes. We cover all emirates, so a crew living in Dubai can be taken to a site in Sharjah, Abu Dhabi or elsewhere in the UAE."],
  ["Do you cover night shifts?", "Yes. We plan pickups around your shift pattern, including night and rotating shifts. We are available 24/7."],
  ["What size of vehicle do we need for our workers?", "It depends on your headcount and how many pickup points there are. Vans suit small crews, and buses suit larger teams. Tell us your numbers and we will suggest the right mix."],
  ["Are your buses air-conditioned?", "Yes. Our vehicles are air-conditioned, which matters for crews travelling in the Dubai heat."],
  ["How do we get a quote for labour transport?", "Send us your headcount, accommodation location, site location and shift timings by WhatsApp or the form on this page, and we will send you a plan and a quote."],
];

const Cta = () => (
  <div className="d-flex flex-wrap gap-3 my-4">
    <a className="btn btn-secondary btn-whatsapp" href="https://wa.me/971555252397" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i> Get a Quote on WhatsApp</a>
    <a className="btn btn-primary" href="tel:+971555252397">Call 055 525 2397</a>
  </div>
);

export default function SvcLabourTransportInDubai() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/services/labour-transport-in-dubai/"]} />
      <section className="banner_home banner_inner banner_inner_services" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-8 my-auto">
      <div className="content_banner text-center">
      <span className="h1_head">Services</span>
      <h1>Labour Transport in Dubai</h1>
      </div>
      </div>
      </div>
      </div>
      </section>

      <div className="container py-5">
      <div className="row">
      <div className="col-lg-8">
      <div className="post-content bus-rental-content">
      <style>{`.bus-rental-content h2{font-size:clamp(26px,3vw,34px);line-height:1.25;margin:44px 0 16px}.bus-rental-content h3{font-size:22px;font-weight:600;margin:26px 0 8px}.bus-rental-content .h5{font-size:19px}.bus-rental-content ul,.bus-rental-content ol{margin:0 0 20px;padding-left:22px}.bus-rental-content li{font-family:Poppins,sans-serif;font-size:16px;line-height:26px;margin-bottom:10px;padding-left:4px}.bus-rental-content li::marker{color:#dd0a1b;font-weight:700}.bus-rental-content p a:not(.btn){color:#dd0a1b;font-weight:600;text-decoration:none;white-space:nowrap}.bus-rental-content p a:not(.btn):hover{text-decoration:underline}`}</style>
      <p>Getting a crew from the accommodation to the site on time, every day, is one of the hardest parts of running a project in Dubai. Alsinan Passengers Transport runs daily labour transport for construction companies, contractors, facilities firms and factories, with licensed drivers and air-conditioned vehicles, so your workers arrive on time and your supervisors stop chasing transport.</p>
      <Cta />

      <h2>Why Contractors Choose Us for Labour Transport</h2>
      <ul>
      <li><strong>Licensed operator.</strong> Registered as Passengers Transport by Rented Buses.</li>
      <li><strong>Drivers who know the routes.</strong> Labour camps, industrial areas and site access roads.</li>
      <li><strong>Air-conditioned vehicles.</strong> Workers arrive ready to work, not worn out by the journey.</li>
      <li><strong>Daily and monthly contracts.</strong> One agreed route and rate, or extra trips when you need them.</li>
      <li><strong>Available 24/7.</strong> Early starts, night shifts and rotating crews are all covered.</li>
      </ul>

      <h2>Who We Work With</h2>
      <h3>Construction Companies and Contractors</h3>
      <p>Daily transport between labour accommodation and sites, planned around shift changes and site access rules.</p>
      <h3>Facilities and Maintenance Firms</h3>
      <p>Cleaning, security and maintenance teams moved between accommodation and several client locations.</p>
      <h3>Factories and Warehouses</h3>
      <p>Shift workers in industrial areas such as Jebel Ali, JAFZA and Dubai Industrial City. <Link to="/services/staff-transport-in-dubai/">Staff transport in Dubai &rarr;</Link></p>
      <h3>Hotels and Restaurants</h3>
      <p>Kitchen, housekeeping and service staff taken to work and home again, including late shifts. <Link to="/services/hotel-transport-service-in-dubai/">Hotel transport in Dubai &rarr;</Link></p>

      <h2>How Our Labour Transport Works</h2>
      <ol>
      <li>Send us your headcount, accommodation location, site location and shift timings.</li>
      <li>We plan the route and suggest the right vehicles for your crew size.</li>
      <li>Once agreed, the same route runs every working day until your needs change.</li>
      </ol>

      <h2>Vehicles for Every Crew Size</h2>
      <p>We run vans for small crews, Coasters and minibuses for medium teams, and full-size buses for large workforces. For crews spread across several accommodations, a mix of vehicles is often faster and cheaper than one large bus. See the vehicles on our <Link to="/our-fleet/">fleet page &rarr;</Link></p>

      <h2>Areas We Cover</h2>
      <p>Labour camps and work sites across Dubai, including Jebel Ali, JAFZA, Dubai Industrial City, Al Quoz, Dubai Investment Park and Dubai South, and in all other emirates of the UAE.</p>

      <h2>Frequently Asked Questions</h2>
      {faqs.map(([q, a]) => (
        <div key={q} className="mb-3">
        <h3 className="h5 mb-1">{q}</h3>
        <p>{a}</p>
        </div>
      ))}

      <h2>Book Labour Transport in Dubai</h2>
      <p>Tell us how many workers you need to move and where. We will plan the route and send a quote.</p>
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
