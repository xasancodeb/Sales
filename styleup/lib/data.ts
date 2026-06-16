// ── StyleUp — Stylist & platform data ─────────────────────────────────

export type SessionType = "in-store" | "home" | "virtual" | "online";

export interface Service {
  name: string;
  desc: string;
  duration: string;
  price: number;
  currency: string;
  type: SessionType;
}

export interface Review {
  author: string;
  flag: string;
  rating: number;
  text: string;
  date: string;
  session: string;
}

export interface Stylist {
  id: string;
  name: string;
  flag: string;
  city: string;
  country: string;
  specialty: string[];
  tagline: string;
  bio: string;
  rating: number;
  reviews_count: number;
  bookings: number;
  gradient: [string, string];   // avatar gradient
  services: Service[];
  reviews: Review[];
  portfolio: { label: string; colors: string[] }[];
  archetypes: string[];
  available_today: boolean;
  response_time: string;
  languages: string[];
}

export const STYLISTS: Stylist[] = [
  {
    id: "amara-okonkwo",
    name: "Amara Okonkwo",
    flag: "🇬🇧",
    city: "London",
    country: "United Kingdom",
    specialty: ["Minimalist", "Contemporary", "Office Wear"],
    tagline: "Less noise, more you.",
    bio: "I spent 8 years dressing executives at a London PR firm before realising that the most powerful thing I could do was help people feel effortlessly themselves. I believe in buying fewer, better things — and knowing exactly why each one is in your wardrobe.",
    rating: 4.97,
    reviews_count: 214,
    bookings: 1847,
    gradient: ["#1A1612", "#4A3728"],
    services: [
      { name: "Wardrobe Edit", desc: "We go through everything. Ruthless but kind.", duration: "3 hrs", price: 285, currency: "£", type: "home" },
      { name: "Shop Together", desc: "I take you to the right stores — not all stores.", duration: "4 hrs", price: 380, currency: "£", type: "in-store" },
      { name: "Virtual Style Consult", desc: "60-min deep-dive on your style goals.", duration: "1 hr", price: 95, currency: "£", type: "virtual" },
      { name: "Online Capsule Build", desc: "I send you a curated mood board + shopping list.", duration: "async", price: 120, currency: "£", type: "online" },
    ],
    reviews: [
      { author: "Priya T.", flag: "🇬🇧", rating: 5, text: "Amara transformed my 'I have nothing to wear' into a wardrobe I actually use. Every piece now works with three others. Genuinely life-changing.", date: "2 weeks ago", session: "Wardrobe Edit" },
      { author: "James W.", flag: "🇺🇸", rating: 5, text: "I was sceptical about a male client booking a stylist. Amara made it completely comfortable and I walked out of that shopping session looking like a completely different — better — person.", date: "1 month ago", session: "Shop Together" },
      { author: "Céline M.", flag: "🇫🇷", rating: 5, text: "She understands that minimalism isn't about being boring. My wardrobe now has a point of view.", date: "3 months ago", session: "Virtual Style Consult" },
    ],
    portfolio: [
      { label: "The London Capsule", colors: ["#1A1612", "#F5F0EB", "#C4923A", "#8B7355", "#E8E5E0"] },
      { label: "Office Power", colors: ["#2C2C2C", "#FFFFFF", "#C0C0C0", "#1A3A6B", "#F5F5F0"] },
      { label: "Weekend Edit", colors: ["#D4C5A9", "#8B7D6B", "#FFFFFF", "#556B2F", "#F0EBE3"] },
    ],
    archetypes: ["Minimalist", "Classic"],
    available_today: true,
    response_time: "< 1 hour",
    languages: ["English", "Igbo"],
  },
  {
    id: "lea-fontaine",
    name: "Léa Fontaine",
    flag: "🇫🇷",
    city: "Paris",
    country: "France",
    specialty: ["Classic French", "Chic", "Effortless Elegance"],
    tagline: "Style parisien — for everyone.",
    bio: "Raised between a Marais boutique and my grandmother's atelier, I learned that true French style is not about the label — it's about fit, fabric, and intention. I have helped 900+ clients from 40 countries find their version of Parisian ease.",
    rating: 4.94,
    reviews_count: 189,
    bookings: 2104,
    gradient: ["#8B6914", "#D4A843"],
    services: [
      { name: "Le Grand Edit", desc: "Full wardrobe overhaul, Paris-method.", duration: "4 hrs", price: 420, currency: "€", type: "home" },
      { name: "Marais Shopping Tour", desc: "My secret stores + your style goals.", duration: "5 hrs", price: 490, currency: "€", type: "in-store" },
      { name: "Capsule en ligne", desc: "A curated 20-piece French capsule wardrobe, delivered digitally.", duration: "async", price: 150, currency: "€", type: "online" },
      { name: "Style Apéro (Virtual)", desc: "A glass of wine and an hour of honest style advice.", duration: "1 hr", price: 85, currency: "€", type: "virtual" },
    ],
    reviews: [
      { author: "Sarah K.", flag: "🇬🇧", rating: 5, text: "Léa took me to three shops I'd walked past a hundred times and never entered. Each one was exactly right. I bought five things and feel richer than I did with a full Zara haul.", date: "1 week ago", session: "Marais Shopping Tour" },
      { author: "Yuki N.", flag: "🇯🇵", rating: 5, text: "I was visiting Paris for a week and booked Léa on day two. Best decision of the trip. She showed me what 'effortless' actually means.", date: "3 weeks ago", session: "Marais Shopping Tour" },
      { author: "Marcus B.", flag: "🇩🇪", rating: 4, text: "The capsule guide she sent was incredibly thoughtful. I've since bought 8 of the 20 pieces and they all work together perfectly.", date: "2 months ago", session: "Capsule en ligne" },
    ],
    portfolio: [
      { label: "Rive Gauche", colors: ["#0A0A0A", "#FFFFFF", "#8B4513", "#D4C5A9", "#2C4A1E"] },
      { label: "Le Brunch", colors: ["#FFDAB9", "#D4A843", "#FAF7F2", "#C19A6B", "#E8DCC8"] },
      { label: "Soirée Parisienne", colors: ["#1A1A2E", "#C0A060", "#F5F5DC", "#8B0000", "#2C2C2C"] },
    ],
    archetypes: ["Classic", "Minimalist", "Romantic"],
    available_today: false,
    response_time: "< 3 hours",
    languages: ["French", "English", "Italian"],
  },
  {
    id: "marcus-reeves",
    name: "Marcus Reeves",
    flag: "🇺🇸",
    city: "New York",
    country: "United States",
    specialty: ["Streetwear", "Sneaker Culture", "Hype-to-Luxury"],
    tagline: "From the block to the boardroom.",
    bio: "I grew up in Brooklyn collecting sneakers before I could afford rent. Now I help people express who they actually are — whether that's Supreme drops or bespoke tailoring. Style has no rules except authenticity.",
    rating: 4.91,
    reviews_count: 302,
    bookings: 3210,
    gradient: ["#FF6B35", "#C0392B"],
    services: [
      { name: "NYC Sneaker Run", desc: "Hit the spots — consignment, boutiques, deadstock.", duration: "4 hrs", price: 440, currency: "$", type: "in-store" },
      { name: "Drip Edit (Home)", desc: "I come to you, assess every piece, and build a new direction.", duration: "3 hrs", price: 330, currency: "$", type: "home" },
      { name: "Virtual Fit Check", desc: "Video session — you show me outfits, I tell you the truth.", duration: "1 hr", price: 110, currency: "$", type: "virtual" },
      { name: "Hype Calendar Consult", desc: "Monthly drop guide + what to cop for your wardrobe.", duration: "async", price: 75, currency: "$", type: "online" },
    ],
    reviews: [
      { author: "Jordan L.", flag: "🇺🇸", rating: 5, text: "Marcus helped me stop buying things because they were hyped and start buying things because they actually work together. My fits have never been cleaner.", date: "5 days ago", session: "Drip Edit (Home)" },
      { author: "Tom F.", flag: "🇬🇧", rating: 5, text: "I was in NYC for a week and Marcus took me places I'd never have found. Came back with the best pieces I own. Already booked him for my next trip.", date: "2 weeks ago", session: "NYC Sneaker Run" },
      { author: "Aisha P.", flag: "🇳🇬", rating: 5, text: "I wanted to dress more casually but still look put-together. Marcus nailed the brief. He understands that streetwear can be elevated.", date: "1 month ago", session: "Virtual Fit Check" },
    ],
    portfolio: [
      { label: "Brooklyn Energy", colors: ["#1A1A1A", "#FFFFFF", "#FF6B35", "#808080", "#C8B400"] },
      { label: "Monochrome Street", colors: ["#0D0D0D", "#333333", "#666666", "#999999", "#CCCCCC"] },
      { label: "Colour Pop", colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA500", "#1A1A1A"] },
    ],
    archetypes: ["Streetwear", "Edgy"],
    available_today: true,
    response_time: "< 30 min",
    languages: ["English"],
  },
  {
    id: "sofia-ricci",
    name: "Sofia Ricci",
    flag: "🇮🇹",
    city: "Milan",
    country: "Italy",
    specialty: ["Luxury", "Occasionwear", "Italian Tailoring"],
    tagline: "Dressed for the life you're building.",
    bio: "Former buying director at a Milanese luxury house, now I take everything I know about fabric, cut, and construction and put it to work for individuals. I believe every person deserves to be dressed the way fashion insiders are dressed.",
    rating: 4.99,
    reviews_count: 97,
    bookings: 843,
    gradient: ["#2C1A4A", "#6B3FA0"],
    services: [
      { name: "Luxury Shop Milan", desc: "Private appointments at Quadrilatero d'Oro boutiques.", duration: "6 hrs", price: 840, currency: "€", type: "in-store" },
      { name: "Wardrobe Architecture", desc: "Build a wardrobe that outperforms fashion cycles.", duration: "5 hrs", price: 700, currency: "€", type: "home" },
      { name: "Event Dressing", desc: "Wedding, gala, dinner — dressed to the exact moment.", duration: "3 hrs", price: 420, currency: "€", type: "home" },
      { name: "Personal Buying Report", desc: "Seasonal curated shortlist with exactly where to buy.", duration: "async", price: 280, currency: "€", type: "online" },
    ],
    reviews: [
      { author: "Emma R.", flag: "🇦🇺", rating: 5, text: "I flew to Milan specifically to work with Sofia. The six hours we spent on Via Montenapoleone changed how I think about getting dressed. Worth every cent and then some.", date: "3 weeks ago", session: "Luxury Shop Milan" },
      { author: "Pierre D.", flag: "🇫🇷", rating: 5, text: "Sofia's understanding of construction — why something hangs the way it does — is remarkable. I now buy half as much and feel twice as well dressed.", date: "2 months ago", session: "Wardrobe Architecture" },
      { author: "Christina W.", flag: "🇩🇪", rating: 5, text: "My wedding mother-of-bride outfit was perfect. Sofia understood exactly the energy I wanted and delivered beyond it.", date: "4 months ago", session: "Event Dressing" },
    ],
    portfolio: [
      { label: "Milano Nera", colors: ["#0A0A0A", "#1A1A1A", "#C0A060", "#F5F5F5", "#8B6914"] },
      { label: "La Dolce Vita", colors: ["#FFFAF0", "#D4A843", "#8B4513", "#2C6B3C", "#B5A642"] },
      { label: "Galleria Luxe", colors: ["#2C1A4A", "#C0A060", "#F0EBE3", "#8B0000", "#FFFFFF"] },
    ],
    archetypes: ["Classic", "Romantic"],
    available_today: false,
    response_time: "< 6 hours",
    languages: ["Italian", "English", "French"],
  },
  {
    id: "jin-park",
    name: "Jin Park",
    flag: "🇰🇷",
    city: "Seoul",
    country: "South Korea",
    specialty: ["K-Fashion", "Gender-Fluid", "Avant-Garde Street"],
    tagline: "Your next era starts here.",
    bio: "Seoul has the world's most exciting street style scene and I've been living in the middle of it for fifteen years. I specialise in helping people make bold moves — wardrobe transitions, style pivots, next-level looks.",
    rating: 4.96,
    reviews_count: 278,
    bookings: 2890,
    gradient: ["#0D1B2A", "#1E6B8A"],
    services: [
      { name: "Hongdae Style Run", desc: "Dongdaemun to Hongdae — the full Seoul experience.", duration: "5 hrs", price: 480000, currency: "₩", type: "in-store" },
      { name: "Era Transition Edit", desc: "You want to look different. Let's build that person.", duration: "3 hrs", price: 300000, currency: "₩", type: "home" },
      { name: "Virtual K-Look Session", desc: "Get the look from wherever you are.", duration: "1 hr", price: 80000, currency: "₩", type: "virtual" },
      { name: "Seoul Shopping Guide", desc: "Curated map + buying guide for your next Seoul trip.", duration: "async", price: 60000, currency: "₩", type: "online" },
    ],
    reviews: [
      { author: "Ava C.", flag: "🇺🇸", rating: 5, text: "I visited Seoul wanting to update my style and Jin completely delivered. The stores he knows are incredible — not tourist traps, real Seoul fashion.", date: "1 week ago", session: "Hongdae Style Run" },
      { author: "Haruto M.", flag: "🇯🇵", rating: 5, text: "The Era Transition session was exactly what I needed. Jin listened to who I wanted to become and built the wardrobe around that vision.", date: "3 weeks ago", session: "Era Transition Edit" },
      { author: "Clara B.", flag: "🇩🇪", rating: 5, text: "The shopping guide was so well researched I felt like I was already there. Bought 4 things online before even arriving.", date: "2 months ago", session: "Seoul Shopping Guide" },
    ],
    portfolio: [
      { label: "Han River Cool", colors: ["#1C2938", "#4A90D9", "#FFFFFF", "#C0C8D0", "#E8F0F8"] },
      { label: "Hongdae Heat", colors: ["#FF4B6B", "#1A1A1A", "#FFFFFF", "#FFD700", "#8B008B"] },
      { label: "Minimal Seoul", colors: ["#F5F5F5", "#2C2C2C", "#A0A0A0", "#FFFFFF", "#1A1A1A"] },
    ],
    archetypes: ["Streetwear", "Edgy", "Minimalist"],
    available_today: true,
    response_time: "< 2 hours",
    languages: ["Korean", "English", "Japanese"],
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    flag: "🇮🇳",
    city: "Mumbai",
    country: "India",
    specialty: ["Contemporary Indian", "East-West Fusion", "Colour Theory"],
    tagline: "Where tradition meets tomorrow.",
    bio: "I grew up between my mother's saree collection and my father's tailoring shop in Bandra. I now help clients navigate the beautiful complexity of dressing for a multicultural life — when to wear what, how to blend worlds, and how to own the room.",
    rating: 4.93,
    reviews_count: 341,
    bookings: 3655,
    gradient: ["#8B1A1A", "#E85D04"],
    services: [
      { name: "Mumbai Market Tour", desc: "Bandra to Colaba — best finds for every budget.", duration: "4 hrs", price: 8500, currency: "₹", type: "in-store" },
      { name: "Fusion Wardrobe Edit", desc: "Indian + Western pieces, made to work together.", duration: "3 hrs", price: 6000, currency: "₹", type: "home" },
      { name: "Colour Analysis Session", desc: "Discover your palette using Indian seasonal theory.", duration: "2 hrs", price: 3500, currency: "₹", type: "virtual" },
      { name: "Wedding Trousseau Plan", desc: "Every outfit for every wedding event, planned in advance.", duration: "3 hrs", price: 12000, currency: "₹", type: "home" },
    ],
    reviews: [
      { author: "Rina K.", flag: "🇬🇧", rating: 5, text: "Priya understood my South Asian wardrobe challenges in a way no one else has. She helped me build a wardrobe that works in London and when I visit family in Hyderabad.", date: "4 days ago", session: "Fusion Wardrobe Edit" },
      { author: "Vikram P.", flag: "🇺🇸", rating: 5, text: "The colour analysis blew my mind. I've been wearing the wrong colours my whole adult life. Priya's session was the most useful 90 minutes I've spent on my appearance.", date: "2 weeks ago", session: "Colour Analysis Session" },
      { author: "Zara A.", flag: "🇦🇪", rating: 5, text: "My wedding trousseau was chaotic until Priya got involved. She brought structure, creativity, and a calm I desperately needed.", date: "5 months ago", session: "Wedding Trousseau Plan" },
    ],
    portfolio: [
      { label: "Mumbai Modern", colors: ["#E85D04", "#FFFFFF", "#FFD700", "#1A1A1A", "#2C6B3C"] },
      { label: "Coastal Days", colors: ["#4ECDC4", "#FFFAF0", "#FFB347", "#87CEEB", "#F08080"] },
      { label: "Celebration", colors: ["#8B0000", "#FFD700", "#006400", "#FF69B4", "#1A1A1A"] },
    ],
    archetypes: ["Bohemian", "Classic", "Romantic"],
    available_today: true,
    response_time: "< 1 hour",
    languages: ["Hindi", "English", "Marathi"],
  },
  {
    id: "carlos-vega",
    name: "Carlos Vega",
    flag: "🇲🇽",
    city: "Mexico City",
    country: "Mexico",
    specialty: ["Eclectic", "Artisan", "Bold Colour"],
    tagline: "Colour is not a risk — hiding is.",
    bio: "CDMX born and raised, art school trained, wardrobe obsessed. I specialise in people who are tired of being invisible. If you want a wardrobe with personality — really, your personality — let's talk.",
    rating: 4.88,
    reviews_count: 156,
    bookings: 1203,
    gradient: ["#2C6B3C", "#4ECDC4"],
    services: [
      { name: "Roma-Condesa Shop", desc: "The best artisan and independent stores in CDMX.", duration: "4 hrs", price: 2800, currency: "$MX", type: "in-store" },
      { name: "Colour Intervention", desc: "We identify why your wardrobe is boring and fix it.", duration: "2.5 hrs", price: 1800, currency: "$MX", type: "home" },
      { name: "Virtual Colour Consult", desc: "I look at your wardrobe on video and tell you what's missing.", duration: "1 hr", price: 750, currency: "$MX", type: "virtual" },
    ],
    reviews: [
      { author: "Isabella R.", flag: "🇮🇹", rating: 5, text: "Carlos got me to wear orange. I never wore orange. I now own three orange things and feel better in all of them than in anything black I own.", date: "1 week ago", session: "Colour Intervention" },
      { author: "Alex M.", flag: "🇺🇸", rating: 4, text: "Fun, energetic, knows every shop in CDMX. The artisan market he took me to was unbelievable — handwoven everything.", date: "1 month ago", session: "Roma-Condesa Shop" },
    ],
    portfolio: [
      { label: "Mercado Colours", colors: ["#E85D04", "#FFD700", "#2C6B3C", "#FF69B4", "#8B1A1A"] },
      { label: "Artisan Mix", colors: ["#D4A843", "#2C4A1E", "#C0391B", "#F5F0E8", "#1A3A1A"] },
      { label: "CDMX Nights", colors: ["#1A1A1A", "#FF1493", "#00CED1", "#FFFFFF", "#FFD700"] },
    ],
    archetypes: ["Bohemian", "Edgy"],
    available_today: false,
    response_time: "< 4 hours",
    languages: ["Spanish", "English"],
  },
  {
    id: "emma-walsh",
    name: "Emma Walsh",
    flag: "🇦🇺",
    city: "Sydney",
    country: "Australia",
    specialty: ["Casual Luxe", "Coastal Living", "Sustainable Fashion"],
    tagline: "Effortless is earned.",
    bio: "Sydney gave me an eye for casual dressing that still looks expensive. Twelve years of personal styling — from Bondi beach bungalows to Darlinghurst dinner parties — taught me that the goal is to look good without appearing to try.",
    rating: 4.92,
    reviews_count: 198,
    bookings: 2240,
    gradient: ["#1E6B8A", "#4ECDC4"],
    services: [
      { name: "Bondi Boutique Run", desc: "The best of Sydney's independent fashion scene.", duration: "4 hrs", price: 480, currency: "A$", type: "in-store" },
      { name: "Wardrobe Reset", desc: "The Australian approach: relaxed, easy, elevated.", duration: "3 hrs", price: 360, currency: "A$", type: "home" },
      { name: "Sustainable Swap Session", desc: "Replace fast fashion with pieces that last decades.", duration: "2 hrs", price: 240, currency: "A$", type: "virtual" },
      { name: "Travel Capsule", desc: "Pack light, look great — a curated 10-piece travel wardrobe.", duration: "async", price: 180, currency: "A$", type: "online" },
    ],
    reviews: [
      { author: "Mia C.", flag: "🇳🇿", rating: 5, text: "I moved to Sydney from Auckland and had no idea how to dress for the climate and culture. Emma solved that in one afternoon.", date: "2 weeks ago", session: "Wardrobe Reset" },
      { author: "David T.", flag: "🇬🇧", rating: 5, text: "Emma's sustainable focus is not preachy — it's just smart. She showed me that buying less and better is actually cheaper over time.", date: "3 months ago", session: "Sustainable Swap Session" },
    ],
    portfolio: [
      { label: "Bondi Summer", colors: ["#87CEEB", "#FFFFF0", "#DEB887", "#4ECDC4", "#F5DEB3"] },
      { label: "Sydney Casual Luxe", colors: ["#F5F5F0", "#D2B48C", "#8FBC8F", "#A0A0A0", "#1A1A1A"] },
      { label: "Sundowner", colors: ["#FF8C69", "#FFD700", "#FFFAF0", "#CD853F", "#8B4513"] },
    ],
    archetypes: ["Minimalist", "Bohemian"],
    available_today: true,
    response_time: "< 2 hours",
    languages: ["English"],
  },
  {
    id: "zara-ahmed",
    name: "Zara Ahmed",
    flag: "🇦🇪",
    city: "Dubai",
    country: "UAE",
    specialty: ["Modest Fashion", "Luxury Abaya", "Contemporary Hijab Styling"],
    tagline: "Modesty is never a compromise.",
    bio: "I've spent a decade proving that modest dressing is among the most sophisticated and versatile approaches to fashion. From Dubai Malls to Paris ateliers, I have built wardrobes for clients who want to be both covered and completely unforgettable.",
    rating: 4.98,
    reviews_count: 161,
    bookings: 1450,
    gradient: ["#C4923A", "#8B6914"],
    services: [
      { name: "Dubai Mall Luxury Shop", desc: "Navigating luxury modestly — from the inside.", duration: "5 hrs", price: 1750, currency: "AED", type: "in-store" },
      { name: "Abaya Architecture", desc: "Build a collection of abayas for every occasion.", duration: "3 hrs", price: 1050, currency: "AED", type: "home" },
      { name: "Global Modest Wardrobe", desc: "Dressing modestly in Western cities — a practical guide.", duration: "1 hr", price: 350, currency: "AED", type: "virtual" },
      { name: "Occasion Styling", desc: "Wedding, Eid, gala — fully covered and stunning.", duration: "2 hrs", price: 700, currency: "AED", type: "home" },
    ],
    reviews: [
      { author: "Fatima H.", flag: "🇸🇦", rating: 5, text: "Zara understands modest fashion at a level that most stylists don't even know exists. She helped me dress for my corporate role in a way I'm proud of.", date: "1 week ago", session: "Abaya Architecture" },
      { author: "Nadia M.", flag: "🇲🇾", rating: 5, text: "I'm based in KL and did the virtual session. Incredibly practical advice for dressing modestly in Southeast Asia. Exactly what I needed.", date: "4 weeks ago", session: "Global Modest Wardrobe" },
    ],
    portfolio: [
      { label: "Desert Gold", colors: ["#C4923A", "#F5ECD7", "#1A1612", "#D4A843", "#8B6914"] },
      { label: "Eid Elegance", colors: ["#2C6B3C", "#FFD700", "#FFFFFF", "#8B0000", "#F5F5DC"] },
      { label: "Modern Abaya", colors: ["#1A1A1A", "#2C2C2C", "#C0A060", "#F5F5F5", "#808080"] },
    ],
    archetypes: ["Classic", "Romantic"],
    available_today: false,
    response_time: "< 3 hours",
    languages: ["Arabic", "English", "French"],
  },
  {
    id: "lucas-silva",
    name: "Lucas Silva",
    flag: "🇧🇷",
    city: "São Paulo",
    country: "Brazil",
    specialty: ["Tropical Colour", "Urban Brazilian", "Vibrant Maximalism"],
    tagline: "You were born for colour.",
    bio: "SP taught me that life is too short for grey. I help people from muted, colour-avoidant wardrobes discover what Brazilian confidence in dressing actually looks like — and it works everywhere in the world, not just in São Paulo.",
    rating: 4.86,
    reviews_count: 127,
    bookings: 987,
    gradient: ["#006400", "#FFD700"],
    services: [
      { name: "Oscar Freire Shop", desc: "SP's best fashion street — guided and curated.", duration: "4 hrs", price: 1200, currency: "R$", type: "in-store" },
      { name: "Cor & Estilo Edit", desc: "Find your personal colour palette and rebuild around it.", duration: "3 hrs", price: 900, currency: "R$", type: "home" },
      { name: "Virtual Paleta", desc: "Online colour analysis using Brazilian seasonal theory.", duration: "1 hr", price: 300, currency: "R$", type: "virtual" },
    ],
    reviews: [
      { author: "Jennifer A.", flag: "🇺🇸", rating: 5, text: "I told Lucas I only wear black and navy. Two hours later my wardrobe cart had colours I'd never considered. I'm wearing cobalt blue today and people keep telling me I look incredible.", date: "2 weeks ago", session: "Virtual Paleta" },
      { author: "Fernanda C.", flag: "🇧🇷", rating: 5, text: "Oscar Freire with Lucas is the best shopping experience in SP. He knows every floor of every store and exactly what's worth your money.", date: "1 month ago", session: "Oscar Freire Shop" },
    ],
    portfolio: [
      { label: "SP Energy", colors: ["#FF4500", "#FFD700", "#006400", "#1A1A1A", "#FFFFFF"] },
      { label: "Ipanema Beach", colors: ["#00CED1", "#FF6347", "#FFD700", "#FFFAF0", "#40E0D0"] },
      { label: "Tropicália", colors: ["#FF1493", "#00FF7F", "#FF8C00", "#9400D3", "#FFFFFF"] },
    ],
    archetypes: ["Bohemian", "Edgy"],
    available_today: true,
    response_time: "< 2 hours",
    languages: ["Portuguese", "English", "Spanish"],
  },
];

export function getStylist(id: string): Stylist | undefined {
  return STYLISTS.find((s) => s.id === id);
}

export const SPECIALTIES = [
  "All", "Minimalist", "Classic", "Streetwear", "Luxury", "Bohemian",
  "Edgy", "Sustainable", "Modest Fashion", "Bold Colour", "K-Fashion",
];

export const SESSION_TYPES: { value: SessionType | "all"; label: string; icon: string; desc: string }[] = [
  { value: "all",      label: "Any session",       icon: "✦",  desc: "" },
  { value: "in-store", label: "Shop Together",      icon: "🛍",  desc: "Your stylist comes with you to shops" },
  { value: "home",     label: "Home Visit",         icon: "🏡",  desc: "Stylist comes to your wardrobe" },
  { value: "virtual",  label: "Virtual Session",    icon: "📱",  desc: "Live video consultation" },
  { value: "online",   label: "Online Styling",     icon: "✉️",   desc: "Async mood board + recommendations" },
];

export const ARCHETYPES = [
  {
    id: "classic",
    name: "Classic",
    desc: "Timeless pieces, quality fabrics, structured silhouettes. You invest in things that outlast trends.",
    palette: ["#2C2C2C", "#FFFFFF", "#C4923A", "#1A3A6B", "#F5F5F0"],
    icon: "◈",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    desc: "Less noise, more impact. A neutral palette, clean lines, and every piece earns its place.",
    palette: ["#F5F5F5", "#1A1A1A", "#A0A0A0", "#FFFFFF", "#2C2C2C"],
    icon: "○",
  },
  {
    id: "streetwear",
    name: "Streetwear",
    desc: "Urban, comfortable, expressive. You dress from culture, not trend reports.",
    palette: ["#1A1A1A", "#FFFFFF", "#FF6B35", "#808080", "#C8B400"],
    icon: "◆",
  },
  {
    id: "romantic",
    name: "Romantic",
    desc: "Soft, feminine, layered. You believe getting dressed should feel like something.",
    palette: ["#FFB6C1", "#FFF0F5", "#DDA0DD", "#F08080", "#E6B8A2"],
    icon: "❧",
  },
  {
    id: "bohemian",
    name: "Bohemian",
    desc: "Free-spirited, earthy, and richly textured. Rules are suggestions. Layering is a language.",
    palette: ["#D4A843", "#8B4513", "#2C6B3C", "#C19A6B", "#8B1A1A"],
    icon: "✿",
  },
  {
    id: "edgy",
    name: "Edgy",
    desc: "Bold, asymmetric, unexpected. You use clothes as a statement, not a shield.",
    palette: ["#1A1A1A", "#C0392B", "#4B0082", "#2C2C2C", "#FF4500"],
    icon: "◬",
  },
];
