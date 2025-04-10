"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, CreditCard, Truck, ArrowRight, Shield, Gift, ChevronLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import type { Product } from "@/lib/product-data"
import { useToast } from "@/components/ui/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [boxPrice, setBoxPrice] = useState(0)
  const [totalRetailPrice, setTotalRetailPrice] = useState(0)
  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly")
  const [deliveryFrequency, setDeliveryFrequency] = useState("monthly")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      // Get selected products from localStorage
      const storedProducts = localStorage.getItem("selectedProducts")
      const storedBoxPrice = localStorage.getItem("boxPrice")
      const storedTotalRetailPrice = localStorage.getItem("totalRetailPrice")

      if (storedProducts) {
        setSelectedProducts(JSON.parse(storedProducts))
      }

      if (storedBoxPrice) {
        setBoxPrice(Number(storedBoxPrice))
      }

      if (storedTotalRetailPrice) {
        setTotalRetailPrice(Number(storedTotalRetailPrice))
      }
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateSubscriptionPrice = () => {
    let basePrice = boxPrice

    // Apply discount based on subscription plan
    if (subscriptionPlan === "quarterly") {
      basePrice = basePrice * 3 * 0.9 // 10% discount for quarterly
    } else if (subscriptionPlan === "yearly") {
      basePrice = basePrice * 12 * 0.8 // 20% discount for yearly
    }

    return basePrice.toFixed(2)
  }

  const calculateSavings = () => {
    const retailTotal =
      totalRetailPrice * (subscriptionPlan === "quarterly" ? 3 : subscriptionPlan === "yearly" ? 12 : 1)
    const subPrice = Number.parseFloat(calculateSubscriptionPrice())
    return (((retailTotal - subPrice) / retailTotal) * 100).toFixed(0)
  }

  const handleCheckout = () => {
    // Basic form validation
    if (!formData.name || !formData.email || !formData.address) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Only save to localStorage on the client
    if (typeof window !== "undefined") {
      // Save order details to localStorage for the confirmation page
      localStorage.setItem(
        "orderDetails",
        JSON.stringify({
          products: selectedProducts,
          boxPrice: boxPrice,
          totalRetailPrice: totalRetailPrice,
          subscriptionPlan: subscriptionPlan,
          deliveryFrequency: deliveryFrequency,
          totalPrice: calculateSubscriptionPrice(),
          savings: calculateSavings(),
          orderId: `BB${Math.floor(Math.random() * 10000)}`,
          orderDate: new Date().toISOString(),
          customerName: formData.name,
          customerEmail: formData.email,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        }),
      )
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/subscription/confirmation")
    }, 1500)
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
      <Button
        variant="ghost"
        className="mb-4 text-gray-600 hover:text-gray-900"
        onClick={() => router.push("/subscription")}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Beauty Box
      </Button>

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
        Complete Your Subscription
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2">
          <Card className="shadow-md mb-6">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-pink-600" />
                <h2 className="text-xl font-semibold">Your Beauty Box</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                {selectedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-all"
                    variants={itemVariants}
                  >
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                    <div className="font-medium">${product.price.toFixed(2)}</div>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>

          <Card className="shadow-md mb-6">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="NY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleInputChange}
                  placeholder="10001"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Summary */}
        <div>
          <Card className="sticky top-4 shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Subscription Summary</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium">Subscription Plan</h3>
                <RadioGroup
                  defaultValue="monthly"
                  value={subscriptionPlan}
                  onValueChange={setSubscriptionPlan}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                      Monthly
                    </Label>
                    <span className="text-sm font-medium">${boxPrice.toFixed(2)}/mo</span>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="quarterly" id="quarterly" />
                    <Label htmlFor="quarterly" className="flex-1 cursor-pointer">
                      Quarterly (Save 10%)
                    </Label>
                    <span className="text-sm font-medium">${(boxPrice * 3 * 0.9).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="yearly" id="yearly" />
                    <Label htmlFor="yearly" className="flex-1 cursor-pointer">
                      Yearly (Save 20%)
                    </Label>
                    <span className="text-sm font-medium">${(boxPrice * 12 * 0.8).toFixed(2)}</span>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Delivery Frequency</h3>
                <RadioGroup
                  defaultValue="monthly"
                  value={deliveryFrequency}
                  onValueChange={setDeliveryFrequency}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="monthly" id="freq-monthly" />
                    <Label htmlFor="freq-monthly" className="flex-1 cursor-pointer">
                      Monthly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="bimonthly" id="freq-bimonthly" />
                    <Label htmlFor="freq-bimonthly" className="flex-1 cursor-pointer">
                      Every 2 Months
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="quarterly" id="freq-quarterly" />
                    <Label htmlFor="freq-quarterly" className="flex-1 cursor-pointer">
                      Every 3 Months
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <h3 className="font-medium">Payment Method</h3>
                <RadioGroup
                  defaultValue="credit-card"
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      Credit Card
                    </Label>
                    <Image src="/placeholder.svg?height=24&width=36" alt="Credit Card" width={36} height={24} />
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      PayPal
                    </Label>
                    <Image src="/placeholder.svg?height=24&width=36" alt="PayPal" width={36} height={24} />
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                    <RadioGroupItem value="google-pay" id="google-pay" />
                    <Label htmlFor="google-pay" className="flex-1 cursor-pointer">
                      Google Pay
                    </Label>
                    <Image src="/placeholder.svg?height=24&width=36" alt="Google Pay" width={36} height={24} />
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "credit-card" && (
                <div className="space-y-3 pt-3 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input
                      id="card-number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Box Price:</span>
                  <span>${boxPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subscription Plan:</span>
                  <span className="capitalize">{subscriptionPlan}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Delivery:</span>
                  <span className="capitalize">{deliveryFrequency}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateSubscriptionPrice()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 mt-1">
                  <span>Your Savings:</span>
                  <span>{calculateSavings()}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="save-info" />
                <Label htmlFor="save-info" className="text-sm">
                  Save my information for faster checkout
                </Label>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Gift className="h-4 w-4" />
                  <span>Cancel or modify anytime</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center gap-2"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Complete Subscription
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

