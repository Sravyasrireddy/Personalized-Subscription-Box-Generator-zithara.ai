// Updated products.js with laptops instead of men's wear
const products = [
  // Women's clothing
  {
    id: "women-1",
    name: "Floral Summer Dress",
    description: "Light and breezy floral dress perfect for summer",
    price: 49.99,
    category: "women",
    image: "/images/women/women1.jpeg",
    popular: true,
    benefits: ["Comfortable", "Stylish", "Breathable"],
  },
  {
    id: "women-2",
    name: "Classic White Blouse",
    description: "Versatile white blouse for any occasion",
    price: 39.99,
    category: "women",
    image: "/images/women/women2.jpeg",
    popular: true,
    benefits: ["Versatile", "Classic", "Elegant"],
  },
  {
    id: "women-3",
    name: "Black Pencil Skirt",
    description: "Elegant black pencil skirt for office wear",
    price: 45.99,
    category: "women",
    image: "/images/women/women3.jpeg",
    popular: true,
    benefits: ["Professional", "Elegant", "Versatile"],
  },
  {
    id: "women-4",
    name: "Casual Denim Jacket",
    description: "Classic denim jacket for everyday style",
    price: 59.99,
    category: "women",
    image: "/images/women/women4.jpeg",
    popular: false,
    benefits: ["Casual", "Durable", "Versatile"],
  },
  {
    id: "women-5",
    name: "Pink Chanderi Suit",
    description: "Beautiful pink chanderi suit for special occasions",
    price: 79.99,
    category: "women",
    image: "/images/women/women5.jpeg",
    popular: false,
    benefits: ["Elegant", "Traditional", "Festive"],
  },

  // Laptops section (replacing men's wear)
  {
    id: "laptop-1",
    name: 'MacBook Pro 13"',
    description: "Powerful laptop with Retina display and all-day battery life",
    price: 1299.99,
    category: "laptops",
    image: "/images/laptops/laptop1.jpeg",
    popular: true,
    benefits: ["Powerful", "Lightweight", "Long Battery Life"],
  },
  {
    id: "laptop-2",
    name: "Windows Ultrabook",
    description: "Sleek Windows laptop with vibrant display and fast performance",
    price: 899.99,
    category: "laptops",
    image: "/images/laptops/laptop2.jpeg",
    popular: true,
    benefits: ["Fast", "Colorful Display", "Affordable"],
  },
  {
    id: "laptop-3",
    name: "Dell XPS 13",
    description: "Premium ultrabook with edge-to-edge display and aluminum chassis",
    price: 1199.99,
    category: "laptops",
    image: "/images/laptops/laptop3.jpeg",
    popular: true,
    benefits: ["Premium", "Borderless Display", "Compact"],
  },
  {
    id: "laptop-4",
    name: "MacBook Air",
    description: "Ultra-thin and light laptop perfect for everyday use",
    price: 999.99,
    category: "laptops",
    image: "/images/laptops/laptop4.jpeg",
    popular: false,
    benefits: ["Thin", "Lightweight", "All-day Battery"],
  },
  {
    id: "laptop-5",
    name: "Professional Workstation",
    description: "High-performance laptop for creative professionals",
    price: 1499.99,
    category: "laptops",
    image: "/images/laptops/laptop5.jpeg",
    popular: false,
    benefits: ["High Performance", "Large Screen", "Professional Grade"],
  },

  // Kids clothing
  {
    id: "kids-1",
    name: "Colorful T-shirt Set",
    description: "Set of 3 colorful t-shirts for kids",
    price: 29.99,
    category: "kids",
    image: "/images/kids/kids1.jpeg",
    popular: true,
    benefits: ["Colorful", "Comfortable", "Durable"],
  },
  {
    id: "kids-2",
    name: "Denim Overalls",
    description: "Cute denim overalls for toddlers",
    price: 34.99,
    category: "kids",
    image: "/images/kids/kids2.jpeg",
    popular: true,
    benefits: ["Cute", "Durable", "Practical"],
  },
  {
    id: "kids-3",
    name: "Summer Dress",
    description: "Light summer dress for girls",
    price: 32.99,
    category: "kids",
    image: "/images/kids/kids3.jpeg",
    popular: true,
    benefits: ["Light", "Comfortable", "Stylish"],
  },
  {
    id: "kids-4",
    name: "Boys Formal Set",
    description: "Formal shirt and pants set for boys",
    price: 39.99,
    category: "kids",
    image: "/images/kids/kids4.jpeg",
    popular: false,
    benefits: ["Formal", "Elegant", "Comfortable"],
  },
  {
    id: "kids-5",
    name: "Winter Jacket",
    description: "Warm winter jacket for kids",
    price: 49.99,
    category: "kids",
    image: "/images/kids/kids5.jpeg",
    popular: false,
    benefits: ["Warm", "Durable", "Comfortable"],
  },

  // Skincare products
  {
    id: "skincare-1",
    name: "Hydrating Facial Cleanser",
    description: "Gentle cleanser for all skin types",
    price: 24.99,
    category: "skincare",
    image: "/images/skincare-blue.webp",
    popular: true,
    benefits: ["Hydrating", "Gentle", "All Skin Types"],
  },
  {
    id: "skincare-2",
    name: "Vitamin C Serum",
    description: "Brightening serum with vitamin C",
    price: 34.99,
    category: "skincare",
    image: "/images/serum.jpeg",
    popular: true,
    benefits: ["Brightening", "Anti-aging", "Antioxidant"],
  },
  {
    id: "skincare-3",
    name: "Moisturizing Cream",
    description: "Rich moisturizing cream for dry skin",
    price: 29.99,
    category: "skincare",
    image: "/images/moisturizer.jpeg",
    popular: true,
    benefits: ["Moisturizing", "Nourishing", "For Dry Skin"],
  },
  {
    id: "skincare-4",
    name: "Exfoliating Scrub",
    description: "Gentle exfoliating scrub for smooth skin",
    price: 22.99,
    category: "skincare",
    image: "/images/skincare-woman.webp",
    popular: false,
    benefits: ["Exfoliating", "Smoothing", "Gentle"],
  },
  {
    id: "skincare-5",
    name: "Anti-Aging Night Cream",
    description: "Rejuvenating night cream with retinol",
    price: 39.99,
    category: "skincare",
    image: "/images/skincare-set.jpeg",
    popular: false,
    benefits: ["Anti-aging", "Rejuvenating", "Overnight Repair"],
  },
]

// Ensure the getProductsByCategory function always returns an array
export function getProductsByCategory(category) {
  if (!category) return []
  return products.filter((product) => product.category === category) || []
}

// Add a search function to find products by query
export function searchProducts(query) {
  if (!query) return []
  const lowerQuery = query.toLowerCase()
  return (
    products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery),
    ) || []
  )
}

export { products }

