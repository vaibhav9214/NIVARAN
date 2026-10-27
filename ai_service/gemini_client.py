import os
import json
import re
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

# Load .env file from project root
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(dotenv_path)

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

def get_genai_client(override_key: Optional[str] = None):
    """
    Returns a Google GenAI Client instance if an API key is available.
    Returns None if no API key is provided or if client initialization fails.
    """
    key = override_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not key or key.strip() == "":
        return None
    try:
        from google import genai
        return genai.Client(api_key=key.strip())
    except Exception as e:
        print(f"[GeminiClient] Failed to initialize client: {e}")
        return None

def is_api_key_configured(override_key: Optional[str] = None) -> bool:
    key = override_key or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    return bool(key and key.strip())

# ============================================================================
# SEQUENCE 1: Summarize Long Grievance Descriptions
# ============================================================================

def summarize_description(title: str, description: str, api_key: Optional[str] = None) -> Dict[str, Any]:
    client = get_genai_client(api_key)
    if client:
        try:
            prompt = f"""
You are an expert collegiate grievance processing assistant for NIVARAN.
Summarize the following student grievance description into:
1. A concise, professional executive summary (2-3 sentences).
2. 3 to 5 key bullet points extracting core facts, dates, affected parties, and the primary complaint.

Respond STRICTLY in valid JSON format with keys:
"summary": "...",
"key_points": ["point 1", "point 2", ...]

Grievance Title: {title}
Description:
{description}
"""
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                data = json.loads(match.group(0))
                return {
                    "summary": data.get("summary", ""),
                    "key_points": data.get("key_points", []),
                    "word_count_original": len(description.split()),
                    "word_count_summary": len(data.get("summary", "").split()),
                    "model": GEMINI_MODEL,
                    "disclaimer": "Advisory AI summary. Does not modify official grievance record."
                }
        except Exception as e:
            print(f"[GeminiClient] Summarization error via Gemini: {e}. Falling back to heuristic.")

    # Heuristic Fallback
    words = description.strip().split()
    sentences = [s.strip() for s in re.split(r'[.!?\n]+', description) if len(s.strip()) > 5]
    if len(sentences) >= 2:
        summary_text = f"{sentences[0]}. {sentences[1]}."
    elif len(sentences) == 1:
        summary_text = f"{sentences[0]}."
    else:
        summary_text = description[:200] + ("..." if len(description) > 200 else "")

    key_points = []
    if len(sentences) > 0:
        key_points.append(f"Primary issue: {sentences[0]}")
    if len(sentences) > 1:
        key_points.append(f"Context: {sentences[1]}")
    if len(sentences) > 2:
        key_points.append(f"Specific detail: {sentences[2]}")
    else:
        key_points.append(f"Filed under title: {title}")

    return {
        "summary": summary_text,
        "key_points": key_points,
        "word_count_original": len(words),
        "word_count_summary": len(summary_text.split()),
        "model": GEMINI_MODEL,
        "disclaimer": "Advisory AI summary. Does not modify official grievance record."
    }

# ============================================================================
# SEQUENCE 2: Suggest Categories and Departments
# ============================================================================

