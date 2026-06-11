export const navItems = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Insights", href: "/insights" }
];

export const images = {
  hero: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2400&q=90",
  rooftop: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1600&q=85",
  commercial: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1600&q=85",
  cctv: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=85",
  lighting: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=85",
  batteries: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=1600&q=85",
  project: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=90",
  architecture: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1800&q=85",
  team: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1600&q=85",
  contact: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85"
};

export const stats = [
  ["12+", "Years Experience"],
  ["5000+", "Customers Served"],
  ["2000+", "Installations"],
  ["24/7", "Support"]
];

export const solutions = [
  {
    title: "Residential Solar",
    text: "Clean, resilient home energy systems with backup power and premium installation.",
    image: images.rooftop
  },
  {
    title: "Commercial Solar",
    text: "Grid-tied and hybrid systems engineered for lower operating costs and uptime.",
    image: images.commercial
  },
  {
    title: "CCTV & Security",
    text: "Integrated surveillance, access control, and smart monitoring for critical assets.",
    image: images.cctv
  },
  {
    title: "Solar Lighting",
    text: "Reliable street, compound, and institutional lighting for all-weather performance.",
    image: images.lighting
  }
];

export const products = [
  ["Solar Panels", "Mono PERC modules", "Up to 580W output", images.rooftop],
  ["Inverters", "Hybrid smart control", "Grid + battery ready", images.commercial],
  ["Batteries", "Lithium energy storage", "Long cycle performance", images.batteries],
  ["CCTV Cameras", "AI assisted security", "Night vision monitoring", images.cctv],
  ["Solar Lighting", "Autonomous LED systems", "Motion sensing controls", images.lighting],
  ["Electrical Products", "Premium distribution gear", "Certified components", images.architecture]
];

export const projects = [
  {
    title: "Nairobi Commercial Hub",
    location: "Nairobi",
    capacity: "180 kWp",
    type: "Commercial Solar",
    image: images.project,
    description: "Hybrid rooftop system reducing daytime grid dependence for a multi-tenant property."
  },
  {
    title: "Kisumu Learning Campus",
    location: "Kisumu",
    capacity: "64 kWp",
    type: "Institutional Solar",
    image: images.rooftop,
    description: "Reliable solar and battery backup powering classrooms, offices, and security systems."
  },
  {
    title: "Mombasa Logistics Yard",
    location: "Mombasa",
    capacity: "Security Grid",
    type: "CCTV & Lighting",
    image: images.cctv,
    description: "Integrated CCTV coverage, smart lighting, and backup power for 24-hour operations."
  },
  {
    title: "Eldoret Residence Estate",
    location: "Eldoret",
    capacity: "28 homes",
    type: "Residential Solar",
    image: images.lighting,
    description: "Estate-wide solar lighting and home backup systems for modern family living."
  }
];

export const testimonials = [
  ["Amina W.", "Homeowner, Karen", "ST Light gave our home silent, reliable backup power with a level of finishing that felt truly premium."],
  ["Peter M.", "Operations Director", "The commercial system was delivered professionally, and the monitoring has helped us control energy costs."],
  ["Grace N.", "School Administrator", "Our labs and security systems now stay online through outages. The support team has been excellent."]
];
