# Makanika-VibeFlow

AI-powered auto repair marketplace built with a modern full-stack
architecture and visual workflow backend.

Makanika-VibeFlow connects customers with nearby automotive service
providers using conversational AI, geolocation matching, automated lead
routing, and multi-portal dashboards.

------------------------------------------------------------------------

## 🚀 Overview

Makanika-VibeFlow is designed as a scalable SaaS marketplace for vehicle
repair workflows. It integrates AI-driven issue interpretation,
real-time provider matching, and automated communication systems.

Core capabilities:

-   Natural language vehicle issue submission
-   AI-powered chat assistant
-   Geolocation-based provider matching
-   Automated lead creation and routing
-   Admin analytics and session management
-   Voice interaction support

------------------------------------------------------------------------

## 🧠 Key Features

### Customer Experience

-   Text or voice-based issue submission
-   AI-assisted conversational support
-   Nearby repair provider discovery
-   Real-time chat session handling

### Admin Portal

-   Dashboard with analytics & metrics
-   Session and message monitoring
-   Provider management
-   Lead tracking system

### Integrations

-   OpenAI (GPT-based assistant)
-   Google Maps Geocoding API
-   Twilio / WhatsApp
-   ElevenLabs (Speech-to-Text / Text-to-Speech)
-   Resend (Email notifications)
-   Convex (Database + serverless backend)

------------------------------------------------------------------------

## 🏗 Architecture

### Frontend

-   React 18
-   TypeScript
-   React Router
-   Tailwind CSS
-   shadcn/ui components

### Backend

-   VibeFlow (Visual workflow orchestration)
-   Convex (Serverless backend & real-time DB)
-   External API nodes (AI, Maps, Email, Messaging)

Workflows handle: - Issue submission - AI interpretation - Location
parsing - Provider ranking - Lead creation - Chat session management -
Admin messaging

------------------------------------------------------------------------

## 📦 Tech Stack

  Layer         Technology
  ------------- --------------------
  Frontend      React + TypeScript
  Backend       VibeFlow + Convex
  AI            OpenAI GPT
  Geolocation   Google Maps API
  Messaging     Twilio / WhatsApp
  Voice         ElevenLabs
  Email         Resend

------------------------------------------------------------------------

## 🛠 Installation

### Prerequisites

-   Node.js (v18+ recommended)
-   pnpm or npm
-   Convex account
-   API keys:
    -   OpenAI
    -   Google Maps
    -   ElevenLabs
    -   Twilio
    -   Resend

------------------------------------------------------------------------

### Clone Repository

``` bash
git clone https://github.com/ARDA7787/Makanika-VibeFlow.git
cd Makanika-VibeFlow
```

------------------------------------------------------------------------

### Install Dependencies

``` bash
pnpm install
```

or

``` bash
npm install
```

------------------------------------------------------------------------

### Environment Variables

Create a `.env.local` file:

``` env
OPENAI_API_KEY=your_openai_key
GOOGLE_MAPS_API_KEY=your_maps_key
ELEVENLABS_API_KEY=your_elevenlabs_key
TWILIO_AUTH=your_twilio_credentials
RESEND_API_KEY=your_resend_key
CONVEX_DEPLOYMENT=your_convex_project
```

------------------------------------------------------------------------

### Run Development Server

``` bash
pnpm dev
```

------------------------------------------------------------------------

## 📐 Backend Workflow Example

### Issue Submission Flow

1.  Customer submits issue description
2.  Address is geocoded → coordinates extracted
3.  AI classifies vehicle problem
4.  Nearby providers fetched
5.  Lead created
6.  Email notifications sent

### Chat Assistant Flow

1.  User sends message
2.  Message stored in Convex
3.  AI generates response
4.  Response persisted
5.  Escalation logic checks if human support needed

------------------------------------------------------------------------

## 🗂 Database Schema (Core Entities)

-   customers
-   providers
-   leads
-   chatSessions
-   chatMessages
-   providerRatings

Convex manages real-time syncing and serverless functions.

------------------------------------------------------------------------

## 🔐 Security Considerations

-   API keys must never be committed
-   Environment variables required for production
-   Validate user input before AI processing
-   Rate-limit messaging endpoints
-   Secure Twilio and webhook endpoints

------------------------------------------------------------------------

## 📊 Scalability Notes

Designed for: - Horizontal backend scaling (serverless functions) -
Modular workflow expansion - Multi-channel messaging (WhatsApp, Web,
Voice) - Future AI agent upgrades

------------------------------------------------------------------------

## 🧪 Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Follow existing workflow patterns
4.  Submit a pull request

Ensure: - Clean TypeScript types - No hardcoded secrets - Workflow logic
documented

------------------------------------------------------------------------

## 📜 License

Add a LICENSE file (MIT recommended) if not already included.

------------------------------------------------------------------------

## 📌 Future Enhancements

-   Provider bidding system
-   Dynamic pricing engine
-   Ratings & review analytics
-   Automated repair cost estimation
-   Multi-region deployment

------------------------------------------------------------------------

## 🤝 Support

For issues or feature requests: - Open a GitHub issue - Submit a pull
request

------------------------------------------------------------------------

**Makanika-VibeFlow --- Intelligent Automotive Service Routing**