def suggest_classification(title: str, description: str,
                           available_categories: Optional[List[str]] = None,
                           available_departments: Optional[List[str]] = None,
                           api_key: Optional[str] = None) -> Dict[str, Any]:
    client = get_genai_client(api_key)
    categories = available_categories or [
        "Academic", "Hostel", "Finance", "Infrastructure", "IT Services",
        "Examination", "Harassment & Discipline", "Library", "Administration"
    ]
    departments = available_departments or [
        "Computer Science", "Hostel Affairs", "Accounts & Finance", "Campus Facilities",
        "IT Infrastructure", "Examination Cell", "Dean Office", "Library Services"
    ]

    if client:
        try:
            prompt = f"""
You are an institutional classifier for college grievances.
Analyze the following grievance and suggest the most fitting category and department.
Available Categories: {', '.join(categories)}
Available Departments: {', '.join(departments)}

Output STRICTLY JSON with keys:
"suggested_category": "...",
"suggested_department": "...",
"confidence": 0.0 to 1.0,
"reasoning": "..."

Grievance Title: {title}
Description: {description}
"""
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                data = json.loads(match.group(0))
                return {
                    "suggested_category": data.get("suggested_category", categories[0]),
                    "suggested_department": data.get("suggested_department", departments[0]),
                    "confidence": float(data.get("confidence", 0.85)),
                    "reasoning": data.get("reasoning", "Classified based on contextual grievance keywords."),
                    "model": GEMINI_MODEL
                }
        except Exception as e:
            print(f"[GeminiClient] Classification error via Gemini: {e}. Falling back to heuristic.")

    # Heuristic Classification
    text = f"{title} {description}".lower()
    cat = "Administration"
    dept = "Dean Office"
    conf = 0.80
    reason = "Matched general administrative grievance context."

    if any(k in text for k in ["room", "hostel", "mess", "bed", "warden", "water", "geyser", "cooler", "block"]):
        cat = "Hostel"
        dept = "Hostel Affairs"
        conf = 0.92
        reason = "Detected hostel amenities and residential accommodation keywords."
    elif any(k in text for k in ["wifi", "wi-fi", "internet", "portal", "login", "server", "lab computer", "network"]):
        cat = "IT Services"
        dept = "IT Infrastructure"
        conf = 0.94
        reason = "Detected campus networking, login, or computing infrastructure issues."
    elif any(k in text for k in ["fee", "refund", "receipt", "scholarship", "payment", "dues", "tuition", "fine"]):
        cat = "Finance"
        dept = "Accounts & Finance"
        conf = 0.91
        reason = "Detected fee payment, scholarship, or financial billing terms."
    elif any(k in text for k in ["exam", "grade", "marks", "revaluation", "attendance", "admit card", "results"]):
        cat = "Examination"
        dept = "Examination Cell"
        conf = 0.93
        reason = "Detected academic evaluations, marks, or examination terminology."
    elif any(k in text for k in ["professor", "lecture", "assignment", "syllabus", "course", "credits", "curriculum"]):
        cat = "Academic"
        dept = "Computer Science" if "computer" in text or "code" in text else "Dean Office"
        conf = 0.88
        reason = "Detected course delivery and academic syllabus references."
    elif any(k in text for k in ["bench", "fan", "ac", "classroom", "projector", "washroom", "lift", "parking"]):
        cat = "Infrastructure"
        dept = "Campus Facilities"
        conf = 0.90
        reason = "Detected physical campus infrastructure and classroom maintenance concerns."
    elif any(k in text for k in ["ragging", "bully", "harass", "threat", "misbehave", "security"]):
        cat = "Harassment & Discipline"
        dept = "Dean Office"
        conf = 0.95
        reason = "Urgent disciplinary, security, or student conduct keywords identified."

    return {
        "suggested_category": cat,
        "suggested_department": dept,
        "confidence": conf,
        "reasoning": reason,
        "model": GEMINI_MODEL
    }

# ============================================================================
# SEQUENCE 3: Identify Potentially Missing Information
# ============================================================================

