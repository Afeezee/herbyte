import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Leaf, ArrowRight, Shield, AlertTriangle } from "lucide-react";

export default function RemedyCard({ remedy }) {
  return (
    <Link to={`${createPageUrl("RemedyProfile")}?id=${remedy.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {remedy.image_url ? (
            <img 
              src={remedy.image_url} 
              alt={remedy.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A7C2E]/20 to-[#2D5016]/20">
              <Leaf className="w-16 h-16 text-[#2D5016]/40" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            {remedy.safety_rating === "Generally Safe" && (
              <Badge className="bg-green-500 text-white border-0">
                <Shield className="w-3 h-3 mr-1" />
                Safe
              </Badge>
            )}
            {remedy.safety_rating === "Use with Caution" && (
              <Badge className="bg-yellow-500 text-white border-0">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Caution
              </Badge>
            )}
            {remedy.safety_rating === "High Risk - Expert Guidance Required" && (
              <Badge className="bg-red-500 text-white border-0">
                <AlertTriangle className="w-3 h-3 mr-1" />
                High Risk
              </Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg text-[#2D5016] mb-1 group-hover:text-[#4A7C2E] transition-colors">
                {remedy.name}
              </h3>
              <p className="text-sm text-gray-600">For: {remedy.health_condition}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {remedy.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline" className="bg-[#4A7C2E]/5 text-[#2D5016] border-[#4A7C2E]/20">
              {remedy.primary_herb_name}
            </Badge>
            {remedy.category && (
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                {remedy.category}
              </Badge>
            )}
          </div>

          <div className="flex items-center text-[#4A7C2E] font-medium group-hover:gap-2 transition-all">
            <span className="text-sm">View Remedy</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}