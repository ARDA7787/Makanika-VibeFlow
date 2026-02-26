import React, { useEffect, useState, useRef } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Bot, 
  AlertTriangle, 
  Star, 
  MessageSquare, 
  Wrench,
  CheckCircle,
  TrendingUp,
  RefreshCw,
  ArrowRight
} from "lucide-react";

interface OverviewSectionProps {
  setActiveSection: (section: "overview" | "sessions" | "escalations" | "leads" | "providers") => void;
  setSelectedSessionId: (id: string | null) => void;
}

export function OverviewSection({ setActiveSection, setSelectedSessionId }: OverviewSectionProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const getAnalytics = useAction(api.actions.processFlow_node_1772031872608_cn05ee5);

  const fetchData = async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const result: any = await getAnalytics({ input: {} });
      if (result?.__error) {
        setError(`Analytics error: ${result.__error}`);
      } else if (result?.__result) {
        setData(result.__result);
      } else if (result && typeof result === 'object' && 'totalLeads' in result) {
        // Direct result without wrapper
        setData(result);
      } else {
        setError("Failed to load analytics data. Please check your API keys in Convex dashboard settings.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching analytics");
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Analytics Unavailable</h3>
        <p className="mt-2 text-slate-500">{error}</p>
        <Button onClick={fetchData} className="mt-4" variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Real-time metrics and system performance.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchData} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Total Leads" 
          value={data?.totalLeads} 
          loading={loading}
          icon={Wrench}
          color="blue"
          subtitle="Repair requests submitted"
        />
        <KPICard 
          title="AI Conversations" 
          value={data?.totalSessions} 
          loading={loading}
          icon={Bot}
          color="violet"
          subtitle="Total chat sessions"
        />
        <KPICard 
          title="Escalations" 
          value={data?.escalationCount} 
          loading={loading}
          icon={AlertTriangle}
          color="amber"
          subtitle={`${data?.escalationRate || 0}% escalation rate`}
        />
        <KPICard 
          title="Avg Rating" 
          value={data?.avgRating} 
          loading={loading}
          icon={Star}
          color="yellow"
          subtitle="Provider feedback score"
          suffix="/ 5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Secondary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard 
              label="Total Messages" 
              value={data?.totalMessages} 
              loading={loading} 
              icon={MessageSquare}
            />
            <StatsCard 
              label="Active Providers" 
              value={data?.totalProviders} 
              loading={loading} 
              icon={Users}
            />
            <StatsCard 
              label="AI Resolution Rate" 
              value={data ? `${100 - (data.escalationRate || 0)}%` : 0} 
              loading={loading} 
              icon={CheckCircle}
              trend="success"
            />
          </div>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-slate-700">Message Volume (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[200px] w-full" />
              ) : (
                <div className="h-[200px] flex items-end gap-2 sm:gap-4 mt-4">
                  {Object.entries(data?.messagesByDay || {}).map(([day, count]: [string, any], i) => {
                    const max = Math.max(...Object.values(data?.messagesByDay || {}).map((v: any) => Number(v)) as number[], 10);
                    const height = Math.max((Number(count) / max) * 100, 4); // Min 4% height
                    
                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full relative h-full flex items-end">
                          <div 
                            className="w-full bg-indigo-100 rounded-t-sm transition-all duration-500 group-hover:bg-indigo-200 relative"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {count} msgs
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-medium truncate w-full text-center">
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium text-slate-700">Issues by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data?.leadsByCategory || {}).map(([category, count]: [string, any]) => (
                    <Badge 
                      key={category} 
                      variant="secondary" 
                      className="px-3 py-1.5 text-sm font-normal bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200"
                    >
                      {category}
                      <span className="ml-2 font-bold text-slate-900">{count}</span>
                    </Badge>
                  ))}
                  {Object.keys(data?.leadsByCategory || {}).length === 0 && (
                    <p className="text-sm text-slate-400 italic">No leads recorded yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Escalations Feed */}
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-slate-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Recent Escalations
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => setActiveSection("escalations")}
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              <div className="absolute inset-0 overflow-y-auto p-4 space-y-3">
                {loading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)
                ) : (data?.recentEscalations || []).length > 0 ? (
                  (data?.recentEscalations || []).map((esc: any) => (
                    <div 
                      key={esc._id} 
                      className="p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all group cursor-pointer"
                      onClick={() => {
                        setSelectedSessionId(esc.sessionId);
                        setActiveSection("sessions");
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 truncate max-w-[120px]">
                          {esc.sessionId}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(esc.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          Needs Response
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2 opacity-20" />
                    <p className="text-sm text-slate-500">No recent escalations.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, loading, icon: Icon, color, subtitle, suffix }: any) {
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    violet: "bg-violet-50 text-violet-600 border-violet-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-24 mt-2" />
            ) : (
              <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
                {value ?? 0}{suffix && <span className="text-lg text-slate-400 font-normal ml-1">{suffix}</span>}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl border ${colorStyles[color as keyof typeof colorStyles]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatsCard({ label, value, loading, icon: Icon, trend }: any) {
  return (
    <Card className="bg-slate-50 border-slate-100">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`p-2 rounded-lg ${trend === 'success' ? 'bg-green-100 text-green-600' : 'bg-white border text-slate-500'}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{label}</p>
          {loading ? (
            <Skeleton className="h-6 w-16 mt-1" />
          ) : (
            <p className="text-lg font-bold text-slate-900">{value}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
