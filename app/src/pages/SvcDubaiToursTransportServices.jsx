import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { ServicesSection, ServiceBox } from "../components/sections/ServicesSection";
import { WhyChoose, ChoosePoint } from "../components/sections/WhyChoose";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function SvcDubaiToursTransportServices() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/services/dubai-tours-transport-services/"]} />
      <section className="banner_home banner_inner banner_inner_services" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <span className="h1_head">Services</span>
      <h2>For Tours &#038; Excursions</h2>
      </div>
      </div>
      </div>
      </div>
      </section>


      <div className="service_post">
      <div className="container">
      <div className="row">

      <div className="col-lg-6">
      <div className="post-thumbnail service_thumbnail">
      <img width="640" height="407" src="/wp-content/uploads/2025/10/tour-transport-op-1024x651.jpg" className="attachment-large size-large wp-post-image" alt="Open top tour bus carrying tourists for Dubai city sightseeing and tours transport services" decoding="async" fetchPriority="high" srcSet="/wp-content/uploads/2025/10/tour-transport-op-1024x651.jpg 1024w, /wp-content/uploads/2025/10/tour-transport-op-300x191.jpg 300w, /wp-content/uploads/2025/10/tour-transport-op-768x488.jpg 768w, /wp-content/uploads/2025/10/tour-transport-op-1536x976.webp 1536w, /wp-content/uploads/2025/10/tour-transport-op.webp 1920w" sizes="(max-width: 640px) 100vw, 640px" />          </div>
      </div>

      <div className="col-lg-6 my-auto">
      <div className="post-content service_content">
      <h3>Services</h3>
      <h2>For Tours &#038; Excursions</h2>
      <h1 className="wp-block-heading">Comfortable and Reliable Dubai Tours Transport Services</h1>
      <p>Dubai is full of experiences you do not want to miss, from modern skylines and waterfront views to desert landscapes and traditional markets. When you are responsible for managing a tour or group trip, you should not have to worry about vehicles, timing or coordination. That is where <strong><Link to="/">Alsinan Transport</Link></strong> supports you.</p>
      <p>Our Dubai tours transport services help groups travel together, stay on schedule and remain comfortable throughout the journey. Whether it is a school tour, a family outing, a corporate program or a multi day itinerary, we handle the transport planning so you can stay focused on the experience itself.</p>
      <p>From smaller outings to full bus rental in Dubai for large groups, we suggest the right option and keep your day moving smoothly from one stop to the next.</p>
      <Link className="btn btn-primary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      </div>
      </div>
      </div>

      <WhyChoose
        variant="ledger"
        heading={<><span className="sub_head">Why Choose Us</span>
      <h2>Why Ride With Us Across Dubai?</h2></>}
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
      <h3>Stay Together</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Instead of splitting your group into multiple taxis and private cars, everyone travels together. Arrivals stay coordinated, headcounts become easier and the entire tour feels organised rather than stressful. Your Dubai tours transport remains unified and manageable.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_ontime.svg" alt="" width="67" height="61" />
      <h3>Experienced Drivers Who Know the City</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Our drivers handle tours and group travel every day. They understand practical drop off areas, sensible pickup locations, useful shortcuts and how to manage busy attractions without wasting time. This local knowledge helps your itinerary stay on track, even on days filled with multiple activities.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_professional_drivers.svg" alt="" width="65" height="61" />
      <h3>Comfort All Day</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Tours are often long, so comfort matters. Our vehicles offer cool air conditioning, wide supportive seating and enough space to store bags and equipment. Between stops, your guests can relax, refresh and prepare comfortably for the next experience.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_maintenance.svg" alt="" width="64" height="60" />
      <h3>Vehicles for Every Group Size</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Your group does not need to adjust to the vehicle. We adjust our vehicles to your group size. Whether you need a compact solution for a small outing or a larger option for big groups, we match capacity and transport type to your needs.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_ontime.svg" alt="" width="67" height="61" />
      <h3>Customizable Travel Plans</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>If you already know the places you want to visit, share your list and timing. Every Dubai tours transport booking is shaped around your group size, travel time and type of journey, whether it is within Dubai, to the desert or between emirates. Your schedule is the priority and we manage the logistics.</span></p>
        </ChoosePoint>
      </WhyChoose>


      <ServicesSection
        heading={<><span className="sub_head">Our Fleet</span>
      <h2>Our Fleet for Dubai Tours Transport Services</h2></>}
        intro={<><h4 className="sub_head_right">Every vehicle is clean, air-conditioned, and driven by a vetted professional. Choose the right ride for your trip:</h4></>}>
        <ServiceBox col="6">
      <h3>Mini Vans and Hiace</h3>
      <p><span style={{ fontWeight: "400" }}>Ideal for smaller groups and shorter excursions. These vehicles suit family sightseeing, small school groups and compact corporate visits. They are easy to move through the city, simple to board and practical for tours with frequent stops.</span></p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Minibuses </h3>
      <p><span style={{ fontWeight: "400" }}>Minibuses are suitable for mid sized groups with fuller schedules. They balance capacity and convenience, making them perfect for city tours, cultural routes and both half and full day plans. Everyone rides comfortably together and stays coordinated throughout the day.</span></p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Buses for Schools and Large Groups</h3>
      <p data-start="275" data-end="644">For larger groups, our buses provide structured and safe group travel. These work well for school outings, community trips, big family tours and corporate events, making them an excellent choice for <Link to="/services/school-transport-in-dubai/"><strong>school transport Dubai</strong> </Link>needs as well. If you are looking for reliable bus rental in Dubai that remains comfortable while staying cost effective, this option is ideal.</p>
      <p data-start="646" data-end="704" data-is-last-node="" data-is-only-node="">

      </p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Coaches for VIP Groups</h3>
      <p><span style={{ fontWeight: "400" }}>When you need a premium travel experience, our coaches deliver extra comfort, space and presentation. They suit VIP delegations, executive programs and multi day corporate or travel itineraries. If you need a refined coach for hire in Dubai for high importance travel, this category provides the right standard.</span></p>
      <p><span style={{ fontWeight: "400" }}>Every vehicle is air conditioned, regularly cleaned and driven by licensed and experienced professionals. On request, we can arrange helpful extras depending on the group requirement.</span></p>
        </ServiceBox>
        <ServiceBox col="12">
      <h3>Safety and Compliance</h3>
      <p><span style={{ fontWeight: "400" }}>Safety sits at the centre of our Dubai tours transport services. Vehicles are inspected regularly and maintained carefully. Drivers are trained in safe driving, passenger care and responsible luggage handling. Approved routes, UAE regulations and sensible driving standards are followed throughout each journey. We also coordinate clearly with organisers to confirm timing, pickup points and special needs so the entire experience remains steady and controlled.</span></p>
        </ServiceBox>
      </ServicesSection>


      <section className="services_area_section thre-epoints-section">
      <div className="container">
      <div className="row">
      </div>
      <div className="row justify-content-center g-4">
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Tours We Cover</h3>
      <p>We support a wide range of trips, including:</p>
      <p>1- Dubai city highlights and sightseeing</p>
      <p>2- Desert safaris and adventure excursions</p>
      <p>3- Day trips to Abu Dhabi and other emirates</p>
      <p>4- Heritage and cultural tours</p>
      <p>5- School outings and educational programs</p>
      <p>6- Corporate events, incentives, and team-building trips</p>
      <p>Have a custom idea or multi-day route? Share the details and we’ll plan transport around it, with transparent pricing agreed in advance.</p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>How Booking Works</h3>
      <p><span style={{ fontWeight: "400" }}>First, share your plan, including group size, dates, pickup locations and destinations. Next, we recommend suitable vehicles based on your itinerary and budget. Once you confirm, the booking is secured and on the tour day we handle timing, transport coordination and smooth movement until the final drop off.</span></p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Why Organizers Choose Us</h3>
      <p><span style={{ fontWeight: "400" }}>Schools, tour operators and corporate planners prefer Alsinan because we keep group transport simple. One point of contact, one organised schedule and one clear arrangement help ensure the day runs smoothly. With experienced drivers, well maintained vehicles and careful planning, Dubai tours transport becomes the easiest part of your itinerary.</span></p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Book Your Tour Transport Today</h3>
      <p><span style={{ fontWeight: "400" }}>Whether you need straightforward bus rental in Dubai for a single trip or a coach for hire in Dubai for a premium multi day program, Alsinan Transport is ready to support your plans. Share your requirements and we will arrange suitable vehicles, dependable drivers and clear pricing so your group can travel comfortably and confidently while enjoying everything Dubai has to offer.</span></p>
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
