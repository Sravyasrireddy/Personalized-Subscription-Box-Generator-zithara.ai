"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function Hero() {
  const router = useRouter()

  return (
    <div className="relative h-[500px] w-full overflow-hidden bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
      <div className="absolute inset-0 bg-black/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your{" "}
          <motion.span
            className="text-pink-200"
            animate={{
              color: ["#fecdd3", "#f9a8d4", "#f472b6", "#fecdd3"],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            Personalized
          </motion.span>{" "}
          Box
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          AI-powered subscription boxes tailored to your unique preferences
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push("/subscription")}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            className="bg-white text-pink-600 hover:bg-pink-100 hover:text-pink-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => router.push("/ai-integration")}
          >
            Learn About AI
          </Button>
        </motion.div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            className="bg-pink-600 hover:bg-pink-700"
            onClick={() => router.push("/subscription?category=women")}
          >
            Subscribe Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-pink-200 text-pink-600 hover:bg-pink-50"
            onClick={() => router.push("/personalized-box")}
          >
            Create Your Box
          </Button>
        </div>
      </div>
    </div>
  )
}
