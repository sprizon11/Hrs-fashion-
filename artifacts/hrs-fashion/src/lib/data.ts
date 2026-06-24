export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "Evening" | "Casual" | "Formal" | "Summer" | "Bridal" | "Bags" | "Accessories";
  image: string;
  images?: string[];
  isNew?: boolean;
  description: string;
  details: string[];
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Aura Silk Slip Dress",
    price: 350,
    originalPrice: 450,
    category: "Evening",
    image: "/images/dress1.png",
    images: ["/images/dress1.png", "/images/dress6.png"],
    isNew: true,
    description:
      "A whisper of silk that moves like water. The Aura Slip Dress is effortless sophistication — bias-cut to drape beautifully across every curve, finished with delicate adjustable straps and a gentle cowl neckline.",
    details: [
      "100% pure silk charmeuse",
      "Bias-cut silhouette",
      "Adjustable spaghetti straps",
      "Cowl neckline with open back",
      "Dry clean only",
      "Made in Italy",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "Magnolia Cream Maxi",
    price: 280,
    category: "Summer",
    image: "/images/dress2.png",
    images: ["/images/dress2.png", "/images/dress4.png"],
    description:
      "Sun-drenched and dreamy, the Magnolia Maxi is the perfect companion for warm evenings and golden afternoons. Crafted from breathable cotton-silk blend, it flows effortlessly with every step.",
    details: [
      "60% cotton, 40% silk blend",
      "Relaxed maxi silhouette",
      "Smocked bodice with adjustable straps",
      "Side pockets",
      "Hand wash cold",
      "Ethically sourced fabrics",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "3",
    name: "Midnight Lace Gown",
    price: 650,
    category: "Formal",
    image: "/images/dress3.png",
    images: ["/images/dress3.png", "/images/dress5.png"],
    description:
      "Drama meets refinement. The Midnight Lace Gown features intricate French lace layered over silk crepe, with a structured bodice and a sweeping A-line skirt that commands every room it enters.",
    details: [
      "French Chantilly lace overlay",
      "Silk crepe underlining",
      "Boned bodice with hidden zip closure",
      "Sweeping A-line skirt with train",
      "Dry clean only",
      "Handcrafted in France",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "4",
    name: "Rosalind Floral Midi",
    price: 220,
    originalPrice: 280,
    category: "Casual",
    image: "/images/dress4.png",
    images: ["/images/dress4.png", "/images/dress2.png"],
    isNew: true,
    description:
      "Light as a petal and just as pretty, the Rosalind Midi is your everyday expression of femininity. Soft floral print on delicate chiffon, with a flattering wrap silhouette and flutter sleeves.",
    details: [
      "100% chiffon",
      "Wrap midi silhouette",
      "Floral print throughout",
      "Flutter sleeves",
      "Self-tie waist",
      "Gentle machine wash",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "5",
    name: "Blush Structure Bodice",
    price: 450,
    category: "Formal",
    image: "/images/dress5.png",
    images: ["/images/dress5.png", "/images/dress3.png"],
    description:
      "Architectural elegance in the softest blush. This gown features a sculptural boned bodice that transitions into a fluid skirt — the perfect tension between structure and romance.",
    details: [
      "Duchess satin bodice",
      "Silk chiffon skirt",
      "Boned and structured bodice",
      "Concealed back zip",
      "Floor-length silhouette",
      "Dry clean only",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "6",
    name: "Champagne Wrap Dress",
    price: 310,
    originalPrice: 390,
    category: "Evening",
    image: "/images/dress6.png",
    images: ["/images/dress6.png", "/images/dress1.png"],
    description:
      "Understated glamour at its finest. The Champagne Wrap Dress is universally flattering, with a deep V-neckline, ruched waist tie, and a cascading hemline that elongates the silhouette beautifully.",
    details: [
      "Stretch satin fabric",
      "Wrap silhouette with adjustable tie",
      "Deep V-neckline",
      "Midi length with cascading hem",
      "Machine wash gentle",
      "Available in limited quantities",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "7",
    name: "Emerald Silk Elegance",
    price: 390,
    category: "Evening",
    image: "/images/dress7.png",
    images: ["/images/dress7.png", "/images/dress6.png"],
    description:
      "A bold statement dressed in whisper-soft silk. The Emerald Evening Gown features a jewel-toned hue that glows under candlelight, with a sleek column silhouette and a dramatic slit.",
    details: [
      "100% mulberry silk",
      "Column silhouette with front slit",
      "Spaghetti straps",
      "V-neck front and back",
      "Dry clean only",
      "Made in limited edition",
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "8",
    name: "Ivory Lace Bridal",
    price: 890,
    category: "Bridal",
    image: "/images/dress8.png",
    images: ["/images/dress8.png", "/images/dress3.png"],
    description:
      "Your most unforgettable moment deserves the most unforgettable gown. The Ivory Lace Bridal gown is hand-embroidered with Venetian lace, featuring a cathedral-length skirt, illusion neckline, and a sweeping train.",
    details: [
      "Hand-embroidered Venetian lace",
      "Silk tulle underskirt",
      "Illusion lace neckline",
      "Cathedral-length train",
      "Boned corset bodice",
      "Complimentary bridal fitting included",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "b1",
    name: "Rosette Mini Bag",
    price: 195,
    category: "Bags",
    image: "/images/bag1.png",
    description: "Bridal and soft rose mini handbag with a delicate gold chain. Perfect for elegant evenings.",
    details: ["Soft rose leather", "Gold chain strap", "Magnetic clasp", "Compact interior", "Made in Italy"],
    sizes: ["One Size"]
  },
  {
    id: "b2",
    name: "Pearl Handle Clutch",
    price: 165,
    category: "Bags",
    image: "/images/bag2.png",
    description: "Ivory satin clutch featuring a stunning pearl detail handle for a touch of timeless sophistication.",
    details: ["Ivory satin exterior", "Faux pearl handle", "Secure snap closure", "Silver-tone hardware", "Dust bag included"],
    sizes: ["One Size"]
  },
  {
    id: "b3",
    name: "Champagne Tote",
    price: 285,
    originalPrice: 350,
    category: "Bags",
    image: "/images/bag3.png",
    description: "A large structured champagne-colored leather tote. Spacious enough for your essentials while remaining incredibly chic.",
    details: ["Structured leather", "Champagne finish", "Spacious interior compartment", "Top handle design", "Protective feet on base"],
    sizes: ["One Size"]
  },
  {
    id: "b4",
    name: "Velvet Evening Bag",
    price: 220,
    category: "Bags",
    image: "/images/bag4.png",
    description: "Deep blush velvet evening bag accented with a brilliant gold clasp. The perfect finishing touch.",
    details: ["Deep blush velvet", "Gold-tone hardware", "Chain crossbody option", "Satin lined", "Imported"],
    sizes: ["One Size"]
  },
  {
    id: "b5",
    name: "Blush Quilted Shoulder",
    price: 340,
    originalPrice: 420,
    category: "Bags",
    image: "/images/bag5.png",
    description: "A classic reborn. Blush pink quilted leather shoulder bag offering elegance and versatility.",
    details: ["Quilted leather", "Adjustable shoulder strap", "Multiple compartments", "Turn-lock closure", "Hand finished"],
    sizes: ["One Size"]
  },
  {
    id: "b6",
    name: "Ivory Crossbody",
    price: 175,
    category: "Bags",
    image: "/images/bag6.png",
    description: "Minimalist ivory leather crossbody paired with gleaming gold hardware. Effortless daily luxury.",
    details: ["Smooth ivory leather", "Gold hardware accents", "Adjustable strap", "Zip closure", "Minimalist profile"],
    sizes: ["One Size"]
  },
  {
    id: "b7",
    name: "Rose Gold Chain Bag",
    price: 255,
    category: "Bags",
    image: "/images/bag7.png",
    description: "A rose gold chain-strap mini bag with a high-shine luxe finish to elevate any outfit.",
    details: ["Luxe metallic finish", "Rose gold tone", "Chain strap", "Evening essential", "Wipe clean"],
    sizes: ["One Size"]
  },
  {
    id: "b8",
    name: "Silk Bow Pouch",
    price: 135,
    originalPrice: 180,
    category: "Bags",
    image: "/images/bag8.png",
    description: "A beautiful cream silk evening pouch gathered with a soft ribbon bow.",
    details: ["100% Silk", "Ribbon bow detail", "Drawstring closure", "Delicate hand feel", "Special occasion piece"],
    sizes: ["One Size"]
  }
];
