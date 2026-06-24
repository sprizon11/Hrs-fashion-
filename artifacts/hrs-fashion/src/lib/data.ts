export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Evening" | "Casual" | "Formal" | "Summer" | "Bridal";
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
];
