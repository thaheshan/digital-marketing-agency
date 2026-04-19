from textblob import TextBlob

def analyze_sentiment(text: str) -> dict:
    """
    Analyzes the sentiment of a given text (e.g. client review)
    Returns subjectivity, polarity, and a categorical 'positive/neutral/negative'.
    """
    if not text or not text.strip():
        return {"sentiment": "neutral", "polarity": 0, "subjectivity": 0}
        
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    # Classify polarity into standard categories
    if polarity > 0.15:
        category = "positive"
    elif polarity < -0.15:
        category = "negative"
    else:
        category = "neutral"
        
    return {
        "sentiment": category,
        "polarity": round(polarity, 2),
        "subjectivity": round(subjectivity, 2)
    }
