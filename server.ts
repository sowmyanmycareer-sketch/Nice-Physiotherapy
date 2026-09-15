import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini with telemetry User-Agent
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    clinic: "Dr Nice Physiotherapy Centre",
    bengaluru: true,
  });
});

// AI Clinical Triage & Rehabilitation Reasoning with Gemini 3 Thinking
app.post("/api/gemini/triage", async (req, res) => {
  try {
    const { painArea, severity, duration, symptoms, activityLevel } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured yet. Please check settings.",
      });
    }

    const systemPrompt = `You are the Lead Clinical Physiotherapy AI Specialist assisting Dr. Nikitha (10+ years experience, Founder of Dr Nice Physiotherapy Centre in Vidyaranyapura, Bengaluru).
You possess deep knowledge of musculoskeletal biomechanics, orthopedic rehabilitation, spinal kinematics (e.g., L4-L5/L5-S1 lumbar discs, cervical spine), joint mobilization, and postural dysfunctions.

Format your answer with clear markdown sections:
### 1. Biomechanical Analysis & Potential Pathomechanics
Explain anatomically what structures (e.g. annulus fibrosus, facet joints, deep cervical flexors, rotator cuff, patellar tendon) might be stressed or irritated based on the user's report.

### 2. Clinical Physiotherapy Interventions Recommended
Detail how Dr Nice Physiotherapy Centre can treat this (e.g., Targeted Spinal Mobilization & Decompression, McKenzie Protocol, Dry Needling, Therapeutic Ultrasound/IFT, Deep Tissue Myofascial Release, Core & Lumbo-pelvic Stabilization).

### 3. Immediate "Do's & Don'ts" (Ergonomics & Home Relief)
Give 2-3 safe ergonomic adjustments and 2 movements to avoid right now to prevent aggravating the condition.

### 4. Guided Gentle Active Range & Postural Relief Drill
Describe 1 or 2 very safe, zero-impact relief exercises (e.g. pelvic tilts, cat-camel, nerve flossing, isometric neck chin tucks) with step-by-step guidance.

Always maintain a reassuring, expert, and warm professional tone. Clarify that while this guidance is based on clinical physiotherapy principles, an in-person physical assessment by Dr. Nikitha at #19 Sai Orchard Layout, Vidyaranyapura is vital for precise palpation and recovery mapping.`;

    const userPrompt = `Patient Assessment Request:
- Pain / Affected Area: ${painArea || "General Spine / Joint"}
- Severity (1 to 10): ${severity || 5}
- Duration of Pain: ${duration || "A few weeks"}
- Specific Symptoms reported: ${symptoms || "Stiffness and sharp discomfort with movement"}
- Daily Activity / Work Routine: ${activityLevel || "Desk job / sitting long hours"}

Please provide a deep, reasoned clinical physiotherapy rehabilitation guide.`;

    // Using Gemini 3 series with High Thinking Level for maximum clinical reasoning
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const analysis = response.text || "Unable to generate assessment at this moment.";
    res.json({ analysis });
  } catch (error: any) {
    console.error("Gemini Triage Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate physiotherapy assessment.",
    });
  }
});

// AI Ergonomic Posture & Desk Workstation Analyzer
app.post("/api/gemini/posture-check", async (req, res) => {
  try {
    const { workStyle, hoursSitting, painTriggers, screenSetup } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `User Desk & Ergonomics Profile:
- Work style: ${workStyle || "Software engineer / desk worker"}
- Hours sitting daily: ${hoursSitting || 8} hrs
- Symptoms noticed at desk: ${painTriggers || "Neck stiffness, upper back knot, lower back fatigue"}
- Screen / Chair setup: ${screenSetup || "Laptop on standard desk without external monitor"}

Provide:
1. 3 Specific Ergonomic Geometry Adjustments (Eye level, 90-degree elbow/hip angle, lumbar support).
2. The "30-Minute Micro-Break Routine" (3 quick 20-second dynamic desk stretches).
3. Recommended preventive physiotherapy treatments at Dr Nice Physiotherapy Centre Bengaluru.`,
      config: {
        systemInstruction: "You are an ergonomic & occupational physiotherapy expert at Dr Nice Physiotherapy Centre Bengaluru.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({ advice: response.text });
  } catch (error: any) {
    console.error("Posture Check Error:", error);
    res.status(500).json({ error: error?.message || "Failed to analyze posture." });
  }
});

// Appointment booking endpoint (in-memory confirmation with booking code)
app.post("/api/booking", (req, res) => {
  const { name, phone, service, date, timeSlot, notes } = req.body;

  if (!name || !phone || !service) {
    return res.status(400).json({ error: "Name, phone, and service are required." });
  }

  const bookingId = "DN-" + Math.floor(100000 + Math.random() * 900000);
  const confirmation = {
    bookingId,
    name,
    phone,
    service,
    date: date || "Today",
    timeSlot: timeSlot || "10:30 AM",
    clinic: "Dr Nice Physiotherapy Centre",
    doctor: "Dr. Nikitha & Clinical Team",
    address: "#19 Sai Orchard Layout, Hesaraghatta Rd, Vidyaranyapura, Bengaluru, Karnataka 560097",
    contactPhone: "080958 46826",
    status: "Confirmed",
    timestamp: new Date().toISOString(),
    notes: notes || "Initial consultation & assessment",
  };

  res.json({ success: true, booking: confirmation });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Dr Nice Physiotherapy Centre server running on http://localhost:${PORT}`);
  });
}

startServer();
