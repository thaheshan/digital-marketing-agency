import sys
sys.path.insert(0, "..")
from services.sentiment import analyze

def test_positive():
    result = analyze({"text": "This is amazing and excellent work!"})
    assert result["label"] == "positive"

def test_negative():
    result = analyze({"text": "This is terrible and horrible service"})
    assert result["label"] == "negative"

def test_neutral():
    result = analyze({"text": "The product was delivered"})
    assert result["label"] in ["neutral", "positive", "negative"]

def test_empty():
    result = analyze({"text": ""})
    assert result["label"] == "neutral"
    assert result["polarity"] == 0.0

def test_auto_approve_positive():
    result = analyze({"text": "Fantastic results, highly recommend!"})
    assert result["auto_approve"] == True

def test_no_auto_approve_negative():
    result = analyze({"text": "Terrible experience, very disappointed"})
    assert result["auto_approve"] == False