def identify_missing_info(title: str, description: str, category: Optional[str] = None,
                          api_key: Optional[str] = None) -> Dict[str, Any]:
    client = get_genai_client(api_key)
    if client:
        try:
            prompt = f"""
You are a quality assurance auditor for student grievances in NIVARAN.
Analyze whether the student has provided all necessary specifics to investigate the grievance:
- Exact date/time/duration of incident
- Specific location (room number, block, lab, hostel name)
- Specific identifiers (course code, professor name, transaction reference ID, staff member name)
- Supporting evidence or screenshots mentioned

Respond STRICTLY with valid JSON:
"is_information_complete": true or false,
"missing_information": ["missing detail 1", ...],
"suggested_questions_for_student": ["question 1", ...],
"completeness_score": 0.0 to 1.0

Grievance Title: {title}
Category: {category or 'General'}
Description: {description}
"""
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                data = json.loads(match.group(0))
                return {
                    "is_information_complete": bool(data.get("is_information_complete", False)),
                    "missing_information": data.get("missing_information", []),
                    "suggested_questions_for_student": data.get("suggested_questions_for_student", []),
                    "completeness_score": float(data.get("completeness_score", 0.7)),
                    "model": GEMINI_MODEL
                }
        except Exception as e:
            print(f"[GeminiClient] Missing info detection error via Gemini: {e}. Falling back to heuristic.")

    # Heuristic missing info detection
    text = f"{title} {description}".lower()
    missing = []
    questions = []

    # Check for date / time indications
    has_date = bool(re.search(r'\b(yesterday|today|last week|on \d{1,2}|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}/\d{1,2}|\d{4})\b', text))
    if not has_date:
        missing.append("Specific date or time when the incident/issue occurred or began.")
        questions.append("Could you specify the exact date or timeframe when this issue started?")

    # Check for location / room / block
    has_location = bool(re.search(r'\b(room|block|hostel|lab|hall|ground|floor|canteen|library|building|b-\d+|a-\d+)\b', text))
    if not has_location:
        missing.append("Exact physical location (Room number, Block name, Lab, or Building).")
        questions.append("Which building, hostel block, or room number did this occur in?")

    # Check for transaction / course details if relevant
    if any(k in text for k in ["fee", "payment", "refund", "money", "paid"]):
        if not re.search(r'\b(txn|reference|utr|receipt|id|rs\.?|\$|\d{5,})\b', text):
            missing.append("Transaction ID, UTR number, or payment receipt reference.")
            questions.append("Please provide the transaction reference ID or attach your payment receipt.")

    if any(k in text for k in ["marks", "exam", "course", "grade", "professor", "teacher"]):
        if not re.search(r'\b(cs\d+|it\d+|course|code|prof|dr\.|semester|sem)\b', text):
            missing.append("Course code, subject name, or faculty member name.")
            questions.append("What is the course code or subject title related to this issue?")

    is_complete = len(missing) == 0
    score = max(0.2, 1.0 - (len(missing) * 0.25))

    return {
        "is_information_complete": is_complete,
        "missing_information": missing,
        "suggested_questions_for_student": questions,
        "completeness_score": round(score, 2),
        "model": GEMINI_MODEL
    }

# ============================================================================
# SEQUENCE 4: Generate Officer-facing Follow-up Suggestions
# ============================================================================

def generate_followup_suggestions(title: str, description: str, category: str,
                                  department: Optional[str] = None,
                                  current_status: Optional[str] = "Submitted",
                                  api_key: Optional[str] = None) -> Dict[str, Any]:
    client = get_genai_client(api_key)
    if client:
        try:
            prompt = f"""
You are an administrative advisor for grievance redressal officers in NIVARAN.
Review the grievance and generate actionable, procedural recommendations for the assigned officer.
Include:
1. Recommended investigative/administrative actions (3 items).
2. Recommended priority ('Low', 'Medium', 'High', 'Urgent').
3. Suggested resolution SLA in hours.
4. Recommended next status in lifecycle ('Under Review', 'In Progress', 'Awaiting Student Response', 'Forwarded').
5. Suggested formal query to student if further clarification is needed.

Output STRICTLY valid JSON:
"recommended_actions": ["action 1", ...],
"recommended_priority": "...",
"suggested_sla_hours": 72,
"recommended_next_status": "...",
"suggested_student_query": "..."

Grievance: {title}
Category: {category}
Department: {department or 'General'}
Current Status: {current_status}
Description: {description}
"""
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                data = json.loads(match.group(0))
                return {
                    "recommended_actions": data.get("recommended_actions", []),
                    "recommended_priority": data.get("recommended_priority", "Medium"),
                    "suggested_sla_hours": int(data.get("suggested_sla_hours", 72)),
                    "recommended_next_status": data.get("recommended_next_status", "Under Review"),
                    "suggested_student_query": data.get("suggested_student_query", None),
                    "model": GEMINI_MODEL,
                    "checkpoint_notice": "Suggestions are non-binding recommendations. Official status change requires human officer action."
                }
        except Exception as e:
            print(f"[GeminiClient] Follow-up suggestions error via Gemini: {e}. Falling back to heuristic.")

    # Heuristic follow-up generation
    text = f"{title} {description}".lower()
    priority = "Medium"
    sla = 72
    next_status = "Under Review"

    if any(k in text for k in ["ragging", "threat", "harass", "urgent", "electric", "fire", "danger"]):
        priority = "Urgent"
        sla = 24
        next_status = "In Progress"
        actions = [
            "Immediately dispatch security or safety supervisor to verify the premise.",
            "Schedule an emergency confidential hearing with the student complainant.",
            "Preserve relevant CCTV logs and document initial statement."
        ]
        student_query = "Please confirm your availability for an immediate meeting with the grievance committee."
    elif any(k in text for k in ["water", "wifi", "internet", "broken", "geyser", "leak"]):
        priority = "High"
        sla = 48
        next_status = "In Progress"
        actions = [
            "Issue maintenance work order ticket to campus facilities / IT support team.",
            "Verify physical site condition and request completion turnaround estimate.",
            "Notify hostel warden/lab in-charge of scheduled maintenance."
        ]
        student_query = "Please confirm the exact room/lab number and your availability for maintenance inspection."
    elif any(k in text for k in ["fee", "payment", "scholarship", "exam", "grade"]):
        priority = "Medium"
        sla = 96
        next_status = "Under Review"
        actions = [
            "Cross-verify transaction logs / ledger with the Accounts & Examination database.",
            "Request bank confirmation statement or course registration record.",
            "Consult with the department coordinator for ledger reconciliation."
        ]
        student_query = "Could you provide your student roll number and the transaction reference receipt for verification?"
    else:
        actions = [
            "Review student's submission history and previous related grievances.",
            "Conduct preliminary departmental inquiry regarding the issue raised.",
            "Prepare inquiry notes before contacting the student."
        ]
        student_query = "Thank you for bringing this to our attention. An officer will review your grievance and contact you if further specifics are needed."

    return {
        "recommended_actions": actions,
        "recommended_priority": priority,
        "suggested_sla_hours": sla,
        "recommended_next_status": next_status,
        "suggested_student_query": student_query,
        "model": GEMINI_MODEL,
        "checkpoint_notice": "Suggestions are non-binding recommendations. Official status change requires human officer action."
    }

