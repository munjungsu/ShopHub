export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 299.99,
    image: "/images/products/headphones.jpg",
    category: "electronics"
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    price: 199.99,
    image: "/images/products/smartwatch.jpg",
    category: "electronics"
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton.",
    price: 29.99,
    image: "/images/products/tshirt.jpg",
    category: "clothing"
  },
  {
    id: 4,
    name: "Professional Blender",
    description: "Powerful blender perfect for smoothies, soups, and more. Features multiple speed settings.",
    price: 89.99,
    image: "/images/products/blender.jpg",
    category: "home"
  },
  {
    id: 5,
    name: "Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots and coin pocket.",
    price: 49.99,
    image: "/images/products/wallet.jpg",
    category: "accessories"
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 39.99,
    image: "/images/products/charger.jpg",
    category: "electronics"
  },
  {
    id: 7,
    name: "Yoga Mat",
    description: "Non-slip yoga mat with perfect thickness for comfort and stability.",
    price: 34.99,
    image: "/images/products/yogamat.jpg",
    category: "sports"
  },
  {
    id: 8,
    name: "Ceramic Coffee Mug",
    description: "Beautiful handcrafted ceramic mug, perfect for your morning coffee.",
    price: 19.99,
    image: "/images/products/mug.jpg",
    category: "home"
  },
  {
    id: 9,
    name: "Running Shoes",
    description: "Lightweight and comfortable running shoes with excellent support.",
    price: 129.99,
    image: "/images/products/shoes.jpg",
    category: "sports"
  },
  {
    id: 10,
    name: "Sunglasses",
    description: "Stylish sunglasses with UV protection and polarized lenses.",
    price: 79.99,
    image: "/images/products/sunglasses.jpg",
    category: "accessories"
  },
  {
    id: 11,
    name: "Backpack",
    description: "Durable and spacious backpack with multiple compartments.",
    price: 59.99,
    image: "/images/products/backpack.jpg",
    category: "accessories"
  },
  {
    id: 12,
    name: "Smart Home Speaker",
    description: "Voice-controlled smart speaker with premium sound quality.",
    price: 149.99,
    image: "/images/products/speaker.jpg",
    category: "electronics"
  }
]; 