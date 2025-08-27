import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import StopItem from "@/components/stop-item";

type TransportFilter = 'all' | 'bus' | 'metro' | 'taxi';

export default function NearbyStops() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<TransportFilter>('all');

  // Mock coordinates for Mumbai downtown
  const { data: stopsData, isLoading, refetch } = useQuery({
    queryKey: ['/api/stops/nearby', { lat: '19.0760', lng: '72.8777', type: filter === 'all' ? undefined : filter }],
  });

  const handleRefresh = () => {
    refetch();
  };

  const stops = (stopsData as any)?.stops || [];

  // Mock nearby stops data when no API data is available
  const mockStops = [
    {
      id: '1',
      name: 'Downtown Bus Station',
      type: 'bus',
      address: 'Junction Road, Near Shopping Mall',
      distance: '120m',
      services: [
        { name: 'Bus 42A', time: '2 min', status: 'arriving' },
        { name: 'Bus 15', time: '8 min', status: 'scheduled' },
        { name: 'Bus 23', time: '12 min', status: 'scheduled' }
      ]
    },
    {
      id: '2',
      name: 'Central Metro Station',
      type: 'metro',
      address: 'Line 1 & Line 2 Interchange',
      distance: '300m',
      services: [
        { name: 'Line 1 (Airport)', time: '3 min', status: 'arriving' },
        { name: 'Line 2 (Harbor)', time: '6 min', status: 'scheduled' }
      ]
    },
    {
      id: '3',
      name: 'Taxi Stand',
      type: 'taxi',
      address: 'Main Street Taxi Point',
      distance: '80m',
      services: [
        { name: 'Available Cabs', time: '4 online', status: 'available' }
      ]
    },
    {
      id: '4',
      name: 'Auto Rickshaw Stand',
      type: 'auto',
      address: 'City Center Auto Point',
      distance: '50m',
      services: [
        { name: 'Available Autos', time: '7 waiting', status: 'available' }
      ]
    }
  ];

  const displayStops = stops.length > 0 ? stops : mockStops;
  const filteredStops = filter === 'all' ? displayStops : displayStops.filter((stop: any) => stop.type === filter);

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
          <h2 className="font-semibold text-lg">Nearby Stops</h2>
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="p-2 rounded-lg hover:bg-slate-100"
            data-testid="button-refresh"
          >
            <i className="fas fa-sync text-slate-600"></i>
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex space-x-1 p-4 bg-slate-50">
          <Button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-white text-transport-blue border border-transport-blue' 
                : 'bg-transparent text-slate-600 hover:bg-white'
            }`}
            data-testid="filter-all"
          >
            All
          </Button>
          <Button 
            onClick={() => setFilter('bus')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'bus' 
                ? 'bg-white text-transport-blue border border-transport-blue' 
                : 'bg-transparent text-slate-600 hover:bg-white'
            }`}
            data-testid="filter-bus"
          >
            Bus
          </Button>
          <Button 
            onClick={() => setFilter('metro')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'metro' 
                ? 'bg-white text-transport-blue border border-transport-blue' 
                : 'bg-transparent text-slate-600 hover:bg-white'
            }`}
            data-testid="filter-metro"
          >
            Metro
          </Button>
          <Button 
            onClick={() => setFilter('taxi')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'taxi' 
                ? 'bg-white text-transport-blue border border-transport-blue' 
                : 'bg-transparent text-slate-600 hover:bg-white'
            }`}
            data-testid="filter-taxi"
          >
            Taxi
          </Button>
        </div>

        {/* Nearby locations list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-4 p-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-100 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredStops.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-map-marker-alt text-4xl text-slate-400 mb-4"></i>
              <p className="text-slate-600">No stops found</p>
              <p className="text-sm text-slate-400">Try changing the filter or refreshing</p>
            </div>
          )}

          {filteredStops.map((stop: any) => (
            <StopItem key={stop.id} stop={stop} />
          ))}
        </div>
      </div>
    </div>
  );
}
