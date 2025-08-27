interface StopService {
  name: string;
  time: string;
  status: 'arriving' | 'scheduled' | 'available';
}

interface StopItemProps {
  stop: {
    id: string;
    name: string;
    type: string;
    address: string;
    distance: string;
    services: StopService[];
  };
}

export default function StopItem({ stop }: StopItemProps) {
  const getStopIcon = (type: string) => {
    switch (type) {
      case 'bus': return 'fas fa-bus';
      case 'metro': return 'fas fa-subway';
      case 'taxi': return 'fas fa-taxi';
      case 'auto': return 'fas fa-taxi';
      default: return 'fas fa-map-marker-alt';
    }
  };

  const getStopColor = (type: string) => {
    switch (type) {
      case 'bus': return 'bg-bus-red';
      case 'metro': return 'bg-metro-blue';
      case 'taxi': return 'bg-taxi-emerald';
      case 'auto': return 'bg-auto-amber';
      default: return 'bg-slate-500';
    }
  };

  const getServiceStatus = (status: string) => {
    switch (status) {
      case 'arriving': return 'text-transport-green';
      case 'available': return 'text-transport-green';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="p-4 border-b border-slate-100" data-testid={`stop-${stop.id}`}>
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 ${getStopColor(stop.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
          <i className={`${getStopIcon(stop.type)} text-white`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold" data-testid={`stop-name-${stop.id}`}>{stop.name}</h3>
            <span className="text-sm text-slate-500" data-testid={`stop-distance-${stop.id}`}>{stop.distance}</span>
          </div>
          <p className="text-sm text-slate-500 mb-2" data-testid={`stop-address-${stop.id}`}>{stop.address}</p>
          
          <div className="space-y-1">
            {stop.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium" data-testid={`service-name-${stop.id}-${index}`}>
                  {service.name}
                </span>
                <span 
                  className={`text-sm ${getServiceStatus(service.status)}`}
                  data-testid={`service-time-${stop.id}-${index}`}
                >
                  {service.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
