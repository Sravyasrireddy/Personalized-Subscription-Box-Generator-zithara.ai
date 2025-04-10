"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, MinusCircle, ShoppingCart, Heart, Sparkles, Check } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  selected: boolean
  category: string
}

export default function SubscriptionBox() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([
    // Skincare products
    {
      id: 1,
      name: "Hydrating Serum",
      price: 45,
      selected: true,
      image: "/images/serum.jpeg",
      description: "Intense moisture for all skin types",
      category: "skincare"
    },
    {
      id: 2,
      name: "Vitamin C Moisturizer",
      price: 38,
      selected: true,
      image: "/images/moisturizer.jpeg",
      description: "Brightens and firms skin",
      category: "skincare"
    },
    {
      id: 3,
      name: "Gentle Cleanser",
      price: 32,
      selected: false,
      image: "/images/cleanser.webp",
      description: "7-in-1 nourishing formula",
      category: "skincare"
    },
    {
      id: 4,
      name: "Exfoliating Toner",
      price: 32,
      selected: false,
      image: "/images/skincare-blue.webp",
      description: "With polyhydroxy acid for balanced skin",
      category: "skincare"
    },
    
    // Women's clothing
    {
      id: 5,
      name: "Pink Embroidered Anarkali",
      price: 89,
      selected: false,
      image: "/images/women/women1.jpeg",
      description: "Beautiful pink anarkali with gold embroidery",
      category: "women"
    },
    {
      id: 6,
      name: "Pink Chanderi Suit Set",
      price: 75,
      selected: false,
      image: "/images/women/women2.jpeg",
      description: "Elegant pink suit with golden border details",
      category: "women"
    },
    {
      id: 7,
      name: "Purple Banarasi Anarkali",
      price: 110,
      selected: false,
      image: "/images/women/women3.jpeg",
      description: "Stunning purple anarkali with rich border",
      category: "women"
    },
    
    // Men's clothing
    {
      id: 8,
      name: "Beige Embroidered Kurta",
      price: 65,
      selected: false,
      image: "/images/men/men1.jpeg",
      description: "Elegant beige kurta with subtle embroidery",
      category: "men"
    },
    {
      id: 9,
      name: "Mint Green Blazer",
      price: 95,
      selected: false,
      image: "/images/men/men2.jpeg",
      description: "Stylish mint green blazer for formal occasions",
      category: "men"
    },
    {
      id: 10,
      name: "White Casual Blazer",
      price: 85,
      selected: false,
      image: "/images/men/men3.jpeg",
      description: "Sophisticated white blazer for casual outings",
      category: "men"
    },
    
    // Kids' clothing
    {
      id: 11,
      name: "Kids Festival Collection",
      price: 45,
      selected: false,
      image: "/images/kids/kids1.jpeg",
      description: "Festive wear for kids in various colors",
      category: "kids"
    },
    {
      id: 12,
      name: "Girls Summer Dresses",
      price: 35,
      selected: false,
      image: "/images/kids/kids2.jpeg",
      description: "Set of colorful summer dresses for girls",
      category: "kids"
    },
    {
      id: 13,
      name: "Green & Pink Lehenga Set",
      price: 55,
      selected: false,
      image: "/images/kids/kids3.jpeg",
      description: "Traditional lehenga set for girls",
      category: "kids"
    }
  ])

  const [activeCategory, setActiveCategory] = useState("skincare")
  const [plan, setPlan] = useState("monthly")
  const [frequency, setFrequency] = useState("monthly")
  const [isLoading, setIsLoading] = useState(false)
  const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [viewingAlternatives, setViewingAlternatives] = useState(false)

  const toggleProduct = (id: number) => {
    setProducts(products.map((product) => (product.id === id ? { ...product, selected: !product.selected } : product)))

    // Highlight the product that was just toggled
    setHighlightedProduct(id)
    setTimeout(() => setHighlightedProduct(null), 1500)

    // Show toast notification
    const product = products.find((p) => p.id === id)
    if (product) {
      toast({
        title: product.selected ? "Product removed" : "Product added",
        description: product.selected
          ? `${product.name} has been removed from your box.`
          : `${product.name} has been added to your box.`,
        action: product.selected ? undefined : (
          <ToastAction altText="Undo" onClick={() => toggleProduct(id)}>
            Undo
          </ToastAction>
        ),
      })
    }
  }

  const selectedProducts = products.filter((p) => p.selected)
  const filteredProducts = viewingAlternatives 
    ? products.filter(p => p.category === activeCategory && !p.selected)
    : products.filter(p => p.category === activeCategory)
  
  const totalRetailPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0)

  const subscriptionPrice = () => {
    const basePrice = 59.99
    if (plan === "quarterly") return (basePrice * 3 * 0.9).toFixed(2)
    if (plan === "yearly") return (basePrice * 12 * 0.8).toFixed(2)
    return basePrice.toFixed(2)
  }

  const savings = () => {
    const retailTotal = totalRetailPrice * (plan === "quarterly" ? 3 : plan === "yearly" ? 12 : 1)
    const subPrice = Number.parseFloat(subscriptionPrice())
    return (((retailTotal - subPrice) / retailTotal) * 100).toFixed(0)
  }

  const handleCheckout = () => {
    setIsLoading(true)
    setShowConfetti(true)

    // Save selected products to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts))
      localStorage.setItem("boxPrice", boxPrice.toString())
      localStorage.setItem("totalRetailPrice", totalRetailPrice.toString())
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/cart")
    }, 800)
  }

  const handleViewAlternatives = () => {
    setViewingAlternatives(true)
  }

  const handleBackToSelected = () => {
    setViewingAlternatives(false)
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

  // Calculate box price (30% discount)
  const boxPrice = Math.round(totalRetailPrice * 0.7)

  // Confetti effect
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Personalized Box
      </motion.h1>

      <Tabs defaultValue="skincare" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skincare">Skincare</TabsTrigger>
          <TabsTrigger value="women">Women's Wear</TabsTrigger>
          <TabsTrigger value="men">Men's Wear</TabsTrigger>
          <TabsTrigger value="kids">Kids' Wear</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Area */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {viewingAlternatives ? "Alternative Products" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Products`}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {viewingAlternatives 
                        ? "Customize your box with these alternatives" 
                        : `Browse our ${activeCategory} collection`}
                    </p>
                  </div>
                  <div>
                    {viewingAlternatives ? (
                      <Button 
                        variant="outline" 
                        className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        onClick={handleBackToSelected}
                      >
                        Back to Products
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="border-pink-300 text-pink-600 hover:bg-pink-50"
                        onClick={handleViewAlternatives}
                      >
                        View Alternatives
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`${activeCategory}-${viewingAlternatives ? 'alt' : 'main'}`}
                    className="space-y-4" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    {filteredProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border ${
                          highlightedProduct === product.id
                            ? product.selected ? "border-pink-300 bg-pink-50" : "border-green-300 bg-green-50"
                            : "border-transparent hover:border-gray-200"
                        } transition-all duration-300 transform hover:scale-102 hover:shadow-md`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="relative w-20 h-20 rounded-md overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">${product.price}</p>
                          <p className="text-xs text-gray-500">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-pink-400 hover:text-pink-600 hover:bg-pink-50"
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                          {product.selected ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleProduct(product.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <MinusCircle className="h-5 w-5" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleProduct(product.id)}
                              className="text-green-500 hover:text-green-700 hover:bg-green-50"
                            >
                              <PlusCircle className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mt-6 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Selected Products</h2>
                    <p className="text-sm text-gray-600">Items you've added to your box</p>
                  </div>
                  <Badge className="bg-pink-600">{selectedProducts.length} items</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <AnimatePresence>
                  <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                    {selectedProducts.length > 0 ? (
                      selectedProducts.map((product) => (
                        <motion.div
                          key={product.id}
                          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border ${
                            highlightedProduct === product.id
                              ? "border-pink-300 bg-pink-50"
                              : "border-transparent hover:border-gray-200"
                          } transition-all duration-300 transform hover:scale-102 hover:shadow-md`}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="relative w-20 h-20 rounded-md overflow-hidden">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">${product.price}</p>
                            <p className="text-xs text-gray-500">{product.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleProduct(product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <MinusCircle className="h-5 w-5" />
                          </Button>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No products selected yet</p>
                        <p className="text-sm text-gray-400 mt-2">Browse the categories and add products to your box</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subscription Options */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="sticky top-4 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Subscription Details</h2>
                  <Badge className="bg-white text-pink-600">Save {savings()}%</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Subscription Plan</h3>
                  <Tabs defaultValue="monthly" value={plan} onValueChange={setPlan} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                      <TabsTrigger value="yearly">Yearly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="monthly" className="mt-2">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">$59.99</span>
                          <span className="text-sm text-gray-600">billed monthly</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Cancel or modify anytime</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="quarterly" className="mt-2">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">$169.99</span>
                          <Badge className="bg-green-600">Save 10%</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Billed every 3 months</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="yearly" className="mt-2">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">$599.99</span>
                          <Badge className="bg-green-600">Save 20%</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Best value, billed annually</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Delivery Frequency</h3>
                  <Tabs defaultValue="monthly" value={frequency} onValueChange={setFrequency} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      <TabsTrigger value="bimonthly">Bi-Monthly</TabsTrigger>
                      <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <span>Subscription Price:</span>
                    <span className="font-bold">${subscriptionPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Retail Value:</span>
                    <span>${totalRetailPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Your Savings:</span>
                    <span>{savings()}%</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-pink-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">Personalized for You</h4>
                      <p className="text-xs text-gray-600">
                        Your box has been curated based on your beauty profile and preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
                  onClick={handleCheckout}
                  disabled={isLoading || selectedProducts.length === 0}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Success animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-6 shadow-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-green-100 rounded-full p-4"
            >
              <Check className="h-8 w-8 text-green-600" />
            </motion.div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 100 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full absolute"
                initial={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                  backgroundColor: ["#EC4899", "#9333EA", "#3B82F6", "#10B981"][Math.floor(Math.random() * 4)],
                }}
                animate={{
                  opacity: 0,
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  scale: Math.random() * 2 + 1,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

