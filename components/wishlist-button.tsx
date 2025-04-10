"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/product-data"

interface WishlistButtonProps {
  product: Product
  isInWishlist?: boolean
  onToggleWishlist: (product: Product) => void
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function WishlistButton({
  product,
  isInWishlist = false,
  onToggleWishlist,
  variant = "ghost",
  size = "icon",
}: WishlistButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const handleClick = () => {
    onToggleWishlist(product)

    toast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    })
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={`${isInWishlist ? "text-pink-500" : "text-gray-500 hover:text-pink-500"}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Heart className="h-5 w-5" fill={isInWishlist || isHovered ? "currentColor" : "none"} />
    </Button>
  )
}

