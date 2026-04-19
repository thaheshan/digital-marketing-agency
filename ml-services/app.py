from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ONLY allow requests from Node.js server
CORS(app, resources={r"/ml/*": {"origins": os.getenv("NODE_URL", "http://localhost:5001")}})

# ── Health check ──────────────────────────────────────────
@app.route("/ml/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "ML Services", "port": 5001})

# ── Lead Scoring ──────────────────────────────────────────
@app.route("/ml/score", methods=["POST"])
def score_lead():
    try:
        from services.lead_scoring import calculate_score
        data = request.get_json()
        result = calculate_score(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "score": 50, "temperature": "warm"}), 500

# ── Chatbot ───────────────────────────────────────────────
@app.route("/ml/chat/session", methods=["POST"])
def chat():
    try:
        from services.chatbot import process_message
        data = request.get_json()
        result = process_message(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "reply": "I am having trouble right now. Please try again."}), 500

# ── Portfolio Description Generator ──────────────────────
@app.route("/ml/generate-portfolio", methods=["POST"])
def generate_portfolio():
    try:
        from services.content_generator import generate_descriptions
        data = request.get_json()
        result = generate_descriptions(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Website Audit ─────────────────────────────────────────
@app.route("/ml/audit", methods=["POST"])
def audit():
    try:
        from services.audit import run_audit
        data = request.get_json()
        result = run_audit(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "overall_score": 50}), 500

# ── Sentiment Analysis ────────────────────────────────────
@app.route("/ml/sentiment", methods=["POST"])
def sentiment():
    try:
        from services.sentiment import analyze
        data = request.get_json()
        result = analyze(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e), "label": "neutral", "polarity": 0}), 500

# ── Personalization ───────────────────────────────────────
@app.route("/ml/personalize", methods=["POST"])
def personalize():
    try:
        data = request.get_json()
        industry   = data.get("industry", "general")
        page       = data.get("page", "home")
        sections   = {
            "E-commerce": {"hero": "Grow Your Online Sales", "cta": "Start Selling More"},
            "SaaS":        {"hero": "Scale Your Software Business", "cta": "Book a Demo"},
            "Healthcare":  {"hero": "Reach More Patients", "cta": "Get Started"},
            "default":     {"hero": "Grow Your Business", "cta": "Get Started"},
        }
        content = sections.get(industry, sections["default"])
        return jsonify({"industry": industry, "page": page, "content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ── Start server ──────────────────────────────────────────
if __name__ == "__main__":
    from waitress import serve
    port = int(os.getenv("PORT", 8000))
    print(f"[ML] Flask starting on port {port} via Waitress")
    serve(app, host="0.0.0.0", port=port)
