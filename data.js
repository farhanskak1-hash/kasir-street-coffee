// Data Menu Awal untuk BLS Street Coffee (Outlet Tepi Jalan)
const INITIAL_MENU = [
  // Kategori: Kopi Susu
  {
    id: "ks-01",
    name: "Kopi Susu Gula Aren",
    category: "kopi-susu",
    price: 10000,
    badge: "Best Seller",
    desc: "Espresso robusta, susu segar, dan gula aren asli khas street coffee",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar", "No Sugar"]
    }
  },
  {
    id: "ks-02",
    name: "Kopi Susu Creamy",
    category: "kopi-susu",
    price: 12000,
    badge: "Favorit",
    desc: "Perpaduan kopi mantap dengan double cream lembut dan manis pas",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar", "No Sugar"]
    }
  },
  {
    id: "ks-03",
    name: "Kopi Susu Caramel",
    category: "kopi-susu",
    price: 13000,
    desc: "Kopi susu dengan sirup karamel gurih manis beraroma wangi",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar", "No Sugar"]
    }
  },
  {
    id: "ks-04",
    name: "Kopi Susu Hazelnut",
    category: "kopi-susu",
    price: 13000,
    desc: "Kopi susu berpadu aroma kacang hazelnut panggang",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar", "No Sugar"]
    }
  },

  // Kategori: Kopi Hitam
  {
    id: "kh-01",
    name: "Americano Classic",
    category: "kopi-hitam",
    price: 8000,
    badge: "Segar",
    desc: "Double espresso hitam segar, cocok untuk boost energi harian",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["No Sugar", "Less Sugar", "Normal"]
    }
  },
  {
    id: "kh-02",
    name: "Kopi Tubruk Robusta",
    category: "kopi-hitam",
    price: 6000,
    desc: "Kopi tubruk murni khas warung kopi nusantara kental dan harum",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Hot"],
      sugar: ["Normal", "Sedang", "Manis", "Tanpa Gula"]
    }
  },
  {
    id: "kh-03",
    name: "Long Black Lemon",
    category: "kopi-hitam",
    price: 10000,
    badge: "Trend",
    desc: "Sensasi espresso pekat dengan kesegaran sari lemon peras",
    image: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice"],
      sugar: ["Normal", "Less Sugar"]
    }
  },

  // Kategori: Non-Coffee
  {
    id: "nc-01",
    name: "Cokelat Street Signature",
    category: "non-coffee",
    price: 10000,
    badge: "Anak Muda",
    desc: "Cokelat pekat dark chocolate creamy dan manis pas",
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar"]
    }
  },
  {
    id: "nc-02",
    name: "Matcha Latte Creamy",
    category: "non-coffee",
    price: 12000,
    desc: "Bubuk matcha jepang pilihan dengan susu segar dingin",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar"]
    }
  },
  {
    id: "nc-03",
    name: "Red Velvet Velvet",
    category: "non-coffee",
    price: 12000,
    desc: "Minuman red velvet manis lembut aroma vanilla pastry",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar"]
    }
  },

  // Kategori: Tea & Refreshment
  {
    id: "tr-01",
    name: "Es Teh Manis Jumbo",
    category: "tea-refreshment",
    price: 5000,
    badge: "Paling Laris",
    desc: "Teh melati wangi racikan khas, cup jumbo 22oz segar pelepas dahaga",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice"],
      sugar: ["Normal", "Less Sugar", "Tawar"]
    }
  },
  {
    id: "tr-02",
    name: "Lemon Tea Segar",
    category: "tea-refreshment",
    price: 8000,
    desc: "Seduhan teh berpadu asam segar buah lemon asli",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice", "Hot"],
      sugar: ["Normal", "Less Sugar"]
    }
  },
  {
    id: "tr-03",
    name: "Lychee Tea Boba",
    category: "tea-refreshment",
    price: 10000,
    desc: "Teh rasa leci harum manis dengan topping popping boba",
    image: "https://images.unsplash.com/photo-1558857563-b37cf5a454d4?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Ice"],
      sugar: ["Normal", "Less Sugar"]
    }
  },

  // Kategori: Cemilan & Pastry
  {
    id: "sn-01",
    name: "Roti Toast Cokelat Keju",
    category: "cemilan",
    price: 10000,
    badge: "Hangat",
    desc: "Roti bakar tebal renyah isi lumeran cokelat dan taburan keju",
    image: "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Hangat"],
      sugar: ["Standard"]
    }
  },
  {
    id: "sn-02",
    name: "Croissant Mini (2 pcs)",
    category: "cemilan",
    price: 12000,
    desc: "Pastry mini renyah berlapis mentega gurih pendamping kopi",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Hangat"],
      sugar: ["Standard"]
    }
  },
  {
    id: "sn-03",
    name: "Donat Gula Klasik",
    category: "cemilan",
    price: 5000,
    desc: "Donat kentang empuk dengan taburan gula halus salju",
    image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400&auto=format&fit=crop&q=60",
    isAvailable: true,
    options: {
      temperature: ["Suhu Ruang"],
      sugar: ["Standard"]
    }
  }
];

// Opsi Tambahan / Extra Topping
const EXTRA_TOPPINGS = [
  { id: "extra-shot", name: "Extra Espresso Shot", price: 3000 },
  { id: "grass-jelly", name: "Cincau / Grass Jelly", price: 2000 },
  { id: "boba", name: "Boba Brown Sugar", price: 3000 },
  { id: "cream-cheese", name: "Cream Cheese Foam", price: 4000 }
];

// Kategori Menu
const CATEGORIES = [
  { id: "all", name: "Semua Menu", icon: "coffee-cup" },
  { id: "kopi-susu", name: "Kopi Susu", icon: "milk" },
  { id: "kopi-hitam", name: "Kopi Hitam", icon: "flame" },
  { id: "non-coffee", name: "Non-Coffee", icon: "sparkles" },
  { id: "tea-refreshment", name: "Tea & Segar", icon: "leaf" },
  { id: "cemilan", name: "Cemilan", icon: "cookie" }
];
