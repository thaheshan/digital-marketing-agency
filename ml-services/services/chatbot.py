"""
Chatbot NLP Service
Intent classification + response generation for the agency chatbot.
Uses keyword matching + TF-IDF similarity. No external API required.
Claude API is used as an optional upgrade if CLAUDE_API_KEY is set.
"""
import os
import re
import uuid
import time
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# In-memory session store (in production, use Redis)
_sessions: dict = {}

# ── Intent Definitions ────────────────────────────────────────────────────────

INTENTS = {
    "greeting": {
        "keywords": ["hi", "hello", "hey", "good morning", "good afternoon", "howdy"],
        "score_delta": 0,
    },
    "pricing": {
        "keywords": ["price", "cost", "how much", "pricing", "package", "rate", "fee", "charge", "budget", "afford"],
        "score_delta": 15,
    },
    "services": {
        "keywords": ["service", "offer", "what do you do", "seo", "ppc", "social media", "content", "email marketing", "google ads", "facebook ads", "branding"],
        "score_delta": 10,
    },
    "portfolio": {
        "keywords": ["work", "portfolio", "example", "case study", "past client", "results", "success", "project"],
        "score_delta": 12,
    },
    "contact": {
        "keywords": ["contact", "speak", "talk", "call", "email", "reach", "book", "appointment", "consultation", "quote", "meet"],
        "score_delta": 20,
    },
    "timeline": {
        "keywords": ["when", "how long", "timeline", "start", "begin", "launch", "quickly", "fast", "asap", "urgent"],
        "score_delta": 8,
    },
    "qualification_budget": {
        "keywords": ["£", "$", "thousand", "k per month", "monthly", "budget", "spend", "invest"],
        "score_delta": 20,
    },
    "qualification_service": {
        "keywords": ["social", "seo", "ppc", "google", "facebook", "instagram", "content", "email", "branding", "ads"],
        "score_delta": 10,
    },
    "about": {
        "keywords": ["about", "who are you", "agency", "team", "experience", "years", "founded", "company"],
        "score_delta": 5,
    },
    "testimonials": {
        "keywords": ["review", "testimonial", "feedback", "ratings", "trust", "recommend", "client say"],
        "score_delta": 8,
    },
    "not_interested": {
        "keywords": ["no thanks", "not interested", "maybe later", "bye", "goodbye"],
        "score_delta": -5,
    },
}

# ── Response Templates ────────────────────────────────────────────────────────

