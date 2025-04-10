"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import type { Subscription, SubscriptionProduct } from "@/lib/types"
import { SubscriptionActions } from "@/components/subscription/SubscriptionActions"
import { ProductManagement } from "@/components/subscription/ProductManagement"
import { FileUploadDialog } from "@/components/subscription/FileUploadDialog"
import { ProductCatalog } from "@/components/subscription/ProductCatalog"
import { PlusCircle } from "lucide-react"

export default function SubscriptionManagePage() {
  const router = useRouter()
  const { toast } = useToast()

  // Set default subscription with empty products array
  const [subscription, setSubscription] = useState<Subscription>({
    id: "SUB-1234",
    status: "active",
    plan: "monthly",
    nextDelivery: "May 15, 2024",
    products: [],
  })

  const [totalPrice, setTotalPrice] = useState(0)
  const [isAddProductsDialogOpen, setIsAddProductsDialogOpen] = useState(false)
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false)
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate total price whenever subscription products change
  useEffect(() => {
    const price = subscription.products.reduce((sum, product) => sum + product.price, 0)
    setTotalPrice(price)
  }, [subscription.products])

  // Load subscription from localStorage on mount and sync with order history
  useEffect(() => {
    setIsLoading(true)
    
    // Get order history first
    const orderHistory = JSON.parse(localStorage.getItem("order-history") || "[]")
    
    // Get saved subscription
    let savedSubscription = localStorage.getItem("user-subscription")
    let parsedSubscription: Subscription | null = null
    
    if (savedSubscription) {
      try {
        parsedSubscription = JSON.parse(savedSubscription)
        console.log("Loaded initial subscription from localStorage:", parsedSubscription)
      } catch (e) {
        console.error("Error parsing saved subscription:", e)
      }
    }
    
    // If no subscription exists, initialize with default one
    if (!parsedSubscription) {
      parsedSubscription = {
        id: "SUB-1234",
        status: "active",
        plan: "monthly",
        nextDelivery: "May 15, 2024",
        products: [
          {
            id: "skin-001",
            name: "Vitamin C Serum",
            price: 42,
            image: "/images/serum.jpeg",
            category: "skincare",
            description: "Brightening serum with 15% Vitamin C to reduce dark spots and improve skin tone.",
          },
          {
            id: "skin-002",
            name: "Hydrating Moisturizer",
            price: 38,
            image: "/images/moisturizer.jpeg",
            category: "skincare",
            description: "Rich moisturizer with hyaluronic acid for deep hydration.",
          },
          {
            id: "skin-003",
            name: "Gentle Cleanser",
            price: 28,
            image: "/images/cleanser.webp",
            category: "skincare",
            description: "Gentle foaming cleanser suitable for all skin types.",
          },
        ],
      }
    }
    
    // Now apply all orders to update the subscription products
    if (orderHistory.length > 0) {
      // Sort orders by date (newest first)
      orderHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      // Start with a copy of the products from parsedSubscription
      let updatedProducts = [...parsedSubscription.products]
      
      // Process each order to add or remove products
      orderHistory.forEach(order => {
        if (order.isRemoval) {
          // Handle removals
          order.items.forEach(item => {
            // Extract the original product ID (remove the " (Removed)" suffix if present)
            const productId = item.id
            // Remove this product from updatedProducts
            updatedProducts = updatedProducts.filter(p => p.id !== productId)
          })
        } else {
          // Handle additions
          order.items.forEach(item => {
            // Check if this product already exists
            const existingIndex = updatedProducts.findIndex(p => p.id === item.id)
            
            if (existingIndex === -1) {
              // If it doesn't exist, add it
              updatedProducts.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                category: item.category || "uncategorized",
                description: "",
                ...(order.isFileUpload && { 
                  fromFile: true,
                  fileName: order.fileName 
                }),
              })
            }
          })
        }
      })
      
      // Ensure we always have at least one product
      if (updatedProducts.length === 0 && parsedSubscription.products.length > 0) {
        updatedProducts = [parsedSubscription.products[0]]
      }
      
      // Update the subscription with the processed products
      parsedSubscription.products = updatedProducts
    }
    
    // Set the updated subscription to state
    setSubscription(parsedSubscription)
    
    // Save the updated subscription back to localStorage
    localStorage.setItem("user-subscription", JSON.stringify(parsedSubscription))
    
    setIsLoading(false)
  }, [])

  // Save subscription to localStorage whenever it changes
  useEffect(() => {
    if (subscription && !isLoading) {
      localStorage.setItem("user-subscription", JSON.stringify(subscription))
      console.log("Saved updated subscription to localStorage:", subscription)
    }
  }, [subscription, isLoading])

  const handleSkipDelivery = () => {
    // Calculate next month's date
    const currentDate = new Date(subscription.nextDelivery)
    currentDate.setMonth(currentDate.getMonth() + 1)
    const nextMonth = currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })

    setSubscription({
      ...subscription,
      nextDelivery: nextMonth,
    })

    toast({
      title: "Delivery Skipped",
      description: `Your next delivery is now scheduled for ${nextMonth}.`,
    })
  }

  const handlePauseResume = () => {
    setSubscription({
      ...subscription,
      status: subscription.status === "paused" ? "active" : "paused",
    })

    toast({
      title: subscription.status === "paused" ? "Subscription Resumed" : "Subscription Paused",
      description:
        subscription.status === "paused"
          ? "Your subscription has been successfully resumed."
          : "Your subscription has been paused. You won't receive any deliveries until you resume.",
    })
  }

  const handleCancel = () => {
    setSubscription({
      ...subscription,
      status: "cancelled",
    })

    toast({
      title: "Subscription Cancelled",
      description: "Your subscription has been cancelled. We're sorry to see you go!",
    })
  }

  const handleAddProduct = (product: SubscriptionProduct) => {
    // Add product to subscription
    const updatedProducts = [...subscription.products, product]
    const updatedSubscription = {
      ...subscription,
      products: updatedProducts,
    }

    // Update state
    setSubscription(updatedSubscription)

    // Immediately save to localStorage to ensure persistence
    localStorage.setItem("user-subscription", JSON.stringify(updatedSubscription))

    // Update order history
    const orderId = updateOrderHistory("add", [product])

    toast({
      title: "Product Added",
      description: `${product.name} has been added to your subscription (Order #${orderId}).`,
    })
  }

  const handleRemoveProduct = (productId: string) => {
    if (subscription.products.length <= 1) {
      toast({
        title: "Cannot Remove Product",
        description: "Your subscription must have at least one product.",
        variant: "destructive",
      })
      return
    }

    // Find the product to remove
    const productToRemove = subscription.products.find((p) => p.id === productId)
    if (!productToRemove) return

    // Update subscription by removing the product
    const updatedProducts = subscription.products.filter((product) => product.id !== productId)
    const updatedSubscription = {
      ...subscription,
      products: updatedProducts,
    }

    // Update state
    setSubscription(updatedSubscription)

    // Immediately save to localStorage to ensure persistence
    localStorage.setItem("user-subscription", JSON.stringify(updatedSubscription))

    // Update order history
    const orderId = updateOrderHistory("remove", [productToRemove])

    toast({
      title: "Product Removed",
      description: `${productToRemove.name} has been removed from your subscription (Order #${orderId}).`,
    })
  }

  const handleAddCustomProduct = (productData: Partial<SubscriptionProduct>) => {
    const newProduct: SubscriptionProduct = {
      id: `custom-${Date.now()}`,
      name: productData.name || "",
      price: productData.price || 0,
      image: productData.image || "/placeholder.svg?height=200&width=300",
      category: productData.category,
      description: productData.description,
    }

    // Add product to subscription
    const updatedProducts = [...subscription.products, newProduct]
    const updatedSubscription = {
      ...subscription,
      products: updatedProducts,
    }

    // Update state
    setSubscription(updatedSubscription)

    // Immediately save to localStorage to ensure persistence
    localStorage.setItem("user-subscription", JSON.stringify(updatedSubscription))

    // Update order history
    const orderId = updateOrderHistory("add", [newProduct], { isCustom: true })

    toast({
      title: "Custom Product Added",
      description: `${newProduct.name} has been added to your subscription (Order #${orderId}).`,
    })
  }

  const handleFileUpload = (products: SubscriptionProduct[], fileName: string) => {
    if (products.length === 0) {
      toast({
        title: "No Products Found",
        description: "No valid products were found in the uploaded file.",
        variant: "destructive",
      })
      return
    }

    // Filter products to only include allowed categories
    const allowedCategories = ["women", "men", "kids", "skincare"]
    const filteredProducts = products.filter(
      (product) => !product.category || allowedCategories.includes(product.category.toLowerCase()),
    )

    if (filteredProducts.length === 0) {
      toast({
        title: "No Valid Products Found",
        description: "No products with allowed categories (women, men, kids, skincare) were found in the file.",
        variant: "destructive",
      })
      return
    }

    // Add products to subscription
    const updatedProducts = [...subscription.products, ...filteredProducts]
    const updatedSubscription = {
      ...subscription,
      products: updatedProducts,
    }

    // Update state
    setSubscription(updatedSubscription)

    // Immediately save to localStorage to ensure persistence
    localStorage.setItem("user-subscription", JSON.stringify(updatedSubscription))

    // Update order history
    const orderId = updateOrderHistory("add", filteredProducts, { isFileUpload: true, fileName })

    toast({
      title: "Products Uploaded",
      description: `${filteredProducts.length} products from ${fileName} have been added to your subscription (Order #${orderId}).`,
    })
  }

  const handleViewProductDetails = (product: SubscriptionProduct) => {
    setSelectedProduct(product)
    setIsProductDetailsOpen(true)
  }

  const updateOrderHistory = (
    action: "add" | "remove",
    products: SubscriptionProduct[],
    details?: { isCustom?: boolean; isFileUpload?: boolean; fileName?: string },
  ) => {
    const existingOrders = JSON.parse(localStorage.getItem("order-history") || "[]")

    const newOrder = {
      id: `SB${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      status: action === "add" ? "Processing" : "Cancelled",
      items: products.map((product) => ({
        id: product.id,
        name: action === "remove" ? `${product.name} (Removed)` : product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category,
      })),
      total: products.reduce((sum, product) => sum + product.price, 0),
      shippingAddress: "123 Main St, New York, NY 10001",
      ...(action === "remove" && { isRemoval: true }),
      ...(details?.isCustom && { isCustom: true }),
      ...(details?.isFileUpload && {
        isFileUpload: true,
        fileName: details.fileName,
      }),
    }

    // Save to localStorage
    localStorage.setItem("order-history", JSON.stringify([newOrder, ...existingOrders]))

    return newOrder.id
  }

  // Calculate billing based on subscription plan
  const calculateBilling = () => {
    const monthlyPrice = totalPrice

    switch (subscription.plan) {
      case "quarterly":
        return {
          cycle: "Quarterly",
          price: (monthlyPrice * 3 * 0.9).toFixed(2), // 10% discount
          savings: "10%",
        }
      case "yearly":
        return {
          cycle: "Yearly",
          price: (monthlyPrice * 12 * 0.8).toFixed(2), // 20% discount
          savings: "20%",
        }
      default:
        return {
          cycle: "Monthly",
          price: monthlyPrice.toFixed(2),
          savings: "0%",
        }
    }
  }

  const billing = calculateBilling()

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading subscription data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
            Manage Your Subscription
          </h1>
          <p className="text-gray-600">
            View and manage your subscription details, upcoming deliveries, and box contents.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <Button variant="outline" onClick={() => router.push("/subscription/history")}>
            View Order History
          </Button>
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => router.push("/subscription")}>
            Modify Box Contents
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="overview">Subscription Details</TabsTrigger>
          <TabsTrigger value="products">Manage Products</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>View and manage your current subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscription ID:</span>
                    <span className="font-medium">{subscription.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      className={
                        subscription.status === "active"
                          ? "bg-green-600"
                          : subscription.status === "paused"
                            ? "bg-amber-600"
                            : "bg-red-600"
                      }
                    >
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">
                      {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Delivery:</span>
                    <span className="font-medium">{subscription.nextDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-medium">{subscription.products.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Price:</span>
                    <span className="font-medium">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing Cycle:</span>
                    <span className="font-medium">
                      {billing.cycle} (${billing.price})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Savings:</span>
                    <span className="font-medium text-green-600">{billing.savings}</span>
                  </div>
                </div>

                <SubscriptionActions
                  subscription={subscription}
                  onSkipDelivery={handleSkipDelivery}
                  onPauseResume={handlePauseResume}
                  onCancel={handleCancel}
                  onManageProducts={() => setIsAddProductsDialogOpen(true)}
                  onUploadFile={() => setIsFileUploadDialogOpen(true)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Subscription Box Preview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Box Contents</CardTitle>
              <CardDescription>
                Your next box will include these items. You can modify your box anytime before the processing date.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscription.products.length === 0 ? (
                  <p className="col-span-3 text-center text-gray-500 py-4">
                    No products in your subscription box. Add some products to get started!
                  </p>
                ) : (
                  <>
                    {subscription.products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleViewProductDetails(product)}
                      >
                        <div className="relative h-14 w-14 rounded-md overflow-hidden">
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
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-gray-500">${product.price}</p>
                          {product.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {subscription.products.length > 3 && (
                      <div className="flex items-center justify-center p-2 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-500">+{subscription.products.length - 3} more products</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Products: {subscription.products.length}</p>
                  <p className="font-bold">${totalPrice.toFixed(2)} / month</p>
                </div>
                <Button onClick={() => router.push("/subscription")} variant="outline">
                  View All Products
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Add, remove, or edit products in your subscription box</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsAddProductsDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Products
                </Button>

                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsFileUploadDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Upload Products File
                </Button>
              </div>

              <ProductManagement
                subscription={subscription}
                onAddProduct={handleAddProduct}
                onRemoveProduct={handleRemoveProduct}
                onAddCustomProduct={handleAddCustomProduct}
                onViewDetails={handleViewProductDetails}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Monthly Price</p>
                <p className="font-bold text-lg">${totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {billing.cycle} billing: ${billing.price} (Save {billing.savings})
                </p>
              </div>
              <Button onClick={() => router.push("/subscription")} className="bg-pink-600 hover:bg-pink-700">
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Products Dialog */}
      <Dialog open={isAddProductsDialogOpen} onOpenChange={setIsAddProductsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add Products to Your Subscription</DialogTitle>
            <DialogDescription>Browse our catalog and add products to your subscription box</DialogDescription>
          </DialogHeader>
          <ProductCatalog
            currentProducts={subscription.products}
            onAddProduct={(product) => {
              handleAddProduct(product)
              // Don't close dialog to allow adding multiple products
            }}
          />
          <div className="flex justify-end">
            <Button onClick={() => setIsAddProductsDialogOpen(false)}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
        onProductsUploaded={handleFileUpload}
      />

      {/* Product Details Dialog */}
      <Dialog open={isProductDetailsOpen} onOpenChange={setIsProductDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <div className="relative h-60 w-full rounded-md overflow-hidden">
                <Image
                  src={selectedProduct.image || "/placeholder.svg?height=200&width=300"}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback for broken images
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
              </div>

              <div>
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">
                    Category:{" "}
                    {selectedProduct.category
                      ? selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1)
                      : "Uncategorized"}
                  </Badge>
                  {selectedProduct.brand && <Badge variant="outline">Brand: {selectedProduct.brand}</Badge>}
                  {selectedProduct.sku && <Badge variant="outline">SKU: {selectedProduct.sku}</Badge>}
                </div>
                <p className="text-lg font-bold mt-3">${selectedProduct.price.toFixed(2)}</p>
                {selectedProduct.fromFile && (
                  <Badge variant="outline" className="mt-2">
                    From file: {selectedProduct.fileName}
                  </Badge>
                )}
              </div>

              {selectedProduct.description && (
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedProduct.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-2">
                {selectedProduct.color && (
                  <div>
                    <h4 className="text-sm font-medium">Color</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.color}</p>
                  </div>
                )}
                {selectedProduct.size && (
                  <div>
                    <h4 className="text-sm font-medium">Size</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.size}</p>
                  </div>
                )}
                {selectedProduct.material && (
                  <div>
                    <h4 className="text-sm font-medium">Material</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.material}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsProductDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleRemoveProduct(selectedProduct.id)
                    setIsProductDetailsOpen(false)
                  }}
                >
                  Remove from Box
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}