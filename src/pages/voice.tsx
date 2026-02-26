import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Mic, Square, ArrowLeft, Wrench, Play, AlertCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type VoiceStatus = 'idle' | 'recording' | 'processing' | 'speaking' | 'error';

interface Message {
  id: string;
  type: 'user' | 'agent';
  text: string;
  timestamp: number;
  audioBase64?: string;
  mimeType?: string;
  issueCategory?: string;
  carModel?: string;
}

export default function VoicePage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Refs
  const sessionIdRef = useRef<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Convex Action
  const processVoice = useAction(api.actions.processFlow_node_1772047321030_41foas9);

  // Initialize Session ID
  useEffect(() => {
    sessionIdRef.current = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setStatus('recording');
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setErrorMessage("Microphone access denied. Please enable permissions.");
      setStatus('error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      setStatus('processing');
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Chrome/Firefox default
        const mimeType = audioBlob.type || 'audio/webm'; // Capture actual mime type
        
        // Stop all tracks
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
        
        // Convert to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64String = reader.result as string;
          // Strip prefix (e.g., "data:audio/webm;base64,")
          const base64Audio = base64String.split(',')[1];
          
          await sendAudioToBackend(base64Audio, mimeType);
        };
      };
    }
  };

  const sendAudioToBackend = async (base64Audio: string, mimeType: string) => {
    try {
      // Optimistically add user "message" (placeholder or just waiting state)
      // Since we don't have the transcript yet, we'll wait for the response
      
      const result = await processVoice({
        input: {
          base64Audio,
          mimeType,
          sessionId: sessionIdRef.current
        }
      });

      // Handle the result from the flow
      // The flow returns: { __result: { ... } } or just the result object depending on how it's wrapped
      // Based on action wrapper, it returns { __result: ... }
      
      const payload = result?.__result ?? result;
      const transcript = payload?.transcript || payload?.resolvedText || "";
      
      if (!payload) {
        throw new Error("No response from AI agent");
      }

      // 1. Add User Message (Transcript)
      if (transcript) {
        setMessages(prev => [...prev, {
          id: `user_${Date.now()}`,
          type: 'user',
          text: transcript,
          timestamp: Date.now()
        }]);
      }

      // 2. Set Detected Language
      if (payload.detectedLanguage && !detectedLanguage) {
        setDetectedLanguage(payload.detectedLanguage);
      }

      // 3. Add Agent Message
      if (payload.agentText) {
        const agentMsg: Message = {
          id: `agent_${Date.now()}`,
          type: 'agent',
          text: payload.agentText,
          timestamp: Date.now(),
          audioBase64: payload.audioBase64,
          mimeType: payload.mimeType,
          issueCategory: payload.issueCategory,
          carModel: payload.carModel
        };
        setMessages(prev => [...prev, agentMsg]);

        // 4. Play Audio
        if (payload.audioBase64) {
          playAudio(payload.audioBase64, payload.mimeType || 'audio/mpeg');
        } else {
          setStatus('idle');
        }
      } else {
        setStatus('idle');
      }

    } catch (error) {
      console.error("Error processing voice request:", error);
      setErrorMessage("Failed to process request. Please try again.");
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const playAudio = (base64Audio: string, mimeType: string) => {
    try {
      setStatus('speaking');
      const audioUrl = `data:${mimeType};base64,${base64Audio}`;
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;
      
      audio.onended = () => {
        setStatus('idle');
      };
      
      audio.onerror = (e) => {
        console.error("Audio playback error:", e);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
      };

      audio.play().catch(e => {
        console.error("Play failed:", e);
        setStatus('idle');
      });
    } catch (e) {
      console.error("Audio setup error:", e);
      setStatus('idle');
    }
  };

  const replayMessage = (msg: Message) => {
    if (msg.audioBase64 && msg.mimeType) {
      playAudio(msg.audioBase64, msg.mimeType);
    }
  };

  // Keyboard support for spacebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && status === 'idle' && !e.repeat) {
        e.preventDefault();
        startRecording();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && status === 'recording') {
        e.preventDefault();
        stopRecording();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [status]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden relative flex flex-col">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Top Navigation */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/customer')}
            className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Wrench className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-semibold text-white tracking-wide">RepairMatch Voice</span>
        </div>

        <div className="flex items-center gap-3">
          {detectedLanguage && (
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-300 shadow-sm animate-in fade-in zoom-in duration-300">
              🌍 {detectedLanguage}
            </span>
          )}
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-950/30 rounded-full border border-green-900/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Live</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        
        {/* Animated Orb Container */}
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[300px]">
          <div className="relative group cursor-pointer" onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={(e) => { e.preventDefault(); startRecording(); }} onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}>
            {/* Orb Effects Layer */}
            <div className={cn(
              "absolute inset-0 rounded-full blur-xl transition-all duration-500",
              status === 'idle' && "bg-indigo-500/20 scale-90",
              status === 'recording' && "bg-red-500/40 scale-150 animate-pulse",
              status === 'processing' && "bg-indigo-400/30 scale-110 animate-pulse",
              status === 'speaking' && "bg-blue-500/30 scale-125 animate-pulse",
              status === 'error' && "bg-red-600/30 scale-110"
            )} />

            {/* The Orb */}
            <div className={cn(
              "relative w-24 h-24 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center",
              status === 'idle' && "bg-gradient-to-br from-indigo-600 to-purple-700 shadow-[0_0_40px_rgba(99,102,241,0.4)]",
              status === 'recording' && "bg-gradient-to-br from-red-500 to-orange-600 shadow-[0_0_60px_rgba(239,68,68,0.6)] scale-110",
              status === 'processing' && "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_0_40px_rgba(139,92,246,0.5)] ring-4 ring-indigo-500/20",
              status === 'speaking' && "bg-gradient-to-br from-blue-500 to-cyan-600 shadow-[0_0_50px_rgba(59,130,246,0.6)]",
              status === 'error' && "bg-gradient-to-br from-red-700 to-red-900 border-2 border-red-500"
            )}>
              {status === 'recording' && <Mic className="w-8 h-8 text-white animate-bounce" />}
              {status === 'processing' && (
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              )}
              {status === 'speaking' && (
                <div className="flex gap-1 items-end h-8">
                  <div className="w-1.5 bg-white/80 rounded-full animate-[bounce_1s_infinite_0ms] h-3" />
                  <div className="w-1.5 bg-white/80 rounded-full animate-[bounce_1s_infinite_200ms] h-6" />
                  <div className="w-1.5 bg-white/80 rounded-full animate-[bounce_1s_infinite_400ms] h-4" />
                </div>
              )}
              {status === 'error' && <AlertCircle className="w-8 h-8 text-white/90" />}
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-12 text-center h-8">
            <p className={cn(
              "text-lg font-light tracking-wide transition-all duration-300",
              status === 'idle' && "text-slate-400",
              status === 'recording' && "text-red-400 font-medium animate-pulse",
              status === 'processing' && "text-indigo-300 animate-pulse",
              status === 'speaking' && "text-blue-300",
              status === 'error' && "text-red-400"
            )}>
              {status === 'idle' && "Hold the button to speak"}
              {status === 'recording' && "Listening... release to send"}
              {status === 'processing' && "Analyzing your request..."}
              {status === 'speaking' && "Speaking..."}
              {status === 'error' && (errorMessage || "Something went wrong")}
            </p>
          </div>
        </div>

        {/* Conversation History */}
        <div className="w-full max-h-[300px] mb-8 relative">
          <ScrollArea className="h-[250px] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.length === 0 && (
                <div className="text-center py-10 text-slate-600 italic font-light">
                  No conversation yet. Start speaking to get help with your vehicle.
                </div>
              )}
              
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex flex-col max-w-[90%] md:max-w-[80%] rounded-2xl p-4 transition-all duration-500 animate-in slide-in-from-bottom-5 fade-in",
                  msg.type === 'user' 
                    ? "ml-auto bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-br-sm" 
                    : "mr-auto bg-white/5 backdrop-blur-md border border-white/10 text-slate-200 rounded-bl-sm"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      msg.type === 'user' ? "bg-indigo-500/30" : "bg-purple-500/30"
                    )}>
                      {msg.type === 'user' ? <Mic className="w-3.5 h-3.5" /> : <Wrench className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      
                      {msg.issueCategory && (
                        <div className="mt-2 flex gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wider">
                            {msg.issueCategory}
                          </span>
                          {msg.carModel && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 uppercase tracking-wider">
                              {msg.carModel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {msg.type === 'agent' && msg.audioBase64 && (
                    <div className="mt-3 pl-9">
                      <button 
                        onClick={() => replayMessage(msg)}
                        className="text-xs flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors font-medium px-2 py-1 rounded-md hover:bg-indigo-500/10"
                      >
                        <Play className="w-3 h-3" /> Replay Audio
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Invisible spacer for scrolling */}
              <div className="h-4" />
            </div>
          </ScrollArea>
          
          {/* Top/Bottom Fade Gradients for ScrollArea */}
          <div className="absolute top-0 left-0 right-4 h-8 bg-gradient-to-b from-slate-950 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-4 h-8 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />
        </div>

        {/* Action Button */}
        <div className="w-full flex justify-center pb-8">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={(e) => { e.preventDefault(); startRecording(); }}
            onTouchEnd={(e) => { e.preventDefault(); stopRecording(); }}
            disabled={status === 'processing' || status === 'speaking'}
            className={cn(
              "relative group h-20 w-72 rounded-3xl flex items-center justify-center gap-3 font-semibold text-lg transition-all duration-200 select-none shadow-xl",
              status === 'idle' && "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/40 hover:scale-105 active:scale-95",
              status === 'recording' && "bg-red-600 text-white shadow-red-900/40 scale-105",
              (status === 'processing' || status === 'speaking') && "bg-slate-800 text-slate-500 cursor-not-allowed opacity-80",
              status === 'error' && "bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 hover:scale-105 active:scale-95"
            )}
          >
            {/* Button Content */}
            {status === 'idle' && (
              <>
                <Mic className="w-6 h-6" />
                <span>Hold to Speak</span>
              </>
            )}
            {status === 'error' && (
              <>
                <RotateCcw className="w-6 h-6" />
                <span>Try Again</span>
              </>
            )}
            {status === 'recording' && (
              <>
                <Square className="w-6 h-6 fill-current animate-pulse" />
                <span>Release to Send</span>
              </>
            )}
            {status === 'processing' && (
              <>
                <div className="w-5 h-5 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            )}
            {status === 'speaking' && (
              <>
                <div className="flex gap-1 h-4 items-center">
                  <div className="w-1 bg-slate-500 h-full animate-pulse" />
                  <div className="w-1 bg-slate-500 h-2/3 animate-pulse delay-75" />
                  <div className="w-1 bg-slate-500 h-full animate-pulse delay-150" />
                </div>
                <span>Listening...</span>
              </>
            )}
            
            {/* Button Glow on Hover */}
            <div className={cn(
              "absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 blur-lg -z-10",
              status === 'idle' && "group-hover:opacity-40 bg-indigo-500",
              status === 'recording' && "opacity-60 bg-red-500"
            )} />
          </button>
        </div>
      </main>
    </div>
  );
}
