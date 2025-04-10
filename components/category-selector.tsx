"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CategorySelector() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")

  const handleCategoryChange = (value: string) => {
    setActiveCategory(value)
    router.push(`/subscription?category=${value}`)
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Explore Our Clothing Collections
        </motion.h2>

        <Tabs defaultValue="all" className="w-full" onValueChange={handleCategoryChange}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
            <TabsTrigger value="all">All Collections</TabsTrigger>
            <TabsTrigger value="women">Women's Collection</TabsTrigger>
            <TabsTrigger value="laptops">Laptops Collection</TabsTrigger>
            <TabsTrigger value="kids">Kids' Collection</TabsTrigger>
            <TabsTrigger value="skincare">Skincare</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Women's Collection</h3>
            <p className="text-gray-700 mb-4">Curated fashion essentials for the modern woman</p>
            <Button
              variant="outline"
              className="border-pink-500 text-pink-600 hover:bg-pink-50"
              onClick={() => router.push("/subscription?category=women")}
            >
              Explore
            </Button>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Laptops Collection</h3>
            <p className="text-gray-700 mb-4">High-performance laptops for work and play</p>
            <Button
              variant="outline"
              className="border-blue-500 text-blue-600 hover:bg-blue-50"
              onClick={() => router.push("/subscription?category=laptops")}
            >
              Explore
            </Button>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Kids' Collection</h3>
            <p className="text-gray-700 mb-4">Fun and practical clothing for children of all ages</p>
            <Button
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
              onClick={() => router.push("/subscription?category=kids")}
            >
              Explore
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

