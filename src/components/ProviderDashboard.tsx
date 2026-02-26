import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Wrench, Car, ClipboardList, Loader2, Calendar, AlertCircle } from "lucide-react";

export const ProviderDashboard = () => {
  const [providerId, setProviderId] = useState("");
  const [submittedProviderId, setSubmittedProviderId] = useState<string | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLeads = useAction(api.actions.processFlow_node_1772030453405_fd9dht9);

  const handleSearch = async () => {
    if (!providerId.trim()) return;

    setIsLoading(true);
    setError(null);
    setSubmittedProviderId(providerId);
    setLeads([]);

    try {
      const result = await getLeads({ input: { providerId } });
      
      if (result.__error) {
        setError(result.__error);
      } else {
        // The result structure from processFlow is { __result: ... }
        // Based on the action definition, __result contains the filtered leads array
        setLeads(Array.isArray(result.__result) ? result.__result : []);
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setError("Failed to load leads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Provider Dashboard
          </CardTitle>
          <CardDescription>
            View your assigned repair requests and manage your workload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="grid w-full items-center gap-1.5 flex-1">
              <Label htmlFor="provider-id">Your Provider ID</Label>
              <Input
                type="text"
                id="provider-id"
                placeholder="Enter your provider ID..."
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || !providerId.trim()} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load My Leads"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {submittedProviderId && !isLoading && !error && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Assigned Leads ({leads.length})
            </h3>
          </div>

          {leads.length === 0 ? (
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <ClipboardList className="h-10 w-10 mb-3 opacity-20" />
                <p>No active leads assigned to you.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead) => (
                <Card key={lead._id} className="overflow-hidden hover:shadow-md transition-shadow border-muted">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 font-semibold">
                        <Car className="h-4 w-4 text-primary" />
                        <span>{lead.carModel || "Unknown Vehicle"}</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={
                          lead.status === "New" 
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" 
                            : lead.status === "Contacted"
                              ? "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200"
                              : ""
                        }
                      >
                        {lead.status}
                      </Badge>
                    </div>

                    <div className="mb-4">
                      {lead.issueCategory && (
                        <Badge variant="outline" className="mb-2 text-xs font-normal">
                          {lead.issueCategory}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {lead.issueDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        <span>
                          {Array.isArray(lead.assignedProviders) 
                            ? `${lead.assignedProviders.length} Provider${lead.assignedProviders.length !== 1 ? 's' : ''}` 
                            : "1 Provider"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(lead._creationTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
