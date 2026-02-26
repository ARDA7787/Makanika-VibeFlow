# RepairMatch — Complete Codebase Documentation

> Auto-generated project documentation. Describes the full architecture, data flows, backend workflows, frontend pages, components, and database schema.

---

## 1. Project Overview
**RepairMatch** is an AI-powered auto repair marketplace that connects customers experiencing vehicle problems with nearby, vetted repair service providers.

The platform consists of 4 distinct portals:
- **Admin Console** (`/`): For platform administrators to monitor analytics, sessions, leads, and providers.
- **Customer Portal** (`/customer`): For car owners to chat with AI, submit issues, and find mechanics.
- **Voice Assistant** (`/voice`): A push-to-talk multilingual voice interface for hands-free assistance.
- **ElevenLabs Agent** (`/elevenlabs-agent`): A real-time conversational AI agent integration.

### Core Value Proposition
1. **Input:** Customer describes car problem (via text, voice, or WhatsApp).
2. **Analysis:** AI extracts issue category and car model.
3. **Location:** System geocodes the customer's address.
4. **Matching:** Finds nearby providers specializing in the specific issue category.
5. **Action:** Emails the top 3 matched providers.
6. **Tracking:** All interactions and leads are tracked in the admin console.

---

## 2. Technology Stack

### Frontend
- **React 18** with TypeScript
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **@11labs/react** SDK for real-time voice
- **Sonner** for toast notifications

### Backend
- **Convex** — Serverless real-time database and backend functions
- **Convex Auth** — Authentication infrastructure (provisioned)
- **Vibeflow** — Visual workflow engine orchestrating backend logic

### AI & External Services
- **OpenAI GPT-4o-mini** — Powers chat assistant, issue parsing, and language detection
- **ElevenLabs** — STT (`scribe_v2`), TTS (`eleven_multilingual_v2`), and Real-time Agents
- **Google Maps Geocoding API** — Converts addresses to coordinates
- **Resend** — Transactional email delivery (via SMTP)
- **Twilio/WhatsApp** — Messaging integration

**ElevenLabs Agent ID (production):** `agent_5801kjar4nz3eswbs9m3s3qwec92`

---

## 3. Application Routes & Pages

All routes are defined in `src/App.tsx`.

| Route | Component | Description |
|---|---|---|
| `/` | `HomePage` | **Admin Console.** The main dashboard for administrators. |
| `/sessions/:sessionId` | `HomePage` | **Admin Console.** deeply links to a specific chat session. |
| `/customer` | `CustomerPage` | **Customer Portal.** 3-tab interface for users to interact with the platform. |
| `/voice` | `VoicePage` | **Voice Assistant.** Push-to-talk interface for voice interactions. |
| `/elevenlabs-agent` | `ElevenLabsAgentPage` | **ElevenLabs Agent.** Setup and interaction with real-time conversational AI. |
| `*` | `NotFoundPage` | **404.** Catch-all for undefined routes. |

---

## 4. Frontend Component Architecture

### Directory Structure
```
src/
├── App.tsx
├── main.tsx
├── index.css
├── pages/
│   ├── home.tsx                    (Admin Console)
│   ├── customer.tsx                (Customer Portal)
│   ├── voice.tsx                   (Voice Push-to-Talk)
│   ├── elevenlabs-agent.tsx        (ElevenLabs Real-Time Agent)
│   └── not-found.tsx
├── components/
│   ├── ChatAssistant.tsx
│   ├── SubmitIssueForm.tsx
│   ├── NearbyProviders.tsx
│   ├── RateProviderForm.tsx
│   ├── ProviderDashboard.tsx
│   └── admin/
│       ├── AdminLayout.tsx
│       ├── OverviewSection.tsx
│       ├── ChatSessionsSection.tsx
│       ├── EscalationsSection.tsx
│       ├── LeadsSection.tsx
│       └── ProvidersSection.tsx
└── hooks/
    └── use-toast.ts
```

