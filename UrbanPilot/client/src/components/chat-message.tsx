import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: {
    id: string;
    message: string;
    response?: string;
    messageType?: string;
    createdAt: string;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="space-y-4 slide-up">
      {/* User Message */}
      <div className="flex justify-end space-x-3">
        <div className="bg-gradient-to-r from-transport-blue to-blue-600 text-white rounded-2xl rounded-tr-sm p-4 max-w-xs shadow-lg interactive-lift">
          <p className="text-sm">{message.message}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-transport-blue to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white text-xs font-semibold">U</span>
        </div>
      </div>

      {/* AI Response */}
      {message.response && (
        <>
          <div className="flex space-x-3 fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-transport-green to-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg pulse-glow">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div className="bg-white/90 glass-effect rounded-2xl rounded-tl-sm p-4 max-w-xs shadow-2xl interactive-lift">
              <p className="text-sm text-slate-700">{message.response}</p>
              
              {message.messageType === 'route_request' && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 mt-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-r from-metro-blue to-blue-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-subway text-white text-xs"></i>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">Recommended Route</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mb-1">Metro Line 1 → Bus 42A</p>
                  <p className="text-xs text-transport-green flex items-center">
                    <i className="fas fa-check-circle mr-1"></i>
                    Fastest option available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 px-13 mt-3">
            <Button 
              variant="outline"
              size="sm"
              className="text-xs font-medium bg-white/80 glass-effect border-transport-blue/20 hover:bg-transport-blue hover:text-white interactive-scale rounded-full"
              data-testid="button-book-ticket"
            >
              <i className="fas fa-ticket-alt mr-1 text-xs"></i>
              Book Ticket
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-xs font-medium bg-white/80 glass-effect border-auto-amber/20 hover:bg-auto-amber hover:text-white interactive-scale rounded-full"
              data-testid="button-set-reminder"
            >
              <i className="fas fa-bell mr-1 text-xs"></i>
              Set Reminder
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="text-xs font-medium bg-white/80 glass-effect border-transport-green/20 hover:bg-transport-green hover:text-white interactive-scale rounded-full"
              data-testid="button-share-route"
            >
              <i className="fas fa-share mr-1 text-xs"></i>
              Share Route
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
