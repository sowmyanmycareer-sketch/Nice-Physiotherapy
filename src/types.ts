export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  comment: string;
  treatmentTag: string;
  verified: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  treats: string[];
  sessionDuration: string;
  modalities: string[];
  anatomicalArea: "spine" | "shoulder" | "knee" | "neck" | "general";
}

export interface AnatomicalHotspot {
  id: string;
  name: string;
  position: [number, number, number];
  description: string;
  commonIssues: string;
  treatments: string[];
}

export interface TriageResult {
  analysis: string;
  timestamp: string;
  painArea: string;
  severity: number;
}

export interface BookingData {
  bookingId: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  clinic: string;
  doctor: string;
  address: string;
  contactPhone: string;
  status: string;
  timestamp: string;
  notes?: string;
}
