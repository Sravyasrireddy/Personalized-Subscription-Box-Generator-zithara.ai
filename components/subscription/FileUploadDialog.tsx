"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileText, Upload, AlertCircle } from "lucide-react"
import type { SubscriptionProduct } from "@/lib/types"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductsUploaded: (products: SubscriptionProduct[], fileName: string) => void
}

export function FileUploadDialog({ open, onOpenChange, onProductsUploaded }: FileUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    const validTypes = ["application/json", "text/csv"]
    if (!validTypes.includes(selectedFile.type)) {
      setErrors(["Please upload a JSON or CSV file"])
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors(["File size must be less than 5MB"])
      return
    }

    setFile(selectedFile)
    setErrors([])
  }

  const handleUpload = async () => {
    if (!file) {
      setErrors(["Please select a file to upload"])
      return
    }

    setIsUploading(true)
    setErrors([])

    try {
      // Read the file
      const fileContent = await readFileContent(file)

      // Parse the file based on its type
      let products: SubscriptionProduct[] = []

      if (file.type === "application/json") {
        products = parseJsonProducts(fileContent)
      } else if (file.type === "text/csv") {
        products = parseCsvProducts(fileContent)
      }

      if (products.length === 0) {
        setErrors(["No valid products found in the file"])
        setIsUploading(false)
        return
      }

      // Call the callback with the parsed products
      onProductsUploaded(products, file.name)

      // Reset the form
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Close the dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Error processing file:", error)
      setErrors(["Error processing file. Please check the file format."])
    }

    setIsUploading(false)
  }

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  const parseJsonProducts = (content: string): SubscriptionProduct[] => {
    try {
      const data = JSON.parse(content)

      // Handle array of products
      if (Array.isArray(data)) {
        return data.map((item, index) => ({
          id: item.id || `json-${Date.now()}-${index}`,
          name: item.name || "Unknown Product",
          price: Number.parseFloat(item.price) || 0,
          image: item.image || "/placeholder.svg?height=200&width=300",
          category: item.category || "other",
          description: item.description || "",
          fromFile: true,
          fileName: file?.name,
        }))
      }

      // Handle single product
      if (data.name) {
        return [
          {
            id: data.id || `json-${Date.now()}`,
            name: data.name || "Unknown Product",
            price: Number.parseFloat(data.price) || 0,
            image: data.image || "/placeholder.svg?height=200&width=300",
            category: data.category || "other",
            description: data.description || "",
            fromFile: true,
            fileName: file?.name,
          },
        ]
      }

      return []
    } catch (error) {
      console.error("Error parsing JSON:", error)
      setErrors(["Invalid JSON format"])
      return []
    }
  }

  const parseCsvProducts = (content: string): SubscriptionProduct[] => {
    try {
      // Split by lines and remove empty lines
      const lines = content.split("\n").filter((line) => line.trim() !== "")

      if (lines.length < 2) {
        setErrors(["CSV file must have a header row and at least one data row"])
        return []
      }

      // Parse header row
      const headers = lines[0].split(",").map((header) => header.trim().toLowerCase())

      // Check required columns
      const nameIndex = headers.indexOf("name")
      const priceIndex = headers.indexOf("price")

      if (nameIndex === -1 || priceIndex === -1) {
        setErrors(["CSV file must have 'name' and 'price' columns"])
        return []
      }

      // Parse data rows
      const products: SubscriptionProduct[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((value) => value.trim())

        if (values.length >= Math.max(nameIndex, priceIndex) + 1) {
          const product: SubscriptionProduct = {
            id: `csv-${Date.now()}-${i}`,
            name: values[nameIndex] || "Unknown Product",
            price: Number.parseFloat(values[priceIndex]) || 0,
            image: "/placeholder.svg?height=200&width=300",
            fromFile: true,
            fileName: file?.name,
          }

          // Add optional fields if they exist
          const categoryIndex = headers.indexOf("category")
          if (categoryIndex !== -1 && values[categoryIndex]) {
            product.category = values[categoryIndex]
          }

          const descriptionIndex = headers.indexOf("description")
          if (descriptionIndex !== -1 && values[descriptionIndex]) {
            product.description = values[descriptionIndex]
          }

          const imageIndex = headers.indexOf("image")
          if (imageIndex !== -1 && values[imageIndex]) {
            product.image = values[imageIndex]
          }

          products.push(product)
        }
      }

      return products
    } catch (error) {
      console.error("Error parsing CSV:", error)
      setErrors(["Invalid CSV format"])
      return []
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Products File</DialogTitle>
          <DialogDescription>
            Upload a JSON or CSV file containing product information to add multiple products at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <Input id="file-upload" type="file" accept=".json,.csv" onChange={handleFileChange} ref={fileInputRef} />
            <p className="text-xs text-gray-500">Accepted formats: JSON, CSV. Maximum file size: 5MB.</p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-4">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
            <h4 className="text-sm font-medium text-amber-800 mb-1">File Format Requirements:</h4>
            <ul className="text-xs text-amber-700 list-disc pl-4 space-y-1">
              <li>JSON: Array of objects with name, price, and optional category, description, image fields</li>
              <li>CSV: Header row with name, price columns (category, description, image are optional)</li>
              <li>Only women, men, kids, and skincare categories will be displayed</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading} className="bg-blue-600 hover:bg-blue-700">
            {isUploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Products
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

