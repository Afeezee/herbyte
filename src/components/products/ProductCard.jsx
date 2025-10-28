import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Store, Package } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <Link to={`${createPageUrl("ProductProfile")}?id=${product.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {product.image_urls && product.image_urls.length > 0 ? (
            <img 
              src={product.image_urls[0]} 
              alt={product.product_name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A7C2E]/20 to-[#2D5016]/20">
              <Package className="w-16 h-16 text-[#2D5016]/40" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className="bg-[#4A7C2E] text-white border-0">
              {product.product_type}
            </Badge>
          </div>
          {!product.availability && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#2D5016] mb-1 group-hover:text-[#4A7C2E] transition-colors">
                {product.product_name}
              </h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Store className="w-3 h-3" />
                {product.seller_business_name}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-[#2D5016]">
                {product.currency} {product.price.toFixed(2)}
              </p>
              {product.size && (
                <p className="text-xs text-gray-500">{product.size}</p>
              )}
            </div>
            {product.linked_remedy_name && (
              <Badge variant="outline" className="text-xs">
                For: {product.linked_remedy_name}
              </Badge>
            )}
          </div>

          <div className="flex items-center text-[#4A7C2E] font-medium group-hover:gap-2 transition-all">
            <span className="text-sm">View Product</span>
            <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}