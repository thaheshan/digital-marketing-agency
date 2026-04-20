import sys
sys.path.insert(0, "..")
from services.lead_scoring import score_lead

def test_hot_lead():
    behaviour = {"pages_viewed": 5, "time_on_site_sec": 300, "used_roi_calc": True, "used_audit": True}
    form = {"budget_range": "£10,000", "timeline": "immediately", "phone_provided": True}
    result = score_lead(behaviour, form)
    assert result["score"] >= 0
    assert result["temperature"] in ["hot", "warm", "cold"]

def test_cold_lead():
    behaviour = {"pages_viewed": 1, "time_on_site_sec": 5}
    form = {"budget_range": "", "timeline": "", "phone_provided": False}
    result = score_lead(behaviour, form)
    assert result["temperature"] in ["cold", "warm"]

def test_score_bounds():
    behaviour = {"pages_viewed": 100, "time_on_site_sec": 9999}
    form = {"budget_range": "£50,000", "timeline": "immediately", "phone_provided": True}
    result = score_lead(behaviour, form)
    assert 0 <= result["score"] <= 100

def test_returns_temperature():
    result = score_lead({}, {})
    assert "temperature" in result
    assert result["temperature"] in ["hot", "warm", "cold"]

def test_returns_score():
    result = score_lead({}, {})
    assert "score" in result
    assert isinstance(result["score"], (int, float))
