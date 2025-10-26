
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Sparkles, Search, BookOpen, CheckCircle } from "lucide-react";
import HerbCard from "../components/herbs/HerbCard";
import TestimonialCard from "../components/home/TestimonialCard";

export default function Home() {
  const { data: featuredHerbs = [], isLoading } = useQuery({
    queryKey: ['featured-herbs'],
    queryFn: async () => {
      try {
        const result = await base44.entities.Herb.filter({ featured: true }, '-created_date', 6);
        return result || [];
      } catch (err) {
        console.error("Error fetching featured herbs:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 1, // Retry fetching once on failure
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600')] bg-cover bg-center"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Herbal Guidance</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Evidence-Based Herbal Medicine at Your Fingertips
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Discover verified herbal remedies backed by scientific research and indigenous wisdom. Get personalized AI guidance for safe and effective natural healing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("ExploreHerbs")}>
                  <Button size="lg" className="bg-white text-[#2D5016] hover:bg-white/90 w-full sm:w-auto">
                    <Search className="w-5 h-5 mr-2" />
                    Explore Herbs
                  </Button>
                </Link>
                <Link to={createPageUrl("SubmitRemedy")}>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Share Your Remedy
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop" 
                  alt="Herbal medicine" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#2D5016]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#2D5016]">100% Verified</p>
                      <p className="text-sm text-gray-600">AI Safety Checked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D5016] mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Herbyte bridges traditional herbal wisdom with modern scientific validation. We preserve indigenous knowledge while ensuring every remedy meets rigorous safety and efficacy standards through AI-powered moderation and expert review.
          </p>
        </div>
      </section>

      {/* Why Choose Herbyte */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#F5F1E8] to-[#FFFEF9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2D5016] mb-4">
              Why Choose Herbyte?
            </h2>
            <p className="text-gray-600 text-lg">Trusted, verified, and scientifically validated herbal information</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-[#2D5016]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D5016] mb-3">
                AI Safety Verification
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every herb and remedy is analyzed by advanced AI to identify potential risks, drug interactions, and contraindications before publication.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-[#2D5016]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D5016] mb-3">
                Evidence-Based Research
              </h3>
              <p className="text-gray-600 leading-relaxed">
                All information is backed by peer-reviewed studies, clinical trials, and reputable phytotherapy research from trusted medical sources.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#2D5016]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D5016] mb-3">
                Community-Driven Knowledge
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share traditional remedies from your culture while contributing to a global database of verified herbal medicine practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Herbs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D5016] mb-2">
                Featured Herbs
              </h2>
              <p className="text-gray-600">Explore our most trusted and well-researched herbal remedies</p>
            </div>
            <Link to={createPageUrl("ExploreHerbs")}>
              <Button variant="outline" className="border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredHerbs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHerbs.map(herb => (
                <HerbCard key={herb.id} herb={herb} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-500">Featured herbs will appear here soon</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Herbal Medicine Enthusiasts
            </h2>
            <p className="text-white/80 text-lg">Real experiences from our community members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard 
              name="Dr. Sarah Mitchell"
              role="Naturopathic Doctor"
              content="Herbyte has become an invaluable resource in my practice. The evidence-based approach and AI safety features give me confidence in recommending herbs to my patients."
            />
            <TestimonialCard 
              name="James Chen"
              role="Traditional Medicine Practitioner"
              content="Finally, a platform that respects indigenous knowledge while ensuring scientific rigor. The AI guidance feature helps me verify traditional remedies with modern research."
            />
            <TestimonialCard 
              name="Maria Rodriguez"
              role="Wellness Enthusiast"
              content="I love how easy it is to find safe herbal alternatives. The personalized AI insights help me understand which herbs are right for my specific health needs."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D5016] mb-6">
            Ready to Discover Natural Healing?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Start exploring our comprehensive database of verified herbal remedies or share your own traditional knowledge with our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ExploreHerbs")}>
              <Button size="lg" className="bg-[#2D5016] hover:bg-[#4A7C2E] w-full sm:w-auto">
                <Search className="w-5 h-5 mr-2" />
                Start Exploring
              </Button>
            </Link>
            <Link to={createPageUrl("SubmitRemedy")}>
              <Button size="lg" variant="outline" className="border-[#2D5016] text-[#2D5016] hover:bg-[#F5F1E8] w-full sm:w-auto">
                Submit a Remedy
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
