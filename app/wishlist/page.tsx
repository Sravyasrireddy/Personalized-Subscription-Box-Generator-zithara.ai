"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart, ArrowLeft, Trash2, Heart } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function WishlistPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load wishlist items from localStorage
    if (typeof window !== "undefined") {
      setLoading(true)
      const savedWishlist = localStorage.getItem("chatbot-wishlist")
      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist))
        } catch (e) {
          console.error("Error parsing saved wishlist:", e)
          setWishlistItems([])
        }
      }
      setLoading(false)
    }
  }, [])

  const removeFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item.id !== itemId)
    setWishlistItems(updatedWishlist)

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbot-wishlist", JSON.stringify(updatedWishlist))
    }

    toast({
      title: "Item removed",
      description: "The item has been removed from your wishlist.",
    })
  }

  const addToCart = (item: any) => {
    // Get current cart
    const currentCart = JSON.parse(localStorage.getItem("chatbot-cart") || "[]")

    // Check if item is already in cart
    if (!currentCart.some((cartItem: any) => cartItem.id === item.id)) {
      // Add to cart
      const updatedCart = [...currentCart, item]
      localStorage.setItem("chatbot-cart", JSON.stringify(updatedCart))
      localStorage.setItem("selectedProducts", JSON.stringify(updatedCart))

      // Trigger cart update event
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"))
        window.dispatchEvent(new CustomEvent("cart-updated"))
      }

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart.`,
      })
    } else {
      toast({
        title: "Already in cart",
        description: `${item.name} is already in your cart.`,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
            My Wishlist
          </h1>
        </div>
        <Button onClick={() => router.push("/cart")} className="bg-pink-600 hover:bg-pink-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Cart
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love to your wishlist and revisit them later.</p>
          <Button onClick={() => router.push("/")} className="bg-pink-600 hover:bg-pink-700">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                <p className="font-bold text-lg">${item.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="flex-1 bg-pink-600 hover:bg-pink-700" onClick={() => addToCart(item)}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

