import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Star, Loader2, ThumbsUp } from "lucide-react";

export function RateProviderForm() {
  const [formData, setFormData] = useState({
    providerId: "",
    userId: "",
    rating: 0,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submitRating = useAction(api.actions.processFlow_node_1772008244900_r5sv0js);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRating = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.providerId || !formData.userId || formData.rating === 0) {
      setError("Please fill in all required fields and provide a rating.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await submitRating({ input: formData });
      setSuccess(true);
      setFormData({ providerId: "", userId: "", rating: 0, comment: "" });
      setHoverRating(0);
    } catch (err) {
      console.error(err);
      setError("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto shadow-lg border-muted/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">Rate a Provider</CardTitle>
        <CardDescription>
          Share your experience to help others find the best service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
            <div className="bg-green-100 p-4 rounded-full">
              <ThumbsUp className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-700">Thank you for your feedback!</h3>
            <p className="text-muted-foreground">Your rating has been submitted successfully.</p>
            <Button variant="outline" onClick={() => setSuccess(false)}>Rate Another Provider</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userId">Your User ID</Label>
              <Input
                id="userId"
                name="userId"
                placeholder="e.g. user_123"
                value={formData.userId}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="providerId">Provider ID</Label>
              <Input
                id="providerId"
                name="providerId"
                placeholder="e.g. mechanic_55"
                value={formData.providerId}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-colors"
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating || formData.rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-transparent text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground font-medium">
                  {formData.rating > 0 ? `${formData.rating} Star${formData.rating > 1 ? 's' : ''}` : "Select a rating"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Comment (Optional)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Tell us more about your experience..."
                className="min-h-[100px]"
                value={formData.comment}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full h-11 text-base" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
