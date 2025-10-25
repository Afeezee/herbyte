import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function TestimonialCard({ name, role, content }) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-6">
        <Quote className="w-10 h-10 text-white/40 mb-4" />
        <p className="text-white/90 leading-relaxed mb-6 italic">
          "{content}"
        </p>
        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-white/70">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}