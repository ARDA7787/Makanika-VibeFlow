import React, { useState, useEffect } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MapPin, 
  Star, 
  Phone, 
  Mail,
  Wrench,
  RefreshCw,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function ProvidersSection() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Use GetNearbyProviders flow to fetch all providers (lat=0, lng=0 returns all sorted by distance from 0)
  const getProviders = useAction(api.actions.processFlow_node_1772029994867_m234cg4);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const result: any = await getProviders({ input: { latitude: 0, longitude: 0 } });
      const data = result?.__result?.Return_Nearby_Providers__w0d0jhe ?? (Array.isArray(result) ? result : []);
      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const filteredProviders = providers.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Provider Network</h2>
          <p className="text-slate-500 mt-1">Manage service partners and ratings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search providers..." 
              className="pl-9 w-[250px] bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchProviders} 
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3"><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-24 w-full" /></CardContent>
              <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <Users className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No Providers Found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <Card key={provider._id} className="overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-2 bg-indigo-500 w-full" />
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold text-slate-900 truncate pr-2">
                    {provider.name}
                  </CardTitle>
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs font-bold text-yellow-700">{provider.rating || "N/A"}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <div className="flex flex-wrap gap-1.5">
                  {(provider.services || []).slice(0, 3).map((service: string, i: number) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-normal text-xs border-slate-200">
                      {service}
                    </Badge>
                  ))}
                  {(provider.services || []).length > 3 && (
                    <Badge variant="secondary" className="bg-slate-50 text-slate-500 font-normal text-xs border-slate-200">
                      +{provider.services.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{provider.address || "No address provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{provider.phone || "No phone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{provider.email || "No email"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button variant="outline" className="w-full text-xs h-9 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors">
                  <Wrench className="h-3.5 w-3.5 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
