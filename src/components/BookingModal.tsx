import React, { useState } from "react";
import { CLINIC_INFO, SERVICES_LIST } from "../data/clinicData";
import { BookingData } from "../types";
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle2, 
  MapPin, 
  ShieldCheck, 
  Navigation,
  ArrowRight
} from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(preselectedService || SERVICES_LIST[0].title);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const timeSlots = [
    "08:30 AM",
    "10:00 AM",
    "11:30 AM",
    "02:30 PM",
    "04:00 PM",
    "05:30 PM",
    "07:00 PM",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          service,
          date: date || new Date().toISOString().split("T")[0],
          timeSlot,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      setBookingConfirmation(data.booking);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setBookingConfirmation(null);
    setName("");
    setPhone("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Screen */}
        {bookingConfirmation ? (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 border border-teal-400/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-teal-400 px-3 py-1 bg-teal-950 rounded-full border border-teal-800">
                Booking ID: {bookingConfirmation.bookingId}
              </span>
              <h3 className="font-['Outfit'] text-2xl font-bold text-white mt-3">
                Appointment Confirmed!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                We have reserved your consultation with <strong className="text-teal-300">{bookingConfirmation.doctor}</strong>.
              </p>
            </div>

            {/* Summary details card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2.5">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Patient:</span>
                <span className="font-semibold text-white">{bookingConfirmation.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Contact:</span>
                <span className="font-semibold text-white">{bookingConfirmation.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Treatment:</span>
                <span className="font-semibold text-teal-300">{bookingConfirmation.service}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Scheduled Time:</span>
                <span className="font-semibold text-white">{bookingConfirmation.date} at {bookingConfirmation.timeSlot}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Clinic Location:</span>
                <span className="text-right text-slate-300 font-medium">Vidyaranyapura (#19 Sai Orchard)</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate to Clinic</span>
              </a>

              <a
                href={`tel:${CLINIC_INFO.phoneRaw}`}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4 text-teal-400" />
                <span>Call Front Desk</span>
              </a>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-400 underline"
            >
              Done / Close Window
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Dr Nice Physiotherapy Centre
              </span>
              <h3 className="font-['Outfit'] text-2xl font-bold text-white mt-1">
                Schedule Physical Therapy
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Consult with Dr. Nikitha (10+ Yrs Exp) at our Vidyaranyapura clinic.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Full Name of Patient *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. Sirisha or Arpitha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Phone Number (WhatsApp for confirmation) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. 080958 46826 or 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Select Treatment Specialization *
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                >
                  {SERVICES_LIST.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Initial Doctor Assessment & Diagnosis">
                    Initial Doctor Assessment & Diagnosis
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Available Time Slot
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-xs"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Brief Condition / Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-xs"
                  placeholder="e.g. L5 spine shooting pain, previous MRI, elderly assistance needed"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/20 hover:brightness-110 disabled:opacity-50 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-slate-950" />
                    <span>Confirm Appointment in Vidyaranyapura</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>No pre-payment required. Pay after clinical consultation.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
