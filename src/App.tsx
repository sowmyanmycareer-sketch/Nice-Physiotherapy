import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero3DSection } from "./components/Hero3DSection";
import { AiThinkingTriage } from "./components/AiThinkingTriage";
import { ServicesSection } from "./components/ServicesSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { ClinicInfoMap } from "./components/ClinicInfoMap";
import { Footer } from "./components/Footer";
import { BookingModal } from "./components/BookingModal";
import { AnatomicalHotspot } from "./types";
import { CLINIC_INFO } from "./data/clinicData";
import { 
  Phone, 
  Navigation, 
  CalendarCheck, 
  Sparkles, 
  Activity, 
  Award, 
  ShieldCheck,
  ChevronRight,
  MessageCircle
} from "lucide-react";

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>();
  const [activeAnatomicalArea, setActiveAnatomicalArea] = useState<string>("L4-L5 Lumbar Spine");

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenBooking = (serviceName?: string) => {
    setSelectedServiceForBooking(serviceName);
    setIsBookingOpen(true);
  };

  const handleSelectHotspot = (hotspot: AnatomicalHotspot) => {
    setActiveAnatomicalArea(hotspot.name);
  };

  const handleOpenAiTriageWithArea = (areaName: string) => {
    setActiveAnatomicalArea(areaName);
    scrollToSection("ai-triage");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-500 selection:text-slate-950">
      {/* Sticky Top Navigation Bar */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Interactive 3D Spine & Biomechanics Simulator */}
        <Hero3DSection
          onOpenBooking={() => handleOpenBooking()}
          onOpenAiTriageWithArea={handleOpenAiTriageWithArea}
          onSelectHotspot={handleSelectHotspot}
        />

        {/* 3D Clinical Biomechanics & Decompression Explainer Banner */}
        <section id="simulator" className="py-12 bg-slate-900/30 border-y border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Outfit'] font-bold text-white text-base">
                    L5 Disc Herniation Protocol
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Targeted decompressive traction separating compressed lumbar disc spaces to relieve impinged sciatic nerve roots.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Outfit'] font-bold text-white text-base">
                    10+ Years Dr. Nikitha Care
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Personalized manual therapy, dry needling, and clinical gait retraining tailored to each patient's biomechanics.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-['Outfit'] font-bold text-white text-base">
                    4.9★ Rating (296 Reviews)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Verified community praise from Vidyaranyapura, Hesaraghatta Road, and Yelahanka for orthopedic excellence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gemini 3.5 AI Biomechanical Triage & Ergonomics Analyzer */}
        <AiThinkingTriage
          initialArea={activeAnatomicalArea}
          onOpenBooking={() => handleOpenBooking(activeAnatomicalArea)}
        />

        {/* Evidence-Based Clinical Services & Treatments */}
        <ServicesSection
          onOpenBookingWithService={(serviceName) => handleOpenBooking(serviceName)}
          onSelectAnatomyForService={(area) => {
            scrollToSection("hero");
          }}
        />

        {/* Google Reviews Showcase with Sirisha, Arpitha, Lakshmi reviews */}
        <ReviewsSection />

        {/* Location, Timing, Directions, and Vidyaranyapura Medical Network */}
        <ClinicInfoMap onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onScrollToSection={scrollToSection}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        preselectedService={selectedServiceForBooking}
      />

      {/* Floating Bottom Quick Action Bar for Mobile Users */}
      <div className="fixed bottom-3 left-4 right-4 z-40 sm:hidden">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 p-2 rounded-2xl shadow-2xl flex items-center gap-2">
          <a
            href={`tel:${CLINIC_INFO.phoneRaw}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 text-teal-300 font-bold text-xs flex items-center justify-center gap-1.5 border border-teal-500/30"
          >
            <Phone className="w-3.5 h-3.5 text-teal-400" />
            <span>Call 080958 46826</span>
          </a>

          <button
            onClick={() => handleOpenBooking()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-950" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
