"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
    originalPrice: number;
    discount: number;
    rating: number;
    reviews: number;
    weight: string;
  };
}

export default function SmallProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">

      {/* Image */}
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square bg-slate-50">
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute left-3 top-3 z-10 rounded-md bg-orange-500 px-2 py-0.5 text-[11px] font-semibold text-white shadow-sm">
              {product.discount}% OFF
            </div>
          )}

          {/* Wishlist */}
          <button
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-red-50"
          >
            <Heart className="h-4 w-4 text-gray-500 group-hover:text-red-500" />
          </button>

          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="space-y-2 p-4">
        {/* Name */}
        <Link href={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-slate-800 transition-colors group-hover:text-green-700">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-500">{product.weight}</p>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center rounded-full bg-green-50 px-2 py-0.5">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[11px] font-semibold">{product.rating}</span>
          </div>
          <span className="text-[11px] text-gray-500">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
        </div>

        {/* Button */}
        <Button
          variant="default"
          className="h-9 w-full rounded-lg bg-green-700 text-sm font-medium hover:bg-green-800"
        >
          <ShoppingCart className="mr-1.5 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </Card>
  );
}
