"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function FeaturedBoxes() {
  const router = useRouter()

  return (
    <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Personalized Boxes
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Women's Box */}
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-lg h-64 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/subscription?category=women")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Image src="/images/women/women1.jpeg" alt="Women's Collection" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 to-transparent flex items-end">
              <h3 className="text-white text-2xl font-bold p-6">Women</h3>
            </div>
          </motion.div>

          {/* Laptops Box - Updated from Men's */}
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-lg h-64 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/subscription?category=laptops")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image src="/images/laptops/laptop1.jpeg" alt="Laptops Collection" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end">
              <h3 className="text-white text-2xl font-bold p-6">Laptops</h3>
            </div>
          </motion.div>

          {/* Kids' Box */}
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-lg h-64 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/subscription?category=kids")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Image src="/images/kids/kids1.jpeg" alt="Kids' Collection" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent flex items-end">
              <h3 className="text-white text-2xl font-bold p-6">Kids</h3>
            </div>
          </motion.div>

          {/* Skincare Box */}
          <motion.div
            className="relative overflow-hidden rounded-xl shadow-lg h-64 cursor-pointer"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            onClick={() => router.push("/subscription?category=skincare")}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Image src="/images/skincare-blue.webp" alt="Skincare Collection" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent flex items-end">
              <h3 className="text-white text-2xl font-bold p-6">Skincare</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

