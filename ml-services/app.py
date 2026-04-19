"""
Digital Marketing Agency — ML Services
Flask API providing: lead scoring, chatbot NLP, content scoring
"""
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from services.lead_scoring import score_lead
from services.chatbot import process_message, start_session
from services.content_scorer import score_content
from services.content_generator import generate_portfolio_content
from services.sentiment import analyze_sentiment
from services.audit import generate_website_audit

load_dotenv()

app = Flask(__name__)
CORS(app, origins=os.getenv("CORS_ORIGIN", "*"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ml-services", "version": "1.0.0"})


# ── Lead Scoring ──────────────────────────────────────────────────────────────
@app.route("/ml/score", methods=["POST"])
def lead_score():
    """
    Score a lead based on visitor behaviour + form signals.
    Input JSON:
      behaviour: { pages_viewed, time_on_site_sec, pricing_page, case_study_time,
                   pdf_download, return_visits, chatbot_engaged, referrer_type }
      form:      { budget_range, timeline, company_size, service_interest, message_keywords }
    Returns: { score, temperature, behaviour_score, form_score, breakdown, factors }
    """
    try:
        data = request.get_json(force=True) or {}
        result = score_lead(data.get("behaviour", {}), data.get("form", {}))
        return jsonify({"success": True, **result})
    except Exception as e:
        logger.error(f"Lead scoring error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── Chatbot ───────────────────────────────────────────────────────────────────
@app.route("/ml/chat/session", methods=["POST"])
def chat_session():
    """
    Start a new chatbot session or continue existing one.
    Input: { session_id (optional), message, page_context, visitor_data }
    Returns: { session_id, reply, intent, score_delta, capture_type, quick_replies }
    """
    try:
        data = request.get_json(force=True) or {}
        session_id = data.get("session_id")
        message = data.get("message", "")
        page_context = data.get("page_context", "")
        visitor_data = data.get("visitor_data", {})

        if not session_id or not message:
            # Start new session — return greeting
            result = start_session(page_context, visitor_data)
        else:
            result = process_message(session_id, message, page_context, visitor_data)

        return jsonify({"success": True, **result})
    except Exception as e:
        logger.error(f"Chatbot error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── Content Scorer ────────────────────────────────────────────────────────────
@app.route("/ml/content-score", methods=["POST"])
def content_score():
    """
    Score portfolio / blog content quality.
    Input: { text, content_type (portfolio|blog), service_category }
    Returns: { total_score, readability, keyword_relevance, results_evidence,
               emotional_triggers, suggestions, can_publish }
    """
    try:
        data = request.get_json(force=True) or {}
        text = data.get("text", "")
        content_type = data.get("content_type", "portfolio")
        service_category = data.get("service_category", "general")

        result = score_content(text, content_type, service_category)
        return jsonify({"success": True, **result})
    except Exception as e:
        logger.error(f"Content scoring error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── AI Content Generator ──────────────────────────────────────────────────────
@app.route("/ml/generate-portfolio", methods=["POST"])
def generate_portfolio():
    """Generates 3 portfolio descriptions based on provided data."""
    try:
        data = request.get_json(force=True) or {}
        variations = generate_portfolio_content(data)
        return jsonify({"success": True, "variations": variations})
    except Exception as e:
        logger.error(f"Portfolio generation error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── Social Proof Sentiment Engine ─────────────────────────────────────────────
@app.route("/ml/sentiment", methods=["POST"])
def score_sentiment():
    """Analyzes the sentiment of a testimonial/review."""
    try:
        data = request.get_json(force=True) or {}
        text = data.get("text", "")
        result = analyze_sentiment(text)
        return jsonify({"success": True, **result})
    except Exception as e:
        logger.error(f"Sentiment analysis error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── Website SEO Audit Engine ──────────────────────────────────────────────────
@app.route("/ml/audit", methods=["POST"])
def run_audit():
    """Generates a competitive SEO audit."""
    try:
        data = request.get_json(force=True) or {}
        url = data.get("url", "")
        result = generate_website_audit(url)
        return jsonify({"success": True, "audit": result})
    except Exception as e:
        logger.error(f"Audit generation error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


# ── Smart Content Personalization ─────────────────────────────────────────────
@app.route("/ml/personalize", methods=["POST"])
def personalize_content():
    """Returns tailored headlines based on visitor's industry/type."""
    try:
        data = request.get_json(force=True) or {}
        visitor_type = data.get("visitor_type", "general").lower()
        
        if "b2b" in visitor_type or "software" in visitor_type:
            headline = "B2B Lead Generation That Drives Pipeline Growth"
            subheadline = "Scale your SaaS or B2B enterprise with data-driven marketing."
        elif "ecommerce" in visitor_type or "retail" in visitor_type:
            headline = "Scale Your E-commerce Revenue Faster"
            subheadline = "Dominate paid social and search with ROI-obsessed strategies."
        else:
            headline = "Let's build something extraordinary."
            subheadline = "Whether you need a full digital transformation or targeted growth strategies, our team of experts is ready to help you scale."
            
        return jsonify({"success": True, "headline": headline, "subheadline": subheadline})
    except Exception as e:
        logger.error(f"Personalization error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("FLASK_ENV", "production") == "development"
    logger.info(f"ML Services starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
