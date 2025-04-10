"use client"

import { useSearchParams } from "next/navigation"
import BeautyBoxBuilder from "@/components/beauty-box-builder"
import ChatbotWidget from "@/components/chatbot-widget"

export default function SubscriptionPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "women"

  // Pass the category to the BeautyBoxBuilder component
  return (
    <main className="min-h-screen bg-gray-50">
      <BeautyBoxBuilder initialCategory={category} />
      <ChatbotWidget />
    </main>
  )
}

