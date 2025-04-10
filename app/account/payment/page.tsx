"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CreditCard, Check, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface PaymentMethod {
  id: string
  type: string
  cardNumber: string
  cardName: string
  expiryDate: string
  isDefault: boolean
}

export default function PaymentMethodPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "card-1",
      type: "Visa",
      cardNumber: "**** **** **** 4242",
      cardName: "Sravya",
      expiryDate: "12/25",
      isDefault: true,
    },
  ])

  const [newCard, setNewCard] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    isDefault: false,
  })

  const handleSavePaymentMethod = () => {
    // Validate form
    if (!newCard.cardNumber || !newCard.cardName || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Create new payment method
    const newPaymentMethod: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: getCardType(newCard.cardNumber),
      cardNumber: maskCardNumber(newCard.cardNumber),
      cardName: newCard.cardName,
      expiryDate: `${newCard.expiryMonth}/${newCard.expiryYear}`,
      isDefault: newCard.isDefault,
    }

    // Update default status if needed
    let updatedMethods = [...paymentMethods]
    if (newCard.isDefault) {
      updatedMethods = updatedMethods.map((method) => ({
        ...method,
        isDefault: false,
      }))
    }

    // Add new method
    updatedMethods.push(newPaymentMethod)

    // Save to state and localStorage
    setPaymentMethods(updatedMethods)
    localStorage.setItem("payment-methods", JSON.stringify(updatedMethods))

    // Reset form
    setNewCard({
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      isDefault: false,
    })

    toast({
      title: "Payment method added",
      description: "Your new payment method has been added successfully.",
    })
  }

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedMethods)
    localStorage.setItem("payment-methods", JSON.stringify(updatedMethods))

    toast({
      title: "Default payment updated",
      description: "Your default payment method has been updated.",
    })
  }

  const handleDeletePaymentMethod = (id: string) => {
    const methodToDelete = paymentMethods.find((method) => method.id === id)

    // Don't allow deleting the only payment method
    if (paymentMethods.length === 1) {
      toast({
        title: "Cannot delete payment method",
        description: "You must have at least one payment method.",
        variant: "destructive",
      })
      return
    }

    // Don't allow deleting the default payment method
    if (methodToDelete?.isDefault) {
      toast({
        title: "Cannot delete default payment method",
        description: "Please set another payment method as default first.",
        variant: "destructive",
      })
      return
    }

    const updatedMethods = paymentMethods.filter((method) => method.id !== id)
    setPaymentMethods(updatedMethods)
    localStorage.setItem("payment-methods", JSON.stringify(updatedMethods))

    toast({
      title: "Payment method deleted",
      description: "Your payment method has been deleted.",
    })
  }

  // Helper functions
  const getCardType = (cardNumber: string): string => {
    // Very basic card type detection
    if (cardNumber.startsWith("4")) return "Visa"
    if (cardNumber.startsWith("5")) return "Mastercard"
    if (cardNumber.startsWith("3")) return "American Express"
    if (cardNumber.startsWith("6")) return "Discover"
    return "Credit Card"
  }

  const maskCardNumber = (cardNumber: string): string => {
    // Remove spaces and non-numeric characters
    const cleaned = cardNumber.replace(/\D/g, "")
    // Mask all but last 4 digits
    return `**** **** **** ${cleaned.slice(-4)}`
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
          Payment Methods
        </h1>
      </div>

      <div className="space-y-8">
        {/* Existing Payment Methods */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Your Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-2 rounded-md">
                    <CreditCard className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.type}</p>
                      {method.isDefault && <Badge className="bg-green-600">Default</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">{method.cardNumber}</p>
                    <p className="text-sm text-gray-500">Expires: {method.expiryDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Add New Payment Method */}
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-pink-600" />
              Add New Payment Method
            </CardTitle>
            <CardDescription>Add a new credit or debit card</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="Sravya"
                value={newCard.cardName}
                onChange={(e) => setNewCard({ ...newCard, cardName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Expiry Month</Label>
                <Select
                  value={newCard.expiryMonth}
                  onValueChange={(value) => setNewCard({ ...newCard, expiryMonth: value })}
                >
                  <SelectTrigger id="expiryMonth">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, "0")
                      return (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryYear">Expiry Year</Label>
                <Select
                  value={newCard.expiryYear}
                  onValueChange={(value) => setNewCard({ ...newCard, expiryYear: value })}
                >
                  <SelectTrigger id="expiryYear">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() + i).toString().slice(-2)
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                className="rounded text-pink-600"
                checked={newCard.isDefault}
                onChange={(e) => setNewCard({ ...newCard, isDefault: e.target.checked })}
              />
              <Label htmlFor="isDefault">Set as default payment method</Label>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 p-6 flex justify-end">
            <Button variant="outline" className="mr-2" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSavePaymentMethod}>
              <Check className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

