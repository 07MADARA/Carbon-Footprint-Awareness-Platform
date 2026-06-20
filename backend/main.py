"""
Carbon Footprint API.

This module provides the backend calculation engine for the Carbon Footprint Awareness Platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import time

app = FastAPI(title="Carbon Footprint API", description="API for calculating carbon footprints.")

# Configure CORS for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://carbon-footprint-awarene-e3068.web.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

class UserData(BaseModel):
    """
    Pydantic model representing user input data with strict boundaries.
    """
    transportMiles: float = Field(..., ge=0, le=100000, description="Monthly miles driven or flown.")
    dietType: str = Field(..., description="Diet frequency: Daily, Frequently, Occasionally, Rarely, Never")
    energyKwh: float = Field(..., ge=0, le=50000, description="Monthly electricity usage in kWh.")

class CalculationResult(BaseModel):
    """
    Pydantic model representing the calculation result.
    """
    totalFootprint: float
    transport: float
    diet: float
    energy: float
    highestCategory: str
    tips: list[str]

# Multipliers
DIET_MULTIPLIERS: dict[str, float] = {
    "Daily": 150.0,
    "Frequently": 100.0,
    "Occasionally": 70.0,
    "Rarely": 40.0,
    "Never": 20.0
}

TIPS: dict[str, list[str]] = {
    "transport": [
        "Consider carpooling or using public transportation a few times a week.",
        "If possible, switch to walking or cycling for shorter trips.",
        "Keep your car tires properly inflated to improve fuel efficiency."
    ],
    "diet": [
        "Try incorporating one or two meatless days into your weekly routine.",
        "Buy locally sourced foods to reduce transportation emissions.",
        "Reduce food waste by planning your meals and properly storing leftovers."
    ],
    "energy": [
        "Switch to energy-efficient LED light bulbs in your home.",
        "Unplug electronics and appliances when they are not in use.",
        "Adjust your thermostat: slightly higher in summer and lower in winter."
    ]
}

@app.post("/calculate", response_model=CalculationResult)
async def calculate_footprint(data: UserData) -> CalculationResult:
    """
    Calculate the carbon footprint based on user data.
    
    Args:
        data (UserData): The user's input data.
        
    Returns:
        CalculationResult: The calculated footprint and actionable tips.
    """
    # Simulate a slight delay to allow frontend to show loading state (wow factor)
    time.sleep(1.0)
    
    transport_emissions: float = data.transportMiles * 0.4
    diet_emissions: float = DIET_MULTIPLIERS.get(data.dietType, 100.0)
    energy_emissions: float = data.energyKwh * 0.9
    
    total: float = transport_emissions + diet_emissions + energy_emissions
    
    # Determine highest category
    categories: dict[str, float] = {
        "transport": transport_emissions,
        "diet": diet_emissions,
        "energy": energy_emissions
    }
    
    highest_category: str = max(categories, key=categories.get)
    suggested_tips: list[str] = TIPS[highest_category]
    
    return CalculationResult(
        totalFootprint=round(total, 2),
        transport=round(transport_emissions, 2),
        diet=round(diet_emissions, 2),
        energy=round(energy_emissions, 2),
        highestCategory=highest_category,
        tips=suggested_tips
    )

@app.get("/")
def read_root() -> dict[str, str]:
    """
    Root endpoint for health checks.
    """
    return {"message": "Carbon Footprint API is running. Use /calculate endpoint."}
