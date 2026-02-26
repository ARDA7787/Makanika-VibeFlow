import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OverviewSection } from "@/components/admin/OverviewSection";
import { ChatSessionsSection } from "@/components/admin/ChatSessionsSection";
import { EscalationsSection } from "@/components/admin/EscalationsSection";
import { LeadsSection } from "@/components/admin/LeadsSection";
import { ProvidersSection } from "@/components/admin/ProvidersSection";

type Section = "overview" | "sessions" | "escalations" | "leads" | "providers";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const { sessionId } = useParams<{ sessionId: string }>();

  useEffect(() => {
    if (sessionId) {
      setActiveSection("sessions");
      setSelectedSessionId(sessionId);
    }
  }, [sessionId]);

  const handleSetSelectedSessionId = (id: string | null) => {
    setSelectedSessionId(id);
    if (id) {
      // Optional: update URL
      // navigate(`/sessions/${id}`, { replace: true });
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return (
          <OverviewSection 
            setActiveSection={setActiveSection} 
            setSelectedSessionId={handleSetSelectedSessionId} 
          />
        );
      case "sessions":
        return (
          <ChatSessionsSection 
            selectedSessionId={selectedSessionId} 
            setSelectedSessionId={handleSetSelectedSessionId} 
          />
        );
      case "escalations":
        return (
          <EscalationsSection 
            setActiveSection={setActiveSection} 
            setSelectedSessionId={handleSetSelectedSessionId} 
          />
        );
      case "leads":
        return <LeadsSection />;
      case "providers":
        return <ProvidersSection />;
      default:
        return <OverviewSection setActiveSection={setActiveSection} setSelectedSessionId={handleSetSelectedSessionId} />;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} setActiveSection={(section) => {
      setActiveSection(section);
    }}>
      {renderSection()}
    </AdminLayout>
  );
}
