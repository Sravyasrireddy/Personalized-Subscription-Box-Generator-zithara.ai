"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  Download,
  ChevronRight,
  Calendar,
  FileText,
  Search,
  RefreshCw,
  CheckCircle,
  Truck,
  AlertTriangle,
  PlusCircle,
  Trash2,
  X,
  Upload,
  ShoppingBag,
} from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrderHistory, saveOrderHistory, updateOrderStatus, type Order } from "@/lib/order-utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

export default function OrderHistoryPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("")
  const [isCreateSampleOrderOpen, setIsCreateSampleOrderOpen] = useState(false)

  // Load orders on initial render and set up event listeners
  useEffect(() => {
    console.log("Order history page mounted")
    
    // Load orders only once using our loadOrders function
    loadOrders()
    
    // Add event listeners for storage changes
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("order-history-updated", handleOrderHistoryUpdate as EventListener)
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("order-history-updated", handleOrderHistoryUpdate as EventListener)
    }
  }, [])

  // Handle order history updates from other components
  const handleOrderHistoryUpdate = (event: CustomEvent) => {
    console.log("Order history updated event received:", event.detail)
    loadOrders()
  }

  // Handle storage changes from other tabs/windows
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "order-history") {
      console.log("Order history storage changed in another tab/window")
      loadOrders()
    }
  }

  const loadOrders = () => {
    setLoading(true)
    
    try {
      const rawData = localStorage.getItem("order-history")
      if (rawData) {
        const parsedData = JSON.parse(rawData)
        console.log("Direct localStorage read in loadOrders:", parsedData)
        
        // Deduplicate orders by ID
        const uniqueOrders = [];
        const seenIds = new Set();
        
        parsedData.forEach(order => {
          if (!seenIds.has(order.id)) {
            seenIds.add(order.id);
            uniqueOrders.push({
              ...order,
              status: order.status || "Processing", // Default to Processing if status is missing
            });
          } else {
            console.log(`Duplicate order detected and removed: ${order.id}`);
          }
        });
        
        // Save the deduplicated orders back to localStorage
        if (uniqueOrders.length !== parsedData.length) {
          localStorage.setItem("order-history", JSON.stringify(uniqueOrders));
          console.log(`Removed ${parsedData.length - uniqueOrders.length} duplicate orders`);
          
          // Update debug info
          setDebugInfo(`Deduplication: Removed ${parsedData.length - uniqueOrders.length} duplicate orders. Now showing ${uniqueOrders.length} unique orders.`);
        } else {
          setDebugInfo(`Loaded ${uniqueOrders.length} unique orders from localStorage`);
        }
        
        setOrders(uniqueOrders);
        setLoading(false);
        return;
      } else {
        console.log("No order history found in localStorage")
        setOrders([]);
        setDebugInfo("No orders found in localStorage");
      }
    } catch (error) {
      console.error("Error reading directly from localStorage in loadOrders:", error)
      setDebugInfo(`Error in loadOrders: ${error.message}`)
      setOrders([]);
    }
    
    setLoading(false);
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleDownloadInvoice = (orderId: string) => {
    // In a real app, this would generate and download an invoice
    toast({
      title: "Invoice Downloaded",
      description: `Invoice for order #${orderId} has been downloaded.`,
    })
  }

  const handleTrackOrder = (trackingNumber: string) => {
    // In a real app, this would open a tracking page
    window.open(`https://example.com/track?number=${trackingNumber}`, "_blank")
  }

  const handleUpdateStatus = (newStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled") => {
    if (!selectedOrder) return

    // Generate tracking number if shipping
    let trackingNumber = selectedOrder.trackingNumber
    if (newStatus === "Shipped" && !trackingNumber) {
      trackingNumber = `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}`
    }

    // Update the order status
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id ? { ...order, status: newStatus, trackingNumber } : order,
    )

    // DIRECT SAVE TO LOCALSTORAGE - Ensure the status update is saved immediately
    try {
      localStorage.setItem("order-history", JSON.stringify(updatedOrders))
      console.log("Order status directly updated in localStorage:", newStatus)

      // Dispatch a single event to notify other components
      window.dispatchEvent(
        new CustomEvent("order-history-updated", {
          detail: { orders: updatedOrders },
        }),
      )
    } catch (error) {
      console.error("Error directly updating order status in localStorage:", error)
    }

    setOrders(updatedOrders)
    setSelectedOrder({ ...selectedOrder, status: newStatus, trackingNumber })

    // Also use the utility function as a backup
    updateOrderStatus(selectedOrder.id, newStatus)

    setIsStatusDialogOpen(false)

    // Add status update to order history for tracking
    const statusUpdateMessage = `Order status updated from ${selectedOrder.status} to ${newStatus}`

    toast({
      title: "Order Status Updated",
      description: statusUpdateMessage,
    })
  }

  const handleDeleteOrder = (orderId: string) => {
    setOrderToDelete(orderId)
    setIsConfirmDeleteOpen(true)
  }

  const confirmDeleteOrder = () => {
    if (!orderToDelete) return

    const updatedOrders = orders.filter((order) => order.id !== orderToDelete)

    // DIRECT SAVE TO LOCALSTORAGE - Ensure the order is deleted immediately
    try {
      localStorage.setItem("order-history", JSON.stringify(updatedOrders))
      console.log("Order directly deleted from localStorage:", orderToDelete)

      // Dispatch a single event to notify other components
      window.dispatchEvent(
        new CustomEvent("order-history-updated", {
          detail: { orders: updatedOrders },
        }),
      )
    } catch (error) {
      console.error("Error directly deleting order from localStorage:", error)
    }

    setOrders(updatedOrders)

    // Also use the utility function as a backup
    saveOrderHistory(updatedOrders)

    // Close dialogs
    setIsConfirmDeleteOpen(false)
    setIsDetailsOpen(false)

    toast({
      title: "Order Deleted",
      description: `Order #${orderToDelete} has been deleted from your history.`,
    })
  }

  const createSampleOrder = () => {
    // Generate a unique order ID
    const orderId = `SAMPLE-${Math.floor(Math.random() * 10000)}`
    const orderDate = new Date().toISOString()

    // Create sample products with IDs unique to this order
    const sampleProducts = [
      {
        id: `sample-1-${orderId}`,
        name: "Luxury Face Cream",
        price: 49.99,
        image: "/images/skincare.jpeg",
        quantity: 1,
        category: "skincare",
      },
      {
        id: `sample-2-${orderId}`,
        name: "Hydrating Serum",
        price: 35.99,
        image: "/images/serum.jpeg",
        quantity: 1,
        category: "skincare",
      },
      {
        id: `sample-3-${orderId}`,
        name: "Gentle Cleanser",
        price: 24.99,
        image: "/images/cleanser.webp",
        quantity: 1,
        category: "skincare",
      },
    ]

    // Create a new sample order
    const newOrder: Order = {
      id: orderId,
      date: orderDate,
      status: "Processing",
      items: sampleProducts,
      total: sampleProducts.reduce((sum, item) => sum + item.price, 0),
      shippingAddress: "123 Sample St, Example City, 12345",
      categories: ["skincare"],
    }

    // Check if this order ID already exists
    if (orders.some(order => order.id === orderId)) {
      toast({
        title: "Order Creation Failed",
        description: "An order with this ID already exists. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Add the sample order to the beginning of the order history
    const updatedOrders = [newOrder, ...orders]

    // DIRECT SAVE TO LOCALSTORAGE
    try {
      localStorage.setItem("order-history", JSON.stringify(updatedOrders))
      console.log("Sample order directly saved to localStorage:", newOrder)

      // Dispatch a single event to notify other components
      window.dispatchEvent(
        new CustomEvent("order-history-updated", {
          detail: { orders: updatedOrders },
        }),
      )
    } catch (error) {
      console.error("Error directly saving sample order to localStorage:", error)
    }

    setOrders(updatedOrders)
    setIsCreateSampleOrderOpen(false)

    toast({
      title: "Sample Order Created",
      description: `A sample order #${orderId} has been added to your history.`,
    })
  }

  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (filterStatus !== "all" && order.status?.toLowerCase() !== filterStatus.toLowerCase()) {
      return false
    }

    // Filter by type
    if (filterType === "regular" && (order.isRemoval || order.isAddition || order.isCustom || order.isFileUpload)) {
      return false
    } else if (filterType === "additions" && !order.isAddition && !order.isCustom && !order.isFileUpload) {
      return false
    } else if (filterType === "removals" && !order.isRemoval) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        order.id.toLowerCase().includes(query) ||
        order.items.some((item) => item.name.toLowerCase().includes(query)) ||
        (order.fileName && order.fileName.toLowerCase().includes(query))
      )
    }

    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Add a function to get status badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-600"
      case "shipped":
        return "bg-blue-600"
      case "processing":
        return "bg-amber-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
            Order History
          </h1>
          <p className="text-gray-600">View and track all your previous orders</p>
          {debugInfo && <p className="text-xs text-gray-500 mt-1">{debugInfo}</p>}
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={loadOrders} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Debug function to check localStorage directly
              const rawData = localStorage.getItem("order-history")
              console.log("Raw localStorage data:", rawData)

              if (rawData) {
                try {
                  const parsedData = JSON.parse(rawData)
                  console.log("Parsed localStorage data:", parsedData)

                  // Check for duplicates
                  const uniqueIds = new Set();
                  const duplicates = [];
                  
                  parsedData.forEach(order => {
                    if (uniqueIds.has(order.id)) {
                      duplicates.push(order.id);
                    } else {
                      uniqueIds.add(order.id);
                    }
                  });
                  
                  if (duplicates.length > 0) {
                    setDebugInfo(`Debug: Found ${duplicates.length} duplicate orders with IDs: ${duplicates.join(', ')}`);
                  } else {
                    setDebugInfo(`Debug: Found ${parsedData.length} orders in localStorage. No duplicates detected.`);
                  }

                  toast({
                    title: "Debug Info",
                    description: duplicates.length > 0 ? 
                      `Found ${duplicates.length} duplicate orders` :
                      `Found ${parsedData.length} orders in localStorage`,
                  })
                } catch (error) {
                  console.error("Error parsing localStorage data:", error)
                  setDebugInfo(`Debug Error: ${error.message}`)
                  toast({
                    title: "Debug Error",
                    description: "Error parsing localStorage data. Check console.",
                    variant: "destructive",
                  })
                }
              } else {
                setDebugInfo("Debug: No order history found in localStorage")
                toast({
                  title: "Debug Info",
                  description: "No order history found in localStorage",
                })
              }
            }}
            className="flex items-center gap-1"
          >
            <Search className="h-4 w-4" />
            Debug
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCreateSampleOrderOpen(true)}
            className="flex items-center gap-1"
          >
            <ShoppingBag className="h-4 w-4" />
            Create Sample Order
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/subscription/manage")}>
            Manage Subscription
          </Button>
        </div>
      </div>

      <Card className="shadow-md mb-8">
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">Search Orders</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by order ID or product..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Orders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-1 block">Type</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="regular">Regular Orders</SelectItem>
                  <SelectItem value="additions">Product Additions</SelectItem>
                  <SelectItem value="removals">Product Removals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card className="shadow-md text-center p-8">
          <div className="flex flex-col items-center justify-center">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== "all" || filterType !== "all"
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't placed any orders yet. Start shopping to see your orders here."}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => router.push("/subscription")}>Browse Products</Button>
              <Button variant="outline" onClick={() => setIsCreateSampleOrderOpen(true)}>
                Create Sample Order
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id} // Using only order.id as key to fix React rendering issues
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`shadow-md overflow-hidden ${
                  order.isRemoval
                    ? "border-red-200"
                    : order.isAddition || order.isCustom || order.isFileUpload
                      ? "border-green-200"
                      : ""
                }`}
              >
                <CardHeader
                  className={`bg-gradient-to-r ${
                    order.isRemoval
                      ? "from-red-50 to-red-100"
                      : order.isAddition || order.isCustom || order.isFileUpload
                        ? "from-green-50 to-green-100"
                        : "from-gray-50 to-gray-100"
                  } p-4`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center flex-wrap gap-2">
                        Order #{order.id}
                        {order.isRemoval && (
                          <Badge variant="outline" className="ml-2 text-red-500 border-red-200">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Product Removal
                          </Badge>
                        )}
                        {order.isAddition && (
                          <Badge variant="outline" className="ml-2 text-green-500 border-green-200">
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Product Addition
                          </Badge>
                        )}
                        {order.isCustom && (
                          <Badge variant="outline" className="ml-2 text-green-500 border-green-200">
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Custom Product
                          </Badge>
                        )}
                        {order.isFileUpload && (
                          <Badge variant="outline" className="ml-2 text-blue-500 border-blue-200">
                            <Upload className="h-3 w-3 mr-1" />
                            File Upload: {order.fileName}
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>Placed on {formatDate(order.date)}</CardDescription>
                      {order.categories && order.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {order.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 md:mt-0 flex items-center gap-2">
                      <Badge className={getStatusBadgeColor(order.status || "Processing")}>
                        {order.status || "Processing"}
                      </Badge>
                      {order.trackingNumber && order.status === "Shipped" && (
                        <Button variant="outline" size="sm" onClick={() => handleTrackOrder(order.trackingNumber!)}>
                          Track Order
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="col-span-3">
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 p-2 border rounded-md">
                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg?height=200&width=300"}
                                alt={item.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Fallback for broken images
                                  e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">${item.price?.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex items-center justify-center p-2 border rounded-md bg-gray-50">
                            <p className="text-sm text-gray-600">+{order.items.length - 3} more items</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Order Summary</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Items:</span>
                          <span className="text-sm">{order.items.length}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Subtotal:</span>
                          <span className="text-sm">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">Shipping:</span>
                          <span className="text-sm">Free</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-4 flex flex-col md:flex-row justify-between items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {order.status === "Delivered"
                        ? `Delivered on ${formatDate(new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString())}`
                        : order.status === "Shipped"
                          ? `Expected delivery by ${formatDate(new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toISOString())}`
                          : `Processing since ${formatDate(order.date)}`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Invoice
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                      className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1"
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              Order Details
              {selectedOrder?.isRemoval && (
                <Badge variant="outline" className="ml-2 text-red-500 border-red-200">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Product Removal
                </Badge>
              )}
              {selectedOrder?.isAddition && (
                <Badge variant="outline" className="ml-2 text-green-500 border-green-200">
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Product Addition
                </Badge>
              )}
              {selectedOrder?.isCustom && (
                <Badge variant="outline" className="ml-2 text-green-500 border-green-200">
                  <PlusCircle className="h-3 w-3 mr-1" />
                  Custom Product
                </Badge>
              )}
              {selectedOrder?.isFileUpload && (
                <Badge variant="outline" className="ml-2 text-blue-500 border-blue-200">
                  <Upload className="h-3 w-3 mr-1" />
                  File Upload: {selectedOrder.fileName}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="font-bold text-lg">Order #{selectedOrder.id}</h3>
                  <p className="text-gray-500">Placed on {formatDate(selectedOrder.date)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusBadgeColor(selectedOrder.status || "Processing")}>
                    {selectedOrder.status || "Processing"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
                    Update Status
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded-md">
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg?height=200&width=300"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback for broken images
                              e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                            {item.category && (
                              <Badge variant="outline" className="text-xs ml-1">
                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="font-medium">${item.price?.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {selectedOrder.categoryBreakdown && selectedOrder.categoryBreakdown.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Category Breakdown</h4>
                      <div className="space-y-2">
                        {selectedOrder.categoryBreakdown.map((cat, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}</span>
                            <span>
                              {cat.count} items (${cat.subtotal.toFixed(2)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Order Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping:</span>
                        <span>Free</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Tax:</span>
                        <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${(selectedOrder.total * 1.08).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Shipping Information</h4>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="mb-2">{selectedOrder.shippingAddress}</p>
                      {selectedOrder.trackingNumber && (
                        <div className="mt-3">
                          <p className="font-medium">Tracking Number:</p>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {selectedOrder.trackingNumber}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTrackOrder(selectedOrder.trackingNumber!)}
                            >
                              Track
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Delete Order
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadInvoice(selectedOrder.id)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Download Invoice
                  </Button>
                  {selectedOrder.status === "Delivered" && !selectedOrder.isRemoval && (
                    <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/subscription")}>
                      Reorder
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Current status:{" "}
                <Badge
                  className={
                    selectedOrder.status === "Delivered"
                      ? "bg-green-600"
                      : selectedOrder.status === "Shipped"
                        ? "bg-blue-600"
                        : "bg-amber-600"
                  }
                >
                  {selectedOrder.status || "Processing"}
                </Badge>
              </p>

              <div className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant={selectedOrder.status === "Processing" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus("Processing")}
                  disabled={selectedOrder.status === "Processing"}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Processing
                </Button>

                <Button
                  className="w-full justify-start"
                  variant={selectedOrder.status === "Shipped" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus("Shipped")}
                  disabled={selectedOrder.status === "Shipped"}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Shipped
                </Button>

                <Button
                  className="w-full justify-start"
                  variant={selectedOrder.status === "Delivered" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus("Delivered")}
                  disabled={selectedOrder.status === "Delivered"}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Delivered
                </Button>

                <Button
                  className="w-full justify-start"
                  variant={selectedOrder.status === "Cancelled" ? "default" : "outline"}
                  onClick={() => handleUpdateStatus("Cancelled")}
                  disabled={selectedOrder.status === "Cancelled"}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelled
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              Delete Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Sample Order Dialog */}
      <Dialog open={isCreateSampleOrderOpen} onOpenChange={setIsCreateSampleOrderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Sample Order</DialogTitle>
            <DialogDescription>
              This will create a sample order with skincare products to help you test the order history functionality.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Sample Products</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src="/images/skincare.jpeg" alt="Luxury Face Cream" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Luxury Face Cream</p>
                    <p className="text-xs text-gray-500">$49.99</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src="/images/serum.jpeg" alt="Hydrating Serum" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Hydrating Serum</p>
                    <p className="text-xs text-gray-500">$35.99</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src="/images/cleanser.webp" alt="Gentle Cleanser" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Gentle Cleanser</p>
                    <p className="text-xs text-gray-500">$24.99</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setIsCreateSampleOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createSampleOrder} className="bg-purple-600 hover:bg-purple-700">
              Create Sample Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

