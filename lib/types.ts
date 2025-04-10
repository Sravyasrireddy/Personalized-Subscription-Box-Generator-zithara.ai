export interface SubscriptionProduct {
  id: string
  name: string
  price: number
  image: string
  category?: string
  description?: string
  brand?: string
  sku?: string
  color?: string
  size?: string
  material?: string
  fromFile?: boolean
  fileName?: string
}

export interface Subscription {
  id: string
  status: "active" | "paused" | "cancelled"
  plan: "monthly" | "quarterly" | "yearly"
  nextDelivery: string
  products: SubscriptionProduct[]
}

