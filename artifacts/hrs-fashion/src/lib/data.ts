export interface Product {
  id: string;
  name: string;
  price: number;
  category: "Evening" | "Casual" | "Formal" | "Summer" | "Bridal";
  image: string;
  isNew?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Aura Silk Slip Dress",
    price: 350,
    category: "Evening",
    image: "/images/dress1.png",
    isNew: true,
  },
  {
    id: "2",
    name: "Magnolia Cream Maxi",
    price: 280,
    category: "Summer",
    image: "/images/dress2.png",
  },
  {
    id: "3",
    name: "Midnight Lace Gown",
    price: 650,
    category: "Formal",
    image: "/images/dress3.png",
  },
  {
    id: "4",
    name: "Rosalind Floral Midi",
    price: 220,
    category: "Casual",
    image: "/images/dress4.png",
    isNew: true,
  },
  {
    id: "5",
    name: "Blush Structure Bodice",
    price: 450,
    category: "Formal",
    image: "/images/dress5.png",
  },
  {
    id: "6",
    name: "Champagne Wrap Dress",
    price: 310,
    category: "Evening",
    image: "/images/dress6.png",
  },
  {
    id: "7",
    name: "Emerald Silk Elegance",
    price: 390,
    category: "Evening",
    image: "/images/dress7.png",
  },
  {
    id: "8",
    name: "Ivory Lace Bridal",
    price: 890,
    category: "Bridal",
    image: "/images/dress8.png",
  },
];
