import sys
sys.path.insert(0, "..")
from services.lead_scoring import calculate_score

def test_hot_lead():
    data = {
        "events": [
            {"type": "viewed_pricing"},
            {"type": "return_visit"},
            {"type": "downloaded_resource"},
        ],
        "budget_range": "£10,000/month",
        "timeline": "immediately",
        "company_size": "51-200",
        "service_interest": ["SEO", "PPC", "Social Media"],
    }
    result = calculate_score(data)
    assert result["score"] >= 70
    assert result["temperature"] == "hot"

def test_cold_lead():
    data = {
        "events": [{"type": "homepage_exit_10s"}],
        "budget_range": "",
        "timeline": "",
        "company_size": "",
        "service_interest": [],
    }
    result = calculate_score(data)
    assert result["temperature"] == "cold"

def test_score_bounds():
    data = {
        "events": [{"type": "return_visit"}] * 20,
        "budget_range": "£20,000",
        "timeline": "immediately",
        "company_size": "200+",
        "service_interest": ["A", "B", "C", "D"],
    }
    result = calculate_score(data)
    assert 0 <= result["score"] <= 100

def test_warm_lead():
    data = {
        "events": [{"type": "viewed_pricing"}],
        "budget_range": "£5,000",
        "timeline": "3 months",
        "company_size": "11-50",
        "service_interest": ["SEO"],
    }
    result = calculate_score(data)
    assert result["temperature"] in ["warm", "hot"]

def test_empty_input():
    result = calculate_score({})
    assert result["score"] == 0
    assert result["temperature"] == "cold"