### Key Components

#### `ChatAssistant.tsx`
- **Purpose:** Customer-facing text chat widget.
- **Backend Flow:** Calls `SendChatMessage` flow.
- **Features:**
  - Generates unique session IDs.
  - Loads history from Convex.
  - Detects escalation messages.
  - Shows typing indicators.

#### `SubmitIssueForm.tsx`
- **Purpose:** Collects customer issue details.
- **Backend Flow:** Calls `SubmitIssue` flow.
- **Features:**
  - Captures name, address, description, and optional car model.
  - Triggers AI parsing and provider matching.
  - Displays matched providers upon success.

#### `NearbyProviders.tsx`
- **Purpose:** Geolocation-based provider finder.
- **Backend Flow:** Calls `GetNearbyProviders` flow.
- **Features:**
  - Requests browser geolocation.
  - Displays provider cards with distance, rating, and contact info.
  - Handles permission denial and loading states.

#### `VoicePage` (`src/pages/voice.tsx`)
- **Purpose:** Push-to-talk voice interface.
- **Backend Flow:** Calls `VoiceChat` flow.
- **Features:**
  - Uses `MediaRecorder` API.
  - visual orb state (idle, recording, processing, speaking).
  - Plays back AI audio response (ElevenLabs TTS).

#### `ElevenLabsAgentPage` (`src/pages/elevenlabs-agent.tsx`)
- **Purpose:** Real-time conversational agent interface.
- **Features:**
  - Uses `@11labs/react` SDK.
  - Pre-configured with Agent ID `agent_5801kjar4nz3eswbs9m3s3qwec92`.
  - Provides webhook configuration instructions.

#### `AdminLayout.tsx` (`src/components/admin/`)
- **Purpose:** Shell for the Admin Console.
- **Features:**
  - Sidebar navigation.
  - Mobile responsiveness.
  - Status indicators for different sections.

---

## 5. Database Schema

The database is built on Convex. All tables include automatic `_id` and `_creationTime` fields.

### `customers`
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Customer's full name |
| `email` | string | Yes | Contact email |
| `phone` | string | Yes | Contact number |
| `address` | string | Yes | Physical address |
| `latitude` | number | Yes | Geocoded latitude |
| `longitude` | number | Yes | Geocoded longitude |

### `providers`
| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | Business name |
| `services` | array | Yes | List of services offered |
| `email` | string | Yes | Contact email |
| `phone` | string | Yes | Contact number |
| `address` | string | Yes | Physical address |
| `latitude` | number | Yes | Geocoded latitude |
| `longitude` | number | Yes | Geocoded longitude |
| `rating` | number | No | Average star rating (1-5) |

### `leads`
| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | Yes | Customer identifier/name |
| `issueDescription` | string | Yes | Original text description |
| `carModel` | string | Yes | AI-detected or user-provided model |
| `status` | string | Yes | 'New', 'Contacted', etc. |
| `issueCategory` | string | No | AI-detected category |
| `assignedProviders` | array | No | List of matched providers |
| `latitude` | number | No | Customer location lat |
| `longitude` | number | No | Customer location lng |

### `chatSessions`
| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | Yes | Customer ID |
| `providerId` | string | No | Linked provider (if any) |
| `status` | string | Yes | Session status |
| `startedAt` | number | Yes | Timestamp |
| `endedAt` | number | No | Timestamp |

### `chatMessages`
| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | Yes | Link to chatSession |
| `sender` | string | Yes | 'user' or 'agent' |
| `message` | string | Yes | Message content |
| `timestamp` | number | Yes | Timestamp |

### `providerRatings`
| Field | Type | Required | Description |
|---|---|---|---|
| `providerId` | string | Yes | Link to provider |
| `userId` | string | Yes | Rater identifier |
| `rating` | number | Yes | 1-5 score |
| `comment` | string | Yes | Review text |

