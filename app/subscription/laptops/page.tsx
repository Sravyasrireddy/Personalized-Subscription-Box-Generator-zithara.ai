'use client';

import { getProductsByCategory } from "@/lib/products";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LaptopsPage() {
  const laptopProducts = getProductsByCategory("laptops") || [];

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">All Laptops</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {laptopProducts && laptopProducts.length > 0 ? (
          laptopProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
              <div className="relative h-64 w-full">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                    console.error(`Failed to load image: ${product.image}`);
                  }}
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.benefits && product.benefits.length > 0 ? (
                    product.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg">${product.price}</span>
                  <Button className="bg-blue-600 hover:bg-blue-700">Add to Cart</Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No laptop products available</p>
          </div>
        )}
      </div>
    </div>
  );
}
