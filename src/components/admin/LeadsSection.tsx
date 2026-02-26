import React, { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Wrench, RefreshCw, AlertCircle } from "lucide-react";

export function LeadsSection() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAnalytics = useAction(api.actions.processFlow_node_1772031872608_cn05ee5);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: any = await getAnalytics({ input: {} });
      
      // Try multiple paths to get leads data
      const tracked = result?.__vibeflowTracking?.['node_1772031872608_c96ei6d']?.output;
      const directResult = result?.__result;
      
      // The analytics flow might return { totalLeads: ..., leadsByCategory: ... } but not the raw leads list in __result
      // So we prioritize the tracking data for the Fetch Leads node
      const leadsData = tracked || (Array.isArray(directResult) ? directResult : []);
      
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      
      if (!Array.isArray(leadsData) || leadsData.length === 0) {
        console.log("No leads data found in analytics result, checking specific paths");
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Could not load leads data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'contacted': return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
      case 'resolved': return 'bg-green-100 text-green-700 hover:bg-green-100';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Leads Management</h2>
          <p className="text-slate-500 mt-1">Track and manage customer repair requests. (Data from Analytics)</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchLeads} 
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard 
          label="Total Leads" 
          value={leads.length} 
          loading={loading}
          icon={FileText}
        />
        <StatsCard 
          label="New Requests" 
          value={leads.filter(l => l.status === 'New').length} 
          loading={loading}
          icon={AlertCircle}
          color="blue"
        />
        <StatsCard 
          label="Assigned" 
          value={leads.filter(l => l.assignedProviders && l.assignedProviders.length > 0).length} 
          loading={loading}
          icon={Wrench}
          color="green"
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium text-slate-900">Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No leads found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[150px]">Car Model</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="max-w-[400px]">Description</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="text-right">Providers</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads
                  .sort((a, b) => (b._creationTime || 0) - (a._creationTime || 0))
                  .map((lead) => (
                  <TableRow key={lead._id}>
                    <TableCell className="font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {new Date(lead._creationTime).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{lead.carModel || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-slate-600">
                        {lead.issueCategory || "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[400px]">
                      <p className="truncate text-slate-500" title={lead.issueDescription}>
                        {lead.issueDescription}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge className={`font-medium border-0 ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium text-slate-600">
                      {lead.assignedProviders?.length || 0}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({ label, value, loading, icon: Icon, color = "slate" }: any) {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
  };
  
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          {loading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colors[color as keyof typeof colors]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
