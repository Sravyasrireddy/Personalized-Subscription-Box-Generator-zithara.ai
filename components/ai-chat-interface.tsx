"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  X,
  Sparkles,
  User,
  Loader2,
  PlusCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getProductsByCategory } from "@/lib/products"
import { useRouter } from "next/navigation"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Product {
  id: number | string
  name: string
  price: number
  image: string
  description: string
  category?: string
  tags?: string[]
}

export default function AIChatInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! 👋 I'm your AI shopping assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [alternativeProducts, setAlternativeProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [viewingAlternatives, setViewingAlternatives] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)

  // Load cart and wishlist from localStorage on initial load
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

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Load alternative products when category changes
  useEffect(() => {
    if (currentCategory) {
      const allProducts = getProductsByCategory(currentCategory)
      // Get products that aren't in the recommended list
      const alternatives = allProducts
        .filter((product) => !recommendedProducts.some((p) => p.id === product.id))
        .slice(0, 4)
      setAlternativeProducts(alternatives)
    }
  }, [currentCategory, recommendedProducts])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setViewingAlternatives(false)

    try {
      // Determine category from input
      const lowerInput = input.toLowerCase()
      let detectedCategory = null

      if (lowerInput.includes("women") || lowerInput.includes("dress") || lowerInput.includes("anarkali")) {
        detectedCategory = "women"
      } else if (lowerInput.includes("laptop") || lowerInput.includes("computer") || lowerInput.includes("notebook")) {
        detectedCategory = "laptops"
      } else if (lowerInput.includes("kid") || lowerInput.includes("children") || lowerInput.includes("girl")) {
        detectedCategory = "kids"
      } else if (lowerInput.includes("skin") || lowerInput.includes("serum") || lowerInput.includes("moisturizer")) {
        detectedCategory = "skincare"
      }

      if (detectedCategory) {
        setCurrentCategory(detectedCategory)
      }

      // Call API to get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          userProfile: {
            // You can add user profile info here if available
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }])

      // Set recommended products if any
      if (data.recommendedProducts && data.recommendedProducts.length > 0) {
        setRecommendedProducts(data.recommendedProducts)

        // Set category based on the first product's category
        if (data.recommendedProducts[0].category && !currentCategory) {
          setCurrentCategory(data.recommendedProducts[0].category)
        }
      } else {
        setRecommendedProducts([])
      }

      // Add to cart if requested
      if (data.addToCart && data.recommendedProducts && data.recommendedProducts.length > 0) {
        data.recommendedProducts.forEach((product: Product) => {
          addToCart(product)
        })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting right now. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = (product: Product) => {
    // Check if product is already in cart to avoid duplicates
    if (!cartItems.some((item) => item.id === product.id)) {
      // Add product to cart
      setCartItems((prev) => [...prev, product])

      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } else {
      // Product is already in cart
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      })
    }
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
      // Product is already in wishlist
      toast({
        title: "Already in wishlist",
        description: `${product.name} is already in your wishlist.`,
      })
    }
  }

  const handleViewAlternatives = () => {
    setViewingAlternatives(true)

    if (!currentCategory) return

    // Get all products for the current category except the ones already shown
    const allCategoryProducts = getProductsByCategory(currentCategory)
    const remainingProducts = allCategoryProducts
      .filter((product) => !recommendedProducts.some((p) => p.id === product.id))
      .slice(0, 4) // Show up to 4 alternative products

    if (remainingProducts.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here are more ${currentCategory} products you might like:`,
        },
      ])
      setRecommendedProducts(remainingProducts)
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've shown you all the available ${currentCategory} products. Would you like to explore another category?`,
        },
      ])
    }
  }

  const handleBackToRecommended = () => {
    setViewingAlternatives(false)

    // Get the original recommended products for the current category
    if (currentCategory) {
      const originalProducts = getProductsByCategory(currentCategory)
        .filter((p) => p.popular)
        .slice(0, 4)

      setRecommendedProducts(originalProducts)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Here are the original recommended ${currentCategory} products:`,
        },
      ])
    }
  }

  const handleCategoryRequest = (category: string) => {
    setInput(`Show me ${category} products`)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleCategoryClick = (category: string) => {
    // Navigate to the category page
    router.push(`/subscription?category=${category}`)
  }

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-pink-600 hover:bg-pink-700 shadow-lg z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 max-h-[80vh]" closeButton={false}>
          <DialogHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 flex flex-row justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <DialogTitle className="font-semibold">AI Shopping Assistant</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/images/ai-recommendation-system.png" alt="AI" />
                        <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === "user" && (
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/images/ai-recommendation-system.png" alt="AI" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </AnimatePresence>

            {/* Product recommendations */}
            {(recommendedProducts.length > 0 || alternativeProducts.length > 0) && (
              <div className="mt-4 mb-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">
                    {viewingAlternatives ? "Alternative products:" : "Recommended products:"}
                  </p>
                  {currentCategory &&
                    (viewingAlternatives ? (
                      <Button variant="outline" size="sm" className="text-xs" onClick={handleBackToRecommended}>
                        <ChevronLeft className="h-3 w-3 mr-1" />
                        Back to Recommended
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="text-xs" onClick={handleViewAlternatives}>
                        View More Products
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(viewingAlternatives ? alternativeProducts : recommendedProducts).map((product) => (
                    <motion.div
                      key={product.id}
                      className="border rounded-md p-2 hover:shadow-md transition-shadow bg-white"
                      whileHover={{ scale: 1.03 }}
                    >
                      <div className="relative h-24 mb-2">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">{product.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-bold">${product.price}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-pink-600 hover:bg-pink-700 text-white"
                            onClick={() => addToCart(product)}
                          >
                            <PlusCircle className="h-3 w-3 mr-1" /> Add
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => addToWishlist(product)}
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t flex flex-col gap-3">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask about products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} className="bg-pink-600 hover:bg-pink-700" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            <div className="w-full">
              <p className="text-xs text-gray-500 mb-2">Quick access:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-pink-200 hover:bg-pink-50"
                  onClick={() => handleCategoryClick("women")}
                >
                  Women's Clothing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-blue-200 hover:bg-blue-50"
                  onClick={() => handleCategoryClick("laptops")}
                >
                  Laptops
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-200 hover:bg-purple-50"
                  onClick={() => handleCategoryClick("kids")}
                >
                  Kids' Clothing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-200 hover:bg-green-50"
                  onClick={() => handleCategoryClick("skincare")}
                >
                  Skincare
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Static chat interface for the page */}
      <Card className="shadow-lg border-0 overflow-hidden h-full">
        <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6">
          <CardTitle className="text-2xl">AI Shopping Assistant</CardTitle>
          <p className="text-pink-100">Ask me anything about our products or get personalized recommendations</p>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Avatar className="mt-1">
              <AvatarImage src="/images/ai-recommendation-system.png" alt="AI" />
              <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-3 flex-1">
              <p>
                Hi there! 👋 I'm your AI shopping assistant. I can help you find the perfect products for your needs.
              </p>
              <p className="mt-2">I can:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Recommend products based on your preferences</li>
                <li>Add items directly to your cart</li>
                <li>Answer questions about our products</li>
                <li>Help you create a personalized subscription box</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start gap-3 justify-end">
            <div className="bg-pink-600 text-white rounded-lg p-3">
              <p>Show me some women's clothing options</p>
            </div>
            <Avatar className="mt-1">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-pink-100 text-pink-600">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-start gap-3">
            <Avatar className="mt-1">
              <AvatarImage src="/images/ai-recommendation-system.png" alt="AI" />
              <AvatarFallback className="bg-purple-100 text-purple-600">AI</AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 rounded-lg p-3 flex-1">
              <p>Here are some popular women's clothing items from our collection:</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="border rounded-md p-2 bg-white">
                  <div className="relative h-20 mb-2">
                    <Image
                      src="/images/women/women1.jpeg"
                      alt="Pink Embroidered Anarkali Dress"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-medium text-xs">Pink Embroidered Anarkali Dress</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold">$89</span>
                  </div>
                </div>
                <div className="border rounded-md p-2 bg-white">
                  <div className="relative h-20 mb-2">
                    <Image
                      src="/images/women/women2.jpeg"
                      alt="Pink Chanderi Suit Set"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h4 className="font-medium text-xs">Pink Chanderi Suit Set</h4>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs font-bold">$75</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => setIsOpen(true)}>
            <MessageCircle className="h-4 w-4 mr-2" /> Chat with AI Assistant
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}