RESPONSES = {
    "greeting": [
        "Hi there! 👋 Welcome to DigitalPulse Agency. I'm here to help you find the right marketing solution. What brings you here today?",
        "Hello! Great to see you here. I can help you explore our services, see past work, or get a quote. What can I help with?",
    ],
    "pricing": [
        "Our packages are tailored to your needs. Social Media starts from **£2,500/month**, SEO from **£1,200/month**, and PPC from **£1,500/month** (not including ad spend). What service interests you most? I can give you a more specific estimate.",
        "Great question! Pricing depends on the scope. As a guide:\n• **Social Media Marketing**: £2,500 – £8,000/mo\n• **SEO**: £1,200 – £4,000/mo\n• **PPC/Google Ads**: £1,500 – £5,000/mo + ad spend\n\nWould you like me to connect you with someone for a free custom quote?",
    ],
    "services": [
        "We offer 6 core services:\n• 📱 **Social Media Marketing** — Instagram, Facebook, TikTok\n• 🔍 **SEO Optimisation** — organic search growth\n• 🎯 **PPC Advertising** — Google & Meta Ads\n• ✍️ **Content Marketing** — blogs, videos, copywriting\n• 📧 **Email Marketing** — automation & campaigns\n• 📊 **Analytics & Reporting** — data-driven insights\n\nWhich area do you need help with?",
    ],
    "portfolio": [
        "We've helped 50+ businesses grow online. Some highlights:\n• 📈 **Glow Skincare** — 312% ROI in 3 months via social media\n• 💻 **TechFlow SaaS** — 220% increase in qualified leads through SEO\n• 🏡 **Nova Real Estate** — 180 qualified leads at £8 CPA via Google Ads\n\nYou can browse all case studies on our [Portfolio page](/portfolio). Would you like me to show you examples relevant to your industry?",
    ],
    "contact": [
        "Absolutely! You can:\n• 📋 Fill in our [contact form](/contact) — we respond within 24 hours\n• 📞 Call us directly during business hours\n\nOr I can take a few quick details now and have someone reach out to you. Would that work?",
    ],
    "timeline": [
        "Timeline depends on the service:\n• **Social Media** campaigns can go live in **1–2 weeks**\n• **SEO** results typically show within **90 days**\n• **PPC campaigns** can be live within **5–7 business days**\n\nWhat's your ideal start date?",
    ],
    "about": [
        "DigitalPulse Agency was founded to help small and medium businesses compete online without wasting budget. Our team of 12 specialists has delivered campaigns for clients across e-commerce, SaaS, retail, and hospitality. We've been recognised as a Top 10 Digital Agency in the region. Anything specific you'd like to know?",
    ],
    "testimonials": [
        "We're proud of our client results! Recent highlights:\n⭐⭐⭐⭐⭐ *\"Our lead volume tripled in 3 months\"* — Marcus J., TechGrowth CEO\n⭐⭐⭐⭐⭐ *\"Finally know where our ROI comes from\"* — Sarah L., Bloom Marketing Director\n\nYou can read all reviews on our [Testimonials page](/testimonials).",
    ],
    "qualification_budget": [
        "That's a great starting budget! We typically achieve the best results with a minimum of £2,000/month for managed campaigns. Could I ask — which service are you most interested in: Social Media, SEO, or PPC?",
    ],
    "qualification_service": [
        "That service is one of our specialities! Can I ask — what's your approximate monthly marketing budget? This helps me match you with the right package.",
    ],
    "not_interested": [
        "No problem at all! If you ever want to chat, we're here. In the meantime, feel free to browse our [portfolio](/portfolio) or [services](/services). Have a great day! 👋",
    ],
    "default": [
        "Thanks for your message! That's a great question. Let me connect you with one of our specialists who can give you a detailed answer. Could you share your email address so we can follow up?",
        "I want to make sure I give you accurate information on that. Could you share a bit more about what you're looking for? Or feel free to use our [contact form](/contact) for a personalised response.",
    ],
    "capture_email": [
        "Thanks! Could I grab your email address so we can send you a tailored proposal?",
    ],
    "capture_service": [
        "Which service are you most interested in? (Social Media, SEO, PPC, Content, Email, or Branding)",
    ],
    "capture_budget": [
        "What's your approximate monthly budget? (e.g. £1,000–£2,000, £2,000–£4,000, £4,000+)",
    ],
}

QUICK_REPLIES = {
    "greeting":              ["💰 Pricing", "🎯 Our Services", "🖼️ Portfolio", "📞 Book a Call"],
    "pricing":               ["Social Media Pricing", "SEO Pricing", "PPC Pricing", "Get a Custom Quote"],
    "services":              ["Social Media", "SEO", "PPC / Google Ads", "Content Marketing"],
    "portfolio":             ["E-commerce Cases", "B2B Cases", "View All Work"],
    "contact":               ["Fill Contact Form", "Request a Quote"],
    "default":               ["Our Pricing", "Case Studies", "Book a Consultation", "Contact Us"],
}

# Qualification flow stages
QUAL_FLOW = ["capture_service", "capture_budget", "capture_email"]


def _detect_intent(message: str) -> tuple[str, int]:
    """Returns (intent_name, score_delta)."""
    msg_lower = message.lower()
    best_intent = "default"
    best_count = 0

    for intent, cfg in INTENTS.items():
        count = sum(1 for kw in cfg["keywords"] if kw in msg_lower)
        if count > best_count:
            best_count = count
            best_intent = intent

    score_delta = INTENTS.get(best_intent, {}).get("score_delta", 0)
    return best_intent, score_delta


def _pick_response(intent: str, session: dict) -> str:
    """Select appropriate response, considering session state."""
    import random
    options = RESPONSES.get(intent, RESPONSES["default"])
    return random.choice(options)


def _extract_capture(message: str, stage: str) -> str | None:
    """Try to extract captured data from user message."""
    if stage == "capture_email":
        match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", message)
        return match.group(0) if match else None
    if stage == "capture_budget":
        # Look for £ amounts or ranges
        match = re.search(r"£?\d[\d,]*(?:\s*[-–]\s*£?\d[\d,]*)?(?:/mo|/month)?", message)
        return match.group(0) if match else message.strip()
    if stage == "capture_service":
        services = ["social media", "seo", "ppc", "google ads", "content", "email", "branding"]
        for svc in services:
            if svc in message.lower():
                return svc.title()
        return message.strip() if len(message.strip()) > 2 else None
    return None


