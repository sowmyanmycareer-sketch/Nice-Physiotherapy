import React from "react";
import { CLINIC_INFO } from "../data/clinicData";
import { ThreeSpineCanvas } from "./ThreeSpineCanvas";
import { AnatomicalHotspot } from "../types";
import { 
  Star, 
  MapPin, 
  Phone, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Activity,
  ArrowRight,
  Clock,
  Heart
} from "lucide-react";

interface Hero3DSectionProps {
  onOpenBooking: () => void;
  onOpenAiTriageWithArea: (areaName: string) => void;
  onSelectHotspot: (hotspot: AnatomicalHotspot) => void;
}

export const Hero3DSection: React.FC<Hero3DSectionProps> = ({
  onOpenBooking,
  onOpenAiTriageWithArea,
  onSelectHotspot,
}) => {
  return (
    <section id="hero" className="relative pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge row */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/60 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-sm backdrop-blur-md whitespace-nowrap">
            <Award className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Best Physiotherapist in Bengaluru</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-white font-bold">{CLINIC_INFO.rating}</span>
            <span>({CLINIC_INFO.reviewCount} Google Reviews)</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-xs whitespace-nowrap">
            <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Open · Closes 8:00 PM</span>
          </div>
        </div>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clinic Headline, Doctor Bio, Call to actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h1 className="font-['Outfit'] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Dr Nice <br />
                <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Physiotherapy Centre
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 font-medium leading-snug">
                Advanced Spine Decompression, Joint Kinematics & Compassionate Rehabilitation in Vidyaranyapura.
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              Led by <strong className="text-teal-300">Dr. Nikitha (10+ Years Experience)</strong>, our clinic specializes in non-surgical L4-L5 lumbar disc rehabilitation, cervical spine therapy, elderly mobility, and post-operative orthopedic recovery using state-of-the-art biomechanics protocols.
            </p>

            {/* Quick highlight cards */}
            <div className="grid grid-cols-3 gap-3 py-1">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-['Outfit'] text-xl sm:text-2xl font-bold text-white">4.9★</div>
                <div className="text-[11px] text-slate-400 mt-0.5">296 Reviews</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-['Outfit'] text-xl sm:text-2xl font-bold text-teal-400">10+ Yrs</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Dr. Nikitha Exp</div>
              </div>
              <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="font-['Outfit'] text-xl sm:text-2xl font-bold text-cyan-400">L5 Spine</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Disc Specialty</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-teal-500/25 hover:brightness-110 transition active:scale-95 whitespace-nowrap shrink-0"
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span>Book Clinic Consultation</span>
              </button>

              <button
                onClick={() => onOpenAiTriageWithArea("L5-S1 Lumbar Spine")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-teal-300 font-semibold text-sm sm:text-base shadow-lg transition active:scale-95 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                <span>AI Symptom Triage</span>
              </button>
            </div>

            {/* Address & Quick call snippet */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400">
              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="flex items-center gap-1.5 text-teal-300 hover:underline font-medium"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Call: {CLINIC_INFO.phone}</span>
              </a>
              <div className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>#19 Sai Orchard Layout, Vidyaranyapura</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Canvas */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* Outer decorative halo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500/30 to-cyan-500/30 rounded-[34px] blur-lg opacity-60" />
              <ThreeSpineCanvas
                onSelectHotspot={onSelectHotspot}
                onOpenAiTriageWithArea={onOpenAiTriageWithArea}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
