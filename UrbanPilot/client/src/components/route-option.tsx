import { Button } from "@/components/ui/button";

interface RouteStep {
  mode: string;
  line: string;
  from: string;
  to: string;
  duration: number;
  fare: number;
  color: string;
}

interface RouteOptionProps {
  route: {
    id: string;
    type: string;
    duration: number;
    fare: number;
    transfers: number;
    steps: RouteStep[];
    aiRecommended: boolean;
  };
  onSelect: () => void;
}

export default function RouteOption({ route, onSelect }: RouteOptionProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fastest': return 'Fastest Route';
      case 'cheapest': return 'Cheapest Route';
      case 'alternative': return 'Alternative Route';
      default: return 'Route Option';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fastest': return 'fas fa-clock';
      case 'cheapest': return 'fas fa-coins';
      default: return 'fas fa-route';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fastest': return 'text-transport-blue';
      case 'cheapest': return 'text-transport-green';
      default: return 'text-auto-amber';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'metro': return 'fas fa-subway';
      case 'bus': return 'fas fa-bus';
      case 'auto': return 'fas fa-taxi';
      case 'taxi': return 'fas fa-car';
      default: return 'fas fa-route';
    }
  };

  return (
    <div 
      className={`bg-white border rounded-xl p-4 shadow-sm ${
        route.aiRecommended ? 'border-transport-blue' : 'border-slate-200'
      }`}
      data-testid={`route-option-${route.id}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <i className={`${getTypeIcon(route.type)} ${getTypeColor(route.type)}`}></i>
          <span className={`font-semibold ${getTypeColor(route.type)}`}>
            {getTypeLabel(route.type)}
          </span>
          {route.aiRecommended && (
            <span className="bg-transport-blue text-white px-2 py-1 rounded-full text-xs">
              AI Recommended
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">{route.duration} min</p>
          <p className="text-sm text-slate-500">₹{route.fare}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {route.steps.map((step, index) => (
          <div key={index}>
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: step.color }}
              >
                <i className={`${getModeIcon(step.mode)} text-white text-sm`}></i>
              </div>
              <div className="flex-1">
                <p className="font-medium">{step.line}</p>
                <p className="text-sm text-slate-500">
                  {step.from} → {step.to} ({step.duration} min)
                </p>
              </div>
              <span className="text-sm font-medium">₹{step.fare}</span>
            </div>
            
            {index < route.steps.length - 1 && (
              <div className="flex items-center space-x-3 pl-11 py-1">
                <div className="w-2 h-6 border-l-2 border-dashed border-slate-300"></div>
                <p className="text-sm text-slate-500">Walk 3 min to next stop</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button 
        onClick={onSelect}
        className={`w-full mt-4 py-3 rounded-xl font-semibold ${
          route.aiRecommended 
            ? 'bg-transport-blue text-white hover:bg-transport-blue/90' 
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
        }`}
        data-testid={`button-select-route-${route.id}`}
      >
        Select This Route
      </Button>
    </div>
  );
}
