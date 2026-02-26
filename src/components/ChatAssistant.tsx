import React, { useState, useRef, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Wrench, Loader2, Bot, PhoneCall } from "lucide-react";
import { toast } from "sonner";

type Message = {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: number;
  type?: "normal" | "escalation";
};

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [sessionId, setSessionId] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessageAction = useAction(api.actions.processFlow_node_1772008244900_jjeqg0p);
  const getChatHistoryAction = useAction(api.actions.processFlow_node_1772030272591_mnlfn7p);

  // Initialize session ID and load history on mount
  useEffect(() => {
    // Generate a simple session ID
    const newSessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
    setSessionId(newSessionId);
    
    const loadHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const result: any = await getChatHistoryAction({ 
          input: { sessionId: newSessionId } 
        });

        // The result structure from vibeflow actions usually wraps the return value
        // But the specific node returns the array directly or in __result
        const historyMessages = result?.__result || result || [];

        if (Array.isArray(historyMessages) && historyMessages.length > 0) {
          const mappedMessages: Message[] = historyMessages.map((msg: any) => ({
            id: msg._id,
            sender: msg.sender as "user" | "agent",
            text: msg.message,
            timestamp: msg.timestamp,
            type: msg.message === "A specialist will contact you soon." ? "escalation" : "normal"
          }));
          setMessages(mappedMessages);
        } else {
          // Add welcome message if no history
          setMessages([
            {
              id: "welcome",
              sender: "agent",
              text: "Ask me anything about your car repair needs!",
              timestamp: Date.now(),
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        // Fallback to welcome message
        setMessages([
          {
            id: "welcome",
            sender: "agent",
            text: "Ask me anything about your car repair needs!",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage.trim();
    setInputMessage(""); // Clear input immediately
    
    // Create optimistic user message
    const tempId = Date.now().toString();
    const userMsg: Message = {
      id: tempId,
      sender: "user",
      text: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call the Convex action
      const result: any = await sendMessageAction({
        input: {
          sessionId: sessionId,
          message: userText,
          sender: "user",
        },
      });

      // Extract agent response
      // result returns the saved agent reply record wrapped in __result
      let agentText = "I couldn't process that request.";
      if (typeof result === "string") {
        agentText = result;
      } else {
        const r = result?.__result ?? result;
        if (typeof r === "string") {
          agentText = r;
        } else if (r?.message && typeof r.message === 'string' && !r.message.startsWith('{')) {
          agentText = r.message;
        } else if (r?.content) {
          agentText = r.content;
        } else if (result?.__error) {
          agentText = "Sorry, I'm having trouble connecting right now. Please try again.";
          toast.error("AI service unavailable. Please check API key configuration.");
        }
      }
      
      const isEscalation = agentText === "A specialist will contact you soon.";
      
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        text: agentText,
        timestamp: Date.now(),
        type: isEscalation ? "escalation" : "normal",
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col shadow-lg border-muted/40 overflow-hidden bg-background">
      <CardHeader className="border-b px-6 py-4 bg-muted/5">
        <CardTitle className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
              <AvatarImage src="/bot-avatar.png" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Wrench className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
          </div>
          <div>
            <span className="block text-lg font-semibold tracking-tight">Auto Repair Assistant</span>
            <span className="block text-xs font-medium text-muted-foreground flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              Online
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden relative bg-slate-50/50 dark:bg-slate-950/20">
        <ScrollArea className="h-full p-4 md:p-6">
          {isLoadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
              <p className="text-sm font-medium">Loading chat history...</p>
            </div>
          ) : (
          <div className="flex flex-col gap-6 pb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <Avatar className={`h-8 w-8 shrink-0 mt-1 shadow-sm ${msg.sender === "user" ? "hidden md:flex" : ""}`}>
                  <AvatarFallback className={msg.sender === "user" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200" : "bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 border"}>
                    {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                  {msg.type === "escalation" && (
                    <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mb-1 ml-1">
                      <PhoneCall className="h-3 w-3" /> Human support requested
                    </span>
                  )}
                  <div
                    className={`rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed whitespace-pre-wrap ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white rounded-tr-none"
                        : msg.type === "escalation"
                          ? "bg-amber-50 border-amber-200 text-amber-900 border rounded-tl-none"
                          : "bg-white dark:bg-slate-800 text-foreground border rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 border">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-slate-800 border rounded-2xl rounded-tl-none px-5 py-3 h-[46px] flex items-center shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-4 bg-background border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-end gap-2"
        >
          <Textarea
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1 min-h-[50px] max-h-[150px] resize-none py-3 focus-visible:ring-indigo-500"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputMessage.trim() || isLoading}
            className="h-[50px] w-[50px] shrink-0 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
