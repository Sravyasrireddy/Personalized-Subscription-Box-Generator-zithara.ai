"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, PlusCircle, Upload, FileText, Camera, X, AlertCircle } from "lucide-react"
import type { Subscription, SubscriptionProduct } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProductManagementProps {
  subscription: Subscription
  onAddProduct: (product: SubscriptionProduct) => void
  onRemoveProduct: (productId: string) => void
  onAddCustomProduct: (product: Partial<SubscriptionProduct>) => void
  onViewDetails: (product: SubscriptionProduct) => void
}

export function ProductManagement({
  subscription,
  onAddProduct,
  onRemoveProduct,
  onAddCustomProduct,
  onViewDetails,
}: ProductManagementProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isConfirmRemoveOpen, setIsConfirmRemoveOpen] = useState(false)
  const [productToRemove, setProductToRemove] = useState<SubscriptionProduct | null>(null)

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductCategory, setNewProductCategory] = useState("skincare")
  const [newProductDescription, setNewProductDescription] = useState("")
  const [uploadErrors, setUploadErrors] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(Date.now())
  const fileInputRef = useRef<HTMLInputElement>(null)

  const confirmRemoveProduct = (product: SubscriptionProduct) => {
    setProductToRemove(product)
    setIsConfirmRemoveOpen(true)
  }

  const handleRemoveProduct = () => {
    if (!productToRemove) return
    onRemoveProduct(productToRemove.id)
    setIsConfirmRemoveOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadErrors((prev) => [...prev, "Image size must be less than 5MB"])
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadErrors((prev) => [...prev, "File must be an image"])
        return
      }

      // Clear errors if validation passes
      setUploadErrors([])

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string)
          // Store the image in localStorage to persist across refreshes
          localStorage.setItem("temp-product-image", event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadErrors((prev) => [...prev, "Image size must be less than 5MB"])
        return
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setUploadErrors((prev) => [...prev, "File must be an image"])
        return
      }

      // Clear errors if validation passes
      setUploadErrors([])

      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetUploadForm = () => {
    setNewProductName("")
    setNewProductPrice("")
    setNewProductDescription("")
    setUploadedImage(null)
    setFileInputKey(Date.now()) // Reset file input
    setNewProductCategory("skincare")
    setUploadErrors([])
  }

  const validateUploadForm = (): boolean => {
    const errors: string[] = []

    if (!newProductName.trim()) {
      errors.push("Product name is required")
    }

    if (!newProductPrice || Number(newProductPrice) <= 0) {
      errors.push("Valid price is required")
    }

    if (!uploadedImage) {
      errors.push("Product image is required")
    }

    setUploadErrors(errors)
    return errors.length === 0
  }

  const handleAddCustomProduct = () => {
    if (!validateUploadForm()) {
      return
    }

    const newProduct = {
      name: newProductName,
      price: Number.parseFloat(newProductPrice),
      image: uploadedImage as string,
      category: newProductCategory,
      description: newProductDescription || `Custom ${newProductCategory} product`,
    }

    onAddCustomProduct(newProduct)
    resetUploadForm()
    setIsUploadOpen(false)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Product Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Custom Product</DialogTitle>
            <DialogDescription>Add your own product to your subscription box</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom-product-name">Product Name *</Label>
                <Input
                  id="custom-product-name"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-product-price">Price ($) *</Label>
                <Input
                  id="custom-product-price"
                  type="number"
                  value={newProductPrice}
                  onChange={(e) => setNewProductPrice(e.target.value)}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-product-category">Category *</Label>
                <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                  <SelectTrigger id="custom-product-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women's Wear</SelectItem>
                    <SelectItem value="men">Men's Wear</SelectItem>
                    <SelectItem value="kids">Kids' Wear</SelectItem>
                    <SelectItem value="skincare">Skincare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-product-description">Description</Label>
                <Textarea
                  id="custom-product-description"
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Product Image *</Label>
              <div
                className={`border-2 border-dashed rounded-md p-4 text-center h-full flex flex-col justify-center ${
                  isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="relative">
                    <div className="relative h-40 w-full">
                      <Image
                        src={uploadedImage || "/placeholder.svg?height=200&width=300"}
                        alt="Product preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full"
                      onClick={() => setUploadedImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Camera className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop an image here, or click to select</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      key={fileInputKey}
                      ref={fileInputRef}
                    />
                    <Button variant="outline" type="button" className="cursor-pointer" onClick={triggerFileInput}>
                      Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {uploadErrors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {uploadErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomProduct} className="bg-pink-600 hover:bg-pink-700">
              Add Custom Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Remove Dialog */}
      <Dialog open={isConfirmRemoveOpen} onOpenChange={setIsConfirmRemoveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {productToRemove?.name} from your subscription?
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmRemoveOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveProduct}>
              Remove Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <Button className="w-full bg-amber-600 hover:bg-amber-700" onClick={() => setIsUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Custom Product
        </Button>

        {subscription.products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-md transition-all"
          >
            <div
              className="relative w-16 h-16 rounded-md overflow-hidden cursor-pointer"
              onClick={() => onViewDetails(product)}
            >
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
              <h3 className="font-medium">{product.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                <Badge variant="outline" className="text-xs">
                  {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : "Other"}
                </Badge>
                {product.brand && (
                  <Badge variant="outline" className="text-xs">
                    {product.brand}
                  </Badge>
                )}
                {product.size && (
                  <Badge variant="outline" className="text-xs">
                    {product.size}
                  </Badge>
                )}
              </div>
              {product.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.description}</p>}
              {product.fromFile && (
                <Badge variant="outline" className="mt-1 text-xs bg-blue-50">
                  From file: {product.fileName}
                </Badge>
              )}
            </div>
            <div className="font-bold">${product.price.toFixed(2)}</div>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => confirmRemoveProduct(product)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {subscription.products.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-md">
            <FileText className="h-12 w-12 text-gray-400 mb-2" />
            <p className="text-gray-500 mb-4">Your subscription box is empty</p>
            <Button onClick={() => setIsUploadOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Custom Product
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

