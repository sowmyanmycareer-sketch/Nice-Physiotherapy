import React from "react";
import { CLINIC_INFO } from "../data/clinicData";
import { 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Award, 
  Facebook, 
  ExternalLink, 
  ShieldCheck, 
  ArrowUp,
  Heart
} from "lucide-react";

interface FooterProps {
  onOpenBooking: () => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onScrollToSection }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs sm:text-sm">
      {/* Top Banner with Quick Call & Directions */}
      <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-cyan-950/60 border-b border-slate-800/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-['Outfit'] text-xl font-bold text-white">
              Suffering from Spine, Disc, or Joint Pain?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Speak directly with Dr Nice Physiotherapy Centre or visit our Vidyaranyapura clinic today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.phoneRaw}`}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold border border-teal-500/40 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-teal-400" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition shadow-lg shadow-teal-500/20"
            >
              Book Physical Assessment
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand & Doctor bio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center text-slate-950 font-['Outfit'] font-black text-lg">
                DN
              </div>
              <div>
                <h4 className="font-['Outfit'] font-bold text-white text-base">
                  Dr Nice Physiotherapy Centre
                </h4>
                <p className="text-[11px] text-teal-400">
                  Best Physiotherapist in Bengaluru · 10+ Yrs Exp
                </p>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              {CLINIC_INFO.aboutText}
            </p>

            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 / 5.0 Rating</span>
                <span className="text-slate-400 font-normal">({CLINIC_INFO.reviewCount} Reviews)</span>
              </div>

              <a
                href={CLINIC_INFO.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
                aria-label="Facebook Profile"
                title="Dr Nice Physiotherapy on Facebook"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Treatments & Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">
              Specialized Care
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onScrollToSection("services")}
                  className="hover:text-teal-300 transition"
                >
                  L4-L5 Lumbar Spine Decompression
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("services")}
                  className="hover:text-teal-300 transition"
                >
                  Orthopedic Knee & Hip Rehab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("services")}
                  className="hover:text-teal-300 transition"
                >
                  Elderly & Geriatric Mobility Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("services")}
                  className="hover:text-teal-300 transition"
                >
                  Cervical Spine & Tech Neck Ergonomics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection("services")}
                  className="hover:text-teal-300 transition"
                >
                  PhysioPilates & Myofascial Release
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-semibold text-white text-xs uppercase tracking-wider">
              Vidyaranyapura Clinic
            </h5>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-relaxed">
                  {CLINIC_INFO.address}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phoneRaw}`} className="text-slate-200 font-bold hover:underline">
                  {CLINIC_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300">Open · Closes 8:00 PM Daily</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-teal-300 hover:underline"
              >
                <span>Google Maps Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom medical disclaimer & copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="max-w-2xl text-center md:text-left">
            <strong>Clinical Disclaimer:</strong> The 3D biomechanics visualizer and Gemini 3.5 AI triage provide supportive educational rehabilitation insights. For acute spinal trauma or progressive neurological deficits, please visit Dr Nice Physiotherapy Centre in Vidyaranyapura for clinical palpation and assessment.
          </p>

          <div className="flex items-center gap-4 shrink-0">
            <span>© {new Date().getFullYear()} Dr Nice Physiotherapy Centre.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 transition"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
