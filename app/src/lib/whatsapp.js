// Every WhatsApp button used to send the same "I want to know more about
// Alsinan", so a message from the school page and one from the bus rental page
// arrived looking identical and whoever answered had to ask what it was about.
// The opening line now names what the visitor was reading.
//
// One map, one source of truth: pages pass their own route, the header, footer
// and shared sections pass the route they are currently rendered on.

const NUMBER = "971555252397";

const DEFAULT = "Hi Alsinan, I would like to ask about your transport services in Dubai.";

const MESSAGES = {
  "/": DEFAULT,
  "/about/": DEFAULT,
  "/contact-us/": "Hi Alsinan, I would like to ask about your transport services in Dubai.",
  "/our-fleet/": "Hi Alsinan, I saw your fleet page. Could you tell me which vehicle suits my group?",
  "/services/": "Hi Alsinan, I saw your services page and would like a quote.",
  "/thank-you/": "Hi Alsinan, I just sent an enquiry through your website and wanted to follow up.",

  // service pages
  "/services/school-transport-in-dubai/":
    "Hi Alsinan, I am enquiring about school transport in Dubai. Could you share routes and pricing?",
  "/services/staff-transport-in-dubai/":
    "Hi Alsinan, I am enquiring about staff transport in Dubai for our team. Could you share a quote?",
  "/services/labour-transport-in-dubai/":
    "Hi Alsinan, I am enquiring about daily labour transport in Dubai from accommodation to site.",
  "/services/bus-rental-dubai/":
    "Hi Alsinan, I am enquiring about bus rental in Dubai with a driver. Could you share sizes and pricing?",
  "/services/airport-transport-in-dubai/":
    "Hi Alsinan, I am enquiring about airport transport in Dubai. Could you share pricing?",
  "/services/hotel-transport-service-in-dubai/":
    "Hi Alsinan, I am enquiring about hotel transport in Dubai for our guests.",
  "/services/private-car-rental-in-dubai/":
    "Hi Alsinan, I am enquiring about private car rental in Dubai. Could you share available vehicles?",
  "/services/dubai-tours-transport-services/":
    "Hi Alsinan, I am enquiring about transport for a tour or excursion in Dubai.",

  // blog
  "/blogs/": "Hi Alsinan, I was reading your blog and would like to ask about your transport services.",
  "/category/cars/": "Hi Alsinan, I was reading your blog and would like to ask about your transport services.",
};

const POST_TOPICS = {
  "/bus-rental-in-dubai-what-to-check-before-you-book/": "bus rental in Dubai",
  "/how-to-choose-a-staff-transport-company-in-dubai/": "staff transport in Dubai",
  "/compare-different-hotel-transport-options-dubai/": "hotel transport in Dubai",
  "/transport-service-options-for-airport-transfers-uae/": "airport transfers in the UAE",
  "/ride-service-for-daily-commuting-in-dubai/": "daily commuting transport in Dubai",
  "/what-to-think-about-before-traveling-to-dubai/": "transport for a trip to Dubai",
  "/the-daily-transport-challenges-businesses-face-in-dubai/": "staff transport in Dubai",
  "/why-many-families-prefer-dedicated-transport-services-in-dubai/": "dedicated family transport in Dubai",
  "/how-visitors-move-around-dubai-without-stress/": "getting around Dubai",
};

for (const [route, topic] of Object.entries(POST_TOPICS)) {
  MESSAGES[route] = `Hi Alsinan, I read your article on ${topic} and would like to ask about it.`;
}

export function waMessage(route) {
  return MESSAGES[route] || DEFAULT;
}

export function waLink(route) {
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(waMessage(route))}`;
}
