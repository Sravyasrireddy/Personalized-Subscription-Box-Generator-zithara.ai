"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Heart, MessageCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getProductsByCategory } from "@/lib/products"
import { ToastAction } from "@/components/ui/toast"

interface Product {
  id: number | string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const { toast } = useToast()

  // Load cart and wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("chatbot-cart")
      const savedWishlist = localStorage.getItem("chatbot-wishlist")

      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Error parsing saved cart:", e)
        }
      }

      if (savedWishlist) {
        try {
          setWishlistItems(JSON.parse(savedWishlist))
        } catch (e) {
          console.error("Error parsing saved wishlist:", e)
        }
      }
    }
  }, [])

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbot-cart", JSON.stringify(cartItems))
      localStorage.setItem("selectedProducts", JSON.stringify(cartItems))

      // Calculate and save price information
      const totalRetailPrice = cartItems.reduce((sum, p) => sum + p.price, 0)
      const boxPrice = Math.round(totalRetailPrice * 0.7) // 30% discount

      localStorage.setItem("boxPrice", boxPrice.toString())
      localStorage.setItem("totalRetailPrice", totalRetailPrice.toString())
    }
  }, [cartItems])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("chatbot-wishlist", JSON.stringify(wishlistItems))
    }
  }, [wishlistItems])

  // Search for products when query changes
  useEffect(() => {
    setIsLoading(true)

    // Get all products from all categories
    const allProducts = [
      ...getProductsByCategory("women"),
      ...getProductsByCategory("men"),
      ...getProductsByCategory("kids"),
      ...getProductsByCategory("skincare"),
    ]

    // Filter products based on query
    if (query) {
      const lowerQuery = query.toLowerCase()
      const results = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery) ||
          (product.tags && product.tags.some((tag) => tag.includes(lowerQuery))),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }

    setIsLoading(false)
  }, [query])

  const addToCart = (product: Product) => {
    // Instead of directly adding to cart, show a message to use the AI
    toast({
      title: "Use AI Assistant",
      description: `Please ask our AI assistant to add ${product.name} to your cart.`,
      action: (
        <ToastAction
          altText="Open AI"
          onClick={() => {
            // Here we would trigger the AI chatbot to open
            // For now, just show another toast
            toast({
              title: "AI Assistant",
              description: `Ask our AI about ${product.name} to add it to your cart.`,
            })
          }}
        >
          Open AI
        </ToastAction>
      ),
    })
  }

  const addToWishlist = (product: Product) => {
    // Check if product is already in wishlist
    if (!wishlistItems.some((item) => item.id === product.id)) {
      // Add product to wishlist
      setWishlistItems((prev) => [...prev, product])

      // Show toast notification
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } else {
      // Remove from wishlist
      setWishlistItems(wishlistItems.filter((item) => item.id !== product.id))

      // Show toast notification
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
        Search Results for "{query}"
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
                      wishlistItems.some((item) => item.id === product.id)
                        ? "text-pink-500"
                        : "text-gray-500 hover:text-pink-500"
                    }`}
                    onClick={() => addToWishlist(product)}
                  >
                    <Heart
                      className="h-5 w-5"
                      fill={wishlistItems.some((item) => item.id === product.id) ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
                <CardContent className="p-4 flex-1">
                  <h2 className="font-bold text-lg mb-1">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                  <p className="font-bold text-lg">${product.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => addToCart(product)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Ask AI About This Product
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-4">No products found</h2>
          <p className="text-gray-600 mb-8">
            We couldn't find any products matching your search. Try using different keywords or browse our categories.
          </p>
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      )}
    </div>
  )
}

