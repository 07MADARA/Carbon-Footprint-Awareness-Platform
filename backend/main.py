from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI(title="Carbon Footprint API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class UserData(BaseModel):
    transportMiles: float
    dietType: str # "Daily", "Frequently", "Occasionally", "Rarely", "Never"
    energyKwh: float

class CalculationResult(BaseModel):
    totalFootprint: float
    transport: float
    diet: float
    energy: float
    highestCategory: str
    tips: list[str]

# Multipliers
# Transport: 0.4 kg CO2 per mile
# Diet: base kg CO2 monthly scaling based on meat consumption
DIET_MULTIPLIERS = {
    "Daily": 150.0,
    "Frequently": 100.0,
    "Occasionally": 70.0,
    "Rarely": 40.0,
    "Never": 20.0
}
# Energy: 0.9 kg CO2 per kWh

TIPS = {
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
async def calculate_footprint(data: UserData):
    # Simulate a slight delay to allow frontend to show loading state (wow factor)
    time.sleep(1.5)
    
    transport_emissions = data.transportMiles * 0.4
    diet_emissions = DIET_MULTIPLIERS.get(data.dietType, 100.0)
    energy_emissions = data.energyKwh * 0.9
    
    total = transport_emissions + diet_emissions + energy_emissions
    
    # Determine highest category
    categories = {
        "transport": transport_emissions,
        "diet": diet_emissions,
        "energy": energy_emissions
    }
    
    highest_category = max(categories, key=categories.get)
    suggested_tips = TIPS[highest_category]
    
    return CalculationResult(
        totalFootprint=round(total, 2),
        transport=round(transport_emissions, 2),
        diet=round(diet_emissions, 2),
        energy=round(energy_emissions, 2),
        highestCategory=highest_category,
        tips=suggested_tips
    )

@app.get("/")
def read_root():
    return {"message": "Carbon Footprint API is running. Use /calculate endpoint."}
