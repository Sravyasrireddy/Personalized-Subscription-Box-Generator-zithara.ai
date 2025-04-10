"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Lock, CreditCard, MapPin, Bell, LogOut } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    firstName: "Sravya Sri Reddy",
    lastName: "Konda",
    email: "sravyasrireddy.konda@gmail.com",
    phone: "555-123-4567",
  })
  const [addressData, setAddressData] = useState({
    street: "Hitech City",
    city: "Hyderabad",
    state: "Telangana",
    zipCode: "500081",
    country: "India",
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: "•••• •••• •••• 4242",
    cardName: "Sravya",
    expiryDate: "12/25",
    cvv: "•••",
  })

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
  }

  const handleSaveAddress = () => {
    toast({
      title: "Address updated",
      description: "Your shipping address has been updated successfully.",
    })
  }

  const handleSavePayment = () => {
    toast({
      title: "Payment method updated",
      description: "Your payment information has been updated successfully.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text">
          My Account
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-gray-500" />
              </div>
              <h2 className="text-xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-500">{profileData.email}</p>
            </div>

            <Separator className="my-4" />

            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/subscription/manage")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push("/subscription/history")}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Order History
              </Button>
              <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/wishlist")}>
                <CreditCard className="h-4 w-4 mr-2" />
                Wishlist
              </Button>
              <Separator className="my-2" />
              <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </nav>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-pink-600" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-pink-600" />
                    Password
                  </CardTitle>
                  <CardDescription>Update your password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-pink-600 hover:bg-pink-700">Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-pink-600" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>Update your shipping address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={addressData.street}
                      onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={addressData.city}
                        onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={addressData.state}
                        onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={addressData.zipCode}
                        onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={addressData.country}
                        onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSaveAddress}>
                    Save Address
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-pink-600" />
                    Payment Methods
                  </CardTitle>
                  <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Default</span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>{paymentData.cardNumber}</p>
                      <p>Expires: {paymentData.expiryDate}</p>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="font-medium">Add New Payment Method</h3>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="Sravya" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input id="expiryDate" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-pink-600 hover:bg-pink-700" onClick={handleSavePayment}>
                    Add Payment Method
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-pink-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Order Updates</h3>
                        <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="orderEmail" className="rounded text-pink-600" defaultChecked />
                        <Label htmlFor="orderEmail" className="text-sm">
                          Email
                        </Label>

                        <input type="checkbox" id="orderSms" className="rounded text-pink-600 ml-4" defaultChecked />
                        <Label htmlFor="orderSms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Subscription Updates</h3>
                        <p className="text-sm text-gray-500">Receive notifications about your subscription</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="subEmail" className="rounded text-pink-600" defaultChecked />
                        <Label htmlFor="subEmail" className="text-sm">
                          Email
                        </Label>

                        <input type="checkbox" id="subSms" className="rounded text-pink-600 ml-4" defaultChecked />
                        <Label htmlFor="subSms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Marketing</h3>
                        <p className="text-sm text-gray-500">Receive promotional offers and updates</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="marketingEmail" className="rounded text-pink-600" defaultChecked />
                        <Label htmlFor="marketingEmail" className="text-sm">
                          Email
                        </Label>

                        <input type="checkbox" id="marketingSms" className="rounded text-pink-600 ml-4" />
                        <Label htmlFor="marketingSms" className="text-sm">
                          SMS
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-pink-600 hover:bg-pink-700">Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

