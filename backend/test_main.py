"""
Tests for the Carbon Footprint API.
"""
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

def test_calculate_valid_input():
    """Test calculation with valid data."""
    response = client.post(
        "/calculate",
        json={"transportMiles": 100, "dietType": "Frequently", "energyKwh": 300}
    )
    assert response.status_code == 200
    data = response.json()
    assert "totalFootprint" in data
    assert "tips" in data
    assert data["transport"] == 40.0
    assert data["diet"] == 100.0
    assert data["energy"] == 270.0
    assert data["highestCategory"] == "energy"

def test_calculate_missing_data():
    """Test calculation with missing fields."""
    response = client.post(
        "/calculate",
        json={"transportMiles": 100} # missing dietType and energyKwh
    )
    assert response.status_code == 422 # Unprocessable Entity

def test_calculate_negative_values():
    """Test calculation with invalid negative boundaries."""
    response = client.post(
        "/calculate",
        json={"transportMiles": -50, "dietType": "Rarely", "energyKwh": 100}
    )
    assert response.status_code == 422

def test_calculate_extreme_values():
    """Test calculation with extremely large invalid values."""
    response = client.post(
        "/calculate",
        json={"transportMiles": 5000000, "dietType": "Daily", "energyKwh": 9999999}
    )
    assert response.status_code == 422
