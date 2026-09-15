import React, { useState } from "react";
import { SERVICES_LIST } from "../data/clinicData";
import { ServiceItem } from "../types";
import { 
  Activity, 
  Bone, 
  HeartHandshake, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Check, 
  Clock, 
  ArrowRight,
  Rotate3d,
  Calendar
} from "lucide-react";

interface ServicesSectionProps {
  onOpenBookingWithService?: (serviceName: string) => void;
  onSelectAnatomyForService?: (area: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenBookingWithService,
  onSelectAnatomyForService,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Treatments" },
    { id: "spine", label: "L5 Spine & Disc" },
    { id: "knee", label: "Orthopedic & Joints" },
    { id: "general", label: "Elderly Care & PhysioPilates" },
    { id: "neck", label: "Cervical & Tech Posture" },
  ];

  const filteredServices = activeCategory === "all"
    ? SERVICES_LIST
    : SERVICES_LIST.filter((s) => s.anatomicalArea === activeCategory || (activeCategory === "general" && (s.anatomicalArea === "general" || s.id === "geriatric-care")));

  const getIcon = (name: string) => {
    switch (name) {
      case "Activity": return <Activity className="w-5 h-5 text-teal-400" />;
      case "Bone": return <Bone className="w-5 h-5 text-cyan-400" />;
      case "HeartHandshake": return <HeartHandshake className="w-5 h-5 text-rose-400" />;
      case "Cpu": return <Cpu className="w-5 h-5 text-emerald-400" />;
      case "Zap": return <Zap className="w-5 h-5 text-amber-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <section id="services" className="py-16 md:py-24 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
              Specialized Physical Therapy
            </span>
            <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Evidence-Based Clinical <br />
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Rehabilitation Treatments
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Non-invasive, doctor-supervised physical therapy programs customized by Dr. Nikitha at our Vidyaranyapura clinic.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition ${
                  activeCategory === cat.id
                    ? "bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-teal-500/40 hover:shadow-xl hover:shadow-teal-500/5 transition group"
            >
              <div className="space-y-4">
                {/* Header with icon and duration */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                    {getIcon(service.iconName)}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>{service.sessionDuration}</span>
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="font-['Outfit'] text-xl font-bold text-white group-hover:text-teal-300 transition">
                    {service.title}
                  </h3>
                  <p className="text-xs text-teal-400 font-medium mt-0.5">
                    {service.subtitle}
                  </p>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Key conditions treated */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Conditions Treated:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {service.treats.map((treat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{treat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modalities Chips */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Clinical Modalities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.modalities.map((mod, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onOpenBookingWithService && onOpenBookingWithService(service.title)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Therapy</span>
                </button>

                {onSelectAnatomyForService && (
                  <button
                    onClick={() => onSelectAnatomyForService(service.anatomicalArea)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="View biomechanics in 3D simulator"
                  >
                    <Rotate3d className="w-4 h-4 text-teal-400" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
