import urllib.request
import time

def run_audit(data: dict) -> dict:
    url = data.get("url", "")
    if not url:
        raise ValueError("URL is required")

    if not url.startswith("http"):
        url = "https://" + url

    # ── Measure load time ─────────────────────────────────
    start = time.time()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as response:
            html      = response.read().decode("utf-8", errors="ignore")
            load_ms   = int((time.time() - start) * 1000)
            status    = response.status
    except Exception as e:
        html    = ""
        load_ms = 9999
        status  = 0

    issues   = []
    scores   = {"performance": 100, "seo": 100, "mobile": 100, "security": 100}

    # ── Performance checks ────────────────────────────────
    if load_ms > 3000:
        scores["performance"] -= 30
        issues.append({"severity": "high", "category": "performance",
                       "issue": "Slow page load", "fix": f"Page loaded in {load_ms}ms. Aim for under 2000ms."})
    elif load_ms > 2000:
        scores["performance"] -= 15
        issues.append({"severity": "medium", "category": "performance",
                       "issue": "Moderate load time", "fix": f"Page loaded in {load_ms}ms. Consider image optimization."})

    # ── SEO checks ────────────────────────────────────────
    if "<title>" not in html.lower():
        scores["seo"] -= 25
        issues.append({"severity": "critical", "category": "seo",
                       "issue": "Missing title tag", "fix": "Add a descriptive <title> tag to every page."})

    if 'meta name="description"' not in html.lower():
        scores["seo"] -= 20
        issues.append({"severity": "high", "category": "seo",
                       "issue": "Missing meta description", "fix": "Add a meta description tag (150-160 characters)."})

    if "<h1" not in html.lower():
        scores["seo"] -= 15
        issues.append({"severity": "medium", "category": "seo",
                       "issue": "Missing H1 tag", "fix": "Add exactly one H1 tag per page."})

    if 'alt="' not in html.lower() and "<img" in html.lower():
        scores["seo"] -= 10
        issues.append({"severity": "medium", "category": "seo",
                       "issue": "Images missing alt text", "fix": "Add descriptive alt attributes to all images."})

    # ── Mobile checks ─────────────────────────────────────
    if 'viewport' not in html.lower():
        scores["mobile"] -= 40
        issues.append({"severity": "critical", "category": "mobile",
                       "issue": "Missing viewport meta tag", "fix": 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.'})

    # ── Security checks ───────────────────────────────────
    if not url.startswith("https"):
        scores["security"] -= 40
        issues.append({"severity": "critical", "category": "security",
                       "issue": "No HTTPS", "fix": "Install an SSL certificate and redirect all HTTP to HTTPS."})

    if status == 0:
        scores["security"] -= 20
        issues.append({"severity": "high", "category": "security",
                       "issue": "Site unreachable", "fix": "Ensure the website is accessible and returns a 200 status."})

    # ── Clamp scores ──────────────────────────────────────
    for key in scores:
        scores[key] = max(0, min(100, scores[key]))

    overall = round(sum(scores.values()) / len(scores))

    critical = sum(1 for i in issues if i["severity"] == "critical")
    high     = sum(1 for i in issues if i["severity"] == "high")
    medium   = sum(1 for i in issues if i["severity"] == "medium")
    low      = sum(1 for i in issues if i["severity"] == "low")

    return {
        "url":              url,
        "overall_score":    overall,
        "performance_score":scores["performance"],
        "seo_score":        scores["seo"],
        "mobile_score":     scores["mobile"],
        "security_score":   scores["security"],
        "issues_count":     len(issues),
        "critical_count":   critical,
        "high_count":       high,
        "medium_count":     medium,
        "low_count":        low,
        "full_report":      issues,
        "page_load_ms":     load_ms,
    }
