import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import { bodyClasses } from "./data/bodyClasses";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import OurFleet from "./pages/OurFleet";
import ContactUs from "./pages/ContactUs";
import Blogs from "./pages/Blogs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import SvcSchoolTransportInDubai from "./pages/SvcSchoolTransportInDubai";
import SvcDubaiToursTransportServices from "./pages/SvcDubaiToursTransportServices";
import SvcPrivateCarRentalInDubai from "./pages/SvcPrivateCarRentalInDubai";
import SvcStaffTransportInDubai from "./pages/SvcStaffTransportInDubai";
import SvcHotelTransportServiceInDubai from "./pages/SvcHotelTransportServiceInDubai";
import SvcAirportTransportInDubai from "./pages/SvcAirportTransportInDubai";
import PostCompareDifferentHotelTransportOptionsDubai from "./pages/PostCompareDifferentHotelTransportOptionsDubai";
import PostTransportServiceOptionsForAirportTransfersUae from "./pages/PostTransportServiceOptionsForAirportTransfersUae";
import PostRideServiceForDailyCommutingInDubai from "./pages/PostRideServiceForDailyCommutingInDubai";
import PostWhatToThinkAboutBeforeTravelingToDubai from "./pages/PostWhatToThinkAboutBeforeTravelingToDubai";
import PostTheDailyTransportChallengesBusinessesFaceInDubai from "./pages/PostTheDailyTransportChallengesBusinessesFaceInDubai";
import PostWhyManyFamiliesPreferDedicatedTransportServicesInDubai from "./pages/PostWhyManyFamiliesPreferDedicatedTransportServicesInDubai";
import PostHowVisitorsMoveAroundDubaiWithoutStress from "./pages/PostHowVisitorsMoveAroundDubaiWithoutStress";
import CategoryCars from "./pages/CategoryCars";

function BodyClass() {
  const { pathname } = useLocation();
  useEffect(() => {
    const key = pathname.endsWith("/") ? pathname : pathname + "/";
    document.body.className = bodyClasses[key] || "";
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// WordPress fired a real pageview per navigation; in a SPA only the first one
// happens on its own, so push a virtual pageview for every route change after it.
function TrackPageViews() {
  const { pathname } = useLocation();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "virtual_pageview",
      page_path: pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div id="page" className="site">
      <BodyClass />
      <ScrollToTop />
      <TrackPageViews />
      <a className="skip-link screen-reader-text" href="#primary">Skip to content</a>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about/" element={<About />} />
        <Route path="/services/" element={<Services />} />
        <Route path="/our-fleet/" element={<OurFleet />} />
        <Route path="/contact-us/" element={<ContactUs />} />
        <Route path="/blogs/" element={<Blogs />} />
        <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions/" element={<TermsAndConditions />} />
        <Route path="/services/school-transport-in-dubai/" element={<SvcSchoolTransportInDubai />} />
        <Route path="/services/dubai-tours-transport-services/" element={<SvcDubaiToursTransportServices />} />
        <Route path="/services/private-car-rental-in-dubai/" element={<SvcPrivateCarRentalInDubai />} />
        <Route path="/services/staff-transport-in-dubai/" element={<SvcStaffTransportInDubai />} />
        <Route path="/services/hotel-transport-service-in-dubai/" element={<SvcHotelTransportServiceInDubai />} />
        <Route path="/services/airport-transport-in-dubai/" element={<SvcAirportTransportInDubai />} />
        <Route path="/compare-different-hotel-transport-options-dubai/" element={<PostCompareDifferentHotelTransportOptionsDubai />} />
        <Route path="/transport-service-options-for-airport-transfers-uae/" element={<PostTransportServiceOptionsForAirportTransfersUae />} />
        <Route path="/ride-service-for-daily-commuting-in-dubai/" element={<PostRideServiceForDailyCommutingInDubai />} />
        <Route path="/what-to-think-about-before-traveling-to-dubai/" element={<PostWhatToThinkAboutBeforeTravelingToDubai />} />
        <Route path="/the-daily-transport-challenges-businesses-face-in-dubai/" element={<PostTheDailyTransportChallengesBusinessesFaceInDubai />} />
        <Route path="/why-many-families-prefer-dedicated-transport-services-in-dubai/" element={<PostWhyManyFamiliesPreferDedicatedTransportServicesInDubai />} />
        <Route path="/how-visitors-move-around-dubai-without-stress/" element={<PostHowVisitorsMoveAroundDubaiWithoutStress />} />
        <Route path="/category/cars/" element={<CategoryCars />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
