"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, User, Search, Sparkles } from "lucide-react"

export function PageHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/")
  }

  return (
    <header className="w-full border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
              PersonalizedBox
            </span>
          </Link>

          {/* Main Navigation - Single Line with Proper Spacing */}
          <nav className="hidden lg:flex items-center space-x-12">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-pink-600 ${
                isActive("/") &&
                !isActive("/subscription") &&
                !isActive("/personalized-box") &&
                !isActive("/ai-integration")
                  ? "text-pink-600"
                  : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/personalized-box"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/personalized-box") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Create Box
            </Link>
            <Link
              href="/subscription/manage"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/subscription/manage") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Manage Subscription
            </Link>
            <Link
              href="/subscription/history"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/subscription/history") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Order History
            </Link>
            <Link
              href="/ai-integration"
              className={`text-sm font-medium transition-colors hover:text-pink-600 flex items-center whitespace-nowrap ${
                isActive("/ai-integration") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              AI Integration
              <Badge className="ml-2 bg-gradient-to-r from-pink-600 to-purple-600">New</Badge>
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-[200px] h-9 rounded-full bg-gray-100 border-0 focus-visible:ring-pink-600"
              />
            </div>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>
            <Button
              className="hidden lg:flex bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              onClick={() => {
                // Trigger the AI chatbot to open
                const event = new CustomEvent("open-chatbot")
                window.dispatchEvent(event)
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> AI Shopping
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

