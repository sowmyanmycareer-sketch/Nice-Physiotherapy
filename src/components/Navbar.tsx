import React, { useState } from "react";
import { CLINIC_INFO } from "../data/clinicData";
import { 
  Phone, 
  MapPin, 
  Star, 
  Clock, 
  Menu, 
  X, 
  Sparkles, 
  CalendarCheck,
  ShieldCheck,
  Navigation
} from "lucide-react";

interface NavbarProps {
  onOpenBooking: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/95 border-b border-slate-800 transition-all">
      {/* Top micro announcement bar - perfectly aligned with max-w-7xl px-4 sm:px-6 lg:px-8 */}
      <div className="bg-gradient-to-r from-teal-950/70 via-slate-900 to-teal-950/70 border-b border-teal-900/30 py-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center gap-1.5 font-medium text-teal-400 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {CLINIC_INFO.status}
            </span>
            <span className="text-slate-600">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>#19 Sai Orchard Layout, Vidyaranyapura, Bengaluru</span>
            </span>
          </div>

          <span className="text-[11px] text-teal-400/90 font-medium hidden md:inline-block whitespace-nowrap">
            Dr. Nikitha (10+ Yrs Exp) · Non-Surgical Spine & Joint Rehabilitation
          </span>
        </div>
      </div>

      {/* Main navigation container with strict one-line alignment and no wrapping */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div 
          onClick={() => handleNavClick("hero")}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 via-cyan-500 to-emerald-600 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="font-['Outfit'] font-extrabold text-xl tracking-tighter bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                DN
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="font-['Outfit'] font-bold text-base sm:text-lg lg:text-xl tracking-tight text-white leading-tight whitespace-nowrap">
              Dr Nice Physiotherapy Centre
            </h1>
            <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap">
              <span className="text-xs text-teal-400 font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="font-bold text-white">{CLINIC_INFO.rating}</span>
                <span className="text-slate-400 font-normal">({CLINIC_INFO.reviewCount} Google Reviews)</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 font-medium border border-teal-500/20 shrink-0">
                10+ Yrs Exp
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Nav Items - Clean, single line, no wrapping */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs xl:text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick("simulator")}
            className="px-2.5 xl:px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>3D Biomechanics</span>
          </button>
          <button
            onClick={() => handleNavClick("ai-triage")}
            className="px-2.5 xl:px-3 py-2 rounded-xl text-teal-300 hover:text-teal-200 hover:bg-teal-950/40 transition flex items-center gap-1.5 font-semibold whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>AI Symptom Triage</span>
          </button>
          <button
            onClick={() => handleNavClick("services")}
            className="px-2.5 xl:px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition whitespace-nowrap"
          >
            <span>Treatments & Spine Care</span>
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className="px-2.5 xl:px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Reviews</span>
            <span className="text-xs px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-bold">
              4.9★
            </span>
          </button>
          <button
            onClick={() => handleNavClick("location")}
            className="px-2.5 xl:px-3 py-2 rounded-xl hover:text-white hover:bg-slate-900 transition whitespace-nowrap"
          >
            <span>Clinic Location</span>
          </button>
        </nav>

        {/* Call to action & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition active:scale-95 whitespace-nowrap shrink-0"
          >
            <CalendarCheck className="w-4 h-4 text-slate-950 shrink-0" />
            <span>Book Appointment</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-4 py-4 space-y-2 backdrop-blur-xl">
          <div className="p-3 bg-slate-900 rounded-xl mb-3 border border-slate-800">
            <p className="text-xs text-slate-400">Dr Nice Physiotherapy Centre</p>
            <p className="text-xs font-semibold text-teal-400">#19 Sai Orchard Layout, Vidyaranyapura, Bengaluru</p>
          </div>

          <button
            onClick={() => handleNavClick("simulator")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900 font-medium"
          >
            3D Spine & Biomechanics Simulator
          </button>
          <button
            onClick={() => handleNavClick("ai-triage")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-teal-300 bg-teal-950/40 hover:bg-teal-900/40 font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            Gemini 3.5 AI Symptom Assessment
          </button>
          <button
            onClick={() => handleNavClick("services")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900 font-medium"
          >
            Specialized Treatments (L5 Spine, Orthopedic)
          </button>
          <button
            onClick={() => handleNavClick("reviews")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900 font-medium flex items-center justify-between"
          >
            <span>Google Patient Reviews</span>
            <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold">
              4.9★ (296)
            </span>
          </button>
          <button
            onClick={() => handleNavClick("location")}
            className="w-full text-left px-3 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900 font-medium"
          >
            Clinic Location & Hours (Open till 8 PM)
          </button>
        </div>
      )}
    </header>
  );
};
