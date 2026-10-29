// FAQ blocks for the blog posts, keyed by route. Each page renders this array
// and jsonld.js turns the same array into the post's FAQPage schema, so the
// visible answers and the structured data cannot drift apart.
//
// No prices, ranges or figures anywhere: the client does not want pricing on
// the site, so a cost question explains what a quote depends on instead.
export const postFaqs = {
  "/transport-service-options-for-airport-transfers-uae/": [
    [
      "Can you pick up from any UAE airport?",
      "Yes. We arrange pickups and drop-offs at Dubai International, Al Maktoum International, Zayed International in Abu Dhabi and Sharjah International, to and from anywhere in the seven emirates.",
    ],
    [
      "What happens if my flight is delayed?",
      "Share your flight number when you book. That allows the pickup time to be adjusted to the actual arrival.",
    ],
    [
      "Can you handle a group arriving on different flights?",
      "Yes. Send the list of flights and passenger names, and the pickups can be planned flight by flight or grouped where arrival times are close.",
    ],
    [
      "Do you offer return trips to the airport?",
      "Yes. Share the departure flight and pickup address, and the return trip can be booked together with the arrival.",
    ],
  ],
  "/compare-different-hotel-transport-options-dubai/": [
    [
      "Can you handle transport for a full event, not just one trip?",
      "Yes. Send the full schedule and passenger numbers, and every movement can be planned together, from airport arrivals to departures.",
    ],
    [
      "Can guests be picked up from more than one hotel?",
      "Yes. Share each hotel and the number of guests at each, and the route can be planned to collect everyone.",
    ],
    [
      "Do you work directly with hotels?",
      "Yes. Hotels can book transport for their guests, including airport pickups, venue transfers and day trips.",
    ],
    [
      "How early should we book for a busy event week?",
      "As early as you can. During large exhibitions and peak tourist months, vehicles book up quickly.",
    ],
  ],
  "/what-affects-the-cost-of-staff-transport-in-dubai/": [
    [
      "How is staff transport priced in Dubai?",
      "Almost always as a monthly rate for a route rather than a rate per person. The provider works out what it costs to run that route every working day, which depends on the vehicle, the distance, the timings and the length of the contract, and quotes a figure for the month.",
    ],
    [
      "Does the cost per employee fall as headcount rises?",
      "Usually, up to the point where the vehicle fills. Moving twenty people in one minibus costs less per head than moving eight, because the run is the same either way. Once you pass what one vehicle holds, a second vehicle starts a new cost line.",
    ],
    [
      "Is a longer contract cheaper?",
      "A longer commitment lets a provider plan vehicles and drivers around your route instead of holding them free for short bookings, and that usually shows in the rate. Ask what changes between a monthly arrangement and a longer term.",
    ],
    [
      "What should we send to get an accurate quote?",
      "Headcount, the areas people travel from, the drop-off location, shift start and finish times, and whether the timings change between days. With those, a quote can be built on your actual route rather than an assumption.",
    ],
  ],

  "/how-to-arrange-secure-transport-for-a-vip-guest-at-a-dubai-hotel/": [
    [
      "How far in advance should a hotel book VIP transport?",
      "As soon as the arrival details are confirmed. The vehicle matters less than the planning around it: the route, the entrance to use, who meets the guest and what happens if the flight moves. That planning needs time, not a last minute call.",
    ],
    [
      "Who should hold the guest's details?",
      "As few people as possible. The driver needs the pickup point, the timing and a name to look for. Flight numbers, room numbers and itineraries should stay with the hotel contact rather than circulating in a group chat.",
    ],
    [
      "What happens if the flight is delayed?",
      "The pickup moves with the flight. We track arrival times for airport work and adjust rather than holding to a fixed slot, so the driver is there when the guest actually lands.",
    ],
    [
      "Can the same driver stay with the guest for the whole visit?",
      "That is usually what a hotel wants, and it is worth asking for when you book. Continuity means the driver already knows the routes, the entrance and the preferences by the second day.",
    ],
  ],

  "/school-bus-transport-in-dubai-what-schools-and-parents-should-check/": [
    [
      "What should a school check before appointing a transport provider?",
      "That the vehicles and drivers are licensed for passenger transport, that drivers are screened and trained to work with students, that there is a named contact for daily issues, and that the provider can show how it plans routes around your timings rather than its own.",
    ],
    [
      "What should a parent ask about their child's route?",
      "Where the pickup point is and at what time, who supervises boarding and drop off, how the school and the provider are contacted if the bus is late, and what happens on a day the child is not travelling.",
    ],
    [
      "How are school routes planned?",
      "Backwards from the school's start and finish times, using the areas families actually live in and the traffic those roads carry at that hour. A route is built once and then left alone, because a school run only works when it is the same every day.",
    ],
    [
      "What happens when timings or numbers change mid term?",
      "A new joiner, a changed finish time or an added stop is handled by adjusting the existing route rather than rebuilding it. Tell the provider as early as you can and the change is absorbed into the schedule.",
    ],
  ],
};
