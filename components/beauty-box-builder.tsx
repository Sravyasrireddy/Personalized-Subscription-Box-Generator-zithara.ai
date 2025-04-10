"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Check, ArrowRight, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { getProductsByCategory } from "@/lib/products"

// Add the initialCategory prop to the component definition
interface BeautyBoxBuilderProps {
  initialCategory?: string
}

export default function BeautyBoxBuilder({ initialCategory = "women" }: BeautyBoxBuilderProps) {
  const router = useRouter()
  const { toast } = useToast()
  // Use the initialCategory prop to set the initial state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [boxPrice, setBoxPrice] = useState(0)
  const [totalRetailPrice, setTotalRetailPrice] = useState(0)
  const [isAIRecommending, setIsAIRecommending] = useState(false)

  // Get products for the selected category
  const products = getProductsByCategory(selectedCategory)

  // Calculate the total price of selected products
  useEffect(() => {
    const total = selectedProducts.reduce((sum, product) => sum + product.price, 0)
    setBoxPrice(total)

    // Calculate retail price (assuming 20% markup for demonstration)
    const retail = selectedProducts.reduce((sum, product) => sum + product.price * 1.2, 0)
    setTotalRetailPrice(retail)

    // Save selected products to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts))
      localStorage.setItem("boxPrice", total.toString())
      localStorage.setItem("totalRetailPrice", retail.toString())

      // Also update the chatbot cart
      localStorage.setItem("chatbot-cart", JSON.stringify(selectedProducts))

      // Dispatch event to update cart count in navbar
      const event = new CustomEvent("cart-updated")
      window.dispatchEvent(event)
    }
  }, [selectedProducts])

  // Add debugging to see if products are being loaded
  useEffect(() => {
    // Log the products when the selected category changes
    console.log(`Selected category: ${selectedCategory}`)
    console.log("Products:", products)
  }, [selectedCategory, products])

  const handleProductSelect = (product: any) => {
    // Check if product is already selected
    const isSelected = selectedProducts.some((p) => p.id === product.id)

    if (isSelected) {
      // Remove product
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id))
      toast({
        title: "Product removed",
        description: `${product.name} has been removed from your box.`,
      })
    } else {
      // Add product
      if (selectedProducts.length >= 5) {
        toast({
          title: "Box is full",
          description: "You can only select up to 5 products. Remove a product to add a new one.",
          variant: "destructive",
        })
        return
      }

      setSelectedProducts([...selectedProducts, product])
      toast({
        title: "Product added",
        description: `${product.name} has been added to your box.`,
        action: <ToastAction altText="View Box">View Box</ToastAction>,
      })
    }
  }

  const handleAIRecommendation = () => {
    setIsAIRecommending(true)

    // Simulate AI recommendation
    setTimeout(() => {
      const recommendedProducts = products.slice(0, 3)
      setSelectedProducts(recommendedProducts)
      setIsAIRecommending(false)

      toast({
        title: "AI Recommendation Complete",
        description: "We've selected 3 products based on your preferences.",
      })
    }, 2000)
  }

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "Empty Box",
        description: "Please select at least one product before proceeding to checkout.",
        variant: "destructive",
      })
      return
    }

    router.push("/subscription/checkout")
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
          Build Your Personalized Box
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select up to 5 products to create your personalized subscription box. We'll deliver these products to your
          doorstep every month.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Select Your Products</CardTitle>
              <CardDescription>Browse our collection and pick your favorites</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="women" value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="women">Women's Wear</TabsTrigger>
                  <TabsTrigger value="laptops">Laptops</TabsTrigger>
                  <TabsTrigger value="kids">Kids' Wear</TabsTrigger>
                  <TabsTrigger value="skincare">Skincare</TabsTrigger>
                </TabsList>

                <TabsContent value="women">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <Card
                          className={`overflow-hidden cursor-pointer transition-all ${
                            selectedProducts.some((p) => p.id === product.id)
                              ? "border-pink-500 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="relative h-48 w-full">
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
                            {selectedProducts.some((p) => p.id === product.id) && (
                              <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${product.price}</span>
                              <Badge
                                variant={selectedProducts.some((p) => p.id === product.id) ? "default" : "outline"}
                              >
                                {selectedProducts.some((p) => p.id === product.id) ? "Selected" : "Add to Box"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="laptops">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products && products.length > 0 ? (
                      products.map((product) => (
                        <motion.div key={product.id} variants={itemVariants}>
                          <Card
                            className={`overflow-hidden cursor-pointer transition-all ${
                              selectedProducts.some((p) => p.id === product.id)
                                ? "border-pink-500 shadow-lg"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => handleProductSelect(product)}
                          >
                            <div className="relative h-48 w-full">
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
                              {selectedProducts.some((p) => p.id === product.id) && (
                                <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full">
                                  <Check className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium">{product.name}</h3>
                              <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                              <div className="flex justify-between items-center">
                                <span className="font-bold">${product.price}</span>
                                <Badge
                                  variant={selectedProducts.some((p) => p.id === product.id) ? "default" : "outline"}
                                >
                                  {selectedProducts.some((p) => p.id === product.id) ? "Selected" : "Add to Box"}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8">
                        <p className="text-gray-500">No laptop products available</p>
                      </div>
                    )}
                  </motion.div>
                </TabsContent>

                <TabsContent value="kids">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <Card
                          className={`overflow-hidden cursor-pointer transition-all ${
                            selectedProducts.some((p) => p.id === product.id)
                              ? "border-pink-500 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="relative h-48 w-full">
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
                            {selectedProducts.some((p) => p.id === product.id) && (
                              <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${product.price}</span>
                              <Badge
                                variant={selectedProducts.some((p) => p.id === product.id) ? "default" : "outline"}
                              >
                                {selectedProducts.some((p) => p.id === product.id) ? "Selected" : "Add to Box"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>

                <TabsContent value="skincare">
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product) => (
                      <motion.div key={product.id} variants={itemVariants}>
                        <Card
                          className={`overflow-hidden cursor-pointer transition-all ${
                            selectedProducts.some((p) => p.id === product.id)
                              ? "border-pink-500 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="relative h-48 w-full">
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
                            {selectedProducts.some((p) => p.id === product.id) && (
                              <div className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded-full">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">${product.price}</span>
                              <Badge
                                variant={selectedProducts.some((p) => p.id === product.id) ? "default" : "outline"}
                              >
                                {selectedProducts.some((p) => p.id === product.id) ? "Selected" : "Add to Box"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleAIRecommendation} disabled={isAIRecommending}>
                {isAIRecommending ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    AI is selecting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Let AI Choose For Me
                  </>
                )}
              </Button>
              <Button onClick={handleCheckout} className="bg-pink-600 hover:bg-pink-700">
                Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Box Summary */}
        <div>
          <Card className="shadow-md sticky top-4">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <CardTitle>Your Box</CardTitle>
              </div>
              <CardDescription className="text-pink-100">{selectedProducts.length}/5 products selected</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {selectedProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Your box is empty</p>
                  <p className="text-sm mt-2">Select products to add them to your box</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
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
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{product.description}</p>
                      </div>
                      <div className="font-medium">${product.price}</div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Box Price:</span>
                  <span>${boxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Retail Value:</span>
                  <span>${totalRetailPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Your Savings:</span>
                  <span>
                    {boxPrice > 0 ? `${Math.round(((totalRetailPrice - boxPrice) / totalRetailPrice) * 100)}%` : "0%"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2"
                onClick={handleCheckout}
                disabled={selectedProducts.length === 0}
              >
                Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium mb-2 text-purple-800">Subscription Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Free shipping on all subscription boxes</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Exclusive access to new products</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Cancel or modify your subscription anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">Save up to 20% compared to retail prices</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

