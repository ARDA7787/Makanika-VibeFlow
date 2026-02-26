import React, { useState, useEffect, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  User, 
  Bot, 
  AlertTriangle, 
  Clock, 
  Send, 
  CheckCheck,
  MoreVertical,
  PhoneCall,
  MessageSquare,
  Globe,
  Info
} from "lucide-react";

// Helper to detect non-ASCII characters (suggesting non-English content)
const hasNonAscii = (str: string) => /[^\x00-\x7F]/.test(str);

interface ChatSessionsSectionProps {
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
}

export function ChatSessionsSection({ selectedSessionId, setSelectedSessionId }: ChatSessionsSectionProps) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEscalated, setFilterEscalated] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const getAllSessions = useAction(api.actions.processFlow_node_1772031872608_f5f3g94);
  const getChatHistory = useAction(api.actions.processFlow_node_1772030272591_mnlfn7p);
  const sendMessage = useAction(api.actions.processFlow_node_1772031872609_6ae4gpc);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const result: any = await getAllSessions({ input: {} });
      if (result?.__result) {
        setSessions(result.__result);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const result: any = await getChatHistory({ input: { sessionId } });
      const msgs = result?.__result || result || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      fetchMessages(selectedSessionId);
    } else {
      setMessages([]);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedSessionId || sending) return;
    
    setSending(true);
    try {
      await sendMessage({ 
        input: { 
          sessionId: selectedSessionId, 
          message: replyText 
        } 
      });
      setReplyText("");
      await fetchMessages(selectedSessionId); // Refresh messages
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setSending(false);
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchesSearch = s.sessionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterEscalated ? s.isEscalated : true;
    return matchesSearch && matchesFilter;
  });

  const activeSession = sessions.find(s => s.sessionId === selectedSessionId);

  return (
    <div className="flex h-full bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      {/* Left Sidebar: Session List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-slate-200 bg-slate-50">
        {/* Info Banner */}
        <div className="bg-indigo-50/50 border-b border-indigo-100 p-2.5 text-[11px] text-indigo-700 flex items-start gap-2 leading-tight">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0 text-indigo-500" />
          <p>Voice messages and multilingual text are automatically transcribed and translated by ElevenLabs before AI processing.</p>
        </div>

        <div className="p-4 border-b border-slate-200 space-y-3">
          {/* Multilingual Badge */}
          <div className="flex justify-center pb-1">
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px] font-normal gap-1.5 hover:bg-teal-100 py-0.5 px-2">
              <Globe className="h-3 w-3" /> Multilingual + Voice Enabled
            </Badge>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search session ID..." 
              className="pl-9 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setFilterEscalated(v === "escalated")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Sessions</TabsTrigger>
              <TabsTrigger value="escalated" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                Escalated
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="divide-y divide-slate-100">
            {loadingSessions ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-4 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            ) : filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No sessions found.
              </div>
            ) : (
              filteredSessions.map(session => (
                <button
                  key={session.sessionId}
                  onClick={() => setSelectedSessionId(session.sessionId)}
                  className={cn(
                    "w-full text-left p-4 hover:bg-white transition-colors flex flex-col gap-1 group relative",
                    selectedSessionId === session.sessionId ? "bg-white border-l-4 border-indigo-500 shadow-sm z-10" : "border-l-4 border-transparent"
                  )}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-mono text-xs text-slate-500 truncate max-w-[140px] bg-slate-100 px-1.5 py-0.5 rounded">
                      {session.sessionId}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(session.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-medium text-slate-700 truncate max-w-[180px]">
                      {session.lastMessage || "No messages"}
                    </p>
                    {session.isEscalated && (
                      <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-[10px] h-5 px-1.5">
                        Escalated
                      </Badge>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Chat View */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {selectedSessionId ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shadow-sm z-10">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 bg-indigo-100 text-indigo-600 border border-indigo-200">
                  <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 font-mono">{selectedSessionId}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{messages.length} messages</span>
                    {activeSession?.isEscalated && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span className="text-amber-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Needs Attention
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4 text-slate-500" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6 bg-slate-50/50">
              {loadingMessages ? (
                <div className="space-y-4">
                   {[1, 2, 3].map(i => (
                     <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                       <Skeleton className="h-8 w-8 rounded-full" />
                       <Skeleton className="h-16 w-64 rounded-xl" />
                     </div>
                   ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <MessageSquare className="h-12 w-12 mb-3 opacity-20" />
                  <p>No messages in this session yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg: any) => {
                    const isUser = msg.sender === "user";
                    const isEscalation = msg.message === "A specialist will contact you soon.";
                    const showGlobe = isUser && hasNonAscii(msg.message);
                    
                    return (
                      <div key={msg._id || msg.timestamp} className={cn("flex gap-3 max-w-[80%]", isUser ? "ml-auto flex-row-reverse" : "")}>
                        <Avatar className={cn("h-8 w-8 mt-1 border", isUser ? "bg-indigo-100 text-indigo-600 border-indigo-200" : "bg-white text-slate-600 border-slate-200")}>
                          <AvatarFallback>
                            {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
                          <div className="flex items-end gap-2">
                            {showGlobe && isUser && (
                              <div className="mb-2" title="Multilingual/Voice Content Detected">
                                <Globe className="h-3.5 w-3.5 text-slate-400 opacity-60" />
                              </div>
                            )}
                            <div className={cn(
                              "px-4 py-3 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-wrap",
                              isUser 
                                ? "bg-indigo-600 text-white rounded-tr-none" 
                                : isEscalation
                                  ? "bg-amber-50 text-amber-900 border border-amber-200 rounded-tl-none"
                                  : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                            )}>
                              {isEscalation && (
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-200/50 text-amber-700 text-xs font-semibold uppercase tracking-wide">
                                  <PhoneCall className="h-3 w-3" /> Escalation Auto-Response
                                </div>
                              )}
                              {msg.message}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 px-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="relative">
                <Textarea 
                  placeholder="Type a reply as an agent..." 
                  className="min-h-[80px] resize-none pr-24 py-3 bg-slate-50 focus:bg-white transition-colors"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Button 
                    size="sm" 
                    className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    onClick={handleSendReply}
                    disabled={!replyText.trim() || sending}
                  >
                    {sending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Send className="h-3.5 w-3.5" />}
                    Send
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Replies are sent immediately to the user.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700">No Session Selected</h3>
            <p className="max-w-xs text-center mt-2 text-sm text-slate-500">
              Select a conversation from the sidebar to view chat history and send replies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
