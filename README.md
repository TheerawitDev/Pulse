# Pulse — Generative City-Wallet
**Hyperpersonalized offers for anyone, anywhere.**

Traditional coupon apps fail because they ignore the user's immediate reality. Pulse is a next-generation loyalty platform built for the **DSV-Gruppe Challenge**. It uses on-device Small Language Models (SLMs) and real-time spatial context (weather, battery life, walking speed, and Payone transaction density) to generate hyper-personalized, zero-click bounties exactly when a user is most likely to convert.

## What It Does
*   **Context Sensing Engine** — Aggregates real-world signals (weather, battery, transit speed, and Payone demand metrics) without sending personal data to the cloud.
*   **Generative Offer Engine** — Uses local, on-device AI (`gemma:2b`) to dynamically write emotional marketing copy and generate UI themes tailored to the user's exact moment.
*   **AI Campaign Assistant** — A zero-click interface for merchants. Instead of filling out complex logic forms, merchants type simple goals (e.g., *"I need to sell 30 pretzels before 5 PM"*), and the AI configures the entire campaign structure.
*   **Spatial Mapping** — High-fidelity `react-leaflet` integration mapping live merchant pulses and user coordinates in Stuttgart.
*   **Seamless Checkout** — Generates dynamic QR codes in an Apple-Wallet-style pass, closing the loop with simulated Payone cashback redemptions.
*   **Privacy-by-Design (GDPR)** — Built with a "Privacy Shield" architecture. All granular context processing and AI inference happens securely on the user's device.

## Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) |
| **Generative AI** | Ollama (`gemma:2b` local SLM) |
| **Spatial Mapping** | `react-leaflet` & `leaflet` |
| **Animations** | `framer-motion` |
| **Styling** | Tailwind CSS |
| **Icons** | `lucide-react` |

## Quick Start

### Prerequisites
*   Node.js 18+
*   [Ollama](https://ollama.com/) installed locally

### Setup
```bash
# 1. Clone & enter
git clone <repo-url> && cd pulse

# 2. Install dependencies
npm install

# 3. Start the local AI model (in a separate terminal)
# This will download the gemma:2b model if you don't have it yet
ollama run gemma:2b

# 4. Start the Next.js frontend
npm run dev
# Go to http://localhost:3000
```

## Demo Dataset
The project runs out-of-the-box using a simulated real-time data layer (`mockData.ts`). It simulates various user states in Stuttgart (e.g., "Raining + Commuting", "Sunny + Browsing") alongside a live simulated feed of DSV Payone transaction density. The UI allows you to toggle these contexts to watch the Generative Offer Engine react in real-time.

## Project Structure
```text
pulse/
├── public/               # Branding assets (logo.svg)
├── src/
│   ├── app/
│   │   ├── admin/        # Merchant Dashboard & AI Campaign Assistant
│   │   ├── api/          # Generative AI endpoints (/api/generate-offer, etc.)
│   │   ├── globals.css   # Tailwind configuration
│   │   ├── layout.tsx    # Root layout & Leaflet CSS
│   │   └── page.tsx      # Main Consumer Dashboard (Map + Phone Simulator)
│   ├── components/
│   │   ├── PhoneSimulator.tsx # 3D Interactive Consumer Wallet UI
│   │   └── SpatialMap.tsx     # react-leaflet implementation
│   ├── lib/
│   │   └── mockData.ts   # Simulated context and merchant rules
│   └── types/            # TypeScript interfaces
├── package.json
└── tailwind.config.ts
```

## License
MIT
