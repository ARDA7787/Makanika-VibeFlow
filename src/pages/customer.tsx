import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatAssistant } from "@/components/ChatAssistant";
import { SubmitIssueForm } from "@/components/SubmitIssueForm";
import { NearbyProviders } from "@/components/NearbyProviders";
import { Wrench, MessageSquare, MapPin, Mic, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden dark">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      ></div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
              <Wrench className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg">RepairMatch</span>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/voice')}
              className="text-slate-400 hover:text-white hover:bg-white/5 gap-2 hidden sm:flex"
            >
              <Mic className="w-4 h-4" />
              Voice Assistant
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/elevenlabs-agent')}
              className="text-slate-400 hover:text-white hover:bg-white/5 gap-2 hidden sm:flex"
            >
              <Sparkles className="w-4 h-4" />
              AI Agent
            </Button>
            <div className="h-4 w-px bg-white/10 hidden sm:block mx-1" />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 pt-16 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Car Trouble? <span className="text-indigo-400">We've Got You.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
          Describe your issue, chat with our AI expert, or find top-rated mechanics near you instantly.
        </p>
      </div>

      {/* Main Content Tabs */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-slate-900/50 border border-white/5 p-1 rounded-full backdrop-blur-sm">
              <TabsTrigger 
                value="chat" 
                className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>AI Assistant</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="issue" 
                className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  <span>Submit Issue</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="providers" 
                className="rounded-full px-6 py-2.5 data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400 transition-all"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Find Mechanics</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="chat" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto">
              <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
                <ChatAssistant />
              </div>
              <p className="text-center text-slate-500 text-sm mt-4">
                Our AI assistant can help diagnose issues and connect you with specialists.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="issue" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-2xl mx-auto">
               {/* Wrap in light theme for the form components if needed, or style overrides */}
               <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 [&_.card]:bg-transparent [&_.card]:border-0 [&_.card]:shadow-none [&_label]:text-slate-300 [&_input]:bg-slate-950/50 [&_input]:border-white/10 [&_textarea]:bg-slate-950/50 [&_textarea]:border-white/10 [&_h3]:text-white [&_p]:text-slate-400">
                <SubmitIssueForm />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="providers" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/50 min-h-[500px] [&_.card]:bg-slate-950/50 [&_.card]:border-white/10 [&_h3]:text-white [&_p]:text-slate-400 [&_span]:text-slate-300">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-white">Nearby Providers</h2>
                <p className="text-slate-400">Find the best rated mechanics in your area</p>
              </div>
              <NearbyProviders />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 RepairMatch. All rights reserved.</p>
      </footer>
    </div>
  );
}
