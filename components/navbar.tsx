"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ShoppingCart, Heart, User, Search, ChevronDown, Package, Home, Sparkles, Laptop } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()

  // Check if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get cart count from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem("chatbot-cart") || "[]")
        setCartCount(cart.length)
      }

      updateCartCount()
      window.addEventListener("storage", updateCartCount)

      // Custom event for cart updates
      window.addEventListener("cart-updated", updateCartCount)

      return () => {
        window.removeEventListener("storage", updateCartCount)
        window.removeEventListener("cart-updated", updateCartCount)
      }
    }
  }, [])

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center mr-8">
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text whitespace-nowrap">
              PersonalizedBox
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/subscription"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/subscription") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Subscription
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-pink-600 whitespace-nowrap">
                  Create Box <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/personalized-box" className="w-full cursor-pointer">
                    Personalized Box
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription?category=women" className="w-full cursor-pointer">
                    Women's Box
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription?category=laptops" className="w-full cursor-pointer">
                    Laptops Box
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription?category=kids" className="w-full cursor-pointer">
                    Kids' Box
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subscription?category=skincare" className="w-full cursor-pointer">
                    Skincare Box
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href="/subscription/manage"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/subscription/manage") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Manage
            </Link>
            <Link
              href="/subscription/history"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/subscription/history") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/ai-integration"
              className={`text-sm font-medium transition-colors hover:text-pink-600 whitespace-nowrap ${
                isActive("/ai-integration") ? "text-pink-600" : "text-gray-700"
              }`}
            >
              <div className="flex items-center">
                AI <Badge className="ml-2 bg-gradient-to-r from-pink-600 to-purple-600">New</Badge>
              </div>
            </Link>
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex relative">
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
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5 text-gray-700" />
              </Button>
            </Link>

            {/* AI Shopping Button */}
            <Button
              className="hidden md:flex bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
              onClick={() => {
                // Trigger the AI chatbot to open
                const event = new CustomEvent("open-chatbot")
                window.dispatchEvent(event)
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" /> AI Shopping
            </Button>

            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <nav className="flex flex-col h-full">
                  <div className="py-4">
                    <Link
                      href="/"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Home className="mr-2 h-5 w-5" />
                      Home
                    </Link>
                    <Link
                      href="/subscription"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Subscription
                    </Link>
                    <Link
                      href="/personalized-box"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Create Box
                    </Link>
                    <Link
                      href="/subscription/manage"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Manage Subscription
                    </Link>
                    <Link
                      href="/subscription/history"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Order History
                    </Link>
                    <Link
                      href="/ai-integration"
                      className="flex items-center py-2 text-lg font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Integration
                      <Badge className="ml-2 bg-gradient-to-r from-pink-600 to-purple-600">New</Badge>
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
                    <Link
                      href="/subscription?category=women"
                      className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                    >
                      Women's Collection
                    </Link>
                    <Link
                      href="/subscription?category=laptops"
                      className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                    >
                      <Laptop className="mr-2 h-5 w-5" />
                      Laptops Collection
                    </Link>
                    <Link
                      href="/subscription?category=kids"
                      className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                    >
                      Kids' Collection
                    </Link>
                    <Link
                      href="/subscription?category=skincare"
                      className="flex items-center py-2 text-base font-medium text-gray-700 hover:text-pink-600"
                    >
                      Skincare
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 py-4 mt-auto">
                    <div className="flex items-center justify-between">
                      <Link href="/account" className="flex items-center text-gray-700 hover:text-pink-600">
                        <User className="mr-2 h-5 w-5" />
                        Account
                      </Link>
                      <Link href="/cart" className="flex items-center text-gray-700 hover:text-pink-600">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Cart
                        {cartCount > 0 && <Badge className="ml-1 bg-pink-600">{cartCount}</Badge>}
                      </Link>
                      <Link href="/wishlist" className="flex items-center text-gray-700 hover:text-pink-600">
                        <Heart className="mr-2 h-5 w-5" />
                        Wishlist
                      </Link>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

