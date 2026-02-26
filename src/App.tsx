import { Routes, Route } from "react-router";
import HomePage from "./pages/home";
import VoicePage from "./pages/voice";
import ElevenLabsAgentPage from "./pages/elevenlabs-agent";
import CustomerPage from "./pages/customer";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/sessions/:sessionId" element={<HomePage />} />
      <Route path="/voice" element={<VoicePage />} />
      <Route path="/elevenlabs-agent" element={<ElevenLabsAgentPage />} />
      <Route path="/customer" element={<CustomerPage />} />
      {/* CRITICAL: ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
