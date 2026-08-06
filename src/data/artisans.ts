export type ArtisanProfile = {
  id: number;
  name: string;
  city: string;
  category: string;
  rating: number;
  description: string;
  about: string;
  image?: string;
};

export type ProductItem = {
  id: number;
  artisanId: number;
  name: string;
  price: number;
  category: string;
};

export const artisanProfiles: ArtisanProfile[] = [
  {
    id: 1,
    name: "Ayesha Tailor",
    city: "Rawalpindi",
    category: "Tailoring",
    rating: 5,
    description: "Custom garments and elegant stitch work for every occasion.",
    about: "Ayesha creates elegant custom garments with precision tailoring and a strong focus on customer comfort and fitting.",
    image: "/images/ayesha tailor .png.png",
  },
  {
    id: 2,
    name: "Sana Crochet",
    city: "Lahore",
    category: "Crochet",
    rating: 5,
    description: "Handmade crochet accessories and heirloom-quality pieces.",
    about: "Sana specializes in crochet pieces that blend traditional charm with modern style for everyday wear and décor.",
    image: "/images/sana crochet.png",
  },
  {
    id: 3,
    name: "Nida Candles",
    city: "Islamabad",
    category: "Candles",
    rating: 5,
    description: "Artisan soy candles crafted with soothing natural aromas.",
    about: "Nida makes handcrafted candles with calming scents and artistic presentation for home and gifting.",
    image: "/images/nida candles.png",
  },
  {
    id: 4,
    name: "Mira Jewelry",
    city: "Karachi",
    category: "Jewelry",
    rating: 5,
    description: "Fine handcrafted jewelry designed with cultural detail.",
    about: "Mira designs handcrafted jewelry with bold cultural motifs and a refined finish for special occasions.",
    image: "/images/nida jewlers .png",
  },
  {
    id: 5,
    name: "Zahra Embroidery",
    city: "Faisalabad",
    category: "Embroidery",
    rating: 4,
    description: "Traditional embroidery with bright threads and delicate patterns.",
    about: "Zahra creates vibrant embroidery designs that celebrate heritage and craftsmanship with every stitch.",
    image: "/images/categories/embroidery.jpg",
  },
  {
    id: 6,
    name: "Hina Zardozi",
    city: "Multan",
    category: "Zardozi",
    rating: 5,
    description: "Rich zardozi work inspired by timeless Pakistani craftsmanship.",
    about: "Hina brings timeless zardozi work to life with detailed embellishment and luxury-inspired finish.",
    image: "/images/categories/zardozi.jpg",
  },
  {
    id: 7,
    name: "Rimsha Applique",
    city: "Peshawar",
    category: "Applique",
    rating: 4,
    description: "Creative fabric patches and custom applique art for fashion.",
    about: "Rimsha creates bold applique and patchwork art that transforms everyday fabric into statement pieces.",
    image: "/images/aplique.jpg",
  },
  {
    id: 8,
    name: "Farah Fabric",
    city: "Quetta",
    category: "Fabric Painting",
    rating: 5,
    description: "Colorful fabric painting that turns textiles into art.",
    about: "Farah paints vibrant textile art pieces that bring color and personality to custom fabric work.",
    image: "/images/categories/fabric-painting.jpg",
  },
];

export const products: ProductItem[] = [
  { id: 101, artisanId: 1, name: "Custom Kurti", price: 1800, category: "Tailoring" },
  { id: 102, artisanId: 1, name: "Bridal Dupatta", price: 2400, category: "Tailoring" },
  { id: 103, artisanId: 2, name: "Crochet Tote Bag", price: 1500, category: "Crochet" },
  { id: 104, artisanId: 2, name: "Baby Blanket", price: 2200, category: "Crochet" },
  { id: 105, artisanId: 3, name: "Lavender Candle", price: 900, category: "Candles" },
  { id: 106, artisanId: 3, name: "Sandalwood Set", price: 1400, category: "Candles" },
  { id: 107, artisanId: 4, name: "Statement Earrings", price: 1700, category: "Jewelry" },
  { id: 108, artisanId: 4, name: "Silver Ring", price: 2100, category: "Jewelry" },
  { id: 109, artisanId: 5, name: "Floral Embroidery", price: 1600, category: "Embroidery" },
  { id: 110, artisanId: 6, name: "Zardozi Cushion", price: 1900, category: "Zardozi" },
  { id: 111, artisanId: 7, name: "Patchwork Scarf", price: 1300, category: "Applique" },
  { id: 112, artisanId: 8, name: "Painted Dupatta", price: 2000, category: "Fabric Painting" },
];

export const artisanCategories = [
  "All",
  "Tailoring",
  "Crochet",
  "Embroidery",
  "Jewelry",
  "Candles",
  "Zardozi",
  "Applique",
  "Fabric Painting",
];