# ============================================================================
# COMPREHENSIVE ANALYSIS (Sequences 1-4 for a single complaint)
# ============================================================================

def analyze_grievance(title: str, description: str,
                      category: Optional[str] = None,
                      department: Optional[str] = None,
                      current_status: Optional[str] = "Submitted",
                      available_categories: Optional[List[str]] = None,
                      available_departments: Optional[List[str]] = None,
                      api_key: Optional[str] = None) -> Dict[str, Any]:
    # 1. Summarize
    sum_res = summarize_description(title, description, api_key=api_key)
    # 2. Classification
    class_res = suggest_classification(title, description, available_categories, available_departments, api_key=api_key)
    # 3. Missing info
    missing_res = identify_missing_info(title, description, category=category or class_res["suggested_category"], api_key=api_key)
    # 4. Officer suggestions
    officer_res = generate_followup_suggestions(
        title, description,
        category=category or class_res["suggested_category"],
        department=department or class_res["suggested_department"],
        current_status=current_status,
        api_key=api_key
    )

    return {
        "summary": sum_res["summary"],
        "key_points": sum_res["key_points"],
        "suggested_category": class_res["suggested_category"],
        "suggested_department": class_res["suggested_department"],
        "classification_confidence": class_res["confidence"],
        "classification_reasoning": class_res["reasoning"],
        "is_information_complete": missing_res["is_information_complete"],
        "missing_information": missing_res["missing_information"],
        "recommended_officer_actions": officer_res["recommended_actions"],
        "recommended_priority": officer_res["recommended_priority"],
        "suggested_sla_hours": officer_res["suggested_sla_hours"],
        "suggested_student_query": officer_res.get("suggested_student_query"),
        "model": GEMINI_MODEL,
        "disclaimer": "AI suggestions are advisory only and must be reviewed by an authorized human officer. AI does not alter official status."
    }

# ============================================================================
# SEQUENCE 5: Identify Trends in Aggregate Grievance Data
# ============================================================================