### `whatsappSessions`
| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | string | Yes | Customer phone number |
| `sessionId` | string | Yes | Link to chatSession |
| `status` | string | Yes | Session status |

---

## 6. Backend Workflow System

The backend logic is orchestrated by **Vibeflow**, a visual node-based engine running on Convex.

### Node Types
- **Frontend Element:** Entry point for UI interactions.
- **Query:** Reads data from Convex.
- **Mutation:** Modifies data in Convex.
- **Agent:** Calls OpenAI GPT-4o-mini.
- **Code:** Executes custom JavaScript logic.
- **HTTP Request:** Calls external APIs (Google Maps, ElevenLabs).
- **Webhook:** Receives external POST requests.
- **Email:** Sends emails via Resend.
- **If/Else:** Conditional logic branching.
- **For Loop:** Iterates over data arrays.
- **Return:** Sends response back to the caller.

---

## 7. Full Data Flow Walkthroughs

### 1. Issue Submission
**Flow:** `SubmitIssue` → `Geocode Address` → `Extract Coordinates` → `ParseIssue` (AI) → `Save Lead` → `FindProviders` → `Sort & Filter Providers` → `Assign Providers to Lead` → `Email Loop` (Notify Provider) → `Return`

### 2. Text Chat
**Flow:** `SendChatMessage` → `Save Chat Message` → `Escalation Check`
- **If Escalated:** `Save Canned Reply` → `Notify Admin` → `Return Canned Message`
- **If Normal:** `AI Car Repair Assistant` → `Save Agent Reply` → `Return Agent Reply`

### 3. Nearby Providers
**Flow:** `GetNearbyProviders` → `FetchAllProviders` → `Sort Providers by Distance` → `Return Nearby Providers`

### 4. Provider Rating
**Flow:** `SubmitRating` → `Save Provider Rating` → `Fetch Provider Ratings` → `Compute Average Rating` → `Update Provider Rating` → `Return Success`

### 5. Get Chat History
**Flow:** `GetChatHistory` → `FetchChatMessages` → `Sort Messages by Timestamp` → `Return Chat History`

### 6. Admin Analytics
**Flow:** `GetAdminAnalytics` → `Fetch Analytics Leads` + `Messages` + `Providers` + `Ratings` → `Compute Analytics` → `Return Analytics`

### 7. Provider Leads Dashboard
**Flow:** `GetLeads` → `FetchAllLeads` → `Filter Provider Leads` → `Return Provider Leads`

### 8. Admin Sessions List
**Flow:** `GetAllSessions` → `Fetch All Messages For Sessions` → `Group Sessions` → `Return All Sessions`

### 9. Admin Send Message
**Flow:** `AdminSendMessage` → `Save Admin Message` → `Return Admin Message`

---

## 8. AI & External Integrations

### OpenAI Agents
- **`aiCarRepairAssistant`:** Main conversational agent. Uses session memory (last 20 messages).
- **`parseIssue`:** Structured data extraction. Returns `{carModel, issueCategory, issueDescription}`.
- **Inline Agents:** Used for language detection and intent extraction in Voice/WhatsApp flows.

### Google Maps
- **Geocoding API:** Used to convert customer addresses to coordinates for provider matching.

### ElevenLabs
- **STT (`scribe_v2`):** Transcribes voice notes and push-to-talk audio.
- **TTS (`eleven_multilingual_v2`):** Generates voice responses (Voice ID: `EXAVITQu4vr4xnSDxMaL`).
- **Real-time Agent:** Interactive conversational AI via SDK.

### Resend
- **Email Service:** Sends HTML emails for provider notifications and admin escalations.

### Twilio / WhatsApp
- **Webhook:** Receives inbound messages.
- **Integration:** Enables text and voice interaction via WhatsApp.

---

## 9. Admin Console Deep Dive