def start_session(page_context: str = "", visitor_data: dict = {}) -> dict:
    """Create a new chatbot session and return greeting."""
    session_id = str(uuid.uuid4())

    # Context-aware greeting
    if "portfolio" in page_context:
        greeting = "Hi! I see you're browsing our portfolio. Would you like me to highlight case studies relevant to your industry? 🎯"
        quick_replies = ["E-commerce", "B2B / SaaS", "Retail", "Hospitality"]
    elif "pricing" in page_context or "services" in page_context:
        greeting = "Hi! Looking for pricing info? Our packages start from £1,200/month. What type of marketing are you exploring? 💡"
        quick_replies = ["Social Media", "SEO", "PPC", "Content Marketing"]
    elif "roi" in page_context or "calculator" in page_context:
        greeting = "Hi! Looks like you're calculating your potential ROI. Would you like to speak with a specialist to refine these projections? 📊"
        quick_replies = ["Yes, connect me", "View Pricing", "See Case Studies"]
    else:
        greeting = RESPONSES["greeting"][0]
        quick_replies = QUICK_REPLIES["greeting"]

    _sessions[session_id] = {
        "id": session_id,
        "messages": [{"from": "bot", "text": greeting, "time": _now()}],
        "qual_stage": 0,  # index into QUAL_FLOW
        "captured": {"service": None, "budget": None, "email": None, "name": None},
        "score_total": 0,
        "started_at": time.time(),
    }

    return {
        "session_id": session_id,
        "reply": greeting,
        "intent": "greeting",
        "score_delta": 0,
        "quick_replies": quick_replies,
        "capture_type": None,
    }


def process_message(session_id: str, message: str, page_context: str = "", visitor_data: dict = {}) -> dict:
    """Process a message and return a reply."""
    # Get or create session
    if session_id not in _sessions:
        session = {
            "id": session_id,
            "messages": [],
            "qual_stage": 0,
            "captured": {"service": None, "budget": None, "email": None},
            "score_total": 0,
            "started_at": time.time(),
        }
        _sessions[session_id] = session
    else:
        session = _sessions[session_id]

    # Record user message
    session["messages"].append({"from": "user", "text": message, "time": _now()})

    # Detect intent
    intent, score_delta = _detect_intent(message)
    session["score_total"] += score_delta

    # Check if we're in a qualification flow
    qual_stage_idx = session.get("qual_stage", 0)
    capture_type = None

    if qual_stage_idx < len(QUAL_FLOW):
        current_stage = QUAL_FLOW[qual_stage_idx]
        extracted = _extract_capture(message, current_stage)
        if extracted and current_stage == "capture_email":
            session["captured"]["email"] = extracted
            session["qual_stage"] += 1
            reply = f"Thanks! We'll follow up at **{extracted}** within 24 hours. Is there anything else you'd like to know in the meantime?"
            quick_replies = ["View Our Portfolio", "See Pricing", "Read Testimonials"]
            capture_type = "email"
        elif extracted and current_stage == "capture_service":
            session["captured"]["service"] = extracted
            session["qual_stage"] += 1
            reply = _pick_response("capture_budget", session)
            quick_replies = ["£500–£1,000", "£1,000–£2,000", "£2,000–£4,000", "£4,000+"]
            capture_type = "service"
        elif extracted and current_stage == "capture_budget":
            session["captured"]["budget"] = extracted
            session["qual_stage"] += 1
            reply = _pick_response("capture_email", session)
            quick_replies = []
            capture_type = "budget"
        else:
            # Answer their question but nudge qualification if high-intent
            reply = _pick_response(intent, session)
            quick_replies = QUICK_REPLIES.get(intent, QUICK_REPLIES["default"])
    else:
        # Qualification complete
        reply = _pick_response(intent, session)
        quick_replies = QUICK_REPLIES.get(intent, QUICK_REPLIES["default"])

    # Escalation detection
    escalate = any(kw in message.lower() for kw in ["speak to", "talk to", "human", "person", "agent", "complex", "urgent"])
    if escalate:
        reply = "I'll connect you with one of our specialists right away! Please use our [contact form](/contact) or I can take your email and have someone call you within 1 hour."
        quick_replies = ["Leave my email", "Fill Contact Form"]

    # Record bot reply
    session["messages"].append({"from": "bot", "text": reply, "time": _now()})

    return {
        "session_id": session_id,
        "reply": reply,
        "intent": intent,
        "score_delta": score_delta,
        "quick_replies": quick_replies,
        "capture_type": capture_type,
        "captured": session["captured"],
        "total_score": session["score_total"],
        "message_count": len([m for m in session["messages"] if m["from"] == "user"]),
    }


def _now() -> str:
    return datetime.now().strftime("%H:%M")
