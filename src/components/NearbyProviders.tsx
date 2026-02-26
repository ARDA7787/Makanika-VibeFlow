import { useState, useEffect } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Phone, Mail, Star, Navigation, RefreshCw } from 'lucide-react';

interface Provider {
  _id: string;
  name: string;
  services: string[];
  email: string;
  phone: string;
  address: string;
  rating?: number;
  distance: number;
}

export function NearbyProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  const getNearbyProviders = useAction(api.actions.processFlow_node_1772029994867_m234cg4);

  const fetchProviders = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getNearbyProviders({ input: { latitude: lat, longitude: lng } });
      
      const data = result?.__result?.Return_Nearby_Providers__w0d0jhe ?? result?.__result ?? (Array.isArray(result) ? result : []);
      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch providers:", err);
      setError("Failed to load providers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLocationPermission('denied');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission('granted');
        fetchProviders(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationPermission('denied');
        setLoading(false);
        setError("Location access denied. Please enable location services to find nearby providers.");
      }
    );
  };
  
  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-full overflow-hidden border-muted-foreground/10">
             <Skeleton className="h-3 w-1/3 m-6 mb-2" />
             <div className="px-6 pb-6 space-y-4">
               <Skeleton className="h-4 w-3/4" />
               <div className="flex gap-2">
                 <Skeleton className="h-6 w-16 rounded-full" />
                 <Skeleton className="h-6 w-16 rounded-full" />
               </div>
               <Skeleton className="h-4 w-1/2" />
             </div>
          </Card>
        ))}
      </div>
    );
  }

  if (locationPermission === 'denied' || error) {
    return (
      <Card className="max-w-md mx-auto text-center p-8 border-dashed border-2">
        <CardContent className="pt-0 flex flex-col items-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">{error || "Location Access Needed"}</h3>
          <p className="text-muted-foreground">
            Please enable location services to see repair providers near you.
          </p>
          <Button onClick={requestLocation} variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry Location Access
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (providers.length === 0 && locationPermission === 'granted') {
     return (
      <Card className="max-w-md mx-auto text-center p-8 border-dashed border-2">
        <CardContent className="pt-0 flex flex-col items-center gap-4">
          <div className="bg-muted p-4 rounded-full">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No Providers Found</h3>
          <p className="text-muted-foreground">
            We couldn't find any repair providers in your immediate area.
          </p>
          <Button onClick={requestLocation} variant="outline" className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {providers.map((provider) => (
        <Card key={provider._id} className="h-full hover:shadow-lg transition-all duration-300 border-muted-foreground/10 group bg-card">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">
                  {provider.name}
                </CardTitle>
                <div className="flex items-center gap-1 mt-1.5 text-sm text-muted-foreground">
                   <MapPin className="h-3.5 w-3.5 shrink-0" />
                   <span className="truncate">{provider.address}</span>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 whitespace-nowrap px-2 py-1 shadow-sm">
                <Navigation className="h-3 w-3" />
                {provider.distance.toFixed(1)} km
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {provider.services?.map((service, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-2 py-0.5 text-xs font-medium">
                  {service}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="flex text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
              </div>
              <span className="font-bold text-foreground">{provider.rating?.toFixed(1) || "New"}</span>
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Rating</span>
            </div>
            
            <div className="space-y-2 pt-3 border-t border-border/50">
              {provider.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{provider.email}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
