# SPACE LEGACY

> **"Every object has a story. Every mission leaves a legacy."**

---

## 1. The Challenge & The Problem

Human exploration of the cosmos has left extraordinary footprints across our solar system. From pioneering landers to robotic rovers, dozens of historic spacecraft now rest quietly in the lunar dust and Martian regolith — abandoned, but carrying the ingenuity of humankind.

Yet for young people and space enthusiasts, this historic hardware remains largely forgotten, scattered across dense archives, technical catalogs, and complex telemetry data. 

**SPACE LEGACY** bridges this gap: transforming intricate historical and scientific records into an engaging, interactive, and educational voyage for the next generation of explorers.

---

## 2. Our Solution

SPACE LEGACY brings abandoned Moon and Mars missions back to life:
- **Authentic Provenance:** Every fact, date, coordinate, and discovery is directly linked to verified NASA and JPL archives.
- **Honest Provenance & AI Labeling:** When AI assists in reconstructing immersive video sequences or narrative logs, it is clearly and transparently labeled. Authentic NASA imagery is preserved and distinguished.
- **Engaging Storytelling:** Experience the operational life, key scientific milestones, and silent rest of humanity's ambassadors on the Moon and Mars.

---

## 3. How to Use the Experience

1. **Explore Moon & Mars:** Browse our planetary explorer to discover landing sites, operational status, and spacecraft types.
2. **Open Machine Dossiers:** Inspect high-resolution imagery, historical significance, engineering specs, and chronological mission timelines.
3. **Read the Logbook:** Follow generated and authored mission journals chronicling the journey from launch to final transmission.
4. **Play Quizzes & Earn Badges:** Test your aerospace knowledge, unlock achievement badges (such as *Lunar Pioneer* or *Curiosity Scholar*), and track your mastery.
5. **Save Your Progress:** Start exploring instantly as an anonymous guest, and seamlessly link your progress to a permanent account at any time.

---

## 4. Getting Started

### Prerequisites
- Node.js (v20 or later)
- pnpm (v9 or later)
- PostgreSQL (v16)

### Quick Start Commands
```bash
# 1. Install project dependencies
pnpm install

# 2. Setup your local environment
cp .env.example .env

# 3. Initialize database and seed authentic NASA Moon & Mars records
pnpm db:migrate
pnpm db:seed

# 4. Start the application
pnpm dev
```

Once started, the platform is ready:
- **Public API:** `http://localhost:3333/api/v1`
- **Mission Control Admin Dashboard:** `http://localhost:3333/admin`
- **System Health:** `http://localhost:3333/health/live`

### Cloud Deployment (Vercel & Neon PostgreSQL)
The backend is cloud-ready and deployable directly on **Vercel** serverless functions with **Neon PostgreSQL**.
- Convert SSL certificates for serverless runtime using `node scripts/convert_ca_to_string.js ca.pem`.
- Set `DATABASE_URL` and `CA_STRING` in the Vercel project environment variables.
- See [docs/RUNBOOK.md](file:///home/pavel/Documents/Dev/NASA/SPACE%20LEGACY/Apps/server/docs/RUNBOOK.md) for full deployment instructions.

---

## 5. Perspectives & Future Horizons

- **Beyond Moon and Mars:** Expanding our celestial catalog to Venus, Titan, comets, and deep space probes (Voyager, New Horizons).
- **Expanded Hardware Archives:** Chronicling descent stages, retroreflectors, and international partner equipment.
- **Global Inclusivity:** Multilingual support across European, Asian, and global languages.
- **Interactive 3D Telemetry:** Real-time 3D orbital trajectory replays and immersive terrain visualization.

---

## 6. Transparency & Declarations

- **Data Sources:** Scientific telemetry and mission timelines are sourced directly from official NASA and JPL publications (`nasa.gov`, `jpl.nasa.gov`).
- **AI Usage Declaration:** Space Legacy employs artificial intelligence exclusively to assist in narrative dramatization and video generation for educational engagement. All synthetic content is prominently labeled with an `AI-GEN` badge.
- **Disclaimer:** This project was built for the NASA Space Apps Challenge 2026 (*Abandoned but Not Forgotten*). It is an independent educational initiative and is not formally affiliated with or endorsed by NASA.
