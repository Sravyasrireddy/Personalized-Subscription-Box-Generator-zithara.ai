"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Package, Calendar, Star, ChevronRight, ArrowLeft } from "lucide-react"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import Link from "next/link"
import { getOrderDetails } from "@/lib/order-utils"

interface Product {
  id: string | number
  name: string
  price: number
  image: string
  description?: string
  category?: string
}

interface OrderDetails {
  orderId: string
  orderDate: string
  products: Product[]
  boxPrice: number
  totalRetailPrice: number
  subscriptionPlan: string
  deliveryFrequency: string
  totalPrice: string
  savings: string
  customerName: string
  customerEmail: string
  shippingAddress: string
  paymentMethod: string
}

export default function OrderSuccessPage() {
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [estimatedDelivery] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 5)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  const [nextDelivery] = useState(() => {
    const date = new Date()
    // Only access localStorage on the client
    const frequency = typeof window !== "undefined" ? localStorage.getItem("deliveryFrequency") || "monthly" : "monthly"

    if (frequency === "monthly") {
      date.setMonth(date.getMonth() + 1)
    } else if (frequency === "bimonthly") {
      date.setMonth(date.getMonth() + 2)
    } else if (frequency === "quarterly") {
      date.setMonth(date.getMonth() + 3)
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  })

  useEffect(() => {
    // Only run on the client side
    if (typeof window !== "undefined") {
      // Get order details using the utility function
      const details = getOrderDetails()
      console.log("Retrieved order details on success page:", details)

      if (details) {
        try {
          // Ensure all products have valid images and categories
          if (details.products) {
            details.products = details.products.map((product: Product) => ({
              ...product,
              image: product.image || "/placeholder.svg?height=200&width=300",
              category: product.category || "other",
            }))
          }

          setOrderDetails(details)

          // Trigger confetti animation on page load
          const duration = 3 * 1000
          const animationEnd = Date.now() + duration

          const randomInRange = (min: number, max: number) => {
            return Math.random() * (max - min) + min
          }

          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
              return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            // Since particles fall down, start a bit higher than random
            confetti({
              particleCount,
              spread: 70,
              origin: { y: 0.6 },
              colors: ["#EC4899", "#9333EA", "#3B82F6", "#10B981"],
            })
          }, 250)

          return () => clearInterval(interval)
        } catch (e) {
          console.error("Error processing order details:", e)
        }
      }
    }
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Order Details Not Found</h1>
              <p className="text-gray-600 mb-6">
                We couldn't find your order details. This might happen if you refreshed the page or accessed this page
                directly.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={() => router.push("/")} className="bg-pink-600 hover:bg-pink-700">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Home
                </Button>
                <Button variant="outline" onClick={() => router.push("/subscription/history")}>
                  <Package className="h-4 w-4 mr-2" />
                  View Order History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" className="text-gray-600" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>

            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
            >
              PersonalizedBox
            </Link>
          </div>

          <motion.div
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
              >
                <CheckCircle className="h-8 w-8 text-green-600" />
              </motion.div>
              <motion.h1
                className="text-2xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Order Confirmed!
              </motion.h1>
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Thank you for your order. Your beauty box is on its way!
              </motion.p>
            </div>

            <div className="p-6">
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                <div className="space-y-4">
                  <motion.div
                    className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Order ID</span>
                    </div>
                    <span className="font-mono">{orderDetails.orderId}</span>
                  </motion.div>

                  <motion.div
                    className="flex justify-between items-center p-3 bg-green-50 rounded-lg"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Estimated Delivery</span>
                    </div>
                    <span>{estimatedDelivery}</span>
                  </motion.div>

                  <motion.div className="p-4 border border-green-200 rounded-lg" variants={itemVariants}>
                    <h3 className="font-medium mb-3 text-green-800">Your Beauty Box Includes:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {orderDetails.products &&
                        orderDetails.products.map((product) => (
                          <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <div className="relative h-10 w-10 rounded overflow-hidden">
                              <Image
                                src={product.image || "/placeholder.svg?height=200&width=300"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Fallback for broken images
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">${product.price?.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </motion.div>

                  <motion.div className="p-4 bg-pink-50 rounded-lg" variants={itemVariants}>
                    <h3 className="font-medium mb-2 text-pink-800">Subscription Details</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Your {orderDetails.subscriptionPlan} subscription has been activated.
                    </p>
                    <p className="text-sm text-gray-600">The next box will be shipped on {nextDelivery}.</p>
                  </motion.div>

                  <motion.div className="p-4 bg-gray-50 rounded-lg" variants={itemVariants}>
                    <h3 className="font-medium mb-2 text-gray-800">Shipping Information</h3>
                    <p className="text-sm text-gray-600">
                      {orderDetails.customerName}
                      <br />
                      {orderDetails.shippingAddress}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Button
                  className="bg-pink-600 hover:bg-pink-700 flex items-center gap-1"
                  onClick={() => router.push("/")}
                >
                  <Home className="h-4 w-4" />
                  Return to Home
                </Button>
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-1"
                  onClick={() => router.push("/subscription/manage")}
                >
                  Manage Subscription
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 flex items-center gap-1"
                  onClick={() => router.push("/subscription/history")}
                >
                  View Order History
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  Rate Your Experience
                </h4>
                <div className="flex justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl text-amber-300 hover:text-amber-500 transition-colors">
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

