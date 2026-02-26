import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useConversation } from '@11labs/react';
import { 
  ArrowLeft, 
  Bot, 
  Copy, 
  Sparkles, 
  Mic, 
  Square, 
  Volume2, 
  VolumeX, 
  CheckCircle2,
  ExternalLink,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Play,
  Loader2,
  Terminal,
  Server
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';

const DEFAULT_AGENT_ID = 'agent_5801kjar4nz3eswbs9m3s3qwec92';

const TOOL_SCHEMAS = {
  find_providers: {
    name: "find_providers",
    description: "Find nearby car repair service providers by issue category and optional GPS coordinates. Returns up to 5 matching providers sorted by distance.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Car repair issue category. One of: Engine, Brakes, Electrical, Transmission, Tires, AC/Heating, Bodywork, General"
        },
        latitude: {
          type: "number",
          description: "User's GPS latitude (optional, for distance sorting)"
        },
        longitude: {
          type: "number",
          description: "User's GPS longitude (optional, for distance sorting)"
        }
      },
      required: ["category"]
    }
  },
  get_issue_categories: {
    name: "get_issue_categories",
    description: "Returns the list of available car repair issue categories that can be used with find_providers.",
    parameters: {
      type: "object",
      properties: {}
    }
  },
  get_platform_stats: {
    name: "get_platform_stats",
    description: "Returns platform statistics including total providers, leads, and messages.",
    parameters: {
      type: "object",
      properties: {}
    }
  }
};

const SYSTEM_PROMPT = `You are RepairMatch Voice Assistant, an AI that helps customers with car repair issues.

When users ask about nearby repair shops, service providers, or mechanics, use the find_providers tool with the appropriate issue category.

Available categories: Engine, Brakes, Electrical, Transmission, Tires, AC/Heating, Bodywork, General.

To get all categories, use get_issue_categories.
To get platform statistics, use get_platform_stats.

Always be friendly, concise, and recommend checking provider ratings and distance. Respond in the user's language.`;

