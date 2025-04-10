"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle, Home, Package, Calendar, Star, ChevronRight } from "lucide-react"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import type { Product } from "@/lib/product-data"

interface OrderDetails {
  products: Product[]
  boxPrice: number
  totalRetailPrice: number
  subscriptionPlan: string
  deliveryFrequency: string
  totalPrice: string
  savings: string
  orderId: string
  orderDate: string
  customerName: string
  customerEmail: string
  shippingAddress: string
}

export default function OrderConfirmationPage() {
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
      // Get order details from localStorage
      const storedOrderDetails = localStorage.getItem("orderDetails")

      if (storedOrderDetails) {
        setOrderDetails(JSON.parse(storedOrderDetails))
      }

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
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Subscription Confirmed!
          </motion.h1>
          <motion.p
            className="text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Thank you for your subscription. Your beauty box is on its way!
          </motion.p>
        </div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Card className="shadow-lg border-green-100 mb-8 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 p-4">
              <h2 className="text-xl font-semibold text-green-800">Order Details</h2>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
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
                <ul className="space-y-2">
                  {orderDetails.products.map((product) => (
                    <li key={product.id} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{product.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="p-4 bg-pink-50 rounded-lg" variants={itemVariants}>
                <h3 className="font-medium mb-2 text-pink-800">Subscription Details</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Your {orderDetails.subscriptionPlan} subscription has been activated.
                </p>
                <p className="text-sm text-gray-600">The next box will be shipped on {nextDelivery}.</p>
              </motion.div>
            </CardContent>
            <CardFooter className="p-4 bg-gray-50 flex justify-center">
              <Button
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                onClick={() => router.push("/")}
              >
                <Home className="h-4 w-4" />
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <h3 className="font-medium mb-2">What's Next?</h3>
          <p className="text-sm text-gray-600 mb-4">
            You'll receive an email confirmation with tracking details soon. We hope you enjoy your personalized beauty
            products!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              className="border-pink-600 text-pink-600 hover:bg-pink-50 flex items-center gap-1"
              onClick={() => router.push("/subscription/manage")}
            >
              Manage Subscription
              <ChevronRight className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-1"
              onClick={() => router.push("/subscription/history")}
            >
              View Order History
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
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
        </motion.div>
      </motion.div>
    </div>
  )
}

