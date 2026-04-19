import random

def generate_portfolio_content(data: dict) -> list[dict]:
    """
    Generates 3 professional variations for a portfolio case study.
    Instead of making an expensive LLM call, this mimics a generative 
    AI using deterministic templates heavily populated with the exact data points.
    Perfect for FYP 'Free AI Demo' requirement.
    """
    client = data.get("clientName", "the client")
    industry = data.get("clientIndustry", "their industry")
    service = data.get("serviceCategory", "Digital Marketing")
    channels = data.get("channels", "multiple channels")
    date_range = data.get("dateRange", "the campaign period")
    
    impressions = data.get("impressions", "high")
    clicks = data.get("clicks", "significant")
    conversions = data.get("conversions", "great")
    cpa = data.get("cpa", "competitive")
    roi = data.get("roi", "positive")
    
    # 1. Professional Tone
    prof_text = f"Our {service} campaign for {client} delivered exceptional results across {channels}. Over {date_range}, we achieved {impressions} total impressions, driving {conversions} qualified conversions at a CPA of {cpa}. The campaign generated a {roi} ROI, demonstrating the effectiveness of our data-driven approach. Through strategic audience segmentation and continuous creative optimisation, we consistently outperformed industry benchmarks, establishing {client} as a leader in the {industry} space."

    # 2. Creative Tone
    creative_text = f"When {client} wanted to make waves in the {industry} market, we knew exactly how to deliver. Our {service} strategy harnessed the power of {channels}, turning heads and driving real results. The numbers speak for themselves: {impressions} impressions, {conversions} conversions, and a {roi} ROI that made the boardroom smile. Over {date_range}, we didn't just run a campaign — we built a movement that connected the brand with the right audiences at exactly the right moment."
    
    # 3. Data-Driven Tone
    data_text = f"Campaign performance analysis for {client} ({date_range}): Deployed {service} strategy across {channels}. Key metrics: {impressions} Impressions, {clicks} Clicks, {conversions} Conversions, {cpa} CPA. The campaign achieved a {roi} return on investment, with conversion rates exceeding initial projections. Continuous A/B testing across ad creatives and landing pages drove progressive CPA reduction throughout the campaign lifecycle within the {industry} sector."
    
    return [
        {"tone": "Professional", "text": prof_text},
        {"tone": "Creative", "text": creative_text},
        {"tone": "Data-Driven", "text": data_text}
    ]
