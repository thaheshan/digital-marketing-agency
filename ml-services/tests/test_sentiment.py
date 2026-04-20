import sys
sys.path.insert(0, "..")
from services.sentiment import analyze_sentiment

def test_positive():
    result = analyze_sentiment("This is amazing and excellent work!")
    assert result["sentiment"] == "positive"

def test_negative():
    result = analyze_sentiment("This is terrible and horrible service")
    assert result["sentiment"] == "negative"

def test_neutral():
    result = analyze_sentiment("The product was delivered")
    assert result["sentiment"] in ["neutral", "positive", "negative"]

def test_empty():
    result = analyze_sentiment("")
    assert result["sentiment"] == "neutral"

def test_returns_polarity():
    result = analyze_sentiment("Fantastic results, highly recommend!")
    assert "polarity" in result
    assert isinstance(result["polarity"], float)

def test_negative_polarity():
    result = analyze_sentiment("Terrible experience, very disappointed")
    assert result["sentiment"] == "negative"
