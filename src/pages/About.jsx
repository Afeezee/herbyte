import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, BookOpen, Sparkles, Target, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Herbyte</h1>
          <p className="text-xl text-white/90 leading-relaxed">
            Bridging traditional herbal wisdom with modern scientific validation to create a trusted, comprehensive resource for evidence-based natural medicine.
          </p>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#2D5016]" />
              </div>
              <h2 className="text-3xl font-bold text-[#2D5016] mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Herbyte was created to preserve and validate traditional herbal medicine knowledge from cultures around the world. We believe that indigenous wisdom and modern science can work together to provide safe, effective natural healing solutions.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our platform combines AI-powered safety validation with expert oversight to ensure every piece of information meets rigorous standards for accuracy, safety, and scientific credibility.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=600&h=400&fit=crop" 
                alt="Herbal medicine research"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gradient-to-br from-[#F5F1E8] to-[#FFFEF9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D5016] mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg">What drives everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-[#2D5016]" />
                </div>
                <h3 className="text-xl font-bold text-[#2D5016] mb-3">Safety First</h3>
                <p className="text-gray-700 leading-relaxed">
                  Every herb and remedy undergoes rigorous AI safety checks and expert review to identify potential risks, interactions, and contraindications.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                  <BookOpen className="w-7 h-7 text-[#2D5016]" />
                </div>
                <h3 className="text-xl font-bold text-[#2D5016] mb-3">Evidence-Based</h3>
                <p className="text-gray-700 leading-relaxed">
                  All information is backed by peer-reviewed research, clinical trials, and reputable phytotherapy sources from trusted medical databases.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                  <Heart className="w-7 h-7 text-[#2D5016]" />
                </div>
                <h3 className="text-xl font-bold text-[#2D5016] mb-3">Cultural Respect</h3>
                <p className="text-gray-700 leading-relaxed">
                  We honor and preserve indigenous knowledge systems while ensuring traditional remedies meet modern safety and efficacy standards.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scientific Validation */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img 
                src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop" 
                alt="Scientific research"
                className="rounded-xl shadow-xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="w-16 h-16 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-[#2D5016]" />
              </div>
              <h2 className="text-3xl font-bold text-[#2D5016] mb-4">AI-Powered Validation</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our advanced AI systems analyze every submission for scientific credibility, safety concerns, and potential drug interactions. This technology helps us:
              </p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C2E] mt-1">✓</span>
                  <span>Identify potentially harmful herb combinations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C2E] mt-1">✓</span>
                  <span>Verify claims against peer-reviewed research</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C2E] mt-1">✓</span>
                  <span>Flag submissions requiring expert review</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#4A7C2E] mt-1">✓</span>
                  <span>Provide personalized safety guidance to users</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Partnerships */}
      <section className="py-16 bg-gradient-to-br from-[#F5F1E8] to-[#FFFEF9]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-[#4A7C2E]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-[#2D5016]" />
            </div>
            <h2 className="text-3xl font-bold text-[#2D5016] mb-4">Expert Partnerships</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We collaborate with leading herbalists, naturopathic doctors, pharmacologists, and indigenous medicine practitioners to ensure our information is accurate and culturally sensitive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-[#2D5016] mb-2">Medical Professionals</h3>
                <p className="text-gray-600">
                  Board-certified naturopathic doctors and herbalists review flagged submissions and validate safety information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-[#2D5016] mb-2">Research Institutions</h3>
                <p className="text-gray-600">
                  We partner with universities and research centers to access the latest phytotherapy studies and clinical trials.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-[#2D5016] mb-2">Indigenous Communities</h3>
                <p className="text-gray-600">
                  Traditional medicine practitioners help us preserve and respect indigenous knowledge systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-[#2D5016] mb-2">Pharmacology Experts</h3>
                <p className="text-gray-600">
                  Pharmacologists verify drug interaction data and ensure accurate safety warnings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Indigenous Knowledge Preservation */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D5016] mb-4">
              Preserving Indigenous Knowledge
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Traditional herbal medicine represents thousands of years of accumulated wisdom. Our platform serves as a digital archive for this invaluable knowledge, ensuring it's preserved for future generations while making it accessible and safe for modern use.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#4A7C2E]/5 to-[#2D5016]/5 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-xl text-[#2D5016] mb-4">Our Commitment</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Respect cultural origins and traditional practices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Credit indigenous communities for their contributions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Ensure traditional knowledge isn't misappropriated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Support sustainable harvesting practices</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#2D5016] mb-4">What We Do</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Document regional and local herb names</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Record traditional preparation methods</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Validate safety through modern research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#4A7C2E] mt-1 text-xl">•</span>
                    <span>Make knowledge freely accessible to all</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us in Our Mission</h2>
          <p className="text-xl text-white/90 mb-8">
            Whether you're a healthcare professional, traditional medicine practitioner, or someone passionate about natural healing, we invite you to contribute to this growing knowledge base.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/submitremedy">
              <button className="px-8 py-3 bg-white text-[#2D5016] rounded-lg font-semibold hover:bg-white/90 transition-colors">
                Share Your Knowledge
              </button>
            </a>
            <a href="/contact">
              <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Get in Touch
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}