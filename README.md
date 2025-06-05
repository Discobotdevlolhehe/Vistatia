# Vistatia
Crafted with late-night coffee, ambition-fueled breakdowns, and a love for helping delegates thrive under pressure.

---

## 🌐 What is Vistatia [formerly MUN AI]?
Vistatia is your personal Model United Nations assistant — built to guide and support delegates during General Assemblies, Crisis Committees, and hybrid formats. Whether you're a first-timer or a seasoned MUNner needing a little backup, Vistatia is designed to enhance your preparation, strategy, and performance.

---

## 🚀 Features
Here's what Vistatia brings to the table:

1. 🧾 Directive Generator
Write your objective, and Vistatia transforms it into a structured, impactful directive — clear, concise, and committee-ready.

2. 🧠 Strategy Assessment
Unsure if your game plan is solid? Feed your strategy into the AI, and get an honest evaluation — strengths, weaknesses, and ways to improve.

3. 🗺️ Strategic Advisor
Struggling to develop a long-term committee game plan? This AI component provides guidance tailored to your agenda and role — turning chaos into clarity.

4. 📢 Speech Drafting
Need help finding the right words? Vistatia will generate powerful opening or closing speeches based on your input, agenda, and tone.

5. 💥 Response Generator (POI / POO / R2R)
When debate heats up, this tool helps you craft effective rebuttals and procedural responses that hit hard and stay within diplomatic lines.

6. 🔥 Rebuttal Assistant
Face tough questioning or critiques with smart, time-efficient counterarguments — ideal for moderated caucuses and spontaneous exchanges.

7. 📚 Background Guide Assistant
Upload or describe your agenda, and get a structured, easy-to-digest background guide that actually helps with prep — not just filler.

---

## 🧪 How It Works

**Session ID Field**: Enter any identifier to start a session.

**Tool Selector**: Choose the AI tool you’d like to use from a dropdown menu.

**Prompt Field**:

- Write a clear, detailed, and specific prompt.

- Avoid vague input — the better the context, the better the output.

**Run the Generator**:

- Click "Generate" or press Alt + Enter.

- Output will be displayed below based on your selected tool.

---

## ❌ Limitations
This tool is intended for preparation purposes only. It does not:

- Replace in-depth research or knowledge of committee rules.

- Guarantee perfect performance in live debates.

- Work as an in-committee cheating tool (use at your own discretion and risk).
 
---

## 🛠️ Local Deployment Guide

### Tech Stack:
- React.js (Frontend)

- Node.js (Backend)

- Mistral API (Multiple Instances)

### Setup Instructions:

1. Clone or download the repository.

2. Navigate to the backend folder.

3. Obtain ~6 Mistral API keys (free for small models) from [here](https://console.mistral.ai)

4. In each AI subfolder, open index.js and replace this:
```js
const API_KEY = "placeholder";
```

with your actual API key. Do not modify shared_memory.json or system_prompt.txt.


5. Start the backend:
```bash
cd backend
npm start
```

6. Start the frontend:

```bash
cd ../frontend
npm run dev
```

---
# 🗨️ Dev Note
This project is optimized for **local development** and rapid prototyping.  
A web-hosted version exists **for experimentation purposes only** — it is **not intended for commercial use**.

> ⚠️ Environment variable support (`.env`) is **not configured by default**. If you're planning deployment, consider using`dotenv` or any other custom secrets manager  
> If you plan to deploy this publicly or manage credentials securely, you're encouraged to implement your own enhancements.

Pull requests and feature suggestions are welcome — **tone critiques are not**.

---

## 📌 Final Comment
Vistatia is a preparation companion — not a replacement for your research, critical thinking, or public speaking skills. It won’t carry you through every unmoderated crisis or save you from a curveball Press Conference. But it will help you walk into committee feeling more prepared, confident, and in control.

Use it wisely. Build your skills. Be ready.

—

Developed with care [(and caffeine)](https://github.com/Discobotdevlolhehe/Vistatia/blob/main/README%5Bfckboi%5D.md),
by a fellow delegate who knows the struggle all too well.


--

# ❕❕ Point to Remember [PTR]:
## Important Note

This repository contains the **full and functional version** of the system, but the codebase is intentionally kept in an unstructured ("spaghetti") form.

A clean, modular, and better-organized version of this same system exists, but it is private to prevent logic replication or unauthorized commercial use.

If you'd like to contribute seriously (e.g. via pull requests, restructuring, or commercial inquiry), feel free to reach out. Access to the clean codebase can be provided on a case-by-case basis.

--
This porject is licensed under a modified MIT License. See the [license](./LICENSE) for more details


