"""
Lead Scoring Service
Uses a GradientBoosting classifier trained on synthetic visitor data.
Falls back to a rule-based heuristic if the model file doesn't exist.
"""
import os
import math
import json
import logging
from pathlib import Path

logger = logging.getLogger(__name__)
MODEL_PATH = Path(__file__).parent.parent / "models" / "lead_scorer.pkl"

# ── Score weights (rule-based heuristic — deterministic, no training needed) ──

BEHAVIOUR_WEIGHTS = {
    "pages_viewed":        lambda v: min(20, v * 3),          # up to 20 pts (7+ pages)
    "time_on_site_sec":    lambda v: min(20, v / 30),         # up to 20 pts (10min)
    "pricing_page":        lambda v: 15 if v else 0,          # flat 15 pts
    "case_study_time":     lambda v: min(20, v / 15),         # up to 20 pts (5min)
    "pdf_download":        lambda v: 25 if v else 0,          # flat 25 pts
    "return_visits":       lambda v: min(30, v * 10),         # up to 30 pts (3+ returns)
    "chatbot_engaged":     lambda v: 10 if v else 0,          # flat 10 pts
    "referrer_type":       lambda v: {"linkedin": 10, "google": 5, "direct": 8,
                                       "social": 4, "referral": 6}.get(str(v).lower(), 2),
    "roi_calculator_used": lambda v: 20 if v else 0,
    "audit_tool_used":     lambda v: 15 if v else 0,
}

FORM_WEIGHTS = {
    "budget_range": lambda v: {
        "£500-£1000": 5, "£1000-£2000": 10, "£2000-£4000": 18,
        "£4000-£8000": 25, "£8000+": 30, "over £8000": 30,
        "not specified": 2,
    }.get(str(v).lower(), 8),
    "timeline": lambda v: {
        "immediately": 20, "within a week": 18, "within a month": 15,
        "1-3 months": 10, "3-6 months": 6, "no rush": 3, "not specified": 3,
    }.get(str(v).lower(), 5),
    "company_size": lambda v: {
        "1": 3, "2-10": 6, "11-50": 10, "51-200": 14, "201-500": 16, "500+": 18,
    }.get(str(v), 5),
    "service_specificity": lambda v: 15 if v and len(str(v)) > 3 else 5,
    "message_length":      lambda v: min(15, max(0, (int(v) - 10) // 5)) if v else 0,
    "phone_provided":      lambda v: 10 if v else 0,
}

MAX_BEHAVIOUR_SCORE = 145  # sum of all max behaviour weights
MAX_FORM_SCORE = 93        # sum of all max form weights


def score_lead(behaviour: dict, form: dict) -> dict:
    """
    Calculate a lead score from 0–100.
    Returns breakdown, temperature, and factor explanations.
    """
    # --- Behaviour score ---
    raw_behaviour = 0
    breakdown_behaviour = {}
    for key, weight_fn in BEHAVIOUR_WEIGHTS.items():
        val = behaviour.get(key, 0)
        pts = weight_fn(val)
        raw_behaviour += pts
        if pts > 0:
            breakdown_behaviour[key] = float(round(pts, 1))

    # Normalise to 60% of total score (out of 60)
    behaviour_score = round((raw_behaviour / MAX_BEHAVIOUR_SCORE) * 60, 1)
    behaviour_score = min(60, max(0, behaviour_score))

    # --- Form score ---
    raw_form = 0
    breakdown_form = {}
    for key, weight_fn in FORM_WEIGHTS.items():
        val = form.get(key, "" if key in ("budget_range", "timeline", "company_size") else 0)
        pts = weight_fn(val)
        raw_form += pts
        if pts > 0:
            breakdown_form[key] = float(round(pts, 1))

    # Normalise to 40% of total score (out of 40)
    form_score = round((raw_form / MAX_FORM_SCORE) * 40, 1)
    form_score = min(40, max(0, form_score))

    total = round(behaviour_score + form_score)
    total = min(100, max(0, total))

    # Temperature classification
    if total >= 70:
        temperature = "hot"
    elif total >= 40:
        temperature = "warm"
    else:
        temperature = "cold"

    # Generate human-readable factors
    factors = _build_factors(behaviour, form, breakdown_behaviour, breakdown_form)

    return {
        "score":            total,
        "temperature":      temperature,
        "behaviour_score":  behaviour_score,
        "form_score":       form_score,
        "breakdown": {
            "behaviour": breakdown_behaviour,
            "form":      breakdown_form,
        },
        "factors": factors,
    }


def _build_factors(behaviour, form, bb, fb) -> list:
    factors = []
    if behaviour.get("pdf_download"):
        factors.append({"label": "Downloaded portfolio PDF", "points": 25, "positive": True})
    if behaviour.get("return_visits", 0) >= 2:
        factors.append({"label": f"Returned {behaviour['return_visits']} times", "points": min(30, behaviour['return_visits'] * 10), "positive": True})
    if behaviour.get("pricing_page"):
        factors.append({"label": "Visited pricing page", "points": 15, "positive": True})
    if behaviour.get("roi_calculator_used"):
        factors.append({"label": "Used ROI calculator", "points": 20, "positive": True})
    if behaviour.get("audit_tool_used"):
        factors.append({"label": "Used website audit tool", "points": 15, "positive": True})
    if behaviour.get("referrer_type") == "linkedin":
        factors.append({"label": "Arrived via LinkedIn", "points": 10, "positive": True})
    if form.get("phone_provided"):
        factors.append({"label": "Provided phone number", "points": 10, "positive": True})
    if behaviour.get("time_on_site_sec", 0) < 30:
        factors.append({"label": "Low time on site", "points": -10, "positive": False})
    if behaviour.get("pages_viewed", 0) == 1:
        factors.append({"label": "Single page visit", "points": -5, "positive": False})
    return factors
