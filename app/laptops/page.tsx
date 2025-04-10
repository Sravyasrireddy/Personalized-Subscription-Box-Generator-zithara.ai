import type { Metadata } from "next"
import LaptopsClientPage from "./LaptopsClientPage"

export const metadata: Metadata = {
  title: "Laptops Collection - PersonalizedBox",
  description: "Browse our collection of high-performance laptops for work and play.",
}

export default function LaptopsPage() {
  return <LaptopsClientPage />
}

