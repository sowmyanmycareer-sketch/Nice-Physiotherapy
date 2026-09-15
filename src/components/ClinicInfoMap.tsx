import React from "react";
import { CLINIC_INFO } from "../data/clinicData";
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  ExternalLink, 
  Compass, 
  Car, 
  CheckCircle2, 
  Share2,
  CalendarCheck
} from "lucide-react";

interface ClinicInfoMapProps {
  onOpenBooking: () => void;
}

export const ClinicInfoMap: React.FC<ClinicInfoMapProps> = ({ onOpenBooking }) => {
  const nearbyPlaces = [
    { name: "Aveksha Pharmacy 24/7", distance: "450 m away", type: "Medical / Pharmacy" },
    { name: "Body & Mind - PhysioPilates", distance: "Nearby Center", type: "Pilates Partner" },
    { name: "Le yantra spine & sports injury clinic", distance: "Area Specialist", type: "Referral Network" },
    { name: "Anand Abhigyan Hospital (Yelahanka)", distance: "15 mins drive", type: "Hospital Hub" },
  ];

  return (
    <section id="location" className="py-16 md:py-24 bg-slate-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-400 tracking-wider uppercase">
            Vidyaranyapura, Bengaluru
          </span>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mt-1">
            Visit Dr Nice <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Physiotherapy Centre
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Conveniently located at Sai Orchard Layout on Hesaraghatta Road, Vidyaranyapura with dedicated patient parking and wheelchair-accessible treatment bays.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Address, Phone, Timings, Directions */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
            <div className="space-y-6">
              {/* Address card */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Clinic Address:</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                    {CLINIC_INFO.address}
                  </p>
                  <p className="text-xs text-teal-400 mt-1 font-medium">
                    Landmark: Near Hesaraghatta Main Rd & Sai Orchard
                  </p>
                </div>
              </div>

              {/* Phone contact */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Appointment & Emergency Helpline:</h4>
                  <a
                    href={`tel:${CLINIC_INFO.phoneRaw}`}
                    className="text-base sm:text-lg font-bold text-teal-300 hover:underline block mt-0.5"
                  >
                    {CLINIC_INFO.phone}
                  </a>
                  <p className="text-xs text-slate-400">
                    Direct line to Dr. Nikitha and the reception desk
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Operational Hours:</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                      Open Today
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    Monday – Saturday: 8:00 AM – 8:00 PM
                  </p>
                  <p className="text-xs text-slate-400">
                    Sunday: Special appointment slots available upon request
                  </p>
                </div>
              </div>
            </div>

            {/* Direction Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps Directions</span>
              </a>

              <button
                onClick={onOpenBooking}
                className="py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-teal-400" />
                <span>Book Slot</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Map Simulation & Nearby Landmark Guide */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-teal-400" />
                  Vidyaranyapura Medical Corridor
                </span>
                <span className="text-xs text-teal-400 font-mono">PIN: 560097</span>
              </div>

              {/* Map Preview Card */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center p-6 text-center group">
                <div className="absolute inset-0 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
                <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20 group-hover:scale-110 transition">
                    <MapPin className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <h5 className="font-['Outfit'] font-bold text-white text-base">
                      Dr Nice Physiotherapy Centre
                    </h5>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      #19 Sai Orchard Layout, Hesaraghatta Rd, Vidyaranyapura, Bengaluru
                    </p>
                  </div>
                  <a
                    href={CLINIC_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-teal-300 bg-slate-900/90 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-teal-500/30 transition shadow"
                  >
                    <span>Click for Turn-by-Turn GPS Navigation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* People Also Search For & Nearby Network */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-slate-400">
                  People also search for in Vidyaranyapura & Yelahanka:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nearbyPlaces.map((place, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-medium text-slate-200 line-clamp-1">{place.name}</p>
                        <p className="text-[10px] text-teal-400">{place.type}</p>
                      </div>
                      <span className="text-[10px] text-slate-500">{place.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Travel time indicators */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-teal-400" />
                <span>10 mins from Yelahanka Major Circle</span>
              </span>
              <span>Wheelchair Accessible Ground Floor</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
