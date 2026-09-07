export const categories = {
  Caps: ["Winter Caps", "Summer Caps", "Anniversary Caps"],

  Perfumes: [
    "Occasion Perfume",
    "Outing Perfume",
    "Soft Perfume",
    "Hard Scent Perfume",
  ],

  Jallabiya: [
    "Everyday Wear",
    "Luxury/Occasion",
    "Summer Light",
    "Embroidered",
  ],

  Wristwatches: ["Formal/Dress", "Casual", "Leather Strap", "Stainless Steel"],
};

const initialProducts = [
  {
    id: 1,
    name: "Classic Winter Cap",
    category: "Caps",
    subCategory: "Winter Caps",
    price: 8500,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee",
    description: "A stylish and comfortable cap suitable for cold weather.",
    featured: true,
  },

  {
    id: 2,
    name: "Premium Summer Cap",
    category: "Caps",
    subCategory: "Summer Caps",
    price: 7000,
    image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc",
    description: "Lightweight and breathable cap for everyday use.",
    featured: true,
  },

  {
    id: 3,
    name: "Luxury Oud Perfume",
    category: "Perfumes",
    subCategory: "Occasion Perfume",
    price: 25000,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601",
    description: "Premium fragrance designed for special occasions.",
    featured: true,
  },

  {
    id: 4,
    name: "Soft Daily Perfume",
    category: "Perfumes",
    subCategory: "Soft Perfume",
    price: 15000,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    description: "A soft and refreshing fragrance for everyday use.",
    featured: false,
  },

  {
    id: 5,
    name: "Luxury Embroidered Jallabiya",
    category: "Jallabiya",
    subCategory: "Embroidered",
    price: 45000,
    image: "https://images.unsplash.com/photo-1598032895397-b9472444bf93",
    description: "Premium embroidered Jallabiya for special occasions.",
    featured: true,
  },

  {
    id: 6,
    name: "Summer Light Jallabiya",
    category: "Jallabiya",
    subCategory: "Summer Light",
    price: 30000,
    image: "https://images.unsplash.com/photo-1506629905607-d4052afc1b0e",
    description: "Lightweight and comfortable Jallabiya for warm weather.",
    featured: false,
  },

  {
    id: 7,
    name: "Classic Leather Watch",
    category: "Wristwatches",
    subCategory: "Leather Strap",
    price: 35000,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
    description: "Elegant wristwatch with a premium leather strap.",
    featured: true,
  },

  {
    id: 8,
    name: "Stainless Steel Watch",
    category: "Wristwatches",
    subCategory: "Stainless Steel",
    price: 40000,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
    description: "Premium stainless steel wristwatch for everyday style.",
    featured: false,
  },
];

export default initialProducts;
