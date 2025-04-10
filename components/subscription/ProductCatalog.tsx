"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus } from "lucide-react"
import type { SubscriptionProduct } from "@/lib/types"

interface ProductCatalogProps {
  currentProducts: SubscriptionProduct[]
  onAddProduct: (product: SubscriptionProduct) => void
}

export function ProductCatalog({ currentProducts, onAddProduct }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample products for each category
  const catalogProducts = {
    women: [
      {
        id: "women-001",
        name: "Floral Summer Dress",
        price: 49.99,
        image: "/images/women/women1.jpeg",
        category: "women",
        description: "Lightweight floral dress perfect for summer days.",
      },
      {
        id: "women-002",
        name: "Classic Denim Jacket",
        price: 59.99,
        image: "/images/women/women2.jpeg",
        category: "women",
        description: "Versatile denim jacket that pairs with any outfit.",
      },
      {
        id: "women-003",
        name: "Casual White Blouse",
        price: 34.99,
        image: "/images/women/women3.jpeg",
        category: "women",
        description: "Elegant white blouse for casual or office wear.",
      },
      {
        id: "women-004",
        name: "Black Leather Handbag",
        price: 79.99,
        image: "/images/women/women4.jpeg",
        category: "women",
        description: "Stylish leather handbag with multiple compartments.",
      },
      {
        id: "women-005",
        name: "Striped Maxi Skirt",
        price: 45.99,
        image: "/images/women/women5.jpeg",
        category: "women",
        description: "Comfortable striped maxi skirt for everyday wear.",
      },
    ],
    men: [
      {
        id: "men-001",
        name: "Classic Oxford Shirt",
        price: 45.99,
        image: "/images/men/men1.jpeg",
        category: "men",
        description: "Timeless oxford shirt suitable for any occasion.",
      },
      {
        id: "men-002",
        name: "Slim Fit Chinos",
        price: 49.99,
        image: "/images/men/men2.jpeg",
        category: "men",
        description: "Comfortable slim fit chinos in versatile khaki color.",
      },
      {
        id: "men-003",
        name: "Casual Denim Jacket",
        price: 69.99,
        image: "/images/men/men3.jpeg",
        category: "men",
        description: "Rugged denim jacket with a modern fit.",
      },
      {
        id: "men-004",
        name: "Leather Belt",
        price: 29.99,
        image: "/images/men/men4.jpeg",
        category: "men",
        description: "Premium leather belt with classic buckle.",
      },
      {
        id: "men-005",
        name: "Wool Blend Sweater",
        price: 59.99,
        image: "/images/men/men5.jpeg",
        category: "men",
        description: "Warm wool blend sweater for colder days.",
      },
    ],
    kids: [
      {
        id: "kids-001",
        name: "Colorful T-Shirt Set",
        price: 24.99,
        image: "/images/kids/kids1.jpeg",
        category: "kids",
        description: "Set of 3 colorful t-shirts for active kids.",
      },
      {
        id: "kids-002",
        name: "Denim Overalls",
        price: 34.99,
        image: "/images/kids/kids2.jpeg",
        category: "kids",
        description: "Cute and durable denim overalls for everyday play.",
      },
      {
        id: "kids-003",
        name: "Printed Pajama Set",
        price: 29.99,
        image: "/images/kids/kids3.jpeg",
        category: "kids",
        description: "Soft cotton pajama set with fun prints.",
      },
      {
        id: "kids-004",
        name: "Winter Jacket",
        price: 49.99,
        image: "/images/kids/kids4.jpeg",
        category: "kids",
        description: "Warm winter jacket with hood and pockets.",
      },
      {
        id: "kids-005",
        name: "School Backpack",
        price: 39.99,
        image: "/images/kids/kids5.jpeg",
        category: "kids",
        description: "Durable backpack with multiple compartments for school supplies.",
      },
    ],
    skincare: [
      {
        id: "skin-004",
        name: "Hydrating Face Mask",
        price: 24.99,
        image: "/images/skincare.jpeg",
        category: "skincare",
        description: "Deeply hydrating face mask for all skin types.",
      },
      {
        id: "skin-005",
        name: "Vitamin C Toner",
        price: 32.99,
        image: "/images/skincare-blue.webp",
        category: "skincare",
        description: "Brightening toner with Vitamin C for radiant skin.",
      },
      {
        id: "skin-006",
        name: "Anti-Aging Night Cream",
        price: 54.99,
        image: "/images/skincare-woman.webp",
        category: "skincare",
        description: "Rich night cream that reduces fine lines and wrinkles.",
      },
      {
        id: "skin-007",
        name: "Exfoliating Scrub",
        price: 28.99,
        image: "/images/facial-cleansers.jpeg",
        category: "skincare",
        description: "Gentle exfoliating scrub to remove dead skin cells.",
      },
      {
        id: "skin-008",
        name: "SPF 50 Sunscreen",
        price: 22.99,
        image: "/images/skincare-set.jpeg",
        category: "skincare",
        description: "Broad-spectrum SPF 50 sunscreen for daily protection.",
      },
    ],
  }

  // Check if a product is already in the subscription
  const isProductInSubscription = (productId: string) => {
    return currentProducts.some((product) => product.id === productId)
  }

  // Filter products based on search query
  const filterProducts = (products: SubscriptionProduct[]) => {
    if (!searchQuery) return products

    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query),
    )
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="women">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="women">Women</TabsTrigger>
          <TabsTrigger value="men">Men</TabsTrigger>
          <TabsTrigger value="kids">Kids</TabsTrigger>
          <TabsTrigger value="skincare">Skincare</TabsTrigger>
        </TabsList>

        {Object.entries(catalogProducts).map(([category, products]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filterProducts(products).map((product) => (
                <div key={product.id} className="border rounded-md overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">${product.price.toFixed(2)}</p>
                      </div>
                      <Badge>{product.category}</Badge>
                    </div>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                    )}
                    <Button
                      className="w-full mt-3"
                      onClick={() => onAddProduct(product)}
                      disabled={isProductInSubscription(product.id)}
                      variant={isProductInSubscription(product.id) ? "outline" : "default"}
                    >
                      {isProductInSubscription(product.id) ? (
                        "Already Added"
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-1" />
                          Add to Box
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}

              {filterProducts(products).length === 0 && (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-gray-500">No products found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

