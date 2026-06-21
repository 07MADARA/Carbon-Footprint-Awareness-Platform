export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/calculate';

export const DIET_OPTIONS = ['Daily', 'Frequently', 'Occasionally', 'Rarely', 'Never'];

export const EMISSION_CATEGORIES = ['transport', 'diet', 'energy'];

export const STRINGS = {
  TITLE: "EcoScore",
  TRANSPORT_HEADING: "Transport",
  TRANSPORT_DESC: "How many miles do you drive or fly in a typical month?",
  DIET_HEADING: "Diet",
  DIET_DESC: "How often do you consume meat or animal products?",
  ENERGY_HEADING: "Energy",
  ENERGY_DESC: "What is your average monthly electricity usage (kWh)?",
  MILES_UNIT: "miles",
  KWH_UNIT: "kWh",
  NETWORK_ERROR: "Failed to calculate footprint. Is the backend running?",
  LOADING_TEXT: "Analyzing footprint...",
  OOPS: "Oops!",
  TRY_AGAIN: "Try Again",
  YOUR_FOOTPRINT: "Your Monthly Carbon Footprint",
  KG_CO2: "kg CO₂",
  EXCELLENT: "Excellent - Below Average",
  AVERAGE: "Average - Room to Improve",
  HIGH: "High - Action Needed",
  EMISSION_BREAKDOWN: "Emission Breakdown",
  ACTIONABLE_TIPS: "Actionable Tips",
  RECALCULATE: "Recalculate",
  CALCULATE: "Calculate",
  NEXT: "Next",
  BACK: "Back",
};
