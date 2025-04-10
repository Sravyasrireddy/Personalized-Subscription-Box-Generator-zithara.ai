"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { getProductsByCategory } from "@/lib/products"
import { ToastAction } from "@/components/ui/toast"

export default function ClothingCategories() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("women")
  const [wishlist, setWishlist] = useState<string[]>([])
  const [cart, setCart] = useState<string[]>([])

  // Get products for each category
  const womenProducts = getProductsByCategory("women")?.slice(0, 3) || []
  const laptopProducts = getProductsByCategory("laptops")?.slice(0, 3) || []
  const kidsProducts = getProductsByCategory("kids")?.slice(0, 3) || []
  const skincareProducts = getProductsByCategory("skincare")?.slice(0, 3) || []

  // Add debugging to check if products are being loaded correctly
  useEffect(() => {
    console.log(`Active category: ${activeCategory}`)
    console.log("Laptop Products:", laptopProducts)
    console.log("Women Products:", womenProducts)
    console.log("Kids Products:", kidsProducts)
    console.log("Skincare Products:", skincareProducts)
  }, [activeCategory, laptopProducts, womenProducts, kidsProducts, skincareProducts])

  // Update the ClothingCategories component to use AI for product interactions
  const handleAddToCart = (productId: string, productName: string) => {
    // Instead of directly adding to cart, show a message to use the AI
    toast({
      title: "Use AI Assistant",
      description: `Please ask our AI assistant to add ${productName} to your cart.`,
      action: (
        <ToastAction
          altText="Open AI"
          onClick={() => {
            // Here we would trigger the AI chatbot to open
            const event = new CustomEvent("open-chatbot")
            window.dispatchEvent(event)

            toast({
              title: "AI Assistant",
              description: `Ask our AI about ${productName} to add it to your cart.`,
            })
          }}
        >
          Open AI
        </ToastAction>
      ),
    })
  }

  const handleAddToWishlist = (productId: string, productName: string) => {
    if (!wishlist.includes(productId)) {
      setWishlist([...wishlist, productId])

      // Save to localStorage
      if (typeof window !== "undefined") {
        const currentWishlist = JSON.parse(localStorage.getItem("chatbot-wishlist") || "[]")
        const product = getProductsByCategory(activeCategory).find((p) => p.id === productId)

        if (product && !currentWishlist.some((item: any) => item.id === productId)) {
          const updatedWishlist = [...currentWishlist, product]
          localStorage.setItem("chatbot-wishlist", JSON.stringify(updatedWishlist))
        }
      }

      toast({
        title: "Added to wishlist",
        description: `${productName} has been added to your wishlist.`,
      })
    } else {
      setWishlist(wishlist.filter((id) => id !== productId))

      // Remove from localStorage
      if (typeof window !== "undefined") {
        const currentWishlist = JSON.parse(localStorage.getItem("chatbot-wishlist") || "[]")
        const updatedWishlist = currentWishlist.filter((item: any) => item.id !== productId)
        localStorage.setItem("chatbot-wishlist", JSON.stringify(updatedWishlist))
      }

      toast({
        title: "Removed from wishlist",
        description: `${productName} has been removed from your wishlist.`,
      })
    }
  }

  return (
    <div className="mt-16">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        Explore Our Collections
      </motion.h2>

      <Tabs defaultValue="women" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All Collections</TabsTrigger>
          <TabsTrigger value="women">Women's Collection</TabsTrigger>
          <TabsTrigger value="laptops">Laptops</TabsTrigger>
          <TabsTrigger value="kids">Kids' Collection</TabsTrigger>
          <TabsTrigger value="skincare">Skincare</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-pink-50 to-pink-100">
              <div className="p-6">
                <h3 className="font-bold text-xl text-pink-700 mb-2">Women's Collection</h3>
                <p className="text-gray-600 mb-4">Curated fashion essentials for the modern woman</p>
                <Button
                  className="bg-pink-600 hover:bg-pink-700"
                  onClick={() => router.push("/subscription?category=women")}
                >
                  Explore
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="p-6">
                <h3 className="font-bold text-xl text-blue-700 mb-2">Laptops Collection</h3>
                <p className="text-gray-600 mb-4">High-performance laptops for work and play</p>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/subscription/laptops")}>
                  Explore
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="p-6">
                <h3 className="font-bold text-xl text-purple-700 mb-2">Kids' Collection</h3>
                <p className="text-gray-600 mb-4">Fun and practical clothing for children of all ages</p>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push("/subscription?category=kids")}
                >
                  Explore
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-all bg-gradient-to-br from-green-50 to-green-100">
              <div className="p-6">
                <h3 className="font-bold text-xl text-green-700 mb-2">Skincare Collection</h3>
                <p className="text-gray-600 mb-4">Premium skincare products for a healthy glow</p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => router.push("/subscription?category=skincare")}
                >
                  Explore
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="women" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {womenProducts && womenProducts.length > 0 ? (
              womenProducts.map((product) => (
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
                        console.error(`Failed to load image: ${product.image}`)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
                        wishlist.includes(product.id) ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                      }`}
                      onClick={() => handleAddToWishlist(product.id, product.name)}
                    >
                      <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </Button>
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
                        className={`${cart.includes(product.id) ? "bg-green-600 hover:bg-green-700" : "bg-pink-600 hover:bg-pink-700"}`}
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={cart.includes(product.id)}
                      >
                        {cart.includes(product.id) ? (
                          <>Added to Cart</>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-1" /> Ask AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No women's products available</p>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-pink-300 text-pink-600 hover:bg-pink-50"
              onClick={() => router.push("/subscription?category=women")}
            >
              View All Women's Collection
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="laptops" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {laptopProducts && laptopProducts.length > 0 ? (
              laptopProducts.map((product) => (
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
                        console.error(`Failed to load image: ${product.image}`)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
                        wishlist.includes(product.id) ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                      }`}
                      onClick={() => handleAddToWishlist(product.id, product.name)}
                    >
                      <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </Button>
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
                        className={`${cart.includes(product.id) ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={cart.includes(product.id)}
                      >
                        {cart.includes(product.id) ? (
                          <>Added to Cart</>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-1" /> Ask AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No laptop products available</p>
                <p className="text-sm text-gray-400 mt-2">Please check the product data in lib/products.js</p>
              </div>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/subscription/laptops")}
            >
              View All Laptops
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="kids" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kidsProducts && kidsProducts.length > 0 ? (
              kidsProducts.map((product) => (
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
                        console.error(`Failed to load image: ${product.image}`)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
                        wishlist.includes(product.id) ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                      }`}
                      onClick={() => handleAddToWishlist(product.id, product.name)}
                    >
                      <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </Button>
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
                        className={`${cart.includes(product.id) ? "bg-green-600 hover:bg-green-700" : "bg-purple-600 hover:bg-purple-700"}`}
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={cart.includes(product.id)}
                      >
                        {cart.includes(product.id) ? (
                          <>Added to Cart</>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-1" /> Ask AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No kids' products available</p>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
              onClick={() => router.push("/subscription?category=kids")}
            >
              View All Kids' Collection
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="skincare" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skincareProducts && skincareProducts.length > 0 ? (
              skincareProducts.map((product) => (
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
                        console.error(`Failed to load image: ${product.image}`)
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-2 right-2 rounded-full bg-white/80 hover:bg-white ${
                        wishlist.includes(product.id) ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
                      }`}
                      onClick={() => handleAddToWishlist(product.id, product.name)}
                    >
                      <Heart className="h-5 w-5" fill={wishlist.includes(product.id) ? "currentColor" : "none"} />
                    </Button>
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
                        className={`${cart.includes(product.id) ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700"}`}
                        onClick={() => handleAddToCart(product.id, product.name)}
                        disabled={cart.includes(product.id)}
                      >
                        {cart.includes(product.id) ? (
                          <>Added to Cart</>
                        ) : (
                          <>
                            <MessageCircle className="h-4 w-4 mr-1" /> Ask AI
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No skincare products available</p>
            )}
          </div>
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              className="border-green-300 text-green-600 hover:bg-green-50"
              onClick={() => router.push("/subscription?category=skincare")}
            >
              View All Skincare Collection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

