"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/product-data"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onAddToWishlist: (product: Product) => void
  isInCart?: boolean
  isInWishlist?: boolean
}

// Update the ProductCard component to remove direct cart functionality
export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isInCart = false,
  isInWishlist = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { toast } = useToast()

  const handleAskAI = () => {
    // Open the chatbot dialog
    setIsChatOpen(true)

    // We'll implement a global state or context to control the chatbot visibility
    // For now, we'll just show a toast message
    toast({
      title: "AI Assistant",
      description: `Ask our AI about ${product.name} to add it to your cart.`,
    })
  }

  const handleAddToWishlist = () => {
    onAddToWishlist(product)
  }

  return (
    <motion.div whileHover={{ y: -5 }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Card className="overflow-hidden h-full flex flex-col border-transparent hover:border-pink-200 hover:shadow-md transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
              isInWishlist ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
            }`}
            onClick={handleAddToWishlist}
          >
            <Heart className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} />
          </Button>
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-2 flex-1">
            <h3 className="font-bold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {product.benefits.slice(0, 2).map((benefit, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {benefit}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
            <span className="font-bold text-lg">${product.price}</span>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={handleAskAI}>
              <MessageCircle className="h-4 w-4 mr-1" /> Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

