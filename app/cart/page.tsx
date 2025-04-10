"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, CreditCard, Truck, ArrowRight, Shield, Gift, Trash2, ChevronLeft, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export default function CartPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isLoading, setIsLoading] = useState(false)
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

  // In a real app, this would come from a state management solution or API
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Hydrating Serum",
      price: 45,
      image: "/images/serum.jpeg",
      quantity: 1,
    },
    {
      id: 2,
      name: "Vitamin C Moisturizer",
      price: 38,
      image: "/images/moisturizer.jpeg",
      quantity: 1,
    },
    {
      id: 3,
      name: "SPF 50 Sunscreen",
      price: 29,
      image: "/images/sunscreen.jpeg",
      quantity: 1,
    },
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.99
  const discount = 10.0
  const total = subtotal + shipping - discount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleCheckout = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/checkout/success")
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
        Back to Subscription
      </Button>

      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
        Your Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card className="shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 p-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-pink-600" />
                <h2 className="text-xl font-semibold">Cart Items</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/")}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-all"
                      variants={itemVariants}
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6 shadow-md">
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="NY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input id="zip" name="zip" value={formData.zip} onChange={handleInputChange} placeholder="10001" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4 shadow-md">
            <CardHeader className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-${discount.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
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
                  <span>Gift wrapping available</span>
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
                    Complete Order
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

