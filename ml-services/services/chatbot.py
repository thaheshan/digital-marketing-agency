import re

RESPONSES = {
    "pricing": {
        "keywords": ["price", "cost", "how much", "pricing", "fee", "charge"],
        "reply": "Our pricing starts from £2,995/month for social media marketing. We offer Basic, Pro, and Enterprise tiers. Would you like a custom quote?",
        "score_delta": 15,
        "intent": "ask_price"
    },
    "services": {
        "keywords": ["service", "offer", "do you", "what can", "help with"],
        "reply": "We offer Social Media Marketing, SEO Optimization, PPC Advertising, Email Marketing, and Content Creation. Which area interests you most?",
        "score_delta": 8,
        "intent": "ask_services"
    },
    "contact": {
        "keywords": ["contact", "speak", "talk", "call", "email", "meet", "consultation"],
        "reply": "I would love to connect you with our team! Could you share your email address and we will have someone reach out within 24 hours.",
        "score_delta": 20,
        "intent": "request_contact"
    },
    "roi": {
        "keywords": ["roi", "return", "results", "growth", "revenue", "profit"],
        "reply": "Our clients typically see 185-285% ROI within 6-12 months. Try our free ROI calculator to get personalized projections for your business!",
        "score_delta": 12,
        "intent": "ask_roi"
    },
    "timeline": {
        "keywords": ["how long", "when", "timeline", "start", "begin"],
        "reply": "We can typically onboard new clients within 1-2 weeks. Most campaigns go live within 14 days of signing. When are you looking to get started?",
        "score_delta": 10,
        "intent": "ask_timeline"
    },
    "greeting": {
        "keywords": ["hello", "hi", "hey", "good morning", "good afternoon"],
        "reply": "Hello! Welcome to Digital Pulse. I am here to help you grow your business. What brings you here today?",
        "score_delta": 2,
        "intent": "greeting"
    },
}

DEFAULT_REPLY = "That is a great question! Our team specialises in helping businesses grow through digital marketing. Could you tell me more about your business goals?"

def process_message(data: dict) -> dict:
    message    = data.get("message", "").lower()
    session_id = data.get("session_id", "")

    matched = None
    for key, config in RESPONSES.items():
        if any(kw in message for kw in config["keywords"]):
            matched = config
            break

    if matched:
        return {
            "reply":       matched["reply"],
            "intent":      matched["intent"],
            "score_delta": matched["score_delta"],
            "session_id":  session_id,
        }

    return {
        "reply":       DEFAULT_REPLY,
        "intent":      "unknown",
        "score_delta": 2,
        "session_id":  session_id,
    }
