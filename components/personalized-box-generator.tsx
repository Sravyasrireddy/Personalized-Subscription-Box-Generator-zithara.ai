"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronRight, Package, Plus, Minus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import AIChatInterface from "@/components/ai-chat-interface"

interface Product {
  id: string
  name: string
  price: number
  description: string
  benefits: string[]
  image: string
  category: string
}

interface BoxType {
  id: string
  name: string
  description: string
  image: string
}

export default function PersonalizedBoxGenerator() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number>(1)
  const [selectedBoxType, setSelectedBoxType] = useState<string | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [alternativeView, setAlternativeView] = useState<boolean>(false)

  // Box types
  const boxTypes: BoxType[] = [
    {
      id: "beauty",
      name: "Beauty Products",
      description: "Personalized skincare and makeup products",
      image: "/images/beauty-products.jpeg",
    },
    {
      id: "women",
      name: "Women's Clothing",
      description: "Curated women's clothing items based on your style",
      image: "/images/women/women1.jpeg",
    },
    {
      id: "men",
      name: "Men's Clothing",
      description: "Stylish men's clothing for every occasion",
      image: "/images/men/men1.jpeg",
    },
    {
      id: "kids",
      name: "Kids' Clothing",
      description: "Adorable and comfortable clothing for children",
      image: "/images/kids/kids1.jpeg",
    },
  ]

  // Sample products for skincare
  const skincareProducts: Product[] = [
    {
      id: "skin-001",
      name: "Hydrating Hyaluronic Serum",
      price: 45,
      description: "Specifically for combination skin",
      benefits: ["Intense moisture retention", "Dermatologist recommended"],
      image: "/images/serum.jpeg",
      category: "skincare",
    },
    {
      id: "skin-002",
      name: "Vitamin C Anti-Aging Moisturizer",
      price: 38,
      description: "Brightens and firms skin",
      benefits: ["Reduces fine lines", "Suitable for 25-35 age group"],
      image: "/images/moisturizer.jpeg",
      category: "skincare",
    },
    {
      id: "skin-003",
      name: "Gentle Cleanser",
      price: 28,
      description: "Removes impurities without stripping",
      benefits: ["Cleansing", "Gentle", "pH Balanced"],
      image: "/images/cleanser.webp",
      category: "skincare",
    },
  ]

  // Alternative skincare products
  const alternativeSkincareProducts: Product[] = [
    {
      id: "skin-004",
      name: "Exfoliating Toner",
      price: 32,
      description: "Weekly treatment for smoother skin",
      benefits: ["Removes dead skin cells", "Improves texture"],
      image: "/images/skincare-blue.webp",
      category: "skincare",
    },
    {
      id: "skin-005",
      name: "Night Repair Cream",
      price: 45,
      description: "Intensive overnight repair",
      benefits: ["Repairing", "Anti-aging", "Nourishing"],
      image: "/images/skincare-set.jpeg",
      category: "skincare",
    },
    {
      id: "skin-006",
      name: "Niacinamide Concentrate",
      price: 36,
      description: "Targets pores and uneven texture",
      benefits: ["Reduces pore appearance", "Balances oil production"],
      image: "/images/skincare-woman.webp",
      category: "skincare",
    },
  ]

  // Women's clothing products
  const womenProducts: Product[] = [
    {
      id: "women-001",
      name: "Pink Embroidered Anarkali Dress",
      price: 89,
      description: "Beautiful pink anarkali with gold embroidery",
      benefits: ["Festive", "Elegant", "Comfortable"],
      image: "/images/women/women1.jpeg",
      category: "women",
    },
    {
      id: "women-002",
      name: "Pink Chanderi Suit Set",
      price: 75,
      description: "Elegant pink suit with golden border details",
      benefits: ["Lightweight", "Elegant", "Traditional"],
      image: "/images/women/women2.jpeg",
      category: "women",
    },
    {
      id: "women-003",
      name: "Purple Banarasi Anarkali",
      price: 110,
      description: "Stunning purple anarkali with rich border",
      benefits: ["Premium", "Festive", "Elegant"],
      image: "/images/women/women3.jpeg",
      category: "women",
    },
  ]

  // Men's clothing products
  const menProducts: Product[] = [
    {
      id: "men-001",
      name: "Beige Embroidered Kurta",
      price: 65,
      description: "Elegant beige kurta with subtle embroidery",
      benefits: ["Comfortable", "Stylish", "Traditional"],
      image: "/images/men/men1.jpeg",
      category: "men",
    },
    {
      id: "men-002",
      name: "Mint Green Blazer",
      price: 95,
      description: "Stylish mint green blazer for formal occasions",
      benefits: ["Trendy", "Formal", "Versatile"],
      image: "/images/men/men2.jpeg",
      category: "men",
    },
    {
      id: "men-003",
      name: "White Casual Blazer",
      price: 85,
      description: "Sophisticated white blazer for casual outings",
      benefits: ["Stylish", "Casual", "Versatile"],
      image: "/images/men/men3.jpeg",
      category: "men",
    },
  ]

  // Kids' clothing products
  const kidsProducts: Product[] = [
    {
      id: "kids-001",
      name: "Kids Festival Collection",
      price: 45,
      description: "Festive wear for kids in various colors",
      benefits: ["Festive", "Comfortable", "Stylish"],
      image: "/images/kids/kids1.jpeg",
      category: "kids",
    },
    {
      id: "kids-002",
      name: "Girls Summer Dresses",
      price: 35,
      description: "Set of colorful summer dresses for girls",
      benefits: ["Comfortable", "Casual", "Colorful"],
      image: "/images/kids/kids2.jpeg",
      category: "kids",
    },
    {
      id: "kids-003",
      name: "Green & Pink Lehenga Set",
      price: 55,
      description: "Traditional lehenga set for girls",
      benefits: ["Festive", "Elegant", "Traditional"],
      image: "/images/kids/kids3.jpeg",
      category: "kids",
    },
  ]

  const handleSelectBoxType = (boxTypeId: string) => {
    setSelectedBoxType(boxTypeId)
    setActiveStep(2)

    // Pre-select products based on box type
    if (boxTypeId === "beauty") {
      setSelectedProducts(skincareProducts)
    } else if (boxTypeId === "women") {
      setSelectedProducts(womenProducts)
    } else if (boxTypeId === "men") {
      setSelectedProducts(menProducts)
    } else if (boxTypeId === "kids") {
      setSelectedProducts(kidsProducts)
    }
  }

  const handleAddProduct = (product: Product) => {
    if (!selectedProducts.some((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])

      toast({
        title: "Product Added",
        description: `${product.name} has been added to your box.`,
      })
    }
  }

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId))

    toast({
      title: "Product Removed",
      description: "The product has been removed from your box.",
    })
  }

  const handleViewAlternatives = () => {
    setAlternativeView(true)
  }

  const handleBackToSelected = () => {
    setAlternativeView(false)
  }

  const handleContinue = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product to continue.",
        variant: "destructive",
      })
      return
    }

    setActiveStep(activeStep + 1)

    // Save selected products to localStorage for the subscription page
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts))

      // Calculate and save price information
      const totalRetailPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0)
      const boxPrice = Math.round(totalRetailPrice * 0.7) // 30% discount

      localStorage.setItem("boxPrice", boxPrice.toString())
      localStorage.setItem("totalRetailPrice", totalRetailPrice.toString())
    }

    // Navigate to subscription page if we're at the last step
    if (activeStep === 3) {
      router.push("/subscription/checkout")
    }
  }

  // Get alternative products based on selected box type
  const getAlternativeProducts = () => {
    if (selectedBoxType === "beauty") {
      return alternativeSkincareProducts
    } else if (selectedBoxType === "women") {
      return womenProducts.slice(3, 6) // Assuming there are more women's products
    } else if (selectedBoxType === "men") {
      return menProducts.slice(3, 6) // Assuming there are more men's products
    } else if (selectedBoxType === "kids") {
      return kidsProducts.slice(3, 6) // Assuming there are more kids' products
    }
    return []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
        Personalized Subscription Box Generator
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div>
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
              <CardTitle className="text-2xl">AI-Powered Recommendations</CardTitle>
              <CardDescription className="text-blue-100">
                Our AI analyzes your preferences to create the perfect personalized box
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[300px]">
                <Image
                  src="/images/ai-recommendation-system-new.png"
                  alt="AI Recommendation System"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">How Our AI Works</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Analyzes your preferences and past interactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Recommends products tailored to your unique needs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Continuously learns from your feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Suggests alternatives based on your style</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <AIChatInterface />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep >= 1 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <span className="text-sm mt-2">Choose Type</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${activeStep >= 2 ? "bg-pink-600" : "bg-gray-200"}`}
              style={{ width: "100%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep >= 2 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <span className="text-sm mt-2">Customize</span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200">
            <div
              className={`h-full ${activeStep >= 3 ? "bg-pink-600" : "bg-gray-200"}`}
              style={{ width: "100%" }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activeStep >= 3 ? "bg-pink-600 text-white" : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
            <span className="text-sm mt-2">Subscribe</span>
          </div>
        </div>
      </div>

      {activeStep === 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Subscription Type</CardTitle>
              <CardDescription>Select the type of subscription box you'd like to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {boxTypes.map((boxType) => (
                  <Card
                    key={boxType.id}
                    className={`cursor-pointer hover:shadow-md transition-all ${
                      selectedBoxType === boxType.id ? "border-2 border-pink-500" : ""
                    }`}
                    onClick={() => handleSelectBoxType(boxType.id)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={boxType.image || "/placeholder.svg"}
                        alt={boxType.name}
                        fill
                        className="object-cover"
                      />
                      {selectedBoxType === boxType.id && (
                        <div className="absolute top-2 right-2 bg-pink-600 text-white rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg">{boxType.name}</h3>
                      <p className="text-gray-600 text-sm">{boxType.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() => handleSelectBoxType("beauty")}
                disabled={selectedBoxType !== null}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {activeStep === 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>
                Customize Your{" "}
                {selectedBoxType === "beauty"
                  ? "Beauty"
                  : selectedBoxType === "women"
                    ? "Women's Clothing"
                    : selectedBoxType === "men"
                      ? "Men's Clothing"
                      : "Kids' Clothing"}{" "}
                Box
              </CardTitle>
              <CardDescription>Select the products you'd like to include in your subscription</CardDescription>
            </CardHeader>
            <CardContent>
              {!alternativeView ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Current Box Contents:</h3>
                    <Button
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                      onClick={handleViewAlternatives}
                    >
                      View Alternative Products
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-48 w-full">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-bold text-lg">${product.price}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleRemoveProduct(product.id)}
                            >
                              <Minus className="h-4 w-4 mr-1" /> Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Alternative Suggestions:</h3>
                    <Button
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                      onClick={handleBackToSelected}
                    >
                      Back to Selected Products
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {getAlternativeProducts().map((product) => (
                      <Card key={product.id} className="overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-48 w-full">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {product.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <span className="font-bold text-lg">${product.price}</span>
                            <Button
                              size="sm"
                              className="bg-pink-600 hover:bg-pink-700"
                              onClick={() => handleAddProduct(product)}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Add to Box
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Box Summary</h3>
                    <p className="text-sm text-gray-500">{selectedProducts.length} products selected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Retail Value</p>
                    <p className="font-bold text-lg">
                      ${selectedProducts.reduce((sum, product) => sum + product.price, 0).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      Subscription Price: $
                      {Math.round(selectedProducts.reduce((sum, product) => sum + product.price, 0) * 0.7).toFixed(2)}
                    </p>
                    <p className="text-xs text-green-600">Save 30% with subscription</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep(1)}>
                Back
              </Button>
              <Button
                onClick={handleContinue}
                className="bg-pink-600 hover:bg-pink-700"
                disabled={selectedProducts.length === 0}
              >
                Continue to Subscription <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {activeStep === 3 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Subscription Plan</CardTitle>
              <CardDescription>Select your preferred delivery frequency and subscription length</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium mb-4">Pricing Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-pink-500">
                      <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100">
                        <CardTitle className="text-center">Monthly Box</CardTitle>
                        <CardDescription className="text-center">Flexible monthly subscription</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">
                          $
                          {Math.round(selectedProducts.reduce((sum, product) => sum + product.price, 0) * 0.7).toFixed(
                            2,
                          )}
                          <span className="text-sm font-normal text-gray-500">/month</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Cancel anytime</p>
                        <Badge>Most Popular</Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">Quarterly Box</CardTitle>
                        <CardDescription className="text-center">Save 10% with quarterly billing</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">
                          $
                          {Math.round(
                            selectedProducts.reduce((sum, product) => sum + product.price, 0) * 0.7 * 3 * 0.9,
                          ).toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">/quarter</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Billed every 3 months</p>
                        <Badge variant="outline">Save 10%</Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">Yearly Box</CardTitle>
                        <CardDescription className="text-center">Save 20% with annual billing</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <div className="text-3xl font-bold mb-2">
                          $
                          {Math.round(
                            selectedProducts.reduce((sum, product) => sum + product.price, 0) * 0.7 * 12 * 0.8,
                          ).toFixed(2)}
                          <span className="text-sm font-normal text-gray-500">/year</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Billed annually</p>
                        <Badge variant="outline">Save 20%</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Delivery Frequency</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-2 border-pink-500">
                      <CardHeader>
                        <CardTitle className="text-center">Monthly Delivery</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 text-pink-600" />
                        <p className="text-sm text-gray-500">Receive a new box every month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">Bi-Monthly Delivery</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-500">Receive a new box every 2 months</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-center">Quarterly Delivery</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 text-center">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-500">Receive a new box every 3 months</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Subscription Summary</h3>
                    <p className="text-sm text-gray-500">Monthly box with {selectedProducts.length} products</p>
                    <p className="text-sm text-gray-500">First delivery: May 15, 2024</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Monthly Price</p>
                    <p className="font-bold text-lg">
                      ${Math.round(selectedProducts.reduce((sum, product) => sum + product.price, 0) * 0.7).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveStep(2)}>
                Back
              </Button>
              <Button onClick={handleContinue} className="bg-pink-600 hover:bg-pink-700">
                Proceed to Payment <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

