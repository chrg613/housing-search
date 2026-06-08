export interface LocalityDetails {
  schools: string[];
  hospitals: string[];
  metro: string[];
  parks: string[];
}

export interface Property {
  id: string;
  type: "rent" | "sale";
  bhk: number;
  sqft: number;
  sector: string;
  projectName: string;
  priceLakhs: number; // For Rent, this represents thousands/month (e.g., 45 = ₹45k/mo)
  priceDisplay: string;
  thumbnail: string;
  facing: string;
  amenities: string[];
  features: string[]; // Token hooks for your compiler ranker matching
  mapQuery: string; // Outbound Google Maps deep-link string
  localityDetails: LocalityDetails;
}

export const gurgaonProperties: Property[] = [
  // --- SECTOR 50 & 43 (Ultra-Premium Core - Sale) ---
  {
    id: "prop-1",
    type: "sale",
    bhk: 3,
    sqft: 2200,
    sector: "Sector 50",
    projectName: "Unitech Nirvana Country",
    priceLakhs: 240,
    priceDisplay: "₹2.40 Cr",
    thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600&auto=format&fit=crop",
    facing: "East",
    amenities: ["Gated Security", "Power Backup", "Clubhouse", "Swimming Pool"],
    features: ["sunlight", "schools", "pool", "luxury", "family"],
    mapQuery: "Nirvana+Country+Sector+50+Gurugram",
    localityDetails: {
      schools: ["Delhi Public School (400m)", "St. Xavier's High School (1.1km)"],
      hospitals: ["Artemis Hospital (2.3km)", "Park Hospital (1.5km)"],
      metro: ["Sector 54 Rapid Metro (3.8km)"],
      parks: ["Nirvana Central Park (200m)"]
    }
  },
  {
    id: "prop-2",
    type: "sale",
    bhk: 2,
    sqft: 1350,
    sector: "Sector 50",
    projectName: "Emaar Marbella Villas Complex",
    priceLakhs: 85,
    priceDisplay: "₹85 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    facing: "North-East",
    amenities: ["Modular Kitchen", "Gym", "Reserved Parking"],
    features: ["sunlight", "budget", "market"],
    mapQuery: "Emaar+Marbella+Sector+50+Gurugram",
    localityDetails: {
      schools: ["Amity International School (1.2km)"],
      hospitals: ["Artemis Hospital (2.5km)"],
      metro: ["Sector 53-54 Metro Station (4.0km)"],
      parks: ["Emaar Community Green Space (150m)"]
    }
  },
  {
    id: "prop-3",
    type: "sale",
    bhk: 4,
    sqft: 3600,
    sector: "Sector 43",
    projectName: "DLF The Gallops",
    priceLakhs: 480,
    priceDisplay: "₹4.80 Cr",
    thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
    facing: "South-East",
    amenities: ["VRV Air Conditioning", "Private Lift", "Infinity Pool", "Concierge"],
    features: ["luxury", "metro", "pool", "sunlight", "high-rise"],
    mapQuery: "DLF+Phase+4+Sector+43+Gurugram",
    localityDetails: {
      schools: ["The Shri Ram School (1.5km)", "Chiranjiv Bharati School (700m)"],
      hospitals: ["Max Super Speciality Hospital (800m)", "Fortis Memorial Research Institute (1.2km)"],
      metro: ["Sector 42-43 Metro Station (300m)", "HUDA City Centre (1.1km)"],
      parks: ["DLF Golf and Country Club (1.8km)", "Gallops Resident Park (100m)"]
    }
  },

  // --- SECTOR 54 (Golf Course Road Hub - Rent & Sale) ---
  {
    id: "prop-4",
    type: "rent",
    bhk: 3,
    sqft: 2000,
    sector: "Sector 54",
    projectName: "Suncity Heights",
    priceLakhs: 65, // ₹65k/month
    priceDisplay: "₹65,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600&auto=format&fit=crop",
    facing: "West",
    amenities: ["Gas Pipeline", "Power Backup", "Tennis Court"],
    features: ["rent", "metro", "schools", "market"],
    mapQuery: "Suncity+Heights+Sector+54+Gurugram",
    localityDetails: {
      schools: ["Suncity School (200m)", "Presidium School (1.4km)"],
      hospitals: ["Paras Hospital (2.0km)", "W Pratiksha Hospital (2.5km)"],
      metro: ["Sector 54 Chowk Rapid Metro (400m)"],
      parks: ["Suncity Central Park (300m)"]
    }
  },
  {
    id: "prop-5",
    type: "sale",
    bhk: 3,
    sqft: 1950,
    sector: "Sector 54",
    projectName: "DLF Park Place",
    priceLakhs: 310,
    priceDisplay: "₹3.10 Cr",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&auto=format&fit=crop",
    facing: "North",
    amenities: ["Spas", "Multi-tier Security", "Gymnasium", "Pet Park"],
    features: ["luxury", "metro", "pool", "family"],
    mapQuery: "DLF+Park+Place+Sector+54+Gurugram",
    localityDetails: {
      schools: ["Shiv Nadar School (2.8km)", "Suncity School (900m)"],
      hospitals: ["Fortis Hospital (3.5km)", "Paras Hospital (1.5km)"],
      metro: ["Sector 54 Chowk Metro Station (600m)"],
      parks: ["Aravalli Biodiversity Park (3.5km)", "DLF Horizon Linear Park (1.2km)"]
    }
  },

  // --- SECTOR 57 & 67 (Mid-Range & Family Commuters - Rent & Sale) ---
  {
    id: "prop-6",
    type: "sale",
    bhk: 2,
    sqft: 1150,
    sector: "Sector 57",
    projectName: "Ansal Florence Greens",
    priceLakhs: 72,
    priceDisplay: "₹72 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&auto=format&fit=crop",
    facing: "East",
    amenities: ["Independent Floor Layout", "Reserved Parking", "Water Storage"],
    features: ["budget", "sunlight", "schools", "low-rise"],
    mapQuery: "Hong+Kong+Bazaar+Sector+57+Gurugram",
    localityDetails: {
      schools: ["Scottish High International School (1.0km)", "Boomerang Pre-School (300m)"],
      hospitals: ["W Pratiksha Hospital (900m)"],
      metro: ["Sector 56 Metro Station (2.1km)"],
      parks: ["Sector 57 HUDA Block Park (150m)"]
    }
  },
  {
    id: "prop-7",
    type: "rent",
    bhk: 2,
    sqft: 1250,
    sector: "Sector 57",
    projectName: "Sushant Lok 3 Builder Floors",
    priceLakhs: 32, // ₹32k/month
    priceDisplay: "₹32,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600&auto=format&fit=crop",
    facing: "South",
    amenities: ["Balcony", "Modular Kitchen", "CCTV Monitoring"],
    features: ["rent", "budget", "market", "sunlight"],
    mapQuery: "Sushant+Lok+3+Sector+57+Gurugram",
    localityDetails: {
      schools: ["Presidium School Sector 57 (500m)"],
      hospitals: ["W Pratiksha Hospital (1.4km)", "Cloudnine Hospital (2.0km)"],
      metro: ["Sector 55-56 Rapid Metro (2.5km)"],
      parks: ["Tau Devi Lal Botanical Park (3.0km)"]
    }
  },
  {
    id: "prop-8",
    type: "sale",
    bhk: 3,
    sqft: 1800,
    sector: "Sector 67",
    projectName: "Ireo Victory Valley",
    priceLakhs: 145,
    priceDisplay: "₹1.45 Cr",
    thumbnail: "https://images.unsplash.com/photo-1549517045-bc93de075e53?q=80&w=600&auto=format&fit=crop",
    facing: "East",
    amenities: ["Theme Valley Gardens", "High Speed Lifts", "Cricket Net", "Gym"],
    features: ["sunlight", "luxury", "pool", "family", "high-rise"],
    mapQuery: "Ireo+Victory+Valley+Sector+67+Gurugram",
    localityDetails: {
      schools: ["VIBGYOR High School (600m)", "Alpine Convent School (1.3km)"],
      hospitals: ["Medinge Healthcare (1.8km)", "Artemis Hospital (4.5km)"],
      metro: ["Sector 55-56 Metro Station (4.8km)"],
      parks: ["Victory Valley Central Lawn (50m)"]
    }
  },

  // --- SECTOR 82 & 102 (Upcoming Suburban Value - Sale & Rent) ---
  {
    id: "prop-9",
    type: "sale",
    bhk: 3,
    sqft: 1750,
    sector: "Sector 82",
    projectName: "Vatika INXT Floors",
    priceLakhs: 98,
    priceDisplay: "₹98 Lakhs",
    thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=600&auto=format&fit=crop",
    facing: "North-West",
    amenities: ["Gated Township", "Power Backup", "Retail Market Connectivity"],
    features: ["budget", "family", "low-rise", "market"],
    mapQuery: "Vatika+India+Next+Sector+82+Gurugram",
    localityDetails: {
      schools: ["MatriKiran High School (800m)", "EuroInternational School (1.9km)"],
      hospitals: ["Miracles Apollo Cradle Hospital (3.2km)"],
      metro: ["HUDA City Centre Metro (14km - Commute Linked)"],
      parks: ["Vatika INXT Town Park (400m)"]
    }
  },
  {
    id: "prop-10",
    type: "rent",
    bhk: 3,
    sqft: 1650,
    sector: "Sector 82",
    projectName: "Mapsko Casabella",
    priceLakhs: 26, // ₹26k/month
    priceDisplay: "₹26,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?q=80&w=600&auto=format&fit=crop",
    facing: "East",
    amenities: ["Clubhouse", "Intercom Facility", "Jogging Track"],
    features: ["rent", "budget", "sunlight", "gym"],
    mapQuery: "Mapsko+Casabella+Sector+82+Gurugram",
    localityDetails: {
      schools: ["St. Xavier's High School Sector 81 (1.2km)"],
      hospitals: ["Genesis Hospital (4.0km)"],
      metro: ["Garhi Harsaru Junction (5km)"],
      parks: ["Casabella Resident Green Park (100m)"]
    }
  },
  {
    id: "prop-11",
    type: "sale",
    bhk: 2,
    sqft: 1300,
    sector: "Sector 102",
    projectName: "Shapoorji Pallonji Joyville",
    priceLakhs: 115,
    priceDisplay: "₹1.15 Cr",
    thumbnail: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=600&auto=format&fit=crop",
    facing: "South-East",
    amenities: ["Air Purifiers Installed", "Gym", "Aravalli Facing Deck", "AC Lounge"],
    features: ["sunlight", "gym", "family", "luxury"],
    mapQuery: "Joyville+Shapoorji+Sector+102+Gurugram",
    localityDetails: {
      schools: ["Doon Public School (1.1km)", "Imperial Heritage School (2.0km)"],
      hospitals: ["Signature Advanced Super Speciality Hospital (2.5km)"],
      metro: ["Dwarka Expressway Transit Hub (1.5km)"],
      parks: ["Joyville Central Pocket Park (200m)"]
    }
  },
  {
    id: "prop-12",
    type: "rent",
    bhk: 1,
    sqft: 650,
    sector: "Sector 43",
    projectName: "Sushant Lok 1 Studio Pods",
    priceLakhs: 22, // ₹22k/month
    priceDisplay: "₹22,000 / mo",
    thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600&auto=format&fit=crop",
    facing: "West",
    amenities: ["Fully Furnished", "High Speed Wi-Fi Inclusion", "Lift"],
    features: ["rent", "metro", "bachelor", "budget"],
    mapQuery: "Sushant+Lok+Phase+1+Sector+43+Gurugram",
    localityDetails: {
      schools: ["The HDFC School (1.4km)"],
      hospitals: ["Max Hospital Gurgaon (900m)"],
      metro: ["HUDA City Centre Metro Station (700m)"],
      parks: ["Sushant Lok Block A Park (150m)"]
    }
  }
];