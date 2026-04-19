"""
Content Scoring Service (Rule-Based — No External API)
Scores portfolio descriptions and blog posts across 4 dimensions.
Runs entirely locally with no API calls needed.
"""
import re
import logging

logger = logging.getLogger(__name__)

# ── Keyword Dictionaries by Service Category ──────────────────────────────────

KEYWORD_DICT = {
    "social_media": [
        "engagement", "reach", "impressions", "followers", "community", "viral",
        "instagram", "facebook", "tiktok", "linkedin", "campaign", "audience",
        "conversion", "click-through rate", "ctr", "story ads", "reel",
    ],
    "seo": [
        "organic", "ranking", "keyword", "backlink", "domain authority", "traffic",
        "serp", "meta", "search engine", "indexing", "crawl", "page speed",
        "bounce rate", "average position", "impressions",
    ],
    "ppc": [
        "click-through", "ctr", "cost per click", "cpc", "roas", "roi",
        "google ads", "paid search", "display", "retargeting", "bid",
        "quality score", "conversion rate", "ad spend", "cpa",
    ],
    "content": [
        "content strategy", "copywriting", "blog", "seo content", "storytelling",
        "thought leadership", "editorial", "inbound", "lead magnet", "whitepaper",
        "engagement rate", "readership", "traffic",
    ],
    "email": [
        "open rate", "click rate", "deliverability", "automation", "drip",
        "subscriber", "segmentation", "personalisation", "ab test", "conversion",
        "unsubscribe", "revenue per email",
    ],
    "branding": [
        "brand identity", "visual", "logo", "typography", "colour palette",
        "brand voice", "positioning", "awareness", "recognition", "differentiation",
        "market", "perception",
    ],
    "general": [
        "roi", "results", "growth", "revenue", "leads", "conversions",
        "strategy", "performance", "data-driven", "audience", "engagement",
        "campaign", "digital marketing", "analytics",
    ],
}

ACTION_VERBS = [
    "achieved", "delivered", "generated", "increased", "grew", "boosted",
    "drove", "improved", "reduced", "launched", "transformed", "scaled",
    "exceeded", "optimised", "accelerated", "doubled", "tripled", "surpassed",
]

TRUST_WORDS = [
    "proven", "certified", "award-winning", "trusted", "leading", "established",
    "industry-recognised", "verified", "accredited",
]

URGENCY_WORDS = [
    "quick", "fast", "rapidly", "efficiently", "within", "days", "weeks",
    "immediately", "accelerated",
]

VALUE_WORDS = [
    "boost", "grow", "maximise", "increase", "improve", "transform", "scale",
    "optimise", "succeed", "win", "outperform", "excel",
]

RESULT_PATTERNS = [
    r"\d+(?:\.\d+)?%",                   # percentages: 45%, 3.2%
    r"£[\d,]+(?:\.\d+)?[k]?",            # GBP: £3,500, £12k
    r"\$[\d,]+(?:\.\d+)?[k]?",           # USD: $5,000
    r"\d+x",                              # multipliers: 4x, 3x ROAS
    r"\d+(?:,\d{3})+",                   # numbers: 1,200 leads
    r"\b\d{2,}\b",                        # numbers ≥ 10: 87% improvement
    r"\b(?:in)\s+\d+\s+(?:days|weeks|months)\b",  # time: in 30 days
]


