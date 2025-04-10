"use client"
import { motion } from "framer-motion"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/product-data"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
  cartItems: Product[]
  wishlistItems: Product[]
}

// Update the ProductGrid component to use the modified ProductCard
export default function ProductGrid({
  products,
  onAddToCart,
  onAddToWishlist,
  cartItems = [],
  wishlistItems = [],
}: ProductGridProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
            isInCart={cartItems.some((item) => item.id === product.id)}
            isInWishlist={wishlistItems.some((item) => item.id === product.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}