### OverviewSection
- **KPIs:** Total Leads, AI Conversations, Escalations, Avg Rating.
- **Charts:** 7-day message volume bar chart.
- **Lists:** Category breakdown, recent escalations feed.

### ChatSessionsSection
- **Layout:** Slack-style two-panel view.
- **Features:** Session filtering, full thread view, admin reply capability.

### LeadsSection
- **Table:** Displays date, car model, category, description, status, and assigned providers.

### ProvidersSection
- **List:** Registered providers with services, contact details, and ratings.

### EscalationsSection
- **View:** Dedicated list of sessions requiring human intervention.

---

## 10. WhatsApp Integration

**Webhook URL:** `https://original-hound-718.convex.site/whatsapp-webhook`

### Flow Walkthrough
1. **Receive:** WhatsApp POST (Twilio).
2. **Session:** `Upsert WA Session` → `Save WA Session Record` → `Save WA User Message`.
3. **Input:** `Prepare Input` (checks for audio).
4. **Processing:**
   - **Voice:** `ElevenLabs Transcribe` → `Extract Transcript` → `Extract English Intent`.
   - **Text:** `Use Text Body` → `Extract English Intent`.
5. **Logic:** `WA Parse Issue` → `WA Fetch Providers` → `Build WA Context`.
6. **Response:** `WA AI Assistant` → `Save WA AI Reply` → Return "OK".

**Capabilities:** Handles text & voice, multi-language support, provider matching.

---

## 11. Voice Interfaces

### Browser Push-to-Talk (`/voice`)
**Flow:** `VoiceChat` → `Voice STT` → `Extract Transcript` → `Save Voice Msg` → `Voice Extract Intent` → `Voice Parse Issue` → `Voice Fetch Providers` → `Build Voice Context` → `Voice AI Assistant` → `Save Voice Reply` → `Voice TTS` → `Build Final Response` → `Return`

**UI:** Interactive orb visualization (Idle/Recording/Processing/Speaking).

### ElevenLabs Real-Time Agent (`/elevenlabs-agent`)
**Integration:** Uses `@11labs/react` SDK with Agent ID `agent_5801kjar4nz3eswbs9m3s3qwec92`.

---

## 12. ElevenLabs Tool Call Webhook

**Webhook URL:** `https://original-hound-718.convex.site/elevenlabs-tool-call`

### Logic
The webhook handles tool calls from the ElevenLabs agent:
1. **`find_providers`:** Fetches, filters, and formats nearby providers.
2. **`get_issue_categories`:** Returns static list of issue categories.
3. **`get_platform_stats`:** Returns aggregated platform statistics.
4. **Unknown:** Returns error message.

---

## 13. Webhook Endpoints Summary

| Endpoint | Method | Purpose |
|---|---|---|
| `/whatsapp-webhook` | POST | Receives Twilio WhatsApp messages |
| `/elevenlabs-tool-call` | POST | Receives ElevenLabs agent tool calls |

---

## 14. Key Backend Node Reference

(This section references the Vibeflow nodes used in the system)

- `processFlow_node_...` actions correspond to the workflows described above.
- `internal` mutations and queries are used within these flows for DB operations.

---

## 15. Environment & Configuration

- **OpenAI API Key:** Stored in Vibeflow.
- **ElevenLabs API Key:** Stored as integration credential.
- **Google Maps API Key:** Configured in Geocode node.
- **Resend API Key:** Configured for email delivery.
- **ElevenLabs Agent ID:** `agent_5801kjar4nz3eswbs9m3s3qwec92`
- **Twilio Webhook:** `https://original-hound-718.convex.site/whatsapp-webhook`
- **ElevenLabs Tool Webhook:** `https://original-hound-718.convex.site/elevenlabs-tool-call`

---
*Last updated: Auto-generated from full codebase analysis. ElevenLabs Agent ID: agent_5801kjar4nz3eswbs9m3s3qwec92*
