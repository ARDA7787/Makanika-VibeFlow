import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";

export function SubmitIssueForm() {
  const [formData, setFormData] = useState({
    userId: "",
    carModel: "",
    issueDescription: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [matchedProviders, setMatchedProviders] = useState<any[]>([]);

  const submitIssue = useAction(api.actions.processFlow_node_1772008244900_r2444c6);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.issueDescription || !formData.address) {
      setError("Please fill in all required fields including your address");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);
    setMatchedProviders([]);

    try {
      const result = await submitIssue({ input: formData });
      
      if (result?.__error) {
        setError(`Submission failed: ${result.__error}`);
        setSuccess(false);
        return;
      }
      
      setSuccess(true);
      
      const resultData = result?.__result ?? result;
      // The loop result (last return) is an array of provider items from the for loop
      const providers = Array.isArray(resultData) ? resultData :
        result?.__vibeflowTracking?.['node_1772008668144_dnuijlt']?.output ?? 
        result?.__vibeflowTracking?.['node_1772008668144_4vbxmfg']?.input ?? 
        [];
      setMatchedProviders(Array.isArray(providers) ? providers : []);

      setFormData(prev => ({  
        ...prev, 
        userId: "", 
        carModel: "", 
        issueDescription: "",
        address: ""
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/40">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-2xl font-bold text-primary">Submit a Repair Issue</CardTitle>
                <CardDescription>
                Describe your car problem and we'll match you with the best providers nearby.
                </CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="userId">Your Name (ID)</Label>
            <Input
              id="userId"
              name="userId"
              placeholder="e.g. John Doe"
              value={formData.userId}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            </div>
            
          <div className="space-y-2">
            <Label htmlFor="address">Your Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="e.g. 123 Main St, Los Angeles, CA"
              value={formData.address}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              We'll use your address to find the nearest repair providers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDescription">Describe the Issue</Label>
            <Textarea
              id="issueDescription"
              name="issueDescription"
              placeholder="Describe your car issue in your own words (e.g., 'My 2019 Toyota Camry makes a grinding noise when braking at low speeds')"
              className="min-h-[120px]"
              value={formData.issueDescription}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            <p className="text-sm text-muted-foreground">
              Our AI will automatically extract your car model and issue details.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="carModel">Car Model (optional — AI will detect automatically)</Label>
            <Input
              id="carModel"
              name="carModel"
              placeholder="e.g. 2018 Toyota Camry"
              value={formData.carModel}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-green-600 font-medium bg-green-50 p-3 rounded-md border border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                Your request has been submitted! Matched providers have been notified by email.
                </div>
                
                {matchedProviders.length > 0 ? (
                    <div className="space-y-3 pt-2">
                        <h4 className="font-medium text-sm">Matched Nearby Providers:</h4>
                        <div className="grid gap-3">
                            {matchedProviders.map((provider: any) => (
                                <div key={provider._id} className="p-3 border rounded-md bg-muted/20 text-sm">
                                    <div className="font-semibold">{provider.name}</div>
                                    <div className="text-muted-foreground">{provider.email}</div>
                                    {provider.distance !== undefined && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Approx. {typeof provider.distance === 'number' ? provider.distance.toFixed(1) : provider.distance} km away
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-3 text-sm text-muted-foreground bg-muted/10 rounded-md">
                        No nearby providers found for this issue type yet.
                    </div>
                )}
            </div>
          )}
          
          <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Find Repair Help"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
