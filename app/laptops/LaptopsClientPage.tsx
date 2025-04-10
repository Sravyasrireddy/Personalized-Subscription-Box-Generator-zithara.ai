"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductsByCategory } from "@/lib/products"

export default function LaptopsClientPage() {
  // Get all laptop products
  const laptopProducts = getProductsByCategory("laptops") || []

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Laptops Collection</h1>
      </div>

      {laptopProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {laptopProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-64 w-full">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.benefits && product.benefits.length > 0 ? (
                    product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">${product.price}</span>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // Trigger AI chatbot to open
                      const event = new CustomEvent("open-chatbot")
                      window.dispatchEvent(event)
                    }}
                  >
                    Ask AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No laptop products available at the moment.</p>
          <p className="text-gray-400 mt-2">Please check back later or explore our other collections.</p>
          <Button className="mt-6" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      )}
    </main>
  )
}

