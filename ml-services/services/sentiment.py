def analyze(data: dict) -> dict:
    text = data.get("text", "")

    if not text.strip():
        return {"label": "neutral", "polarity": 0.0, "subjectivity": 0.0}

    try:
        from textblob import TextBlob
        blob      = TextBlob(text)
        polarity  = blob.sentiment.polarity
        subjectivity = blob.sentiment.subjectivity
    except Exception:
        # Fallback if TextBlob not available
        positive_words = ["great", "excellent", "amazing", "good", "love", "best", "fantastic", "brilliant"]
        negative_words = ["bad", "terrible", "awful", "poor", "hate", "worst", "horrible", "disappointing"]
        text_lower = text.lower()
        pos = sum(1 for w in positive_words if w in text_lower)
        neg = sum(1 for w in negative_words if w in text_lower)
        polarity = (pos - neg) / max(len(text.split()), 1)
        subjectivity = 0.5

    if polarity > 0.1:    label = "positive"
    elif polarity < -0.1: label = "negative"
    else:                 label = "neutral"

    return {
        "label":        label,
        "polarity":     round(polarity, 4),
        "subjectivity": round(subjectivity, 4),
        "auto_approve": label == "positive",
    }