def identify_trends(grievances: List[Dict[str, Any]], timeframe: str = "Past 30 Days",
                    api_key: Optional[str] = None) -> Dict[str, Any]:
    total_count = len(grievances)
    if total_count == 0:
        return {
            "total_analyzed": 0,
            "top_recurring_issues": [],
            "hotspot_departments": [],
            "emerging_patterns": ["No grievance records submitted in this timeframe."],
            "actionable_recommendations": ["Encourage student reporting to baseline grievance patterns."],
            "model": GEMINI_MODEL,
            "disclaimer": "Institutional trend analysis generated by Gemini. Advisory intelligence for administrators."
        }

    client = get_genai_client(api_key)
    if client:
        try:
            sample_data = grievances[:40]
            prompt = f"""
You are the institutional intelligence analyst for NIVARAN campus administration.
Analyze the following aggregate grievance records from the {timeframe} ({total_count} total complaints):
{json.dumps(sample_data, indent=2)}

Perform root cause analysis and identify:
1. Top 2-4 recurring issue topics with affected departments, estimated counts, severity, and analytical summary.
2. Hotspot departments with count of complaints and primary bottlenecks.
3. 2-4 emerging patterns across the campus.
4. 3 actionable administrative recommendations for proactive intervention.

Output STRICTLY valid JSON:
"top_recurring_issues": [
  {{"issue_topic": "...", "affected_departments": ["..."], "grievance_count": 5, "severity": "High", "summary_insight": "..."}}
],
"hotspot_departments": [
  {{"department_name": "...", "grievance_count": 8, "primary_concern": "..."}}
],
"emerging_patterns": ["pattern 1", ...],
"actionable_recommendations": ["recommendation 1", ...]
"""
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )
            raw = response.text
            match = re.search(r'\{[\s\S]*\}', raw)
            if match:
                data = json.loads(match.group(0))
                return {
                    "total_analyzed": total_count,
                    "top_recurring_issues": data.get("top_recurring_issues", []),
                    "hotspot_departments": data.get("hotspot_departments", []),
                    "emerging_patterns": data.get("emerging_patterns", []),
                    "actionable_recommendations": data.get("actionable_recommendations", []),
                    "model": GEMINI_MODEL,
                    "disclaimer": "Institutional trend analysis generated by Gemini. Advisory intelligence for administrators."
                }
        except Exception as e:
            print(f"[GeminiClient] Trends analysis error via Gemini: {e}. Falling back to heuristic.")

    # Heuristic Aggregate Trend Aggregation
    dept_counts: Dict[str, int] = {}
    cat_counts: Dict[str, int] = {}
    for g in grievances:
        dept = g.get("department_name") or "General"
        cat = g.get("category") or "General"
        dept_counts[dept] = dept_counts.get(dept, 0) + 1
        cat_counts[cat] = cat_counts.get(cat, 0) + 1

    sorted_depts = sorted(dept_counts.items(), key=lambda x: x[1], reverse=True)
    sorted_cats = sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)

    top_recurring = []
    for cat_name, count in sorted_cats[:3]:
        severity = "High" if count >= 3 else "Medium"
        top_recurring.append({
            "issue_topic": f"Recurrent concerns in {cat_name}",
            "affected_departments": [d[0] for d in sorted_depts[:2]],
            "grievance_count": count,
            "severity": severity,
            "summary_insight": f"{count} complaints clustered in {cat_name}, pointing to operational friction."
        })

    hotspots = []
    for dept_name, count in sorted_depts[:3]:
        hotspots.append({
            "department_name": dept_name,
            "grievance_count": count,
            "primary_concern": f"High case concentration representing {round(count / max(1, total_count) * 100)}% of caseload."
        })

    patterns = [
        f"Grievances are primarily concentrated in {sorted_depts[0][0] if sorted_depts else 'General'} department.",
        f"Leading grievance category across campus is {sorted_cats[0][0] if sorted_cats else 'General'}.",
        f"Average resolution flow requires proactive intervention to avoid backlog spikes."
    ]

    recommendations = [
        f"Conduct a targeted operational audit of {sorted_depts[0][0] if sorted_depts else 'highest volume'} department processes.",
        "Implement preventative maintenance schedules to curb facility and network related grievances.",
        "Establish automated SLA escalation reminders for officers to expedite initial grievance review."
    ]

    return {
        "total_analyzed": total_count,
        "top_recurring_issues": top_recurring,
        "hotspot_departments": hotspots,
        "emerging_patterns": patterns,
        "actionable_recommendations": recommendations,
        "model": GEMINI_MODEL,
        "disclaimer": "Institutional trend analysis generated by Gemini. Advisory intelligence for administrators."
    }

