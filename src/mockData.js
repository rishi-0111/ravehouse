export const mockEvents = [
  {
    id: "evt-01",
    name: "Coastal Sunrise Beach Clean-up & Yoga",
    description: "Join us for a dual-purpose morning. We will start with a 45-minute beach clean-up drive to help preserve our marine ecosystem, followed by a relaxing and rejuvenating Vinyasa yoga session led by certified instructor Kiara Sen right on the sand. Breakfast and cleaning kits will be provided.",
    category: "Beach Activities",
    date: "2026-06-14",
    time: "06:00 AM",
    venue: "Marina Beach, Temple Bay Front, Chennai",
    maps_link: "https://maps.app.goo.gl/t1k5YmJj8K8dD1gT9",
    registration_deadline: "2026-06-12",
    max_participants: 60,
    fee: 0,
    payment_type: "Free",
    qr_enabled: false,
    qr_image_url: null,
    upi_id: null,
    banner_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200",
    status: "published"
  },
  {
    id: "evt-02",
    name: "Rave House Midnight Marathon (10K / 5K)",
    description: "Experience the adrenaline of racing under the city lights. The Rave House Midnight Run is Chennai's premiere night marathon. Features include neon lighting, live DJ checkpoints along the route, professional timing chips, dry-fit tees, finisher medals, and post-run neon concert party.",
    category: "Running Events",
    date: "2026-06-20",
    time: "09:30 PM",
    venue: "Besant Nagar Beach Promenade, Chennai",
    maps_link: "https://maps.app.goo.gl/t1k5YmJj8K8dD1gT9",
    registration_deadline: "2026-06-18",
    max_participants: 500,
    fee: 499,
    payment_type: "QR Payment",
    qr_enabled: true,
    qr_image_url: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=ravehouse@ybl%26pn=Rave%20House%20Events%26am=499.00",
    upi_id: "ravehouse@ybl",
    banner_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=1200",
    status: "published"
  },
  {
    id: "evt-03",
    name: "Youth Mental Well-being & Counselling Seminar",
    description: "A social welfare program focusing on breaking taboos around mental health in modern youth. Keynote addresses by top psychologists, followed by group circles, interactive mindfulness worksheets, and open Q&A sessions. Free professional advice and resource materials for all attendees.",
    category: "Social Welfare Programs",
    date: "2026-06-28",
    time: "10:00 AM",
    venue: "Inspiria Innovation Hub, Nungambakkam",
    maps_link: "https://maps.app.goo.gl/t1k5YmJj8K8dD1gT9",
    registration_deadline: "2026-06-26",
    max_participants: 120,
    fee: 0,
    payment_type: "Free",
    qr_enabled: false,
    qr_image_url: null,
    upi_id: null,
    banner_url: "https://images.unsplash.com/photo-1529070538774-1883cb3c65db?auto=format&fit=crop&q=80&w=1200",
    status: "published"
  },
  {
    id: "evt-04",
    name: "Summer Beats & Tech Meetup",
    description: "Get together with the finest tech creators, designers, and electronic music enthusiasts in the community. Networking, showcases of indie projects, and a guest masterclass on 'Sound Synthesis and Algorithmic Beats'. Food and drinks on the house.",
    category: "Community Meetups",
    date: "2026-07-05",
    time: "04:00 PM",
    venue: "The Rave House Garage, ECR road",
    maps_link: "https://maps.app.goo.gl/t1k5YmJj8K8dD1gT9",
    registration_deadline: "2026-07-03",
    max_participants: 80,
    fee: 199,
    payment_type: "QR Payment",
    qr_enabled: true,
    qr_image_url: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=ravehouse@ybl%26pn=Rave%20House%20Events%26am=199.00",
    upi_id: "ravehouse@ybl",
    banner_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1200",
    status: "published"
  }
];

export const mockAnnouncements = [
  {
    id: "ann-01",
    title: "Midnight Marathon Neon Gear Update",
    content: "All registered participants for the Midnight Marathon can pick up their neon bibs and glow kits starting June 18th at the Besant Nagar Desk. Ensure you carry your QR Ticket for validation.",
    created_at: "2026-06-05"
  },
  {
    id: "ann-02",
    title: "Volunteering Call Open for Q3 Events",
    content: "We are expanding our core team for upcoming winter projects. Apply under the Volunteer section to gain access to premium benefits and event passes.",
    created_at: "2026-06-02"
  }
];

export const mockGallery = [
  {
    id: "gal-01",
    event_id: "evt-01",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  },
  {
    id: "gal-02",
    event_id: "evt-02",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  },
  {
    id: "gal-03",
    event_id: "evt-02",
    image_url: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  },
  {
    id: "gal-04",
    event_id: "evt-03",
    image_url: "https://images.unsplash.com/photo-1529070538774-1883cb3c65db?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  },
  {
    id: "gal-05",
    event_id: "evt-04",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  },
  {
    id: "gal-06",
    event_id: "evt-01",
    image_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    video_url: null,
    uploaded_by: "Admin"
  }
];

export const mockFeedback = [
  {
    id: "feed-01",
    event_id: "evt-01",
    participant_email: "rohan@gmail.com",
    rating: 5,
    comment: "The Beach Cleanup was wonderfully managed! Yoga on the beach at sunrise was a perfect finish.",
    created_at: "2026-06-02"
  },
  {
    id: "feed-02",
    event_id: "evt-02",
    participant_email: "priya@yahoo.com",
    rating: 4,
    comment: "Midnight Marathon had awesome music but the route could have had more water stations. Can't wait for next year!",
    created_at: "2026-06-03"
  }
];