export default function ElevenLabsAgentPage() {
  const navigate = useNavigate();
  
  // Agent State
  const [agentId, setAgentId] = useState(() => localStorage.getItem('elevenlabs_agent_id') || DEFAULT_AGENT_ID);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Copy State
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTool, setCopiedTool] = useState<string | null>(null);
  
  // Tester State
  const [testTool, setTestTool] = useState<'find_providers' | 'get_issue_categories' | 'get_platform_stats'>('find_providers');
  const [testCategory, setTestCategory] = useState('Brakes');
  const [testLatitude, setTestLatitude] = useState('');
  const [testLongitude, setTestLongitude] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; data: any; ms: number } | null>(null);

  // Inline Tester State (Step 4)
  const [inlineTestTool, setInlineTestTool] = useState<'find_providers' | 'get_issue_categories' | 'get_platform_stats'>('find_providers');
  const [inlineTestCategory, setInlineTestCategory] = useState('Brakes');
  const [inlineTestLoading, setInlineTestLoading] = useState(false);
  const [inlineTestResult, setInlineTestResult] = useState<{ success: boolean; data: any; ms: number } | null>(null);

  // Expanded Tool Cards State
  const [expandedTool, setExpandedTool] = useState<string | null>('find_providers');

  // ElevenLabs Conversation Hook
  const conversation = useConversation({
    onConnect: () => setStatus('connected'),
    onDisconnect: () => setStatus('idle'),
    onMessage: (message: any) => {
      console.log('Message:', message);
    },
    onError: (error: any) => {
      console.error('Conversation error:', error);
      setErrorMsg(typeof error === 'string' ? error : 'An error occurred with the conversation');
      setStatus('error');
    },
  });
  
  // Handle mute functionality
  useEffect(() => {
    if (status === 'connected') {
      conversation.setVolume({ volume: isMuted ? 0 : 1 });
    }
  }, [isMuted, status, conversation]);

  // Load agent ID from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('elevenlabs_agent_id');
    if (stored) {
      setAgentId(stored);
    } else {
      setAgentId(DEFAULT_AGENT_ID);
      localStorage.setItem('elevenlabs_agent_id', DEFAULT_AGENT_ID);
    }
  }, []);

  // Update localStorage when agent ID changes
  const handleAgentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAgentId(newValue);
    localStorage.setItem('elevenlabs_agent_id', newValue);
  };

  const handleStartConversation = async () => {
    if (!agentId) {
      setErrorMsg('Please enter a valid Agent ID');
      return;
    }
    
    setErrorMsg(null);
    setStatus('connecting');
    
    try {
      await conversation.startSession({ agentId });
    } catch (error) {
      console.error('Failed to start session:', error);
      setStatus('error');
      setErrorMsg('Failed to connect. Check your Agent ID and try again.');
    }
  };

  const handleEndConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const copyToClipboard = (text: string, type: 'url' | 'prompt' | string) => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedTool(type);
      setTimeout(() => setCopiedTool(null), 2000);
    }
  };

  const runWebhookTest = async (
    tool: string, 
    category: string, 
    lat: string, 
    lng: string,
    setLoading: (l: boolean) => void,
    setResult: (r: any) => void
  ) => {
    setLoading(true);
    setResult(null);
    const start = Date.now();
    
    const params: Record<string, any> = {};
    if (tool === 'find_providers') {
      params.category = category;
      if (lat) params.latitude = parseFloat(lat);
      if (lng) params.longitude = parseFloat(lng);
    }
    
    try {
      const res = await fetch('https://original-hound-718.convex.site/elevenlabs-tool-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool_name: tool, parameters: params })
      });
      const data = await res.json();
      setResult({ success: res.ok, data, ms: Date.now() - start });
    } catch (err: any) {
      setResult({ success: false, data: { error: err.message }, ms: Date.now() - start });
    } finally {
      setLoading(false);
    }
  };

  const handleConsoleTest = () => {
    runWebhookTest(testTool, testCategory, testLatitude, testLongitude, setTestLoading, setTestResult);
  };

  const handleInlineTest = () => {
    runWebhookTest(inlineTestTool, inlineTestCategory, '', '', setInlineTestLoading, setInlineTestResult);
  };

  // Status text helper
  const getStatusText = () => {
    if (status === 'error') return errorMsg || 'Connection failed';
    if (status === 'connecting') return 'Connecting to agent...';
    if (status === 'connected') {
      if (conversation.isSpeaking) return 'Agent is speaking...';
      return 'Listening... speak now';
    }
    return 'Enter your Agent ID and click Connect to start';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none z-0" />
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      {/* Top Navigation */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-950/50 backdrop-blur-md sticky top-0">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="text-slate-400 hover:text-white hover:bg-white/5 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <div className="bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-semibold text-white tracking-wide">ElevenLabs Agent</span>
        </div>

        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300",
            status === 'connected' 
              ? "bg-green-950/30 border-green-900/50" 
              : "bg-slate-900/50 border-slate-800"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] transition-colors duration-300",
              status === 'connected' ? "bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-slate-500"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider transition-colors duration-300",
              status === 'connected' ? "text-green-500" : "text-slate-400"
            )}>
              {status === 'connected' ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 p-6 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Panel: Setup & Configuration */}
        <div className="space-y-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 font-bold">1</div>
            <h2 className="text-xl font-semibold text-white">Setup & Configuration</h2>
          </div>

          <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm overflow-hidden flex-1 flex flex-col">
            <ScrollArea className="flex-1 h-[calc(100vh-250px)]">
              <div className="p-6 space-y-8">
                
                {/* Step 1: Agent ID */}
                <section className="space-y-4 relative">
                  <div className="absolute left-[-29px] top-0 bottom-0 w-px bg-slate-800 lg:block hidden"></div>
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full border border-indigo-500/30 flex items-center justify-center text-[10px] bg-indigo-500/10">1</span>
                    Get your Agent ID
                  </div>
                  <div className="pl-2">
                    <p className="text-slate-400 text-sm mb-3">
                      Go to <a href="https://elevenlabs.io/app/conversational-ai" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 hover:underline">elevenlabs.io <ExternalLink className="w-3 h-3" /></a> → Conversational AI → Create Agent.
                    </p>
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-slate-500 uppercase">ElevenLabs Agent ID</label>
                      <Input 
                        value={agentId}
                        onChange={handleAgentIdChange}
                        placeholder="e.g. agent_5801kjar4nz3eswbs9m3s3qwec92"
                        className="bg-slate-950/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500/50 focus:ring-indigo-500/20"
                      />
                      {agentId === DEFAULT_AGENT_ID && (
                        <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Agent configured
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-800/50" />

                {/* Step 2: Webhook Tool */}
                <section className="space-y-4 relative">
                  <div className="absolute left-[-29px] top-0 bottom-0 w-px bg-slate-800 lg:block hidden"></div>
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full border border-indigo-500/30 flex items-center justify-center text-[10px] bg-indigo-500/10">2</span>
                    Configure Webhook Tool
                  </div>
                  <div className="pl-2 space-y-4">
                    <p className="text-slate-400 text-sm">
                      In your ElevenLabs Agent settings → Tools → Add Tool → <span className="text-white font-medium">Server Tool</span> → Method: <span className="text-indigo-300 font-mono">POST</span>
                    </p>
                    
                    <div className="space-y-2">
                      <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3 relative group flex items-center justify-between gap-2">
                        <div className="font-mono text-xs text-indigo-200 break-all">
                          https://original-hound-718.convex.site/elevenlabs-tool-call
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard('https://original-hound-718.convex.site/elevenlabs-tool-call', 'url')}
                          className={cn(
                            "h-8 w-8 text-indigo-400 hover:text-white hover:bg-indigo-500/20 transition-all duration-300 shrink-0",
                            copiedUrl && "text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:text-green-300"
                          )}
                        >
                          {copiedUrl ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-medium text-slate-500 uppercase flex items-center gap-2">
                        <Settings className="w-3 h-3" /> Tool Definitions
                      </h4>
                      <p className="text-xs text-slate-400">Copy these JSON schemas into the tool configuration.</p>
                      
                      <div className="space-y-3">
                        {Object.entries(TOOL_SCHEMAS).map(([key, schema]) => (
                          <div key={key} className="bg-slate-950/50 rounded-xl border border-indigo-500/20 overflow-hidden">
                            <button 
                              onClick={() => setExpandedTool(expandedTool === key ? null : key)}
                              className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-indigo-300 font-medium">{key}</span>
                              </div>
                              {expandedTool === key ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </button>
                            
                            {expandedTool === key && (
                              <div className="p-3 pt-0 border-t border-indigo-500/10">
                                <p className="text-xs text-slate-400 mb-3 mt-3">{schema.description}</p>
                                <div className="relative">
                                  <div className="bg-black/40 border border-slate-800 rounded-lg p-3 overflow-auto max-h-48">
                                    <pre className="text-[10px] font-mono text-green-300 leading-relaxed whitespace-pre-wrap">
                                      {JSON.stringify(schema, null, 2)}
                                    </pre>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(JSON.stringify(schema, null, 2), key)}
                                    className={cn(
                                      "absolute right-2 top-2 h-7 text-xs gap-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700",
                                      copiedTool === key && "text-green-400 border-green-500/30"
                                    )}
                                  >
                                    {copiedTool === key ? (
                                      <>
                                        <CheckCircle2 className="w-3 h-3" /> Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" /> Copy JSON
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-800/50" />

                {/* Step 3: System Prompt */}
                <section className="space-y-4 relative">
                  <div className="absolute left-[-29px] top-0 bottom-0 w-px bg-slate-800 lg:block hidden"></div>
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full border border-indigo-500/30 flex items-center justify-center text-[10px] bg-indigo-500/10">3</span>
                    System Prompt Suggestion
                  </div>
                  <div className="pl-2">
                    <p className="text-slate-400 text-sm mb-3">
                      Copy this prompt into your agent's System Prompt field.
                    </p>
                    <div className="relative">
                      <div className="bg-black/40 border border-slate-800 rounded-lg p-3 overflow-auto max-h-48 font-mono text-xs text-slate-300 whitespace-pre-wrap">
                        {SYSTEM_PROMPT}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => copyToClipboard(SYSTEM_PROMPT, 'prompt')}
                        className={cn(
                          "absolute right-2 top-2 h-7 w-7 text-slate-400 hover:text-white bg-slate-900/50 hover:bg-slate-800",
                          copiedPrompt && "text-green-400"
                        )}
                      >
                        {copiedPrompt ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  </div>
                </section>

                <Separator className="bg-slate-800/50" />

                {/* Step 4: Mini Tester */}
                <section className="space-y-4 relative">
                  <div className="absolute left-[-29px] top-0 bottom-0 w-px bg-slate-800 lg:block hidden"></div>
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full border border-indigo-500/30 flex items-center justify-center text-[10px] bg-indigo-500/10">4</span>
                    Test Your Webhook
                  </div>
                  <div className="pl-2 space-y-3">
                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-3">
                      <div className="flex gap-2">
                        <select 
                          value={inlineTestTool}
                          onChange={(e) => setInlineTestTool(e.target.value as any)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 px-2 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                          <option value="find_providers">find_providers</option>
                          <option value="get_issue_categories">get_issue_categories</option>
                          <option value="get_platform_stats">get_platform_stats</option>
                        </select>
                        {inlineTestTool === 'find_providers' && (
                          <Input 
                            value={inlineTestCategory}
                            onChange={(e) => setInlineTestCategory(e.target.value)}
                            placeholder="Category"
                            className="w-24 h-auto py-1.5 text-xs bg-slate-900 border-slate-700"
                          />
                        )}
                      </div>
                      
                      <Button 
                        onClick={handleInlineTest}
                        disabled={inlineTestLoading}
                        size="sm"
                        className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-500"
                      >
                        {inlineTestLoading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Play className="w-3 h-3 mr-2" />}
                        Test Webhook
                      </Button>

                      {inlineTestResult && (
                        <div className={cn(
                          "rounded text-xs p-2 font-mono overflow-auto max-h-32 border",
                          inlineTestResult.success 
                            ? "bg-green-950/20 border-green-500/20 text-green-300" 
                            : "bg-red-950/20 border-red-500/20 text-red-300"
                        )}>
                          <div className="flex justify-between text-[10px] opacity-70 mb-1">
                            <span>{inlineTestResult.success ? '✓ 200 OK' : '✗ Error'}</span>
                            <span>{inlineTestResult.ms}ms</span>
                          </div>
                          <pre>{JSON.stringify(inlineTestResult.data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col h-full gap-6">
          
          {/* Top: Live Conversation */}
          <div className="flex-1 flex flex-col min-h-[450px]">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center border border-indigo-500 text-white font-bold">2</div>
              <h2 className="text-xl font-semibold text-white">Live Conversation</h2>
            </div>

            <Card className="flex-1 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border-slate-800/60 backdrop-blur-sm relative overflow-hidden flex flex-col items-center justify-center">
              
              {/* Background Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />

              {/* Status Indicator / Orb */}
              <div className="relative mb-12">
                {/* Glow Ring */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-2xl transition-all duration-700",
                  status === 'idle' && "bg-indigo-500/10 scale-90",
                  status === 'connecting' && "bg-indigo-500/20 scale-110 animate-pulse",
                  status === 'connected' && (conversation.isSpeaking ? "bg-cyan-500/30 scale-125" : "bg-green-500/20 scale-100"),
                  status === 'error' && "bg-red-500/20 scale-100"
                )} />

                {/* The Orb Itself */}
                <div className={cn(
                  "relative w-32 h-32 rounded-full shadow-2xl transition-all duration-500 flex items-center justify-center border-4",
                  status === 'idle' && "bg-slate-800 border-slate-700 shadow-inner",
                  status === 'connecting' && "bg-indigo-600/20 border-indigo-500/50 animate-pulse shadow-[0_0_30px_rgba(99,102,241,0.3)]",
                  status === 'connected' && "bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]",
                  status === 'error' && "bg-red-900/20 border-red-500/30"
                )}>
                  {status === 'idle' && <Bot className="w-12 h-12 text-slate-600" />}
                  {status === 'connecting' && <Sparkles className="w-12 h-12 text-indigo-400 animate-spin-slow" />}
                  {status === 'connected' && (
                    <div className="flex gap-1.5 items-end h-10">
                      {/* Audio visualizer simulation */}
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-2 bg-indigo-400 rounded-full transition-all duration-150",
                            conversation.isSpeaking 
                              ? `animate-[bounce_1s_infinite_${i * 100}ms] h-${[4, 8, 10, 8, 4][i]}` 
                              : "h-2 bg-slate-600"
                          )}
                          style={{ height: conversation.isSpeaking ? undefined : '4px' }}
                        />
                      ))}
                    </div>
                  )}
                  {status === 'error' && <AlertCircle className="w-12 h-12 text-red-500" />}
                </div>

                {/* Connection Ring (when connected) */}
                {status === 'connected' && (
                  <div className="absolute inset-[-10px] rounded-full border border-indigo-500/20 animate-[spin_10s_linear_infinite] border-dashed" />
                )}
              </div>

              {/* Status Message */}
              <div className="text-center space-y-2 mb-10 px-6">
                <h3 className={cn(
                  "text-2xl font-light tracking-tight transition-colors duration-300",
                  status === 'connected' ? "text-white" : "text-slate-400"
                )}>
                  {status === 'connected' && conversation.isSpeaking ? 'Agent Speaking' : 
                   status === 'connected' ? 'Listening' : 
                   status === 'connecting' ? 'Connecting' : 'Ready to Connect'}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  {getStatusText()}
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-4 w-full px-8 max-w-sm">
                {status === 'idle' || status === 'error' ? (
                  <Button 
                    size="lg" 
                    className="w-full h-14 rounded-full text-lg font-medium bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
                    onClick={handleStartConversation}
                    disabled={!agentId}
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    Start Conversation
                  </Button>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-14 w-14 rounded-full border-slate-700 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-white hover:border-slate-600 shrink-0"
                      onClick={() => setIsMuted(!isMuted)}
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                    <Button 
                      size="lg" 
                      className="flex-1 h-14 rounded-full text-lg font-medium bg-red-600/90 hover:bg-red-500 text-white shadow-lg shadow-red-900/20 transition-all"
                      onClick={handleEndConversation}
                    >
                      <Square className="w-5 h-5 fill-current mr-2" />
                      End Session
                    </Button>
                  </div>
                )}
                
                {!agentId && status === 'idle' && (
                  <p className="text-xs text-amber-500/80 flex items-center gap-1.5 mt-2">
                    <Info className="w-3 h-3" />
                    Configure Agent ID in the left panel first
                  </p>
                )}
              </div>

            </Card>
          </div>

          {/* Bottom: Webhook Test Console */}
          <div>
             <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-slate-400 font-bold">3</div>
              <h2 className="text-xl font-semibold text-white">Webhook Test Console</h2>
            </div>
            
            <Card className="bg-slate-900/50 border-slate-800/60 backdrop-blur-sm p-5">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-1">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-slate-300">Request Builder</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {Object.keys(TOOL_SCHEMAS).map((tool) => (
                    <button
                      key={tool}
                      onClick={() => {
                        setTestTool(tool as any);
                        setTestResult(null);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                        testTool === tool
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                          : "bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600"
                      )}
                    >
                      {tool}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-950/50 rounded-lg p-4 border border-slate-800 space-y-4">
                  {testTool === 'find_providers' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500">Category</label>
                        <Input 
                          value={testCategory}
                          onChange={(e) => setTestCategory(e.target.value)}
                          placeholder="e.g. Brakes"
                          className="h-9 bg-slate-900 border-slate-700"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-500">Lat (Optional)</label>
                          <Input 
                            value={testLatitude}
                            onChange={(e) => setTestLatitude(e.target.value)}
                            placeholder="0.0"
                            className="h-9 bg-slate-900 border-slate-700"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-slate-500">Lng (Optional)</label>
                          <Input 
                            value={testLongitude}
                            onChange={(e) => setTestLongitude(e.target.value)}
                            placeholder="0.0"
                            className="h-9 bg-slate-900 border-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-16 text-xs text-slate-500 italic border border-dashed border-slate-800 rounded bg-slate-900/30">
                      No parameters required for this tool
                    </div>
                  )}

                  <Button 
                    onClick={handleConsoleTest}
                    disabled={testLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    {testLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending Request...
                      </>
                    ) : (
                      <>
                        <Server className="w-4 h-4 mr-2" /> Send Test Request
                      </>
                    )}
                  </Button>
                </div>

                {testResult && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                          testResult.success 
                            ? "bg-green-500/10 text-green-400 border-green-500/20" 
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {testResult.success ? 'Success' : 'Error'}
                        </div>
                        <span className="text-xs text-slate-500">{testResult.ms}ms</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono">JSON Output</span>
                    </div>
                    
                    <div className="bg-black/40 border border-slate-800 rounded-lg p-3 overflow-auto max-h-48">
                      <pre className={cn(
                        "text-xs font-mono leading-relaxed whitespace-pre-wrap",
                        testResult.success ? "text-green-300" : "text-red-300"
                      )}>
                        {JSON.stringify(testResult.data, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

      </main>
    </div>
  );
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
