def generate_descriptions(data: dict) -> dict:
    title       = data.get("title", "Marketing Campaign")
    client      = data.get("client_name", "our client")
    industry    = data.get("client_industry", "business")
    channels    = data.get("channels_used", ["Digital Marketing"])
    metrics     = data.get("metrics", [])
    challenge   = data.get("challenge_text", "")
    solution    = data.get("solution_text", "")

    channels_str = ", ".join(channels) if channels else "digital marketing"

    metric_highlights = ""
    if metrics:
        metric_highlights = " ".join([f"{m.get('metricValue', '')} {m.get('metricLabel', '')}" for m in metrics[:3]])

    # ── Variant 1: Professional / Formal ─────────────────
    variant_1 = f"""We partnered with {client}, a leading {industry} business, to deliver a comprehensive {title} campaign. 
Leveraging {channels_str}, our team developed a data-driven strategy that addressed their core marketing challenges and unlocked significant growth opportunities.
{f'The primary challenge was: {challenge}' if challenge else ''}
{f'Our solution: {solution}' if solution else ''}
{f'Key results achieved: {metric_highlights}' if metric_highlights else ''}
This engagement demonstrates our commitment to delivering measurable, sustainable results for {industry} businesses seeking to establish a competitive advantage in their market."""

    # ── Variant 2: Conversational / Friendly ─────────────
    variant_2 = f"""When {client} came to us, they had a clear vision — grow their {industry} business and reach more of the right customers.
We got to work building a tailored {title} strategy using {channels_str}.
{f'{metric_highlights} — those are the kinds of numbers that make a real difference.' if metric_highlights else ''}
The team loved working on this one. It is a brilliant example of what happens when strategy meets creativity meets data.
If you are in the {industry} space and want results like these, let us talk."""

    # ── Variant 3: Data-Driven / Results-led ─────────────
    variant_3 = f"""Campaign: {title} | Client: {client} | Industry: {industry}
Channels deployed: {channels_str}
{f'Performance highlights: {metric_highlights}' if metric_highlights else ''}
Methodology: Our data-first approach combined audience segmentation, A/B testing, and continuous optimisation cycles to maximise return on every pound of marketing spend.
The results speak for themselves — quantifiable growth, improved conversion metrics, and a measurable impact on {client}'s bottom line.
This case study demonstrates our proven framework for {industry} businesses ready to scale."""

    return {
        "option_1": variant_1.strip(),
        "option_2": variant_2.strip(),
        "option_3": variant_3.strip(),
        "word_counts": {
            "option_1": len(variant_1.split()),
            "option_2": len(variant_2.split()),
            "option_3": len(variant_3.split()),
        }
    }
