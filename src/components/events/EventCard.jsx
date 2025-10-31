import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ArrowRight, Video, DollarSign } from "lucide-react";
import { format } from "date-fns";

export default function EventCard({ event }) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  
  return (
    <Link to={`${createPageUrl("EventProfile")}?id=${event.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          {event.image_url ? (
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4A7C2E]/20 to-[#2D5016]/20">
              <Calendar className="w-16 h-16 text-[#2D5016]/40" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className={
              event.status === "Upcoming" ? "bg-green-500 text-white" :
              event.status === "Ongoing" ? "bg-blue-500 text-white" :
              event.status === "Completed" ? "bg-gray-500 text-white" :
              "bg-red-500 text-white"
            }>
              {event.status}
            </Badge>
            {event.is_free && (
              <Badge className="bg-yellow-500 text-white">Free</Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            {event.location_type === "Virtual" && (
              <Badge className="bg-purple-500 text-white">
                <Video className="w-3 h-3 mr-1" />
                Virtual
              </Badge>
            )}
            {event.location_type === "Hybrid" && (
              <Badge className="bg-indigo-500 text-white">Hybrid</Badge>
            )}
          </div>
        </div>
        
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <Badge variant="outline" className="bg-[#4A7C2E]/5 text-[#2D5016] border-[#4A7C2E]/20">
              {event.event_type}
            </Badge>
          </div>
          <h3 className="font-bold text-lg text-[#2D5016] group-hover:text-[#4A7C2E] transition-colors line-clamp-2">
            {event.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-[#4A7C2E]" />
              <span>{format(eventDate, 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4 text-[#4A7C2E]" />
              <span>{event.start_time}{event.end_time && ` - ${event.end_time}`}</span>
            </div>

            {event.location_type === "In-Person" && event.city && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#4A7C2E]" />
                <span className="line-clamp-1">{event.city}, {event.country}</span>
              </div>
            )}

            {!event.is_free && (
              <div className="flex items-center gap-2 text-sm font-bold text-[#2D5016]">
                <DollarSign className="w-4 h-4" />
                <span>{event.currency} {event.price}</span>
              </div>
            )}
          </div>

          <div className="flex items-center text-[#4A7C2E] font-medium group-hover:gap-2 transition-all">
            <span className="text-sm">View Details</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}