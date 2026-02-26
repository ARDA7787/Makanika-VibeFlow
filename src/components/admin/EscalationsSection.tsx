import React, { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  MessageSquare, 
  CheckCircle, 
  Clock,
  ArrowRight
} from "lucide-react";

interface EscalationsSectionProps {
  setActiveSection: (section: "overview" | "sessions" | "escalations" | "leads" | "providers") => void;
  setSelectedSessionId: (id: string | null) => void;
}

export function EscalationsSection({ setActiveSection, setSelectedSessionId }: EscalationsSectionProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getAllSessions = useAction(api.actions.processFlow_node_1772031872608_f5f3g94);

  useEffect(() => {
    const fetchEscalations = async () => {
      setLoading(true);
      try {
        const result: any = await getAllSessions({ input: {} });
        if (result?.__result) {
          const escalated = (result.__result || []).filter((s: any) => s.isEscalated);
          setSessions(escalated);
        }
      } catch (error) {
        console.error("Failed to fetch escalations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEscalations();
  }, []);

  const handleOpenChat = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActiveSection("sessions");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Active Escalations</h2>
          <p className="text-slate-500 mt-1">Sessions requiring human intervention.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-sm font-medium text-amber-700">
            {sessions.length} Pending
          </span>
        </div>
      </div>

      {sessions.length > 0 && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Attention Required</AlertTitle>
          <AlertDescription>
            {sessions.length} customer{sessions.length !== 1 ? 's are' : ' is'} waiting for a response. Average wait time: 12m.
          </AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="h-[200px]">
              <CardHeader><Skeleton className="h-6 w-32" /></CardHeader>
              <CardContent><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-medium text-slate-900">All Clear!</h3>
          <p className="text-slate-500 mt-2">No pending escalations at this moment.</p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => setActiveSection("overview")}
          >
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map(session => (
            <Card key={session.sessionId} className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {session.sessionId}
                  </CardTitle>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(session.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg text-sm text-slate-700 italic border border-slate-100">
                    "{session.lastMessage}"
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                    <AlertTriangle className="h-3 w-3" />
                    Requested human support
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-3 border-t bg-slate-50/50">
                <Button 
                  className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent"
                  onClick={() => handleOpenChat(session.sessionId)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Chat
                  <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