def score_content(text: str, content_type: str = "portfolio", service_category: str = "general") -> dict:
    """
    Score content quality across 4 dimensions, each 0–25 → total 0–100.
    Returns breakdown, suggestions, and publish recommendation.
    """
    if not text or len(text.strip()) < 10:
        return _empty_score()

    text_lower = text.lower()
    sentences = re.split(r"[.!?]+", text)
    sentences = [s.strip() for s in sentences if len(s.strip()) > 5]
    words = re.findall(r"\b\w+\b", text_lower)
    word_count = len(words)

    # ── 1. Readability (25 pts) ───────────────────────────────────────────────
    readability = 0
    readability_suggestions = []

    # Word count sweet spot: 120–250 words = full marks
    if word_count >= 200:
        readability += 8
    elif word_count >= 120:
        readability += 6
    elif word_count >= 60:
        readability += 3
        readability_suggestions.append("Add more detail — aim for at least 120 words.")
    else:
        readability_suggestions.append("Content is very short. Add at least 120 words.")

    # Average sentence length (15–25 words = ideal)
    if sentences:
        avg_sentence_len = word_count / len(sentences)
        if 12 <= avg_sentence_len <= 25:
            readability += 8
        elif 8 <= avg_sentence_len < 12 or 25 < avg_sentence_len <= 35:
            readability += 4
        else:
            readability += 1
            readability_suggestions.append("Vary sentence length — some sentences are too long or too short.")

    # Action verbs usage
    action_count = sum(1 for av in ACTION_VERBS if av in text_lower)
    if action_count >= 3:
        readability += 9
    elif action_count >= 1:
        readability += 5
        readability_suggestions.append("Use more action verbs (achieved, delivered, generated, grew).")
    else:
        readability_suggestions.append("Start sentences with action verbs to make impact clear.")

    readability = min(25, readability)

    # ── 2. Keyword Relevance (25 pts) ─────────────────────────────────────────
    keywords_found = []
    kw_suggestions = []

    category_keywords = KEYWORD_DICT.get(service_category.lower().replace(" ", "_"), KEYWORD_DICT["general"])
    general_keywords = KEYWORD_DICT["general"]
    all_keywords = list(set(category_keywords + general_keywords))

    found_set = [kw for kw in all_keywords if kw in text_lower]
    keywords_found = found_set[:10]  # top 10
    kw_score_raw = min(25, len(found_set) * 2)

    if kw_score_raw < 10:
        missing = [kw for kw in category_keywords[:5] if kw not in text_lower]
        kw_suggestions.append(f"Add relevant keywords: {', '.join(missing[:3])}")

    keyword_relevance = kw_score_raw

    # ── 3. Results Evidence (25 pts) ──────────────────────────────────────────
    results_evidence = 0
    results_suggestions = []
    results_found = []

    for pattern in RESULT_PATTERNS:
        matches = re.findall(pattern, text)
        results_found.extend(matches)

    unique_results = list(set(results_found))
    if len(unique_results) >= 4:
        results_evidence = 25
    elif len(unique_results) == 3:
        results_evidence = 20
    elif len(unique_results) == 2:
        results_evidence = 14
        results_suggestions.append("Add at least 3 specific metrics (e.g. 4.2x ROAS, £8 CPA, 150% ROI).")
    elif len(unique_results) == 1:
        results_evidence = 8
        results_suggestions.append("Include specific numbers: percentages, ROI, cost per lead, impressions.")
    else:
        results_evidence = 0
        results_suggestions.append("No specific results found. Add data: 'achieved 312% ROI', '1,200 leads at £8 CPA'.")

    # ── 4. Emotional Triggers (25 pts) ────────────────────────────────────────
    emotional_triggers = 0
    emotion_suggestions = []

    trust_hits = sum(1 for w in TRUST_WORDS if w in text_lower)
    urgency_hits = sum(1 for w in URGENCY_WORDS if w in text_lower)
    value_hits = sum(1 for w in VALUE_WORDS if w in text_lower)

    emotional_triggers += min(10, trust_hits * 4)
    emotional_triggers += min(8, urgency_hits * 3)
    emotional_triggers += min(7, value_hits * 2)
    emotional_triggers = min(25, emotional_triggers)

    if trust_hits == 0:
        emotion_suggestions.append("Add trust signals: 'award-winning', 'proven', 'industry-leading'.")
    if value_hits == 0:
        emotion_suggestions.append("Use value words: 'grew', 'transformed', 'maximised', 'outperformed'.")

    # ── Total ──────────────────────────────────────────────────────────────────
    total = readability + keyword_relevance + results_evidence + emotional_triggers
    total = min(100, max(0, total))

    can_publish = total >= 40
    all_suggestions = readability_suggestions + kw_suggestions + results_suggestions + emotion_suggestions

    return {
        "total_score":         total,
        "readability":         readability,
        "keyword_relevance":   keyword_relevance,
        "results_evidence":    results_evidence,
        "emotional_triggers":  emotional_triggers,
        "suggestions":         all_suggestions[:5],  # max 5 suggestions
        "keywords_found":      keywords_found,
        "results_found":       unique_results[:8],
        "can_publish":         can_publish,
        "word_count":          word_count,
        "grade": "excellent" if total >= 80 else "good" if total >= 60 else "needs_work" if total >= 40 else "poor",
    }


def _empty_score() -> dict:
    return {
        "total_score": 0, "readability": 0, "keyword_relevance": 0,
        "results_evidence": 0, "emotional_triggers": 0,
        "suggestions": ["Start writing your content to see a live score."],
        "keywords_found": [], "results_found": [], "can_publish": False,
        "word_count": 0, "grade": "poor",
    }
