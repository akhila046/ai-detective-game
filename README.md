# 🕵️ AI Detective: The Missing Developer

A full-stack AI-powered detective game where you investigate the disappearance of a lead developer at a tech company. Characters are powered by an LLM and respond dynamically to your questions. Evidence unlocks progressively as you dig deeper.

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Spring Boot (Java 21) |
| Database | MySQL 8 |
| AI / NLP | OpenAI GPT-4o |
| Realtime | WebSockets (STOMP) |
| Styling | Tailwind CSS |

## 📁 Project Structure

```
ai-detective-game/
├── frontend/          # React + Vite app
├── backend/           # Spring Boot app
├── database/          # SQL schema + seed data
└── README.md
```

## 🎮 Gameplay Overview

1. You're an intern. The lead developer — **Alex Mercer** — has vanished.
2. You explore their computer: git commits, emails, notes, bug reports.
3. You interrogate 4 characters — each AI-powered with their own secrets.
4. Collect evidence, find contradictions, and make your accusation.
5. Wrong accusation = game over. Correct = case solved.

## 👥 Characters

- **Jordan Lee** — Senior engineer, overly calm
- **Priya Nair** — Project Manager, evasive about timeline
- **Sam Carter** — DevOps, accessed production at 2AM
- **Dana Voss** — CEO's assistant, knows more than she lets on

## 🔐 The Truth

Alex discovered that production data was being silently exported to a third-party server. When they raised it internally, they were "removed" from the project. The git trail, encrypted file, and a final email draft tell the full story.

## � Running Locally

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Database
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p ai_detective < database/seed.sql
```

Set your OpenAI key in `backend/src/main/resources/application.properties`:
```
openai.api.key=YOUR_KEY_HERE
```
