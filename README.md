
# 🚨 AI Incident Alert Workflow (n8n + Slack)

This repository contains an **AI-powered incident classification and alerting workflow** built with **n8n** and **Slack**.

The system analyzes incoming incident descriptions, classifies them using an AI model, evaluates their severity, and automatically sends **real-time alerts to Slack** when high-severity incidents are detected.

---

## 🧠 How It Works

1. Incident data is received through a **Webhook**
2. An **AI model** analyzes the incident and returns:
   - Category
   - Severity (Low / Medium / High)
   - Recommended action
3. The workflow evaluates the severity:
   - **High severity → Slack alert**
4. The alert is posted to a dedicated Slack channel (e.g. `#incidents`)

---

## 🔁 Workflow Overview

```text
Webhook
 → AI Incident Classification
 → Data Formatting (JavaScript)
 → Severity Check (If node)
 → Slack Notification (High severity only)
💬 Example Slack Alert
vbnet
Copier le code
🚨 HIGH SEVERITY INCIDENT
Category: Machine Breakdown
Severity: High
Action: Immediate machine inspection and repair, halt production line to ensure safety.
🛠 Tech Stack
n8n – Workflow automation

Slack API – Incident notifications

AI / LLM – Incident classification

JavaScript – Data transformation and logic

🎯 Use Cases
Industrial incident monitoring

Production line safety alerts

Operational incident escalation

AI-assisted decision support

🚀 Status
✅ Fully functional
🔒 Production-ready logic
🔄 Easily extensible (Email, SMS, on-call escalation, human approval)

📌 Notes
Slack authentication is handled via OAuth

The Slack bot must be invited to the target channel

Designed with human-in-the-loop workflows in mind

### Frontend (React + TypeScript)

A simple web interface allows users to submit industrial incident descriptions.
The frontend sends incidents to an n8n webhook, receives structured AI analysis,
and displays the classification result in real time.

Features:
- Incident input form
- Async request handling
- AI-powered classification result display
- Integration with Slack alerting workflow
