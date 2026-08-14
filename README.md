# 🕵️ AI Detective: The Missing Developer

```
╔═══════════════════════════════════════════════════════════════╗
║  NEXUS CORP — INTERNAL SYSTEM v4.2.1                          ║
║                                                               ║
║  > Loading employee workstation...                            ║
║  > Authenticating credentials...                              ║
║  WARNING: Primary user [alex.mercer] account SUSPENDED        ║
║  ALERT:   Anomalous activity detected in session logs         ║
║                                                               ║
║  CASE #4471 — STATUS: OPEN                                    ║
║  The lead developer has disappeared.                          ║
║  Their monitor is still on.                                   ║
╚═══════════════════════════════════════════════════════════════╝
```

> *It's 8:47 AM. You arrive at the office as the new intern.*
> *Alex Mercer — the lead developer — is gone. No notice. No goodbye.*
> *Their workstation is still logged in. Something doesn't add up.*
> **Investigate. Interrogate. Find the truth.**

---

## 🔍 What is this?

A full-stack AI-powered detective game where you investigate the mysterious disappearance of a software developer inside a tech company. The twist — every suspect is powered by **GPT-4o** and responds dynamically to your questions, remembers what you've said, and reacts differently depending on what evidence you've found.

This is not a quiz game. Characters **lie**. They **deflect**. They **crack under pressure**.

---

## 🎮 Gameplay

```
📁 Explore Alex's Workstation
   ├── Git commits at 2AM
   ├── An unsent email about a data breach  
   ├── An encrypted file with a cryptic hint
   └── Server logs that don't add up

💬 Interrogate 4 AI-Powered Suspects
   ├── Ask anything — the AI responds in character
   ├── Present evidence mid-conversation
   └── Watch them get nervous when you hit a nerve

📌 Build Your Evidence Board
   └── 11 pieces of evidence with a progressive unlock chain

⚖️ Make Your Accusation
   └── One shot. Choose wisely.
```

---

## 👥 Persons of Interest

| Suspect | Role | Suspicion |
|---|---|---|
| 👨‍💻 Jordan Lee | Senior Engineer | 🟡 Medium |
| 👩‍💼 Priya Nair | Project Manager | 🔴 High |
| 🧑‍🔧 Sam Carter | DevOps Engineer | 🔴 High |
| 👩‍💼 Dana Voss | CEO's Assistant | 🔴🔴 Very High |

> *One of them knows exactly what happened to Alex Mercer.*
> *The others are hiding something too.*

---

## 🧱 Tech Stack

```
Frontend  →  React 18 + Vite + Tailwind CSS + Framer Motion
Backend   →  Spring Boot 3 (Java 21) + WebSockets (STOMP)
Database  →  MySQL 8
AI        →  OpenAI GPT-4o (dynamic character conversations)
Realtime  →  SockJS + STOMP (live typing indicators)
```

---

## ⚙️ How It Works

```
You ask a question
      ↓
React sends POST /api/interrogate
      ↓
Spring Boot builds a context-aware system prompt
(includes what evidence you've collected)
      ↓
GPT-4o generates a character response
      ↓
Response saved to MySQL
      ↓
Character replies in your chat — in real time
```

The AI doesn't just roleplay — it knows your investigation state. Present the server logs to Sam Carter and watch him panic. Show Dana Voss her own email and see if she flinches.

---

## 🚀 Run It Locally

### Prerequisites
- Java 21+
- MySQL 8
- Node.js 18+

### 1. Database
```sql
-- Run in MySQL Workbench
source database/schema.sql
```

### 2. Backend Config
```bash
# backend/src/main/resources/application.properties
# (copy from application.properties.example)
spring.datasource.password=YOUR_MYSQL_PASSWORD
openai.api.key=YOUR_OPENAI_KEY
```

### 3. Run Backend
```bash
# Open in IntelliJ → Run DetectiveApplication.java
# OR
cd backend && ./mvnw spring-boot:run
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open
```
http://localhost:3000
```

---

## 📁 Project Structure

```
ai-detective-game/
├── frontend/                  # React + Vite
│   └── src/
│       ├── screens/           # 6 game screens
│       ├── context/           # Game state (useReducer)
│       ├── data/              # Evidence + character definitions
│       └── components/        # Reusable UI components
│
├── backend/                   # Spring Boot
│   └── src/main/java/
│       ├── controller/        # REST + WebSocket endpoints
│       ├── service/           # AI orchestration + business logic
│       ├── model/             # JPA entities
│       └── repository/        # Spring Data JPA
│
└── database/
    ├── schema.sql             # Table definitions
    └── seed.sql               # Demo data
```

---

## 🔐 The Truth

```
[ CLASSIFIED — SPOILER BELOW ]

Alex Mercer discovered that Nexus Corp was silently exporting
user data to DataBridge Solutions — a data broker — earning
$102,000/month in violation of GDPR.

When Alex tried to report it internally, someone had them removed.
Their monitoring scripts were deleted at 2AM.
Their access was revoked before the HR email was even sent.
The performance review was fabricated after the fact.

Alex is safe. But silenced.
The question is — who gave the order?
```

---

## 💡 Key Features

- **AI characters with memory** — GPT-4o responses adapt based on your collected evidence
- **Progressive evidence unlock chain** — each clue reveals the next
- **Evidence board** — cork board style with pinned cards
- **Live typing indicator** — WebSocket pushes real-time "thinking..." state
- **Session persistence** — all conversations saved to MySQL
- **One-shot accusation** — wrong guess = case goes cold

---

## 🎯 Built for Portfolio

This project demonstrates:
- LLM API integration with dynamic prompt engineering
- Full-stack REST API design with Spring Boot
- React state management with useReducer + Context
- Real-time communication with WebSockets
- Relational database design with MySQL
- Progressive UI unlock systems

---

*"Wait… you built this yourself? Show me how the AI works."*
— The interviewer you want 😄
