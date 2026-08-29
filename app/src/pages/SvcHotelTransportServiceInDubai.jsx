import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { ServicesSection, ServiceBox } from "../components/sections/ServicesSection";
import { WhyChoose, ChoosePoint } from "../components/sections/WhyChoose";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";

export default function SvcHotelTransportServiceInDubai() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/services/hotel-transport-service-in-dubai/"]} />
      <section className="banner_home banner_inner banner_inner_services" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <span className="h1_head">Services</span>
      <h2>For Hotel</h2>
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
      <img width="640" height="853" src="/wp-content/uploads/2025/10/busses-768x1024.jpg" className="attachment-large size-large wp-post-image" alt="Two Toyota Coaster minibuses used for reliable group and staff transport services in Dubai by Alsinan Transport" decoding="async" fetchPriority="high" srcSet="/wp-content/uploads/2025/10/busses-768x1024.jpg 768w, /wp-content/uploads/2025/10/busses-225x300.jpg 225w, /wp-content/uploads/2025/10/busses.webp 960w" sizes="(max-width: 640px) 100vw, 640px" />          </div>
      </div>

      <div className="col-lg-6 my-auto">
      <div className="post-content service_content">
      <h3>Services</h3>
      <h2>For Hotel</h2>
      <h1 className="wp-block-heading"><strong><strong>Reliable Hotel Transport Service in Dubai</strong></strong></h1>
      <p>Moving around Dubai should feel easy, especially when you are staying at a hotel and want to make the most of your time. At Alsinan Transport, every hotel transfer is kept simple, dependable and comfortable. Whether you are travelling alone, with family or as part of a business group, our hotel transport service in Dubai is designed to suit your schedule and the way you travel.</p>
      <p>From smooth airport pickups to hotel transfers across the city, we handle the planning so you can focus on your stay, your meetings, your sightseeing or your special events. Every journey is arranged carefully so it feels seamless from hotel lobby to destination.</p>
      <Link className="btn btn-primary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      </div>
      </div>
      </div>

      <WhyChoose
        variant="ledger"
        heading={<><span className="sub_head">Why Choose Us</span>
      <h2>Why Choose Alsinan for Hotel Transport in Dubai</h2></>}
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
      <h3>Always on Time</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Your flights, meetings, reservations and plans all follow time. Our service does as well. Our team reaches your hotel on time so there is no waiting, rushing or unnecessary stress. With punctual hotel transport in Dubai, your day can begin and end smoothly without delays.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/icon_ontime.svg" alt="" width="67" height="61" />
      <h3>Friendly, Safe Drivers</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>A comfortable ride starts with a responsible and skilled driver. Our drivers are licensed, experienced and familiar with Dubai roads, hotel zones and key city locations. They handle luggage carefully, stay calm in traffic and maintain a respectful and reassuring attitude throughout the ride. You simply take your seat and relax while they handle the journey.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_professional_drivers.svg" alt="" width="65" height="61" />
      <h3>Vehicles for Every Group</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>No matter how many people are travelling, we provide the right transport option. Individuals and couples enjoy comfortable cars that are ideal for quick and private transfers around the city or between hotel and airport. Families, friends and small corporate teams can travel together in vans and minibuses that offer proper seating space and convenience. For large groups, our buses and coaches provide steady, safe and well organised travel for events, city tours or conference movement. You choose your need and we match the best option to your schedule.</span></p>
        </ChoosePoint>
        <ChoosePoint col="6">
      <div className="choose_list_icon">
      <img src="/wp-content/uploads/2025/09/iocn_maintenance.svg" alt="" width="64" height="60" />
      <h3>Comfort You Can Depend On</h3>
      </div>
      <p><span style={{ fontWeight: "400" }}>Every vehicle is air conditioned, clean and designed for comfortable city travel. Seating remains pleasant, space is well planned and the ride stays smooth whether it is a short nearby transfer or a longer cross city journey. If you want more flexibility beyond hotel transfers, we can also assist with longer arrangements and car rental in Dubai so you can explore with comfort and confidence.</span></p>
        </ChoosePoint>
      </WhyChoose>


      <ServicesSection
        heading={<><span className="sub_head">Our Fleet</span>
      <h2>Our Fleet for Hotel Transport in Dubai</h2></>}>
        <ServiceBox col="6">
      <h3>Cars for Solo Travelers or Couples</h3>
      <p><span style={{ fontWeight: "400" }}>For solo guests, couples and business travellers, our cars are ideal for quick and direct transport. There is enough room for luggage, interiors remain cool and the ride is focused on comfort and convenience. These are perfect for airport transfers, city travel, meetings and visits to malls, restaurants and attractions. You enjoy a direct and simple ride without hassle.</span></p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Vans and Minibuses</h3>
      <p><span style={{ fontWeight: "400" }}>For families, groups of friends and business teams who want to stay together, our vans and minibuses are a practical choice. There is comfortable seating, extra legroom and sufficient space for bags, strollers or equipment. This option works especially well for Guest transport Dubai when everyone prefers to travel together on the same schedule without splitting into multiple vehicles.</span></p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Buses and Coaches</h3>
      <p><span style={{ fontWeight: "400" }}>For larger groups, our buses and coaches make transport organised and smooth. These are great for corporate events, large travel groups, conference movements and group city tours. The ride remains steady, safe and relaxed whether it is a city transfer or a longer journey to key destinations. Every vehicle in our fleet is regularly maintained, cleaned and inspected so you can rely on it confidently.</span></p>
        </ServiceBox>
        <ServiceBox col="6">
      <h3>Safety Standards and Compliance</h3>
      <p><span style={{ fontWeight: "400" }}>We follow Dubai transport safety regulations carefully across every hotel journey. Our vehicles go through regular inspections and preventive maintenance. Drivers receive training focused on passenger safety, comfort and luggage handling. Approved routes and rules are followed responsibly and coordination remains clear so communication always stays smooth. These practices ensure every ride stays secure and comfortable for hotels and guests.</span></p>
        </ServiceBox>
      </ServicesSection>


      <section className="services_area_section thre-epoints-section">
      <div className="container">
      <div className="row">
      </div>
      <div className="row justify-content-center g-4">
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>How It Works</h3>
      <h3><span style={{ fontWeight: "400" }}>Book Your Ride</span></h3>
      <p><span style={{ fontWeight: "400" }}>Share your hotel name, pickup time, destination and any special requests such as child seats, extra luggage, multiple stops or group travel needs.</span></p>
      <h3><span style={{ fontWeight: "400" }}>Choose Your Vehicle</span></h3>
      <p><span style={{ fontWeight: "400" }}>Select from our cars, vans, minibuses or buses depending on your group size and travel plan. Our team helps you pick the right option.</span></p>
      <h3><span style={{ fontWeight: "400" }}>Confirm and Go</span></h3>
      <p><span style={{ fontWeight: "400" }}>We confirm every detail in advance so when the time arrives, you simply walk out of the lobby, take your seat and enjoy a calm, straightforward journey.</span></p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Why Guests and Hotels Trust Us</h3>
      <p><span style={{ fontWeight: "400" }}>Hotels, families, corporate travellers and tour groups choose us because we treat every ride as part of their overall stay experience. Our drivers are respectful and professional. Our vehicles are well maintained. Our processes are consistent. For Guest transport Dubai that hotels can confidently recommend, Alsinan delivers service that is reliable, comfortable and truly supportive of their reputation.</span></p>
      <Link className="btn btn-secondary" to="/contact-us/">Book Now</Link>
      </div>
      </div>
      <div className="col-lg-4">
      <div className="service_area_box">
      <h3>Book Your Hotel Transport Today</h3>
      <p><span style={{ fontWeight: "400" }}>Begin your Dubai stay in a relaxed, organised and confident way. Book your hotel transport service in Dubai with Alsinan Transport, choose the vehicle that suits your travel needs and let us handle the journey. Whether it is a quick hotel transfer, airport connection or a day of city travel, every ride is planned for convenience, comfort and efficiency so you can simply enjoy your stay.</span></p>
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
