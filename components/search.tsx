"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Product {
  id: number | string
  name: string
  price: number
  image: string
  description: string
  category: string
}

export default function Search() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Sample product data - in a real app, this would come from an API
  const products: Product[] = [
    {
      id: 1,
      name: "Pink Embroidered Anarkali Dress",
      price: 89,
      image: "/images/women/women1.jpeg",
      description: "Beautiful pink anarkali with gold embroidery",
      category: "women",
    },
    {
      id: 2,
      name: "Pink Chanderi Suit Set",
      price: 75,
      image: "/images/women/women2.jpeg",
      description: "Elegant pink suit with golden border details",
      category: "women",
    },
    {
      id: 3,
      name: "Purple Banarasi Anarkali",
      price: 110,
      image: "/images/women/women3.jpeg",
      description: "Stunning purple anarkali with rich border",
      category: "women",
    },
    {
      id: 4,
      name: "Beige Embroidered Kurta",
      price: 65,
      image: "/images/men/men1.jpeg",
      description: "Elegant beige kurta with subtle embroidery",
      category: "men",
    },
    {
      id: 5,
      name: "Mint Green Blazer",
      price: 95,
      image: "/images/men/men2.jpeg",
      description: "Stylish mint green blazer for formal occasions",
      category: "men",
    },
    {
      id: 6,
      name: "Kids Festival Collection",
      price: 45,
      image: "/images/kids/kids1.jpeg",
      description: "Festive wear for kids in various colors",
      category: "kids",
    },
    {
      id: 7,
      name: "Girls Summer Dresses",
      price: 35,
      image: "/images/kids/kids2.jpeg",
      description: "Set of colorful summer dresses for girls",
      category: "kids",
    },
    {
      id: 8,
      name: "Hydrating Serum",
      price: 45,
      image: "/images/serum.jpeg",
      description: "Intense moisture for all skin types",
      category: "skincare",
    },
    {
      id: 9,
      name: "Vitamin C Moisturizer",
      price: 38,
      image: "/images/moisturizer.jpeg",
      description: "Brightens and firms skin",
      category: "skincare",
    },
    {
      id: 10,
      name: "Olay Total Effects Cleanser",
      price: 32,
      image: "/images/cleanser.webp",
      description: "7-in-1 nourishing formula",
      category: "skincare",
    },
  ]

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsLoading(true)
      // Simulate API call with setTimeout
      setTimeout(() => {
        const results = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(results)
        setShowResults(true)
        setIsLoading(false)
      }, 300)
    } else {
      setShowResults(false)
    }
  }, [searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleProductClick = (productId: number | string) => {
    // In a real app, you would navigate to the product page
    toast({
      title: "Product Selected",
      description: "You selected a product. In a complete app, this would navigate to the product page.",
    })
    setShowResults(false)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="w-full flex items-center relative">
        <Input
          type="search"
          placeholder="Search products..."
          className="w-full rounded-full pr-10 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 text-gray-500 hover:text-pink-600"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full mt-1 w-full z-50 max-h-[400px] overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">${product.price}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && searchResults.length === 0 && !isLoading && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-gray-500">No products found</p>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <Card className="absolute top-full mt-1 w-full z-50 shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-pink-600 animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div
                className="w-2 h-2 rounded-full bg-pink-600 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-pink-600 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

