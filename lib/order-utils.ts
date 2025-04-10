// Centralized order utilities to ensure consistency across all pages

export interface OrderItem {
  id: string | number
  name: string
  price: number
  image: string
  quantity: number
  category?: string
}

export interface Order {
  id: string
  date: string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled"
  items: OrderItem[]
  total: number
  trackingNumber?: string
  shippingAddress: string
  isRemoval?: boolean
  isAddition?: boolean
  isCustom?: boolean
  isFileUpload?: boolean
  fileName?: string
  categories?: string[]
  categoryBreakdown?: { category: string; count: number; subtotal: number }[]
}

// Function to get order history - used by all components
export function getOrderHistory(): Order[] {
  if (typeof window === "undefined") return []

  try {
    const savedOrderHistory = localStorage.getItem("order-history")
    if (savedOrderHistory) {
      const parsedOrders = JSON.parse(savedOrderHistory)
      console.log("Retrieved order history:", parsedOrders)

      // Ensure all orders have a status
      const validatedOrders = parsedOrders.map((order: Order) => ({
        ...order,
        status: order.status || "Processing", // Default to Processing if status is missing
      }))

      // If we had to fix any orders, save them back
      if (JSON.stringify(validatedOrders) !== JSON.stringify(parsedOrders)) {
        localStorage.setItem("order-history", JSON.stringify(validatedOrders))
        console.log("Fixed and saved orders with missing status")
      }

      return validatedOrders
    }
  } catch (error) {
    console.error("Error getting order history:", error)
  }

  return []
}

// Function to save order history - used by all components
export function saveOrderHistory(orders: Order[]): void {
  if (typeof window === "undefined") return

  try {
    // Make sure all orders have a status
    const validatedOrders = orders.map((order) => ({
      ...order,
      status: order.status || "Processing", // Default to Processing if status is missing
    }))

    localStorage.setItem("order-history", JSON.stringify(validatedOrders))
    console.log("Saved order history:", validatedOrders)

    // Dispatch a custom event to notify other components
    window.dispatchEvent(
      new CustomEvent("order-history-updated", {
        detail: { orders: validatedOrders },
      }),
    )

    // Also dispatch a storage event for cross-tab communication
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "order-history",
        newValue: JSON.stringify(validatedOrders),
        storageArea: localStorage,
      }),
    )
  } catch (error) {
    console.error("Error saving order history:", error)
  }
}

// Function to add a new order to history
export function addOrderToHistory(newOrder: Order): void {
  // Ensure the order has a status
  if (!newOrder.status) {
    newOrder.status = "Processing"
  }

  // Get current history
  const currentHistory = getOrderHistory()

  // Check if order already exists (prevent duplicates)
  const orderExists = currentHistory.some((order) => order.id === newOrder.id)
  if (orderExists) {
    console.log("Order already exists in history, not adding duplicate:", newOrder.id)
    return
  }

  // Add new order to the beginning
  const updatedHistory = [newOrder, ...currentHistory]

  // Save updated history
  saveOrderHistory(updatedHistory)

  // Log for debugging
  console.log("Added new order to history:", newOrder)
  console.log("Updated order history:", updatedHistory)

  // Direct update to localStorage as a fallback
  try {
    localStorage.setItem("order-history", JSON.stringify(updatedHistory))
  } catch (error) {
    console.error("Error directly updating localStorage:", error)
  }
}

// Function to update an existing order
export function updateOrderStatus(
  orderId: string,
  newStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled",
): void {
  // Get current history
  const currentHistory = getOrderHistory()

  // Find and update the order
  const updatedHistory = currentHistory.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))

  // Save updated history
  saveOrderHistory(updatedHistory)

  console.log(`Updated order ${orderId} status to ${newStatus}`)
}

// Function to clear order history (for testing)
export function clearOrderHistory(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("order-history")
  console.log("Order history cleared")
}

// Function to get order details for success page
export function getOrderDetails() {
  if (typeof window === "undefined") return null

  try {
    const orderDetails = localStorage.getItem("orderDetails")
    if (orderDetails) {
      return JSON.parse(orderDetails)
    }
  } catch (error) {
    console.error("Error getting order details:", error)
  }

  return null
}

// Function to save order details for success page
export function saveOrderDetails(details: any): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("orderDetails", JSON.stringify(details))
    console.log("Saved order details:", details)

    // Dispatch a storage event for cross-tab communication
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "orderDetails",
        newValue: JSON.stringify(details),
        storageArea: localStorage,
      }),
    )
  } catch (error) {
    console.error("Error saving order details:", error)
  }
}

