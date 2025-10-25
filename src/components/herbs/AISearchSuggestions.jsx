import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function AISearchSuggestions({ suggestions, onSelect }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-[#4A7C2E]/5 to-[#2D5016]/5 rounded-lg border border-[#4A7C2E]/10">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#4A7C2E]" />
        <span className="text-sm font-medium text-[#2D5016]">AI Suggestions</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Badge
            key={index}
            variant="outline"
            className="cursor-pointer hover:bg-[#4A7C2E]/10 hover:border-[#4A7C2E] transition-colors"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
    </div>
  );
}