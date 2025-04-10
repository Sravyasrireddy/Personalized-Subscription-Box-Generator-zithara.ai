"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { addOrderToHistory, saveOrderDetails } from "@/lib/order-utils"
import Image from "next/image"
import { Loader2 } from "lucide-react"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit-card",
  })

  // Load cart items on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Try to get cart items from both possible sources
        const chatbotCart = localStorage.getItem("chatbot-cart")
        const selectedProducts = localStorage.getItem("selectedProducts")

        let items = []
        if (chatbotCart) {
          items = JSON.parse(chatbotCart)
          console.log("Loaded cart items from chatbot-cart:", items)
        } else if (selectedProducts) {
          items = JSON.parse(selectedProducts)
          console.log("Loaded cart items from selectedProducts:", items)
        }

        setCartItems(items || [])
        console.log("Loaded cart items:", items)
      } catch (error) {
        console.error("Error loading cart items:", error)
        setCartItems([])
      }
    }
  }, [])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const shipping = 5.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePlaceOrder = () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Ensure we have the latest cart items
    const latestCartItems =
      cartItems.length > 0
        ? cartItems
        : typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("chatbot-cart") || localStorage.getItem("selectedProducts") || "[]")
          : []

    if (latestCartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Add some products before placing an order.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Generate a unique order ID
    const orderId = `SB${Math.floor(Math.random() * 10000)}`
    const orderDate = new Date().toISOString()

    // Create new order for order history
    const newOrder = {
      id: orderId,
      date: orderDate,
      status: "Processing", // Explicitly set status
      items: latestCartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image || "/placeholder.svg?height=200&width=300",
        quantity: 1,
        category: item.category || "other",
      })),
      total: total,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      categories: [...new Set(latestCartItems.map((item) => item.category || "other"))],
    }

    // Create order details object with proper category information
    const orderDetails = {
      orderId: orderId,
      orderDate: orderDate,
      products: latestCartItems.map((item) => ({
        ...item,
        image: item.image || "/placeholder.svg?height=200&width=300",
        category: item.category || "other",
      })),
      boxPrice: Math.round(subtotal * 0.7),
      totalRetailPrice: subtotal,
      subscriptionPlan: "Monthly",
      deliveryFrequency: "Every month",
      totalPrice: total.toFixed(2),
      savings: (subtotal * 0.3).toFixed(2),
      customerName: formData.fullName,
      customerEmail: formData.email,
      shippingAddress: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      paymentMethod: formData.paymentMethod,
      status: "Processing", // Explicitly set status
    }

    // DIRECT SAVE TO LOCALSTORAGE - Ensure the order is saved immediately
    try {
      // Get current orders
      const currentOrders = JSON.parse(localStorage.getItem("order-history") || "[]")

      // Check if order already exists (prevent duplicates)
      const orderExists = currentOrders.some((order) => order.id === orderId)
      if (!orderExists) {
        // Add new order to the beginning
        const updatedOrders = [newOrder, ...currentOrders]

        // Save directly to localStorage
        localStorage.setItem("order-history", JSON.stringify(updatedOrders))
        console.log("Order directly saved to localStorage:", newOrder)
        console.log("Updated order history:", updatedOrders)

        // Also save order details
        localStorage.setItem("orderDetails", JSON.stringify(orderDetails))

        // Dispatch events to notify other components
        window.dispatchEvent(
          new CustomEvent("order-history-updated", {
            detail: { orders: updatedOrders },
          }),
        )

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "order-history",
            newValue: JSON.stringify(updatedOrders),
            storageArea: localStorage,
          }),
        )
      } else {
        console.log("Order already exists, not adding duplicate:", orderId)
      }
    } catch (error) {
      console.error("Error directly saving order to localStorage:", error)
    }

    // Also use the utility functions as a backup
    addOrderToHistory(newOrder)
    saveOrderDetails(orderDetails)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)

      // Clear cart AFTER saving order details and history
      localStorage.removeItem("chatbot-cart")
      localStorage.removeItem("selectedProducts")

      // Show success toast
      toast({
        title: "Order placed successfully!",
        description: `Your order #${orderDetails.orderId} has been placed.`,
      })

      // Redirect to success page
      router.push("/checkout/success")
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
        Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
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

              <div className="grid grid-cols-2 gap-4">
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
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                defaultValue="credit-card"
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    Credit Card
                  </Label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="Credit Card" width={36} height={24} />
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 mt-2 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                    PayPal
                  </Label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="PayPal" width={36} height={24} />
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 mt-2 hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="google-pay" id="google-pay" />
                  <Label htmlFor="google-pay" className="flex-1 cursor-pointer">
                    Google Pay
                  </Label>
                  <Image src="/placeholder.svg?height=24&width=36" alt="Google Pay" width={36} height={24} />
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                ) : (
                  cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 border rounded-md">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <Image
                          src={item.image || "/placeholder.svg?height=200&width=300"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">${item.price?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={handlePlaceOrder} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

