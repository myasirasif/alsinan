import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import useThemeScripts from "../hooks/useThemeScripts";
import { seo } from "../data/seo";
import PostDate from "../components/PostDate";

export default function Blogs() {
  useThemeScripts([]);

  return (
    <>
      <Seo {...seo["/blogs/"]} />
      <section className="banner_home banner_inner" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1>Blogs</h1>
      </div>
      </div>
      </div>
      </div>
      </section>


      <section className="all_blogs">
      <div className="container my-5">
      <div className="blogs_head">
      <div className="col-12 text-center">
      <h2 className="text-center"><span>Alsinan</span>Blogs</h2>
      </div>
      </div>
      <div className="row">
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/bus-rental-in-dubai-what-to-check-before-you-book/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/bus-rental-dubai-fleet-768x364.webp" className="img-fluid wp-post-image" alt="Two Toyota Coaster buses with Dubai number plates parked at the Alsinan Transport depot" decoding="async" srcSet="/wp-content/uploads/2026/01/bus-rental-dubai-fleet-768x364.webp 768w, /wp-content/uploads/2026/01/bus-rental-dubai-fleet-300x142.webp 300w, /wp-content/uploads/2026/01/bus-rental-dubai-fleet-1024x485.webp 1024w, /wp-content/uploads/2026/01/bus-rental-dubai-fleet.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/bus-rental-in-dubai-what-to-check-before-you-book/" />
      <h5 className="card-title">Bus Rental in Dubai: What to Check Before You Book</h5>
      <p className="card-text">
                          Vehicle size, driver, itinerary, pricing and backup plans. The details that decide whether a group trip runs smoothly.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/how-to-choose-a-staff-transport-company-in-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/staff-transport-company-dubai-768x364.webp" className="img-fluid wp-post-image" alt="Toyota Coaster carrying staff on a Dubai road, used by staff transport companies for daily employee runs" decoding="async" srcSet="/wp-content/uploads/2026/01/staff-transport-company-dubai-768x364.webp 768w, /wp-content/uploads/2026/01/staff-transport-company-dubai-300x142.webp 300w, /wp-content/uploads/2026/01/staff-transport-company-dubai-1024x485.webp 1024w, /wp-content/uploads/2026/01/staff-transport-company-dubai.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/how-to-choose-a-staff-transport-company-in-dubai/" />
      <h5 className="card-title">How to Choose a Staff Transport Company in Dubai</h5>
      <p className="card-text">
                          Licensing, vehicles, punctuality and pricing. A practical checklist to work through before you sign a transport contract.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/compare-different-hotel-transport-options-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img width="640" height="303" src="/wp-content/uploads/2026/02/compare-different-hotel-transport-options-dubai-1-6982c6e08e182-768x364.webp" className="img-fluid wp-post-image" alt="Compare different hotel transport options for visitors traveling between city areas in Dubai" decoding="async" srcSet="/wp-content/uploads/2026/02/compare-different-hotel-transport-options-dubai-1-6982c6e08e182-768x364.webp 768w, /wp-content/uploads/2026/02/compare-different-hotel-transport-options-dubai-1-6982c6e08e182-300x142.webp 300w, /wp-content/uploads/2026/02/compare-different-hotel-transport-options-dubai-1-6982c6e08e182-1024x485.webp 1024w, /wp-content/uploads/2026/02/compare-different-hotel-transport-options-dubai-1-6982c6e08e182.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/compare-different-hotel-transport-options-dubai/" />
      <h5 className="card-title">Compare Different Hotel Transport Options for Visitors Traveling Between City Areas</h5>
      <p className="card-text">
                          Choosing the right hotel transport makes visiting Dubai easier. This guide compares options                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/transport-service-options-for-airport-transfers-uae/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/transport-service-options-for-airport-transfers-uae-697c131647105-768x364.webp" className="img-fluid wp-post-image" alt="Transport service options for airport transfers in the UAE with professional driver support" decoding="async" srcSet="/wp-content/uploads/2026/01/transport-service-options-for-airport-transfers-uae-697c131647105-768x364.webp 768w, /wp-content/uploads/2026/01/transport-service-options-for-airport-transfers-uae-697c131647105-300x142.webp 300w, /wp-content/uploads/2026/01/transport-service-options-for-airport-transfers-uae-697c131647105-1024x485.webp 1024w, /wp-content/uploads/2026/01/transport-service-options-for-airport-transfers-uae-697c131647105.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/transport-service-options-for-airport-transfers-uae/" />
      <h5 className="card-title">What Are the Best Transport Service Options for Airport Transfers in the UAE?</h5>
      <p className="card-text">
                          Not all airport transfers are the same. This guide explains the best transport options in the UAE so you can...                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/ride-service-for-daily-commuting-in-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/untitled-design-17-6978241f66bd2-768x364.webp" className="img-fluid wp-post-image" alt="Reliable ride service for daily commuting in Dubai provided by Alsinan Transport" decoding="async" srcSet="/wp-content/uploads/2026/01/untitled-design-17-6978241f66bd2-768x364.webp 768w, /wp-content/uploads/2026/01/untitled-design-17-6978241f66bd2-300x142.webp 300w, /wp-content/uploads/2026/01/untitled-design-17-6978241f66bd2-1024x485.webp 1024w, /wp-content/uploads/2026/01/untitled-design-17-6978241f66bd2.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/ride-service-for-daily-commuting-in-dubai/" />
      <h5 className="card-title">How Can I Book a Reliable Ride Service for Daily Commuting in Dubai?</h5>
      <p className="card-text">
                          Dubai life moves fast. This guide explains how to book a reliable daily ride service without stress.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/what-to-think-about-before-traveling-to-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/untitled-design-13-69683c735ba94-768x364.webp" className="img-fluid wp-post-image" alt="Traveler calmly reviewing plans before a trip to Dubai, focusing on preparation and thoughtful travel planning." decoding="async" srcSet="/wp-content/uploads/2026/01/untitled-design-13-69683c735ba94-768x364.webp 768w, /wp-content/uploads/2026/01/untitled-design-13-69683c735ba94-300x142.webp 300w, /wp-content/uploads/2026/01/untitled-design-13-69683c735ba94-1024x485.webp 1024w, /wp-content/uploads/2026/01/untitled-design-13-69683c735ba94.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/what-to-think-about-before-traveling-to-dubai/" />
      <h5 className="card-title">What to Think About Before Traveling to Dubai</h5>
      <p className="card-text">
                          Dubai is exciting, but first time travel needs thoughtful planning. This guide helps visitors prepare before arriving.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/the-daily-transport-challenges-businesses-face-in-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/untitled-design-12-69633a3b6bbc3-768x364.webp" className="img-fluid wp-post-image" alt="Office professionals in Dubai discussing schedules while looking concerned about daily staff transport delays." decoding="async" srcSet="/wp-content/uploads/2026/01/untitled-design-12-69633a3b6bbc3-768x364.webp 768w, /wp-content/uploads/2026/01/untitled-design-12-69633a3b6bbc3-300x142.webp 300w, /wp-content/uploads/2026/01/untitled-design-12-69633a3b6bbc3-1024x485.webp 1024w, /wp-content/uploads/2026/01/untitled-design-12-69633a3b6bbc3.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/the-daily-transport-challenges-businesses-face-in-dubai/" />
      <h5 className="card-title">The Daily Transport Challenges Businesses Face in Dubai</h5>
      <p className="card-text">
                          Dubai is fast paced, but daily staff movement can disrupt operations. This guide explains how transport challenges affect businesses.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/why-many-families-prefer-dedicated-transport-services-in-dubai/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/untitled-design-9-695f0a21e2722-768x364.webp" className="img-fluid wp-post-image" alt="Parent helping a child enter a comfortable vehicle in Dubai, showing calm and reliable daily family transport." decoding="async" srcSet="/wp-content/uploads/2026/01/untitled-design-9-695f0a21e2722-768x364.webp 768w, /wp-content/uploads/2026/01/untitled-design-9-695f0a21e2722-300x142.webp 300w, /wp-content/uploads/2026/01/untitled-design-9-695f0a21e2722-1024x485.webp 1024w, /wp-content/uploads/2026/01/untitled-design-9-695f0a21e2722.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/why-many-families-prefer-dedicated-transport-services-in-dubai/" />
      <h5 className="card-title">Why Many Families Prefer Dedicated Transport Services in Dubai</h5>
      <p className="card-text">
                          Dubai is exciting, but daily travel with family needs more care. This guide explains why many families choose reliable transport.                  </p>
      </div>
      </div>
      </Link>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
      <Link className="text-decoration-none d-block h-100" to="/how-visitors-move-around-dubai-without-stress/">
      <div className="card h-100">
      <div className="card-img-top">
      <img loading="lazy" width="640" height="303" src="/wp-content/uploads/2026/01/Untitled-design-8-768x364.webp" className="img-fluid wp-post-image" alt="Calm tourists arriving at Dubai International Airport with light luggage, heading toward pre arranged transport for a stress free start to their trip." decoding="async" srcSet="/wp-content/uploads/2026/01/Untitled-design-8-768x364.webp 768w, /wp-content/uploads/2026/01/Untitled-design-8-300x142.png 300w, /wp-content/uploads/2026/01/Untitled-design-8-1024x485.webp 1024w, /wp-content/uploads/2026/01/Untitled-design-8.webp 1408w" sizes="(max-width: 640px) 100vw, 640px" />                </div>
      <div className="card-body">
      <PostDate route="/how-visitors-move-around-dubai-without-stress/" />
      <h5 className="card-title">How Visitors Move Around Dubai Without Stress</h5>
      <p className="card-text">
                          Dubai is exciting, but moving around it for the first time can feel confusing. This guide helps visitors travel confidently.                  </p>
      </div>
      </div>
      </Link>
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
      <img loading="lazy" src="/wp-content/uploads/2025/09/red_area.png" alt="" width="980" height="652" />
      </div>
      <div className="content_middle">
      <span className="sub_head">Looking for a safe and reliable transport services in Dubai?</span>
      <h2>Contact us today to book your ride!</h2>
      </div>
      <div className="whatsapp_num white_num">
      <div className="whatsapp_box">
      <div className="icon_wp">
      <img loading="lazy" src="/wp-content/uploads/2025/09/icon_wp.svg" alt="Chat with Alsinan Transport on WhatsApp" width="37" height="36" />
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
