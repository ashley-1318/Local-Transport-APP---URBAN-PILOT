import { Card, CardContent } from "@/components/ui/card";

interface TransportCardProps {
  type: 'bus' | 'metro' | 'auto' | 'taxi';
  name: string;
  status: string;
  time?: string;
  fare?: number;
  onClick?: () => void;
}

export default function TransportCard({ type, name, status, time, fare, onClick }: TransportCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'bus': return 'fas fa-bus';
      case 'metro': return 'fas fa-subway';
      case 'auto': return 'fas fa-taxi';
      case 'taxi': return 'fas fa-car';
      default: return 'fas fa-route';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'bus': return 'bg-bus-red text-white';
      case 'metro': return 'bg-metro-blue text-white';
      case 'auto': return 'bg-auto-amber text-white';
      case 'taxi': return 'bg-taxi-emerald text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
      data-testid={`transport-card-${type}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${getColor(type)} rounded-full flex items-center justify-center`}>
            <i className={`${getIcon(type)} text-lg`}></i>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold" data-testid={`transport-name-${type}`}>{name}</h3>
            <p className="text-sm text-slate-500" data-testid={`transport-status-${type}`}>{status}</p>
          </div>
          <div className="text-right">
            {time && <p className="text-sm font-medium" data-testid={`transport-time-${type}`}>{time}</p>}
            {fare && <p className="text-xs text-slate-500" data-testid={`transport-fare-${type}`}>₹{fare}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
