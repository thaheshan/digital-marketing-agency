def calculate_score(data: dict) -> dict:
    score = 0

    # ── Behaviour signals ─────────────────────────────────
    events = data.get("events", [])
    for event in events:
        event_type = event.get("type", "")
        if event_type == "viewed_pricing":        score += 15
        elif event_type == "case_study_3min":     score += 20
        elif event_type == "downloaded_resource": score += 25
        elif event_type == "return_visit":        score += 30
        elif event_type == "visited_from_linkedin":score += 10
        elif event_type == "homepage_exit_10s":   score -= 15

    # ── Form signals ──────────────────────────────────────
    budget = data.get("budget_range", "")
    if "10,000" in budget or "20,000" in budget:  score += 20
    elif "5,000" in budget:                        score += 15
    elif "1,000" in budget:                        score += 5

    timeline = data.get("timeline", "")
    if "immediately" in timeline.lower() or "1 month" in timeline.lower():
        score += 15
    elif "3 months" in timeline.lower():
        score += 10

    company_size = data.get("company_size", "")
    if "51" in company_size or "200" in company_size:  score += 10
    elif "11" in company_size:                         score += 5

    services = data.get("service_interest", [])
    if len(services) >= 3:   score += 15
    elif len(services) >= 1: score += 8

    # ── Clamp to 0-100 ────────────────────────────────────
    score = max(0, min(100, score))

    if score >= 70:   temperature = "hot"
    elif score >= 40: temperature = "warm"
    else:             temperature = "cold"

    return {
        "score":       score,
        "temperature": temperature,
        "breakdown": {
            "behaviour_signals": len(events),
            "budget_signal":     budget,
            "timeline_signal":   timeline,
        }
    }
