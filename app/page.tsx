"use client"

import { useEffect } from "react"
import Hero from "@/components/hero"
import FeaturedBoxes from "@/components/featured-boxes"
import CategorySelector from "@/components/category-selector"
import Footer from "@/components/footer"
import ClothingCategories from "@/components/clothing-categories"
import AIChatInterface from "@/components/ai-chat-interface"
import ChatbotWidget from "@/components/chatbot-widget"
import { getOrderHistory } from "@/lib/order-utils"

export default function Home() {
  // Add this effect to ensure order history is preserved when navigating to home page
  useEffect(() => {
    // This is just to ensure we don't accidentally clear localStorage
    // when navigating to the home page
    if (typeof window !== "undefined") {
      // Load order history from localStorage to ensure it's not cleared
      const savedOrders = getOrderHistory()
      if (savedOrders.length > 0) {
        console.log("Order history loaded successfully on home page:", savedOrders)

        // Ensure all orders have a status
        const allHaveStatus = savedOrders.every((order) => !!order.status)
        if (!allHaveStatus) {
          console.log("Some orders are missing status, fixing...")
          // Fix any orders without status
          const fixedOrders = savedOrders.map((order) => ({
            ...order,
            status: order.status || "Processing", // Default to Processing if status is missing
          }))

          // Save the fixed orders back to localStorage
          localStorage.setItem("order-history", JSON.stringify(fixedOrders))

          // Dispatch storage event to notify other tabs/windows
          window.dispatchEvent(
            new StorageEvent("storage", {
              key: "order-history",
              newValue: JSON.stringify(fixedOrders),
              storageArea: localStorage,
            }),
          )
        }
      }

      // Add event listener for custom order history updates
      const handleOrderHistoryUpdate = (event: CustomEvent) => {
        console.log("Order history updated event received in home page:", event.detail)
      }

      // Add event listener for storage changes from other tabs/windows
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === "order-history") {
          console.log("Order history storage changed in another tab/window")
        }
      }

      window.addEventListener("order-history-updated", handleOrderHistoryUpdate as EventListener)
      window.addEventListener("storage", handleStorageChange)

      // Clean up
      return () => {
        window.removeEventListener("order-history-updated", handleOrderHistoryUpdate as EventListener)
        window.removeEventListener("storage", handleStorageChange)
      }
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <FeaturedBoxes />
        <ClothingCategories />
        <CategorySelector />
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">AI Shopping Assistant</h2>
            <p className="text-gray-600 mb-4">
              Our AI-powered shopping assistant helps you find the perfect products based on your preferences. Try
              asking about specific products, get personalized recommendations, or build your subscription box.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Get personalized product recommendations</li>
              <li>Ask questions about products and features</li>
              <li>Build your custom subscription box</li>
              <li>Manage your subscription preferences</li>
            </ul>
          </div>
          <div>
            <AIChatInterface />
          </div>
        </div>
      </div>
      <Footer />
      <ChatbotWidget />
    </main>
  )
}

