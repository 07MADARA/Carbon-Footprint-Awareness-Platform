"""
Carbon Footprint API.

This module provides the backend calculation engine for the Carbon Footprint Awareness Platform.
"""

import logging
from functools import lru_cache
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Carbon Footprint API", description="API for calculating carbon footprints.")

# Configure CORS for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://carbon-footprint-awarene-e3068.web.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Centralized error handling middleware."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
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
    "Never": 20.0,
}

TIPS: dict[str, list[str]] = {
    "transport": [
        "Consider carpooling or using public transportation a few times a week.",
        "If possible, switch to walking or cycling for shorter trips.",
        "Keep your car tires properly inflated to improve fuel efficiency.",
    ],
    "diet": [
        "Try incorporating one or two meatless days into your weekly routine.",
        "Buy locally sourced foods to reduce transportation emissions.",
        "Reduce food waste by planning your meals and properly storing leftovers.",
    ],
    "energy": [
        "Switch to energy-efficient LED light bulbs in your home.",
        "Unplug electronics and appliances when they are not in use.",
        "Adjust your thermostat: slightly higher in summer and lower in winter.",
    ],
}


@lru_cache(maxsize=1024)
def _calculate_emissions_core(
    transport_miles: float, diet_type: str, energy_kwh: float
) -> dict[str, float | str | list[str]]:
    """Core calculation logic with LRU cache to save CPU cycles on repeated inputs."""
    logger.info("Cache miss: Calculating emissions for input parameters.")
    transport_emissions = transport_miles * 0.4
    diet_emissions = DIET_MULTIPLIERS.get(diet_type, 100.0)
    energy_emissions = energy_kwh * 0.9

    total = transport_emissions + diet_emissions + energy_emissions

    categories = {
        "transport": transport_emissions,
        "diet": diet_emissions,
        "energy": energy_emissions,
    }

    highest_category = max(categories, key=categories.get)
    suggested_tips = TIPS[highest_category]

    return {
        "totalFootprint": round(total, 2),
        "transport": round(transport_emissions, 2),
        "diet": round(diet_emissions, 2),
        "energy": round(energy_emissions, 2),
        "highestCategory": highest_category,
        "tips": suggested_tips,
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
    logger.info(f"Received calculation request for diet: {data.dietType}")

    # Use cached core logic
    result_dict = _calculate_emissions_core(data.transportMiles, data.dietType, data.energyKwh)

    return CalculationResult(**result_dict)


@app.get("/")
async def read_root() -> dict[str, str]:
    """
    Root endpoint for health checks.
    """
    logger.info("Health check endpoint accessed.")
    return {"message": "Carbon Footprint API is running. Use /calculate endpoint."}
