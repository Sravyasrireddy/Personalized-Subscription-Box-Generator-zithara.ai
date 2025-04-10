"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  ShoppingCart,
  Package,
  Calendar,
  Trash2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { type Product, getProductsByCategory, searchProducts } from "@/lib/products"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Define message types
type MessageRole = "user" | "bot" | "system"

interface Message {
  role: MessageRole
  content: string
  timestamp: Date
  products?: Product[]
  alternativeProducts?: Product[]
  category?: string
}

interface UserProfile {
  skinType?: string
  concerns?: string[]
  ageRange?: string
  preferences?: string[]
  categories?: string[]
}

interface OrderDetails {
  id: string
  date: Date
  items: Product[]
  status: "Processing" | "Shipped" | "Delivered"
  total: number
}

export default function ChatbotWidget() {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "How can I help you find the perfect products today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("chat")
  const [cartItems, setCartItems] = useState<Product[]>([])
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [orderHistory, setOrderHistory] = useState<OrderDetails[]>([])
  const [viewingAlternatives, setViewingAlternatives] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string | null>(null)
  const [alternativeProducts, setAlternativeProducts] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false)
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<"active" | "paused" | "cancelled">("active")
  const [nextDeliveryDate, setNextDeliveryDate] = useState<string>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 14)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  })
  const [conversationStage, setConversationStage] = useState<
    "greeting" | "category_selection" | "product_recommendation" | "customization" | "checkout"
  >("greeting")
  // Flag to prevent showing the initial AI message
  const [initialMessageShown, setInitialMessageShown] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Add this state to track whether we're showing alternatives
  const [showingAlternatives, setShowingAlternatives] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number | null>(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load cart and wishlist from localStorage on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("chatbot-cart")
      const savedWishlist = localStorage.getItem("chatbot-wishlist")
      const savedOrderHistory = localStorage.getItem("order-history")

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

      if (savedOrderHistory) {
        try {
          setOrderHistory(JSON.parse(savedOrderHistory))
        } catch (e) {
          console.error("Error parsing saved order history:", e)
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("order-history", JSON.stringify(orderHistory))
    }
  }, [orderHistory])

  // Add event listeners to allow opening the chatbot from other components
  useEffect(() => {
    // Function to handle opening the chatbot
    const handleOpenChatbot = () => {
      setIsOpen(true)
    }

    // Function to handle opening the chatbot and showing skincare products
    const handleOpenChatbotSkincare = () => {
      setIsOpen(true)
      showProductsDirectly("skincare")
    }

    // Function to handle opening the chatbot and going to wishlist tab
    const handleOpenChatbotWishlist = () => {
      setIsOpen(true)
      setActiveTab("wishlist")
    }

    // Add event listeners
    window.addEventListener("open-chatbot", handleOpenChatbot)
    window.addEventListener("open-chatbot-skincare", handleOpenChatbotSkincare)
    window.addEventListener("open-chatbot-wishlist", handleOpenChatbotWishlist)

    // Clean up event listeners
    return () => {
      window.removeEventListener("open-chatbot", handleOpenChatbot)
      window.removeEventListener("open-chatbot-skincare", handleOpenChatbotSkincare)
      window.removeEventListener("open-chatbot-wishlist", handleOpenChatbotWishlist)
    }
  }, [])

  // Load alternative products when category changes
  useEffect(() => {
    if (currentCategory) {
      const products = getProductsByCategory(currentCategory)
      // Get products that aren't in the recommended list
      const alternatives = products.filter((p) => !p.popular).slice(0, 3)
      setAlternativeProducts(alternatives)
    }
  }, [currentCategory])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Set loading state
    setIsLoading(true)

    try {
      // Process the message and generate a response
      const response = await processUserMessage(input, conversationStage, userProfile)

      // Add bot response
      setMessages((prev) => [...prev, response])

      // Update conversation stage if needed
      if (response.content.includes("Which category would you like to explore?")) {
        setConversationStage("category_selection")
      } else if (
        conversationStage === "category_selection" &&
        (input.toLowerCase().includes("women") ||
          input.toLowerCase().includes("laptops") ||
          input.toLowerCase().includes("kids") ||
          input.toLowerCase().includes("skincare") ||
          input.toLowerCase().includes("makeup") ||
          input.toLowerCase().includes("hair"))
      ) {
        setConversationStage("product_recommendation")
      } else if (
        conversationStage === "product_recommendation" &&
        response.content.includes("Would you like to customize your box?")
      ) {
        setConversationStage("customization")
      } else if (conversationStage === "customization" && response.content.includes("ready to checkout")) {
        setConversationStage("checkout")
      }

      // Update user profile based on message content
      updateUserProfile(input)
    } catch (error) {
      console.error("Error:", error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "I'm having trouble connecting right now, but I can still help with basic recommendations. Please try again or explore our featured products.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Function to directly show products without greeting
  const showProductsDirectly = (category: string) => {
    let products: Product[] = []
    let responseContent = ""

    if (category === "women") {
      products = getProductsByCategory("women")
        .filter((p) => p.popular)
        .slice(0, 3)
      responseContent =
        "Here are some popular women's clothing items from our collection. You can view more products by clicking 'View More Products'."
    } else if (category === "laptops") {
      products = getProductsByCategory("laptops")
        .filter((p) => p.popular)
        .slice(0, 3)
      responseContent =
        "Here are some popular laptops from our collection. You can view more products by clicking 'View More Products'."
    } else if (category === "kids") {
      products = getProductsByCategory("kids")
        .filter((p) => p.popular)
        .slice(0, 3)
      responseContent =
        "Here are some lovely clothing items for kids from our collection. You can view more products by clicking 'View More Products'."
    } else if (category === "skincare") {
      products = getProductsByCategory("skincare")
        .filter((p) => p.popular)
        .slice(0, 3)
      responseContent =
        "Here are some popular skincare products from our collection. You can view more products by clicking 'View More Products'."
    }

    setMessages([
      {
        role: "bot",
        content: responseContent,
        timestamp: new Date(),
        products: products,
        category: category,
      },
    ])

    // Set current category
    setCurrentCategory(category)

    // Update user profile
    setUserProfile((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), category],
    }))
  }

  // Process user message and generate a response
  const processUserMessage = async (
    message: string,
    stage: "greeting" | "category_selection" | "product_recommendation" | "customization" | "checkout",
    profile: UserProfile,
  ): Promise<Message> => {
    const lowerMessage = message.toLowerCase()

    // Handle greetings
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
      return {
        role: "bot",
        content:
          "Hi there! How can I help you today? I can recommend products, help you build your shopping cart, or answer questions about our subscription service.",
        timestamp: new Date(),
      }
    }

    // Handle "how are you" type questions
    if (lowerMessage.includes("how are you")) {
      return {
        role: "bot",
        content:
          "I'm doing fine, thank you for asking! How can I assist you today? Would you like to explore our clothing collections, laptops, or beauty products?",
        timestamp: new Date(),
      }
    }

    // Handle women's clothing/collection request
    if (
      lowerMessage.includes("women") ||
      lowerMessage.includes("woman") ||
      lowerMessage.includes("female") ||
      lowerMessage.includes("ladies") ||
      lowerMessage.includes("lady") ||
      lowerMessage.includes("women's collection")
    ) {
      // Get women's products
      const womenProducts = getProductsByCategory("women")
        .filter((p) => p.popular)
        .slice(0, 3)

      // Get alternative women's products for the "View Alternatives" button
      const alternativeWomenProducts = getProductsByCategory("women")
        .filter((p) => !p.popular)
        .slice(0, 3)

      setCurrentCategory("women")

      return {
        role: "bot",
        content:
          "Here are some popular women's clothing items from our collection. You can add these to your cart or view alternatives.",
        timestamp: new Date(),
        products: womenProducts,
        alternativeProducts: alternativeWomenProducts,
        category: "women",
      }
    }

    // Handle laptops request
    if (
      lowerMessage.includes("laptop") ||
      lowerMessage.includes("computer") ||
      lowerMessage.includes("macbook") ||
      lowerMessage.includes("notebook") ||
      lowerMessage.includes("pc")
    ) {
      // Get laptop products
      const laptopProducts = getProductsByCategory("laptops")
        .filter((p) => p.popular)
        .slice(0, 3)

      // Get alternative laptop products for the "View Alternatives" button
      const alternativeLaptopProducts = getProductsByCategory("laptops")
        .filter((p) => !p.popular)
        .slice(0, 3)

      setCurrentCategory("laptops")

      return {
        role: "bot",
        content:
          "Here are some popular laptops from our collection. You can add these to your cart or view alternatives.",
        timestamp: new Date(),
        products: laptopProducts,
        alternativeProducts: alternativeLaptopProducts,
        category: "laptops",
      }
    }

    // Handle kids products request
    if (
      lowerMessage.includes("kid") ||
      lowerMessage.includes("child") ||
      lowerMessage.includes("children") ||
      lowerMessage.includes("girl") ||
      lowerMessage.includes("boy")
    ) {
      // Get kids products
      const kidsProducts = getProductsByCategory("kids")
        .filter((p) => p.popular)
        .slice(0, 3)

      // Get alternative kids products for the "View Alternatives" button
      const alternativeKidsProducts = getProductsByCategory("kids")
        .filter((p) => !p.popular)
        .slice(0, 3)

      setCurrentCategory("kids")

      return {
        role: "bot",
        content:
          "Here are some lovely clothing items for kids from our collection. You can add these to your cart or view alternatives.",
        timestamp: new Date(),
        products: kidsProducts,
        alternativeProducts: alternativeKidsProducts,
        category: "kids",
      }
    }

    // Handle skincare products request
    if (lowerMessage.includes("skin") || lowerMessage.includes("face") || lowerMessage.includes("cream")) {
      // Get skincare products
      const skincareProducts = getProductsByCategory("skincare")
        .filter((p) => p.popular)
        .slice(0, 3)

      // Get alternative skincare products for the "View Alternatives" button
      const alternativeSkincareProducts = getProductsByCategory("skincare")
        .filter((p) => !p.popular)
        .slice(0, 3)

      setCurrentCategory("skincare")

      return {
        role: "bot",
        content: "Here are some popular skincare products. You can add these to your cart or view alternatives.",
        timestamp: new Date(),
        products: skincareProducts,
        alternativeProducts: alternativeSkincareProducts,
        category: "skincare",
      }
    }

    // Handle requests for alternatives
    if (lowerMessage.includes("alternative") || lowerMessage.includes("other") || lowerMessage.includes("more")) {
      // Determine which category to show alternatives for
      let category = profile.categories?.[profile.categories.length - 1] || "women"

      // If the message mentions a specific category, use that instead
      if (lowerMessage.includes("women")) category = "women"
      if (lowerMessage.includes("laptop")) category = "laptops"
      if (lowerMessage.includes("kid")) category = "kids"
      if (lowerMessage.includes("skin")) category = "skincare"

      const alternativeProducts = getProductsByCategory(category)
        .filter((p) => !p.popular)
        .slice(0, 3)

      setCurrentCategory(category)

      return {
        role: "bot",
        content: `Here are some alternative ${category} products you might like. Would you like to add any of these to your cart?`,
        timestamp: new Date(),
        products: alternativeProducts,
      }
    }

    // Handle adding products to cart
    if (
      lowerMessage.includes("add") &&
      (lowerMessage.includes("cart") || lowerMessage.includes("box") || lowerMessage.includes("basket"))
    ) {
      // Try to find product by name in the message
      const allProducts = [
        ...getProductsByCategory("women"),
        ...getProductsByCategory("laptops"),
        ...getProductsByCategory("kids"),
        ...getProductsByCategory("skincare"),
      ]

      const matchedProducts = allProducts.filter((product) => lowerMessage.includes(product.name.toLowerCase()))

      if (matchedProducts.length > 0) {
        // Add products to cart
        setCartItems((prev) => {
          const newCart = [...prev]
          matchedProducts.forEach((product) => {
            if (!newCart.some((item) => item.id === product.id)) {
              newCart.push(product)
            }
          })
          return newCart
        })

        // Also update the localStorage
        if (typeof window !== "undefined") {
          const currentCart = JSON.parse(localStorage.getItem("chatbot-cart") || "[]")
          const updatedCart = [...currentCart]

          matchedProducts.forEach((product) => {
            if (!updatedCart.some((item) => item.id === product.id)) {
              updatedCart.push(product)
            }
          })

          localStorage.setItem("chatbot-cart", JSON.stringify(updatedCart))

          // Also update the selectedProducts for the subscription page
          localStorage.setItem("selectedProducts", JSON.stringify(updatedCart))

          // Calculate and save price information
          const totalRetailPrice = updatedCart.reduce((sum, p) => sum + p.price, 0)
          const boxPrice = Math.round(totalRetailPrice * 0.7) // 30% discount

          localStorage.setItem("boxPrice", boxPrice.toString())
          localStorage.setItem("totalRetailPrice", totalRetailPrice.toString())
        }

        return {
          role: "bot",
          content: `I've added ${matchedProducts.map((p) => p.name).join(", ")} to your cart. Would you like to add anything else or proceed to checkout?`,
          timestamp: new Date(),
        }
      } else {
        // Search for products based on keywords
        const searchResults = searchProducts(message)

        if (searchResults.length > 0) {
          return {
            role: "bot",
            content: `I found these products that might match what you're looking for. Would you like to add any of these to your cart?`,
            timestamp: new Date(),
            products: searchResults.slice(0, 3),
          }
        } else {
          return {
            role: "bot",
            content:
              "I couldn't find a specific product matching your request. Could you tell me more about what type of product you're looking for?",
            timestamp: new Date(),
          }
        }
      }
    }

    // Handle removing products from cart
    if (
      lowerMessage.includes("remove") &&
      (lowerMessage.includes("cart") || lowerMessage.includes("box") || lowerMessage.includes("basket"))
    ) {
      const allProducts = [
        ...getProductsByCategory("women"),
        ...getProductsByCategory("laptops"),
        ...getProductsByCategory("kids"),
        ...getProductsByCategory("skincare"),
      ]

      const matchedProducts = allProducts.filter((product) => lowerMessage.includes(product.name.toLowerCase()))

      if (matchedProducts.length > 0 && cartItems.some((item) => item.id === matchedProducts[0].id)) {
        // Remove product from cart
        setCartItems((prev) => prev.filter((item) => item.id !== matchedProducts[0].id))

        // Also update the localStorage
        if (typeof window !== "undefined") {
          const currentCart = JSON.parse(localStorage.getItem("chatbot-cart") || "[]")
          const updatedCart = currentCart.filter((item) => item.id !== matchedProducts[0].id)

          localStorage.setItem("chatbot-cart", JSON.stringify(updatedCart))

          // Also update the selectedProducts for the subscription page
          localStorage.setItem("selectedProducts", JSON.stringify(updatedCart))

          // Calculate and save price information
          const totalRetailPrice = updatedCart.reduce((sum, p) => sum + p.price, 0)
          const boxPrice = Math.round(totalRetailPrice * 0.7) // 30% discount

          localStorage.setItem("boxPrice", boxPrice.toString())
          localStorage.setItem("totalRetailPrice", totalRetailPrice.toString())
        }

        return {
          role: "bot",
          content: `I've removed ${matchedProducts[0].name} from your cart. Is there anything else you'd like to do?`,
          timestamp: new Date(),
        }
      } else {
        return {
          role: "bot",
          content: "I couldn't find that product in your cart. Could you specify which product you'd like to remove?",
          timestamp: new Date(),
        }
      }
    }

    // Handle wishlist functionality
    if (lowerMessage.includes("wishlist") || lowerMessage.includes("like") || lowerMessage.includes("save for later")) {
      const allProducts = [
        ...getProductsByCategory("women"),
        ...getProductsByCategory("laptops"),
        ...getProductsByCategory("kids"),
        ...getProductsByCategory("skincare"),
      ]

      const matchedProducts = allProducts.filter((product) => lowerMessage.includes(product.name.toLowerCase()))

      if (matchedProducts.length > 0) {
        // Add to wishlist
        setWishlistItems((prev) => {
          const newWishlist = [...prev]
          if (!newWishlist.some((item) => item.id === matchedProducts[0].id)) {
            newWishlist.push(matchedProducts[0])
          }
          return newWishlist
        })

        // Also update the localStorage
        if (typeof window !== "undefined") {
          const currentWishlist = JSON.parse(localStorage.getItem("chatbot-wishlist") || "[]")
          const updatedWishlist = [...currentWishlist]

          if (!updatedWishlist.some((item) => item.id === matchedProducts[0].id)) {
            updatedWishlist.push(matchedProducts[0])
          }

          localStorage.setItem("chatbot-wishlist", JSON.stringify(updatedWishlist))
        }

        return {
          role: "bot",
          content: `I've added ${matchedProducts[0].name} to your wishlist! You can view your wishlist in the Wishlist tab. Would you like to continue shopping?`,
          timestamp: new Date(),
        }
      } else {
        return {
          role: "bot",
          content:
            "I'd be happy to add an item to your wishlist. Could you specify which product you'd like to save for later?",
          timestamp: new Date(),
        }
      }
    }

    // Handle subscription management
    if (lowerMessage.includes("subscription") || lowerMessage.includes("manage")) {
      return {
        role: "bot",
        content:
          "You can manage your subscription by visiting the 'Manage Subscription' page. There, you can skip a delivery, update your products, pause or cancel your subscription. Would you like me to take you there now?",
        timestamp: new Date(),
      }
    }

    // Handle order history
    if (lowerMessage.includes("order") && lowerMessage.includes("history")) {
      return {
        role: "bot",
        content:
          "You can view your order history by visiting the 'Order History' page. Would you like me to take you there now?",
        timestamp: new Date(),
      }
    }

    // Handle checkout intent
    if (lowerMessage.includes("checkout") || lowerMessage.includes("subscribe") || lowerMessage.includes("buy")) {
      return {
        role: "bot",
        content:
          "Great! You're ready to checkout with your selected items. You can complete your purchase by clicking the 'Proceed to Checkout' button in your cart, or I can take you there now. Would you like to proceed to checkout?",
        timestamp: new Date(),
      }
    }

    // Handle payment questions
    if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
      return {
        role: "bot",
        content:
          "We accept all major credit cards, PayPal, and Google Pay. Your payment information is securely processed and stored. Would you like to proceed to checkout?",
        timestamp: new Date(),
      }
    }

    // Default response based on conversation stage
    if (stage === "greeting") {
      return {
        role: "bot",
        content:
          "I'm here to help you find the perfect products. Which category would you like to explore? We have women's clothing, laptops, kids' clothing, and skincare products.",
        timestamp: new Date(),
      }
    } else if (stage === "product_recommendation" || stage === "customization") {
      return {
        role: "bot",
        content:
          "Would you like to customize your cart with different products? You can add or remove products, or ask to see alternatives. When you're ready, we can proceed to checkout.",
        timestamp: new Date(),
      }
    } else if (stage === "checkout") {
      return {
        role: "bot",
        content:
          "Is there anything else you'd like to know about your order or our subscription options before proceeding to checkout?",
        timestamp: new Date(),
      }
    }

    // Fallback response
    return {
      role: "bot",
      content:
        "I'm here to help you with your shopping needs. Would you like to explore our products, build a personalized cart, or learn more about our subscription service?",
      timestamp: new Date(),
    }
  }

  // Simple function to update user profile based on message content
  const updateUserProfile = (message: string) => {
    const lowerMessage = message.toLowerCase()

    // Extract preferences
    if (lowerMessage.includes("women") || lowerMessage.includes("woman") || lowerMessage.includes("ladies")) {
      setUserProfile((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), "women"],
      }))
    }

    if (lowerMessage.includes("laptop") || lowerMessage.includes("computer") || lowerMessage.includes("macbook")) {
      setUserProfile((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), "laptops"],
      }))
    }

    if (lowerMessage.includes("kids") || lowerMessage.includes("children") || lowerMessage.includes("child")) {
      setUserProfile((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), "kids"],
      }))
    }

    if (lowerMessage.includes("skin") || lowerMessage.includes("beauty") || lowerMessage.includes("skincare")) {
      setUserProfile((prev) => ({
        ...prev,
        categories: [...(prev.categories || []), "skincare"],
      }))
    }

    // Extract skin type
    if (lowerMessage.includes("dry skin")) {
      setUserProfile((prev) => ({ ...prev, skinType: "dry" }))
    } else if (lowerMessage.includes("oily skin")) {
      setUserProfile((prev) => ({ ...prev, skinType: "oily" }))
    } else if (lowerMessage.includes("combination skin")) {
      setUserProfile((prev) => ({ ...prev, skinType: "combination" }))
    } else if (lowerMessage.includes("normal skin")) {
      setUserProfile((prev) => ({ ...prev, skinType: "normal" }))
    } else if (lowerMessage.includes("sensitive skin")) {
      setUserProfile((prev) => ({ ...prev, skinType: "sensitive" }))
    }

    // Extract concerns
    const concerns: string[] = []
    if (lowerMessage.includes("acne")) concerns.push("acne")
    if (lowerMessage.includes("aging") || lowerMessage.includes("wrinkle")) concerns.push("aging")
    if (lowerMessage.includes("dark spot") || lowerMessage.includes("hyperpigmentation"))
      concerns.push("hyperpigmentation")
    if (lowerMessage.includes("redness")) concerns.push("redness")
    if (lowerMessage.includes("dryness") || lowerMessage.includes("dehydrated")) concerns.push("dryness")
    if (lowerMessage.includes("oiliness") || lowerMessage.includes("greasy")) concerns.push("oiliness")

    if (concerns.length > 0) {
      setUserProfile((prev) => ({
        ...prev,
        concerns: [...(prev.concerns || []), ...concerns].filter((v, i, a) => a.indexOf(v) === i),
      }))
    }

    // Extract age range
    if (lowerMessage.includes("20s")) {
      setUserProfile((prev) => ({ ...prev, ageRange: "20s" }))
    } else if (lowerMessage.includes("30s")) {
      setUserProfile((prev) => ({ ...prev, ageRange: "30s" }))
    } else if (lowerMessage.includes("40s")) {
      setUserProfile((prev) => ({ ...prev, ageRange: "40s" }))
    } else if (lowerMessage.includes("50s") || lowerMessage.includes("50+")) {
      setUserProfile((prev) => ({ ...prev, ageRange: "50+" }))
    }

    // Extract preferences
    const preferences: string[] = []
    if (lowerMessage.includes("natural")) preferences.push("natural")
    if (lowerMessage.includes("vegan")) preferences.push("vegan")
    if (lowerMessage.includes("cruelty-free") || lowerMessage.includes("cruelty free")) preferences.push("cruelty-free")
    if (lowerMessage.includes("fragrance-free") || lowerMessage.includes("fragrance free"))
      preferences.push("fragrance-free")
    if (lowerMessage.includes("organic")) preferences.push("organic")
    if (lowerMessage.includes("clean beauty")) preferences.push("clean beauty")

    if (preferences.length > 0) {
      setUserProfile((prev) => ({
        ...prev,
        preferences: [...(prev.preferences || []), ...preferences].filter((v, i, a) => a.indexOf(v) === i),
      }))
    }
  }

  const handleCreateBox = () => {
    setIsOpen(false)
    router.push("/subscription")
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Enhance the chatbot to be the central point for all product interactions
  // Update the addToCart function to be more prominent

  const addToCart = (product: Product) => {
    // Check if product is already in cart to avoid duplicates
    if (!cartItems.some((item) => item.id === product.id)) {
      // Add product to cart
      setCartItems((prev) => [...prev, product])

      // Show confirmation message
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `I've added ${product.name} to your cart! Would you like to add anything else or proceed to checkout?`,
          timestamp: new Date(),
        },
      ])

      // Show toast notification
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } else {
      // Product is already in cart
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `${product.name} is already in your cart. Would you like to add something else or proceed to checkout?`,
          timestamp: new Date(),
        },
      ])

      // Show toast notification
      toast({
        title: "Already in cart",
        description: `${product.name} is already in your cart.`,
      })
    }
  }

  const removeFromCart = (product: Product) => {
    // Remove product from cart
    setCartItems((prev) => prev.filter((item) => item.id !== product.id))

    // Show confirmation message
    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: `I've removed ${product.name} from your cart. Is there anything else you'd like to do?`,
        timestamp: new Date(),
      },
    ])

    // Show toast notification
    toast({
      title: "Removed from cart",
      description: `${product.name} has been removed from your cart.`,
    })
  }

  const addToWishlist = (product: Product) => {
    // Check if product is already in wishlist
    if (!wishlistItems.some((item) => item.id === product.id)) {
      // Add product to wishlist
      setWishlistItems((prev) => [...prev, product])

      // Show confirmation message
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `I've added ${product.name} to your wishlist! You can view your saved items in the Wishlist tab. Would you like to continue shopping?`,
          timestamp: new Date(),
        },
      ])

      // Show toast notification
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    } else {
      // Product is already in wishlist
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `${product.name} is already in your wishlist. Would you like to add it to your cart instead?`,
          timestamp: new Date(),
        },
      ])

      // Show toast notification
      toast({
        title: "Already in wishlist",
        description: `${product.name} is already in your wishlist.`,
      })
    }
  }

  // Updated handleViewAlternatives function to properly toggle between recommended and alternative products
  const handleViewAlternatives = (index: number) => {
    const message = messages[index]

    if (!message || !message.category) return

    // Toggle showing alternatives for this specific message
    setCurrentMessageIndex(index)
    setShowingAlternatives(!showingAlternatives)

    if (!showingAlternatives) {
      // Show alternative products
      const alternativeProducts = getProductsByCategory(message.category)
        .filter((p) => !p.popular)
        .slice(0, 3)

      // Update the message with alternative products
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[index] = {
          ...newMessages[index],
          products: alternativeProducts,
          content: `Here are some alternative ${message.category} products you might like:`,
        }
        return newMessages
      })
    } else {
      // Show original recommended products
      const recommendedProducts = getProductsByCategory(message.category)
        .filter((p) => p.popular)
        .slice(0, 3)

      // Update the message with recommended products
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages[index] = {
          ...newMessages[index],
          products: recommendedProducts,
          content: `Here are some popular ${message.category} products from our collection:`,
        }
        return newMessages
      })
    }
  }

  // Add this helper function to get alternative products
  const getAlternativeProducts = () => {
    // This would typically come from an API, but for demo purposes we'll just create some alternatives
    const alternatives = [
      {
        id: "alt1",
        name: "Alternative Moisturizer",
        price: 32.99,
        image: "/images/moisturizer.jpeg",
        description: "A lightweight, oil-free moisturizer for sensitive skin",
      },
      {
        id: "alt2",
        name: "Alternative Serum",
        price: 48.99,
        image: "/images/serum.jpeg",
        description: "Vitamin C serum for brightening and evening skin tone",
      },
      {
        id: "alt3",
        name: "Alternative Cleanser",
        price: 24.99,
        image: "/images/cleanser.webp",
        description: "Gentle foaming cleanser for all skin types",
      },
    ]
    return alternatives
  }

  const handleBackToRecommended = () => {
    setViewingAlternatives(false)

    if (!currentCategory) return

    // Get the top recommended products for the current category
    const recommendedProducts = getProductsByCategory(currentCategory)
      .filter((p) => p.popular)
      .slice(0, 3)

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: `Here are our top recommended ${currentCategory} products:`,
        timestamp: new Date(),
        products: recommendedProducts,
        category: currentCategory,
      },
    ])
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Your cart is empty. Let me help you find some products to add first!",
          timestamp: new Date(),
        },
      ])
      return
    }

    setIsCheckoutOpen(true)

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: "Great! I've opened the checkout page for you. You can review your items and complete your purchase.",
        timestamp: new Date(),
      },
    ])
  }

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before placing an order.",
        variant: "destructive",
      })
      return
    }

    // Show loading state
    setIsLoading(true)

    // Generate a unique order ID
    const orderId = `ORD-${Math.floor(Math.random() * 10000)}`
    const orderDate = new Date().toISOString()

    // Create a new order
    const newOrder = {
      id: orderId,
      date: orderDate,
      status: "Processing", // Explicitly set status
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || "/placeholder.svg?height=200&width=300",
        quantity: 1,
        category: item.category || "other",
      })),
      total: cartItems.reduce((sum, item) => sum + item.price, 0),
      shippingAddress: "Default Address",
      categories: [...new Set(cartItems.map((item) => item.category || "other"))],
    }

    // Create order details for success page
    const orderDetails = {
      orderId: orderId,
      orderDate: orderDate,
      products: cartItems.map((item) => ({
        ...item,
        image: item.image || "/placeholder.svg?height=200&width=300",
        category: item.category || "other",
      })),
      boxPrice: Math.round(newOrder.total * 0.7),
      totalRetailPrice: newOrder.total,
      subscriptionPlan: "Monthly",
      deliveryFrequency: "Every month",
      totalPrice: newOrder.total.toFixed(2),
      savings: (newOrder.total * 0.3).toFixed(2),
      customerName: "Customer",
      customerEmail: "customer@example.com",
      shippingAddress: "Default Address",
      paymentMethod: "credit-card",
      status: "Processing", // Explicitly set status
    }

    // DIRECT SAVE TO LOCALSTORAGE - Ensure the order is saved immediately
    try {
      // Get current orders
      const currentOrders = JSON.parse(localStorage.getItem("order-history") || "[]")

      // Check if order already exists (prevent duplicates)
      const orderExists = currentOrders.some((order) => order.id === orderId)
      if (!orderExists) {
        // Add new order to the beginning
        const updatedOrders = [newOrder, ...currentOrders]

        // Save directly to localStorage
        localStorage.setItem("order-history", JSON.stringify(updatedOrders))
        console.log("Order directly saved to localStorage from chatbot:", newOrder)
        console.log("Updated order history from chatbot:", updatedOrders)

        // Also save order details
        localStorage.setItem("orderDetails", JSON.stringify(orderDetails))

        // Dispatch events to notify other components
        window.dispatchEvent(
          new CustomEvent("order-history-updated", {
            detail: { orders: updatedOrders },
          }),
        )

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "order-history",
            newValue: JSON.stringify(updatedOrders),
            storageArea: localStorage,
          }),
        )
      } else {
        console.log("Order already exists, not adding duplicate:", orderId)
      }
    } catch (error) {
      console.error("Error directly saving order to localStorage from chatbot:", error)
    }

    // Also use the utility functions as a backup
    addOrderToHistory(newOrder)
    saveOrderDetails(orderDetails)

    // Simulate API call
    setTimeout(() => {
      // Clear cart
      setCartItems([])
      localStorage.removeItem("chatbot-cart")
      localStorage.removeItem("selectedProducts")

      // Close checkout
      setIsCheckoutOpen(false)
      setIsLoading(false)

      // Show confirmation message
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: `Your order has been placed successfully! Your order ID is ${newOrder.id}. You can view your order details in the Order History tab.`,
          timestamp: new Date(),
        },
      ])

      // Show toast notification
      toast({
        title: "Order placed successfully!",
        description: `Your order #${newOrder.id} has been placed and will be processed shortly.`,
      })

      // Navigate to confirmation page
      router.push("/checkout/success")
    }, 1500)
  }

  const handleViewOrderHistory = () => {
    setIsOrderHistoryOpen(true)

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: "I've opened your order history. You can view all your past orders here.",
        timestamp: new Date(),
      },
    ])
  }

  const handleManageSubscription = () => {
    setIsSubscriptionOpen(true)

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: "I've opened the subscription management page. You can manage your subscription settings here.",
        timestamp: new Date(),
      },
    ])
  }

  const handleSkipDelivery = () => {
    // Calculate next month's date
    const currentDate = new Date(nextDeliveryDate)
    currentDate.setMonth(currentDate.getMonth() + 1)
    const newDeliveryDate = currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    setNextDeliveryDate(newDeliveryDate)

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content: `I've skipped your next delivery. Your next box will now arrive on ${newDeliveryDate}.`,
        timestamp: new Date(),
      },
    ])

    toast({
      title: "Delivery Skipped",
      description: `Your next delivery is now scheduled for ${newDeliveryDate}.`,
    })
  }

  const handlePauseSubscription = () => {
    setSubscriptionStatus(subscriptionStatus === "paused" ? "active" : "paused")

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content:
          subscriptionStatus === "paused"
            ? "I've resumed your subscription. You'll continue receiving your boxes as scheduled."
            : "I've paused your subscription. You won't receive any boxes until you resume.",
        timestamp: new Date(),
      },
    ])

    toast({
      title: subscriptionStatus === "paused" ? "Subscription Resumed" : "Subscription Paused",
      description:
        subscriptionStatus === "paused"
          ? "Your subscription has been successfully resumed."
          : "Your subscription has been paused. You can resume it at any time.",
    })
  }

  const handleCancelSubscription = () => {
    setSubscriptionStatus("cancelled")

    setMessages((prev) => [
      ...prev,
      {
        role: "bot",
        content:
          "I've cancelled your subscription. We're sorry to see you go! If you change your mind, you can always start a new subscription.",
        timestamp: new Date(),
      },
    ])

    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled.",
    })
  }

  const handleCategoryRequest = (category: string) => {
    setInput(`Show me ${category} products`)
    setTimeout(() => handleSendMessage(), 100)
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

      {/* Quick category buttons for direct product viewing */}
      <div className="fixed bottom-24 right-6 flex flex-col gap-2 z-50">
        <Button
          onClick={() => {
            setIsOpen(true)
            showProductsDirectly("women")
          }}
          className="rounded-full bg-pink-500 hover:bg-pink-600 shadow-md"
          aria-label="Women's clothing"
        >
          Women
        </Button>
        <Button
          onClick={() => {
            setIsOpen(true)
            showProductsDirectly("laptops")
          }}
          className="rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
          aria-label="Laptops"
        >
          Laptops
        </Button>
        <Button
          onClick={() => {
            setIsOpen(true)
            showProductsDirectly("kids")
          }}
          className="rounded-full bg-purple-500 hover:bg-purple-600 shadow-md"
          aria-label="Kids' clothing"
        >
          Kids
        </Button>
        <Button
          onClick={() => {
            setIsOpen(true)
            showProductsDirectly("skincare")
          }}
          className="rounded-full bg-green-500 hover:bg-green-600 shadow-md"
          aria-label="Skincare products"
        >
          Skincare
        </Button>
      </div>

      {/* Chat dialog */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full">
          <SheetHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4 flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <SheetTitle className="text-white">AI Shopping Assistant</SheetTitle>
            </div>
            <SheetClose className="text-white hover:text-white/80">
              <X className="h-5 w-5" />
            </SheetClose>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    {message.role === "bot" && (
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

                  {/* Product recommendations */}
                  {message.products && message.products.length > 0 && (
                    <div className="ml-10 mt-2 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-500">
                          {message.category
                            ? `${message.category.charAt(0).toUpperCase() + message.category.slice(1)} products:`
                            : "Recommended products:"}
                        </p>
                        {message.category && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => handleViewAlternatives(index)}
                          >
                            {currentMessageIndex === index && showingAlternatives ? (
                              <>
                                <ChevronLeft className="h-3 w-3 mr-1" />
                                Back to Recommended
                              </>
                            ) : (
                              <>
                                View More Products
                                <ChevronRight className="h-3 w-3 ml-1" />
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {message.products.map((product) => (
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
                            <p className="text-xs text-gray-500 truncate">{product.description}</p>
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
                  onClick={() => handleCategoryRequest("women's")}
                >
                  Women's Clothing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-blue-200 hover:bg-blue-50"
                  onClick={() => handleCategoryRequest("laptop")}
                >
                  Laptops
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-200 hover:bg-purple-50"
                  onClick={() => handleCategoryRequest("kids")}
                >
                  Kids' Clothing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-green-200 hover:bg-green-50"
                  onClick={() => handleCategoryRequest("skincare")}
                >
                  Skincare
                </Button>
              </div>
            </div>

            <div className="flex justify-between mt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setIsCartOpen(true)}
                disabled={cartItems.length === 0}
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                Cart ({cartItems.length})
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={handleViewOrderHistory}>
                <Package className="h-3 w-3 mr-1" />
                Order History
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={handleManageSubscription}>
                <Calendar className="h-3 w-3 mr-1" />
                Manage Subscription
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
          </DialogHeader>
          {cartItems.length === 0 ? (
            <div className="text-center py-6">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add products to your cart to see them here</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {cartItems.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 p-2 border rounded-md">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-500">${product.price}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeFromCart(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total:</p>
                  <p className="font-bold">${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</p>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Checkout</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Order Summary</h3>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {cartItems.map((product) => (
                  <div key={product.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="relative h-10 w-10 rounded-md overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                    </div>
                    <p className="font-medium">${product.price}</p>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${(cartItems.reduce((sum, item) => sum + item.price, 0) * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  $
                  {(
                    cartItems.reduce((sum, item) => sum + item.price, 0) +
                    5.99 +
                    cartItems.reduce((sum, item) => sum + item.price, 0) * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Shipping Details</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input id="full-name" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div className="space-y-1 col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Payment Method</h3>
              <RadioGroup defaultValue="credit-card" className="space-y-2">
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    Credit Card
                  </label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="Credit Card" width={36} height={24} />
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <label htmlFor="paypal" className="flex-1 cursor-pointer">
                    PayPal
                  </label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="PayPal" width={36} height={24} />
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="google-pay" id="google-pay" />
                  <label htmlFor="google-pay" className="flex-1 cursor-pointer">
                    Google Pay
                  </label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="Google Pay" width={36} height={24} />
                </div>
              </RadioGroup>
            </div>
            <DialogFooter className="flex justify-between items-center mt-4">
              <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700 px-6 py-2 text-base font-medium"
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order History Dialog */}
      <Dialog open={isOrderHistoryOpen} onOpenChange={setIsOrderHistoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Order History</DialogTitle>
          </DialogHeader>
          {orderHistory.length === 0 ? (
            <div className="text-center py-6">
              <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500">No orders yet</p>
              <p className="text-sm text-gray-400 mt-2">Your order history will appear here</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {orderHistory.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        className={
                          order.status === "Delivered"
                            ? "bg-green-600"
                            : order.status === "Shipped"
                              ? "bg-blue-600"
                              : "bg-amber-600"
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <div className="relative h-8 w-8 rounded-md overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <p className="text-xs flex-1">{item.name}</p>
                          <p className="text-xs font-medium">${item.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">Total:</p>
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Subscription Management Dialog */}
      <Dialog open={isSubscriptionOpen} onOpenChange={setIsSubscriptionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Subscription</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Subscription Status</p>
                  <p className="text-sm text-gray-500">Your subscription is currently {subscriptionStatus}</p>
                </div>
                <Badge
                  className={
                    subscriptionStatus === "active"
                      ? "bg-green-600"
                      : subscriptionStatus === "paused"
                        ? "bg-amber-600"
                        : "bg-red-600"
                  }
                >
                  {subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Next Delivery</p>
                  <p className="text-sm text-gray-500">{nextDeliveryDate}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSkipDelivery}
                  disabled={subscriptionStatus !== "active"}
                >
                  Skip
                </Button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <p className="font-medium mb-2">Subscription Products</p>
              <div className="space-y-2 max-h-[150px] overflow-y-auto">
                {cartItems.length > 0 ? (
                  cartItems.map((product) => (
                    <div key={product.id} className="flex items-center gap-2">
                      <div className="relative h-8 w-8 rounded-md overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs flex-1">{product.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500"
                        onClick={() => removeFromCart(product)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No products in your subscription</p>
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseSubscription}
                  disabled={subscriptionStatus === "cancelled"}
                >
                  {subscriptionStatus === "paused" ? "Resume" : "Pause"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={subscriptionStatus === "cancelled"}
                >
                  Cancel
                </Button>
              </div>
              <Button onClick={() => setIsSubscriptionOpen(false)}>Close</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Utility function to add order to history
const addOrderToHistoryFunc = (newOrder: any) => {
  const currentHistory = JSON.parse(localStorage.getItem("order-history") || "[]")
  localStorage.setItem("order-history", JSON.stringify([newOrder, ...currentHistory]))
}

// Utility function to save order details
const saveOrderDetailsFunc = (orderDetails: any) => {
  localStorage.setItem("orderDetails", JSON.stringify(orderDetails))
}

// Utility function to add order to history
const addOrderToHistory = (newOrder: any) => {
  const currentHistory = JSON.parse(localStorage.getItem("order-history") || "[]")
  localStorage.setItem("order-history", JSON.stringify([newOrder, ...currentHistory]))

  // Dispatch storage event to notify other tabs/windows
  window.dispatchEvent(new Event("storage"))
  console.log("Order history updated from chatbot:", [newOrder, ...currentHistory])
}

// Utility function to save order details
const saveOrderDetails = (orderDetails: any) => {
  localStorage.setItem("orderDetails", JSON.stringify(orderDetails))

  // Dispatch storage event to notify other tabs/windows
  window.dispatchEvent(new Event("storage"))
}

// Utility function to get order history
const getOrderHistory = () => {
  return JSON.parse(localStorage.getItem("order-history") || "[]")
}

