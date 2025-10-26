
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Leaf, Search, BookOpen, Send, Info, Mail, Menu } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Leaf,
  },
  {
    title: "Explore Herbs",
    url: createPageUrl("ExploreHerbs"),
    icon: Search,
  },
  {
    title: "Submit Remedy",
    url: createPageUrl("SubmitRemedy"),
    icon: Send,
  },
  {
    title: "About Us",
    url: createPageUrl("About"),
    icon: Info,
  },
  {
    title: "Contact",
    url: createPageUrl("Contact"),
    icon: Mail,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFEF9] to-[#F5F1E8]">
      <style>{`
        :root {
          --primary-green: #2D5016;
          --secondary-green: #4A7C2E;
          --accent-green: #6B9F4A;
          --warm-beige: #F5F1E8;
          --cream: #FFFEF9;
          --text-dark: #1F2937;
          --text-medium: #4B5563;
        }
      `}</style>

      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#2D5016]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2D5016] tracking-tight">Herbyte</h1>
                <p className="text-xs text-[#4A7C2E]">Evidence-Based Herbal Medicine</p>
              </div>
            </Link>

            <nav className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.url
                      ? "text-[#2D5016] bg-[#4A7C2E]/10 font-medium"
                      : "text-[#4B5563] hover:text-[#2D5016] hover:bg-[#F5F1E8]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#2D5016]/10 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[#2D5016] to-[#4A7C2E] rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#2D5016]">Herbyte</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[#F5F1E8] transition-colors"
            >
              <Menu className="w-6 h-6 text-[#2D5016]" />
            </button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <nav className="border-t border-[#2D5016]/10 bg-white p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.url
                    ? "text-[#2D5016] bg-[#4A7C2E]/10 font-medium"
                    : "text-[#4B5563] hover:bg-[#F5F1E8]"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Alert className="border-amber-300 bg-transparent">
            <AlertDescription className="text-sm text-amber-900">
              <strong>Medical Disclaimer:</strong> Information provided is for educational purposes only and does not replace professional medical advice. Always consult healthcare providers before using herbal remedies.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-200px)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#2D5016] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Herbyte</span>
              </div>
              <p className="text-white/80 leading-relaxed mb-4">
                Evidence-based herbal medicine information platform dedicated to preserving indigenous knowledge while ensuring scientific validation and safety.
              </p>
              <p className="text-xs text-white/60">
                © 2025 Herbyte. All rights reserved.
              </p>
              <p className="text-xs text-white/60 mt-1">
                Developed by{" "}
                <a 
                  href="https://cereustechnologies.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Cereus Technologies
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      className="text-white/80 hover:text-white transition-colors text-sm"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Safety & Trust</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li>✓ Evidence-Based Information</li>
                <li>✓ AI-Powered Safety Checks</li>
                <li>✓ Expert Validation</li>
                <li>✓ Research-Backed Data</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
            <p>This platform does not provide medical advice. Always consult qualified healthcare professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
