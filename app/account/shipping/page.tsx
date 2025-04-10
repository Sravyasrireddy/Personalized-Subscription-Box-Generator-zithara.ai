"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ShippingAddressPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [addressData, setAddressData] = useState({
    firstName: "John",
    lastName: "Doe",
    street: "123 Main St",
    apartment: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phone: "555-123-4567",
    isDefault: true,
  })

  const handleSaveAddress = () => {
    // Save address to localStorage
    localStorage.setItem("shipping-address", JSON.stringify(addressData))

    toast({
      title: "Address updated",
      description: "Your shipping address has been updated successfully.",
    })

    // Redirect back to subscription management
    router.push("/subscription/manage")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
          Update Shipping Address
        </h1>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-pink-600" />
            Shipping Address
          </CardTitle>
          <CardDescription>Update your shipping address for subscription deliveries</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={addressData.firstName}
                onChange={(e) => setAddressData({ ...addressData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={addressData.lastName}
                onChange={(e) => setAddressData({ ...addressData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={addressData.street}
              onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
            <Input
              id="apartment"
              value={addressData.apartment}
              onChange={(e) => setAddressData({ ...addressData, apartment: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={addressData.city}
                onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Select
                value={addressData.state}
                onValueChange={(value) => setAddressData({ ...addressData, state: value })}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="CT">Connecticut</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="HI">Hawaii</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={addressData.zipCode}
                onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={addressData.country}
              onValueChange={(value) => setAddressData({ ...addressData, country: value })}
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Japan">Japan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={addressData.phone}
              onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDefault"
              className="rounded text-pink-600"
              checked={addressData.isDefault}
              onChange={(e) => setAddressData({ ...addressData, isDefault: e.target.checked })}
            />
            <Label htmlFor="isDefault">Set as default shipping address</Label>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 p-6 flex justify-end">
          <Button variant="outline" className="mr-2" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSaveAddress}>
            <Check className="h-4 w-4 mr-2" />
            Save Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

