import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation("/journey-planner");
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen shadow-2xl relative">
      <div className="h-screen flex flex-col">
        
        {/* Header */}
        <header className="bg-white/80 glass-effect shadow-lg px-4 py-4 flex items-center justify-between fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-transport-blue to-transport-green rounded-full flex items-center justify-center interactive-scale shadow-lg">
              <span className="text-white font-semibold text-sm" data-testid="text-user-initials">
                {getInitials((user as any)?.firstName, (user as any)?.lastName)}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800" data-testid="text-user-name">
                {(user as any)?.firstName && (user as any)?.lastName ? `${(user as any).firstName} ${(user as any).lastName}` : (user as any)?.email || 'User'}
              </p>
              <p className="text-xs text-slate-500 flex items-center" data-testid="text-location">
                <i className="fas fa-map-marker-alt mr-1 text-transport-green"></i>
                Downtown, Mumbai
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className="p-3 rounded-xl hover:bg-white/50 relative interactive-scale glass-effect"
            data-testid="button-notifications"
          >
            <i className="fas fa-bell text-slate-600"></i>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded-full pulse-glow flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </span>
          </Button>
        </header>

        {/* Search Bar */}
        <div className="px-4 py-4 slide-up">
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <i className="fas fa-search text-slate-400 group-focus-within:text-transport-blue transition-colors"></i>
            </div>
            <Input
              type="text"
              placeholder="Where are you going?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setLocation("/journey-planner")}
              className="w-full pl-12 pr-16 py-4 bg-white/90 glass-effect rounded-2xl border-0 focus:bg-white focus:ring-2 focus:ring-transport-blue shadow-lg interactive-lift text-slate-800 placeholder-slate-500"
              data-testid="input-search-destination"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button
                onClick={handleSearch}
                className="w-8 h-8 bg-gradient-to-r from-transport-blue to-transport-green rounded-full flex items-center justify-center interactive-scale"
              >
                <i className="fas fa-arrow-right text-white text-sm"></i>
              </Button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-200 to-slate-300 mx-4 rounded-3xl shadow-inner overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-300/50 to-slate-400/50 flex items-center justify-center">
            <div className="text-slate-600 text-center fade-in">
              <div className="w-16 h-16 bg-white/20 glass-effect rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
                <i className="fas fa-map text-3xl text-slate-600"></i>
              </div>
              <p className="text-base font-medium">Interactive Map</p>
              <p className="text-sm opacity-75">Real-time transport tracking</p>
            </div>
          </div>
          
          {/* Transport mode floating buttons */}
          <div className="absolute top-6 right-6 space-y-3 slide-up">
            <Button 
              className="w-14 h-14 bg-gradient-to-br from-bus-red to-red-600 text-white rounded-full shadow-2xl hover:shadow-red-500/25 interactive-lift interactive-scale group"
              data-testid="button-filter-bus"
            >
              <i className="fas fa-bus group-hover:scale-110 transition-transform"></i>
            </Button>
            <Button 
              className="w-14 h-14 bg-gradient-to-br from-metro-blue to-blue-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 interactive-lift interactive-scale group"
              data-testid="button-filter-metro"
            >
              <i className="fas fa-subway group-hover:scale-110 transition-transform"></i>
            </Button>
            <Button 
              className="w-14 h-14 bg-gradient-to-br from-auto-amber to-yellow-600 text-white rounded-full shadow-2xl hover:shadow-yellow-500/25 interactive-lift interactive-scale group"
              data-testid="button-filter-auto"
            >
              <i className="fas fa-taxi group-hover:scale-110 transition-transform"></i>
            </Button>
            <Button 
              className="w-14 h-14 bg-gradient-to-br from-taxi-emerald to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/25 interactive-lift interactive-scale group"
              data-testid="button-filter-taxi"
            >
              <i className="fas fa-car group-hover:scale-110 transition-transform"></i>
            </Button>
          </div>

          {/* Current location button */}
          <Button 
            className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 glass-effect rounded-full shadow-2xl hover:shadow-transport-blue/25 interactive-lift interactive-scale group"
            data-testid="button-current-location"
          >
            <i className="fas fa-location-crosshairs text-transport-blue group-hover:scale-110 transition-transform"></i>
          </Button>

          {/* AI Assistant floating button */}
          <Button 
            onClick={() => setLocation("/ai-chat")}
            className="absolute bottom-6 left-6 w-16 h-16 bg-gradient-to-br from-transport-green to-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/30 interactive-lift interactive-scale relative group pulse-glow"
            data-testid="button-ai-assistant"
          >
            <i className="fas fa-robot text-xl group-hover:scale-110 transition-transform"></i>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center pulse-glow">
              <span className="text-white text-xs font-bold">!</span>
            </span>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 glass-effect p-6 mx-4 rounded-t-3xl shadow-2xl slide-up">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-lightning-bolt text-transport-blue mr-2"></i>
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <Button 
              variant="ghost"
              onClick={() => setLocation("/nearby-stops")}
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 h-auto interactive-lift interactive-scale group"
              data-testid="button-nearby-stops"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-transport-blue to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-map-marker-alt text-white text-lg"></i>
              </div>
              <span className="text-xs font-medium text-slate-700">Nearby</span>
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setLocation("/tickets")}
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 h-auto interactive-lift interactive-scale group"
              data-testid="button-tickets"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-transport-green to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-ticket-alt text-white text-lg"></i>
              </div>
              <span className="text-xs font-medium text-slate-700">Tickets</span>
            </Button>
            <Button 
              variant="ghost"
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 h-auto interactive-lift interactive-scale group"
              data-testid="button-schedule"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-auto-amber to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-clock text-white text-lg"></i>
              </div>
              <span className="text-xs font-medium text-slate-700">Schedule</span>
            </Button>
            <Button 
              variant="ghost"
              className="flex flex-col items-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 h-auto interactive-lift interactive-scale group"
              data-testid="button-history"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fas fa-history text-white text-lg"></i>
              </div>
              <span className="text-xs font-medium text-slate-700">History</span>
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white/90 glass-effect border-t border-white/20 px-4 py-3 shadow-2xl">
          <div className="flex justify-around">
            <Button 
              variant="ghost"
              className="flex flex-col items-center space-y-2 p-3 text-transport-blue bg-transport-blue/10 rounded-2xl interactive-scale"
              data-testid="nav-home"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-transport-blue to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-home text-white text-sm"></i>
              </div>
              <span className="text-xs font-medium">Home</span>
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setLocation("/journey-planner")}
              className="flex flex-col items-center space-y-2 p-3 text-slate-500 hover:text-slate-700 rounded-2xl interactive-scale group"
              data-testid="nav-routes"
            >
              <div className="w-8 h-8 bg-slate-100 group-hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <i className="fas fa-route text-sm"></i>
              </div>
              <span className="text-xs font-medium">Routes</span>
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setLocation("/tickets")}
              className="flex flex-col items-center space-y-2 p-3 text-slate-500 hover:text-slate-700 rounded-2xl interactive-scale group"
              data-testid="nav-tickets"
            >
              <div className="w-8 h-8 bg-slate-100 group-hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <i className="fas fa-qrcode text-sm"></i>
              </div>
              <span className="text-xs font-medium">Tickets</span>
            </Button>
            <Button 
              variant="ghost"
              onClick={() => window.location.href = '/api/logout'}
              className="flex flex-col items-center space-y-2 p-3 text-slate-500 hover:text-slate-700 rounded-2xl interactive-scale group"
              data-testid="nav-profile"
            >
              <div className="w-8 h-8 bg-slate-100 group-hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors">
                <i className="fas fa-user text-sm"></i>
              </div>
              <span className="text-xs font-medium">Profile</span>
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}
