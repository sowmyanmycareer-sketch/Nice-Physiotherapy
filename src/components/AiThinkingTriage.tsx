import React, { useState } from "react";
import { CLINIC_INFO } from "../data/clinicData";
import { 
  Sparkles, 
  BrainCircuit, 
  Activity, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  Layers, 
  RotateCcw,
  Zap,
  Laptop,
  Flame,
  ArrowRight
} from "lucide-react";

interface AiThinkingTriageProps {
  initialArea?: string;
  onOpenBooking: () => void;
}

export const AiThinkingTriage: React.FC<AiThinkingTriageProps> = ({
  initialArea = "L4-L5 Lumbar Spine (Lower Back)",
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<"triage" | "ergonomics">("triage");

  // Triage state
  const [painArea, setPainArea] = useState(initialArea);
  const [severity, setSeverity] = useState(6);
  const [duration, setDuration] = useState("2 - 6 weeks");
  const [symptoms, setSymptoms] = useState("Shooting pain down leg, morning stiffness, difficulty standing straight");
  const [activityLevel, setActivityLevel] = useState("Desk job (sitting 8+ hours)");

  // Ergonomics state
  const [workStyle, setWorkStyle] = useState("Software Engineer / Desk Worker in Bengaluru");
  const [hoursSitting, setHoursSitting] = useState(9);
  const [painTriggers, setPainTriggers] = useState("Stiff neck at 4 PM, mid-back ache, hunched shoulders");
  const [screenSetup, setScreenSetup] = useState("Laptop on desk without external monitor or stand");

  // Execution state
  const [loading, setLoading] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const thinkingSteps = [
    "Gemini 3.5 Thinking Engine: Analyzing anatomical kinematics & nerve root pathomechanics...",
    "Correlating symptoms with Dr Nice Centre clinical orthopedic database...",
    "Synthesizing spinal decompression, manual mobilization, and corrective biomechanics...",
    "Generating personalized clinical rehab trajectory & ergonomic safeguard protocols...",
  ];

  const handleRunTriage = async () => {
    setLoading(true);
    setResultText(null);
    setErrorText(null);
    setThinkingStep(0);

    const stepInterval = setInterval(() => {
      setThinkingStep((prev) => (prev < thinkingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const endpoint = activeTab === "triage" ? "/api/gemini/triage" : "/api/gemini/posture-check";
      const payload = activeTab === "triage"
        ? { painArea, severity, duration, symptoms, activityLevel }
        : { workStyle, hoursSitting, painTriggers, screenSetup };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI consultation.");
      }

      setResultText(data.analysis || data.advice);
    } catch (err: any) {
      setErrorText(err.message || "Something went wrong while consulting the AI model.");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
    }
  };

  const applyPreset = (presetArea: string, presetSymptoms: string, presetSeverity: number) => {
    setPainArea(presetArea);
    setSymptoms(presetSymptoms);
    setSeverity(presetSeverity);
  };

  return (
    <section id="ai-triage" className="py-16 md:py-24 relative overflow-hidden bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/70 border border-teal-500/40 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Powered by Gemini 3.5 High Thinking Model</span>
          </div>
          <h2 className="font-['Outfit'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            AI Clinical Rehabilitation & <br />
            <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
              Biomechanical Triage
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Get an instant orthopedic reasoning analysis, anatomical stress mapping, and personalized physiotherapy recommendations calibrated for Dr Nice Physiotherapy Centre.
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => { setActiveTab("triage"); setResultText(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === "triage"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Pain & Spine Triage</span>
            </button>
            <button
              onClick={() => { setActiveTab("ergonomics"); setResultText(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === "ergonomics"
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>IT Workstation & Posture</span>
            </button>
          </div>
        </div>

        {/* Triage Container Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Inputs */}
          <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-teal-400" />
                <span className="font-semibold text-white text-base">
                  {activeTab === "triage" ? "Patient Symptom Profile" : "Desk Setup & Ergonomics Profile"}
                </span>
              </div>
              <span className="text-xs text-teal-400 font-mono">ThinkingLevel.HIGH</span>
            </div>

            {/* Quick Presets for Common Bengaluru Clinic Cases */}
            {activeTab === "triage" && (
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Quick Case Templates (From Google Reviews):</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset("L5 Spine & Lumbar Disc", "Shooting nerve pain into leg, severe morning stiffness, difficulty bending (like Sirisha T)", 8)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40 hover:bg-rose-900/40 transition"
                  >
                    Sirisha's L5 Spine Case
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("Geriatric Knee Joint (Elderly)", "Knee osteoarthritis, knee stiffness when walking, balance instability (like Arpitha's grandmother)", 6)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-teal-950/40 text-teal-300 border border-teal-800/40 hover:bg-teal-900/40 transition"
                  >
                    Grandmother Knee Care
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset("Cervical Spine (Tech Neck)", "Upper neck spasms, tension headaches after 6 hours on laptop, burning shoulder blade", 5)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/40 transition"
                  >
                    Tech Neck & Shoulder
                  </button>
                </div>
              </div>
            )}

            {/* Form Fields */}
            {activeTab === "triage" ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                    Target Anatomical Area:
                  </label>
                  <input
                    type="text"
                    value={painArea}
                    onChange={(e) => setPainArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition"
                    placeholder="e.g., L5-S1 Spine, Right Knee, Frozen Shoulder"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-medium text-xs">
                      Pain Severity (1 to 10 Scale):
                    </label>
                    <span className="font-bold font-mono text-teal-400 text-sm">
                      {severity}/10 {severity >= 7 ? "(Severe)" : severity >= 4 ? "(Moderate)" : "(Mild)"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                      Pain Duration:
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    >
                      <option>Less than 1 week (Acute)</option>
                      <option>1 - 3 weeks (Subacute)</option>
                      <option>1 - 3 months (Persistent)</option>
                      <option>Over 6 months (Chronic)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                      Daily Routine / Activity:
                    </label>
                    <input
                      type="text"
                      value={activityLevel}
                      onChange={(e) => setActivityLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                      placeholder="e.g. 8 hrs desk work, Gym, Runner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                    Specific Symptoms & Aggravating Factors:
                  </label>
                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 text-xs sm:text-sm"
                    placeholder="Describe sensations (numbness, pins/needles, catching, stiffness)..."
                  />
                </div>
              </div>
            ) : (
              /* Ergonomics Inputs */
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                    Occupation / Work Style:
                  </label>
                  <input
                    type="text"
                    value={workStyle}
                    onChange={(e) => setWorkStyle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                      Hours Sitting Daily:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={16}
                      value={hoursSitting}
                      onChange={(e) => setHoursSitting(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                      Screen & Chair Setup:
                    </label>
                    <input
                      type="text"
                      value={screenSetup}
                      onChange={(e) => setScreenSetup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5 text-xs">
                    Desk Pain Triggers:
                  </label>
                  <textarea
                    rows={3}
                    value={painTriggers}
                    onChange={(e) => setPainTriggers(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400 text-xs sm:text-sm"
                  />
                </div>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={handleRunTriage}
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-500 text-slate-950 font-bold text-sm sm:text-base shadow-xl shadow-teal-500/20 hover:brightness-110 disabled:opacity-50 transition active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Activity className="w-5 h-5 animate-spin text-slate-950" />
                  <span>Gemini 3.5 Deep Thinking In Progress...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Generate Biomechanical Clinical Report</span>
                </>
              )}
            </button>
          </div>

          {/* Right AI Clinical Report & Reasoning Display */}
          <div className="lg:col-span-6 bg-slate-900/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col min-h-[480px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-400" />
                <h3 className="font-semibold text-white text-base">
                  Dr Nice Clinical Rehabilitation Guidance
                </h3>
              </div>
              <span className="text-xs text-slate-400">Dr. Nikitha's Protocol</span>
            </div>

            {/* Loading Thinking State */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-6 text-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
                  <BrainCircuit className="w-7 h-7 text-teal-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <div className="text-sm font-semibold text-teal-300">
                    {thinkingSteps[thinkingStep]}
                  </div>
                  <p className="text-xs text-slate-400">
                    Applying clinical biomechanics to isolate stress on facet joints, discs, and muscular kinetic chains...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorText && (
              <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Unable to complete assessment</span>
                </div>
                <p className="text-xs text-rose-200/80">{errorText}</p>
                <p className="text-xs text-slate-300">
                  You can also directly call Dr Nice Physiotherapy Centre at <strong className="text-teal-300">080958 46826</strong> for immediate telephone triage.
                </p>
              </div>
            )}

            {/* Results Display */}
            {resultText && !loading && (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 space-y-4 leading-relaxed overflow-y-auto max-h-[460px] pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                  {resultText.split("\n").map((line, i) => {
                    if (line.startsWith("### ")) {
                      return (
                        <h4 key={i} className="text-base font-bold text-teal-300 mt-4 mb-2 font-['Outfit'] border-b border-teal-900/50 pb-1">
                          {line.replace("### ", "")}
                        </h4>
                      );
                    }
                    if (line.startsWith("- ") || line.startsWith("* ")) {
                      return (
                        <li key={i} className="ml-4 text-xs sm:text-sm text-slate-300">
                          {line.replace(/^[-*]\s*/, "")}
                        </li>
                      );
                    }
                    if (line.trim() === "") return null;
                    return (
                      <p key={i} className="text-xs sm:text-sm text-slate-300">
                        {line}
                      </p>
                    );
                  })}
                </div>

                {/* Call to action footer */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Recommended Next Step:</p>
                    <p className="text-[11px] text-slate-400">In-person assessment with Dr. Nikitha</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={onOpenBooking}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Slot in Vidyaranyapura</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Default Placeholder State */}
            {!resultText && !loading && !errorText && (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center">
                  <BrainCircuit className="w-8 h-8 text-teal-400" />
                </div>
                <div className="max-w-md space-y-1">
                  <p className="font-semibold text-white text-sm">
                    Ready for Biomechanical Analysis
                  </p>
                  <p className="text-xs text-slate-400">
                    Select your symptoms or click the 3D model above to analyze L5 disc loading, nerve root pathways, and recommended treatments.
                  </p>
                </div>
                <button
                  onClick={handleRunTriage}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium border border-teal-500/20 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Analyze Sirisha's L5 Spine Case</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
