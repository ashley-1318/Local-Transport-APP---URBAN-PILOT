import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import RouteOption from "@/components/route-option";

type RoutePreference = 'fastest' | 'cheapest' | 'safest';

export default function JourneyPlanner() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [fromLocation, setFromLocation] = useState("Downtown, Mumbai");
  const [toLocation, setToLocation] = useState("");
  const [preference, setPreference] = useState<RoutePreference>('fastest');

  const searchRoutesMutation = useMutation({
    mutationFn: async (data: { from: string; to: string; preference: RoutePreference }) => {
      const response = await apiRequest('POST', '/api/routes/search', data);
      return await response.json();
    },
    onSuccess: (data) => {
      console.log('Routes found:', data);
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: "Unable to find routes. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    if (!toLocation.trim()) {
      toast({
        title: "Destination Required",
        description: "Please enter your destination",
        variant: "destructive",
      });
      return;
    }
    
    searchRoutesMutation.mutate({
      from: fromLocation,
      to: toLocation,
      preference
    });
  };

  const handleSwapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSelectRoute = (route: any) => {
    toast({
      title: "Route Selected",
      description: "Starting navigation...",
    });
    setLocation("/");
  };

  const routes = searchRoutesMutation.data?.routes || [];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2 rounded-lg hover:bg-slate-100"
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left text-slate-600"></i>
          </Button>
          <h2 className="font-semibold text-lg">Plan Journey</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleSwapLocations}
            className="p-2 rounded-lg hover:bg-slate-100"
            data-testid="button-swap-locations"
          >
            <i className="fas fa-exchange-alt text-slate-600"></i>
          </Button>
        </div>

        {/* Location inputs */}
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-transport-green rounded-full"></div>
            <Input
              type="text"
              placeholder="From (Current location)"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="flex-1 p-3 bg-slate-100 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-transport-blue"
              data-testid="input-from-location"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-bus-red rounded-full"></div>
            <Input
              type="text"
              placeholder="To (Destination)"
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="flex-1 p-3 bg-slate-100 rounded-xl border-0 focus:bg-white focus:ring-2 focus:ring-transport-blue"
              data-testid="input-to-location"
            />
          </div>

          {/* Travel preferences */}
          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={() => setPreference('fastest')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                preference === 'fastest' 
                  ? 'bg-transport-blue text-white' 
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              data-testid="button-preference-fastest"
            >
              Fastest
            </Button>
            <Button 
              onClick={() => setPreference('cheapest')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                preference === 'cheapest' 
                  ? 'bg-transport-blue text-white' 
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              data-testid="button-preference-cheapest"
            >
              Cheapest
            </Button>
            <Button 
              onClick={() => setPreference('safest')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                preference === 'safest' 
                  ? 'bg-transport-blue text-white' 
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
              data-testid="button-preference-safest"
            >
              Safest
            </Button>
          </div>

          <Button 
            onClick={handleSearch}
            disabled={searchRoutesMutation.isPending}
            className="w-full bg-transport-blue text-white py-3 rounded-xl font-semibold hover:bg-transport-blue/90"
            data-testid="button-search-routes"
          >
            {searchRoutesMutation.isPending ? 'Searching...' : 'Find Routes'}
          </Button>
        </div>

        {/* AI Route Suggestions */}
        <div className="flex-1 overflow-y-auto px-4">
          {searchRoutesMutation.isPending && (
            <div className="space-y-4 pb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-xl p-4 animate-pulse">
                  <div className="h-6 bg-slate-200 rounded mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {routes.length > 0 && (
            <div className="space-y-4 pb-4">
              {routes.map((route: any, index: number) => (
                <RouteOption
                  key={route.id || index}
                  route={route}
                  onSelect={() => handleSelectRoute(route)}
                />
              ))}
            </div>
          )}

          {!searchRoutesMutation.isPending && routes.length === 0 && toLocation && (
            <div className="text-center py-8">
              <i className="fas fa-route text-4xl text-slate-400 mb-4"></i>
              <p className="text-slate-600">No routes found</p>
              <p className="text-sm text-slate-400">Try a different destination</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
