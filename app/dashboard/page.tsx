"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Calendar, Clock, User, ShoppingBag, History, Settings, MessageSquare } from "lucide-react"
import AIChatInterface from "@/components/ai-chat-interface"

interface OrderSummary {
  id: string
  date: string
  status: string
  total: number
  items: number
}

interface SubscriptionDetails {
  status: string
  plan: string
  nextDelivery: string
  boxPrice: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [recentOrders, setRecentOrders] = useState<OrderSummary[]>([])
  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    status: "active",
    plan: "monthly",
    nextDelivery: "May 15, 2024",
    boxPrice: 108,
  })
  const [userName, setUserName] = useState("John")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)

    // Get order history from localStorage
    const fetchData = () => {
      try {
        const orderHistory = localStorage.getItem("order-history")
        if (orderHistory) {
          const parsedOrders = JSON.parse(orderHistory)
          setRecentOrders(
            parsedOrders.slice(0, 3).map((order) => ({
              id: order.id,
              date: new Date(order.date).toLocaleDateString(),
              status: order.status,
              total: order.total,
              items: order.items.length,
            })),
          )
        } else {
          // Sample data if no orders exist
          setRecentOrders([
            {
              id: "SB1234",
              date: "04/15/2024",
              status: "Processing",
              total: 112,
              items: 3,
            },
            {
              id: "SB1189",
              date: "03/15/2024",
              status: "Shipped",
              total: 102,
              items: 3,
            },
            {
              id: "SB1023",
              date: "02/15/2024",
              status: "Delivered",
              total: 75,
              items: 3,
            },
          ])
        }
      } catch (error) {
        console.error("Error loading order history:", error)
        // Set sample data on error
        setRecentOrders([
          {
            id: "SB1234",
            date: "04/15/2024",
            status: "Processing",
            total: 112,
            items: 3,
          },
        ])
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-green-600">Delivered</Badge>
      case "Shipped":
        return <Badge className="bg-blue-600">Shipped</Badge>
      case "Processing":
        return <Badge className="bg-amber-600">Processing</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">Manage your subscription, view orders, and get personalized recommendations.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/subscription")}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Create New Box
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscription">Manage Subscription</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="ai">AI Assistant</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-pink-600" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Status:</span>
                  <Badge className="bg-green-600">Active</Badge>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Next Delivery:</span>
                  <span className="font-medium">{subscription.nextDelivery}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push("/subscription/manage")}
                >
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-5 w-5 text-pink-600" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">No orders yet</p>
                ) : (
                  recentOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="flex justify-between items-center py-2 border-b">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className="text-right">{getStatusBadge(order.status)}</div>
                    </div>
                  ))
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => router.push("/subscription/history")}>
                  View All Orders
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-pink-600" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get personalized product recommendations and answers to your questions.
                </p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <p className="font-medium">Try asking:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-600">
                    <li>Recommend skincare products for dry skin</li>
                    <li>What's in my current subscription?</li>
                    <li>When is my next delivery?</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    // Trigger the AI chatbot to open
                    const event = new CustomEvent("open-chatbot")
                    window.dispatchEvent(event)
                  }}
                >
                  Chat with AI Assistant
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Delivery</CardTitle>
              <CardDescription>Your next box will be shipped soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-pink-600" />
                    <div>
                      <p className="font-medium">Delivery Date</p>
                      <p className="text-gray-600">{subscription.nextDelivery}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-pink-600" />
                    <div>
                      <p className="font-medium">Estimated Delivery Time</p>
                      <p className="text-gray-600">3-5 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-pink-600" />
                    <div>
                      <p className="font-medium">Box Contents</p>
                      <p className="text-gray-600">3 personalized products</p>
                    </div>
                  </div>
                </div>

                <Separator orientation="vertical" className="hidden md:block" />

                <div className="flex-1">
                  <h3 className="font-medium mb-3">Actions</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/subscription/manage")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Modify Box Contents
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/subscription/manage")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Skip Next Delivery
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => router.push("/subscription/manage")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Update Shipping Address
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription">
          <div className="bg-white rounded-lg shadow-md p-6">
            <iframe src="/subscription/manage" className="w-full h-[800px] border-0" title="Subscription Management" />
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="bg-white rounded-lg shadow-md p-6">
            <iframe src="/subscription/history" className="w-full h-[800px] border-0" title="Order History" />
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>AI Shopping Assistant</CardTitle>
              <CardDescription>Get personalized recommendations and answers to your questions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[600px]">
                <AIChatInterface />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

