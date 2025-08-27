import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Tickets() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'active' | 'book' | 'history'>('active');

  const { data: activeTicketsData, isLoading: loadingActive } = useQuery({
    queryKey: ['/api/tickets/active'],
  });

  const { data: allTicketsData, isLoading: loadingAll } = useQuery({
    queryKey: ['/api/tickets'],
    enabled: activeTab === 'history',
  });

  const bookTicketMutation = useMutation({
    mutationFn: async (data: { type: string; transportType: string; fare: number; validUntil: string }) => {
      const response = await apiRequest('POST', '/api/tickets', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tickets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/tickets/active'] });
      toast({
        title: "Ticket Booked",
        description: "Your ticket has been successfully booked!",
      });
      setActiveTab('active');
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: "Unable to book ticket. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBookTicket = (type: string, transportType: string, fare: number) => {
    const validUntil = type === 'day_pass' 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 hours for single journey

    bookTicketMutation.mutate({
      type,
      transportType,
      fare,
      validUntil
    });
  };

  const activeTickets = (activeTicketsData as any)?.tickets || [];
  const allTickets = (allTicketsData as any)?.tickets || [];

  // Mock active ticket when no API data
  const mockActiveTicket = activeTickets.length === 0 ? {
    id: 'mock-1',
    type: 'day_pass',
    transportType: 'metro',
    fare: 100,
    validUntil: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    qrCode: 'MOCK_QR_CODE',
    isUsed: false
  } : null;

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
          <h2 className="font-semibold text-lg">Digital Tickets</h2>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab('history')}
            className="p-2 rounded-lg hover:bg-slate-100"
            data-testid="button-history"
          >
            <i className="fas fa-history text-slate-600"></i>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <Button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'active'
                ? 'border-transport-blue text-transport-blue bg-transport-blue/5'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            data-testid="tab-active"
          >
            Active Tickets
          </Button>
          <Button
            onClick={() => setActiveTab('book')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'book'
                ? 'border-transport-blue text-transport-blue bg-transport-blue/5'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            data-testid="tab-book"
          >
            Book New
          </Button>
          <Button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'history'
                ? 'border-transport-blue text-transport-blue bg-transport-blue/5'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
            data-testid="tab-history"
          >
            History
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Active Tickets Tab */}
          {activeTab === 'active' && (
            <div className="p-4">
              {loadingActive && (
                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-xl p-4 animate-pulse h-48"></div>
                </div>
              )}

              {!loadingActive && activeTickets.length === 0 && !mockActiveTicket && (
                <div className="text-center py-12">
                  <i className="fas fa-ticket-alt text-4xl text-slate-400 mb-4"></i>
                  <p className="text-slate-600">No active tickets</p>
                  <p className="text-sm text-slate-400">Book a new ticket to get started</p>
                </div>
              )}

              {/* Show mock ticket or real tickets */}
              {(mockActiveTicket ? [mockActiveTicket] : activeTickets).map((ticket: any) => (
                <Card key={ticket.id} className="bg-gradient-to-r from-metro-blue to-blue-600 text-white mb-4" data-testid={`ticket-${ticket.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <i className={`fas ${ticket.transportType === 'metro' ? 'fa-subway' : 'fa-bus'}`}></i>
                        <span className="font-semibold">
                          {ticket.type === 'day_pass' ? 'Metro Day Pass' : `${ticket.transportType} Ticket`}
                        </span>
                      </div>
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">Valid</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90">Valid until</p>
                        <p className="font-semibold">
                          {new Date(ticket.validUntil).toLocaleDateString()} {new Date(ticket.validUntil).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Fare</p>
                        <p className="font-semibold">₹{ticket.fare}</p>
                      </div>
                    </div>
                    
                    {/* QR Code placeholder */}
                    <div className="bg-white rounded-lg p-4 flex items-center justify-center">
                      <div className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center">
                        <i className="fas fa-qrcode text-slate-400 text-2xl"></i>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Book New Ticket Tab */}
          {activeTab === 'book' && (
            <div className="p-4">
              <h3 className="font-semibold mb-4">Book New Ticket</h3>
              
              <div className="space-y-3">
                {/* Metro tickets */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-metro-blue rounded-full flex items-center justify-center">
                          <i className="fas fa-subway text-white"></i>
                        </div>
                        <div>
                          <p className="font-semibold">Metro Day Pass</p>
                          <p className="text-sm text-slate-500">Unlimited metro rides for 24 hours</p>
                          <p className="text-sm font-medium text-transport-blue">₹100</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookTicket('day_pass', 'metro', 100)}
                        disabled={bookTicketMutation.isPending}
                        className="bg-metro-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-metro-blue/90"
                        data-testid="book-metro-day-pass"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-metro-blue rounded-full flex items-center justify-center">
                          <i className="fas fa-subway text-white"></i>
                        </div>
                        <div>
                          <p className="font-semibold">Metro Single Journey</p>
                          <p className="text-sm text-slate-500">One-way metro ticket</p>
                          <p className="text-sm font-medium text-transport-blue">₹25</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookTicket('single', 'metro', 25)}
                        disabled={bookTicketMutation.isPending}
                        className="bg-metro-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-metro-blue/90"
                        data-testid="book-metro-single"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Bus tickets */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-bus-red rounded-full flex items-center justify-center">
                          <i className="fas fa-bus text-white"></i>
                        </div>
                        <div>
                          <p className="font-semibold">Bus Day Pass</p>
                          <p className="text-sm text-slate-500">Unlimited bus rides for 24 hours</p>
                          <p className="text-sm font-medium text-bus-red">₹80</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookTicket('day_pass', 'bus', 80)}
                        disabled={bookTicketMutation.isPending}
                        className="bg-bus-red text-white px-4 py-2 rounded-lg font-medium hover:bg-bus-red/90"
                        data-testid="book-bus-day-pass"
                      >
                        Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="p-4">
              <h3 className="font-semibold mb-4">Recent Bookings</h3>
              
              {loadingAll && (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-100 rounded-xl p-4 animate-pulse">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-slate-200 rounded w-24"></div>
                            <div className="h-3 bg-slate-200 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-slate-200 rounded w-12"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingAll && allTickets.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-history text-4xl text-slate-400 mb-4"></i>
                  <p className="text-slate-600">No ticket history</p>
                  <p className="text-sm text-slate-400">Your booked tickets will appear here</p>
                </div>
              )}

              <div className="space-y-3">
                {allTickets.map((ticket: any) => (
                  <Card key={ticket.id} className="border border-slate-200" data-testid={`history-ticket-${ticket.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${ticket.isUsed ? 'bg-slate-400' : 'bg-transport-blue'} rounded-full flex items-center justify-center`}>
                            <i className={`fas ${ticket.transportType === 'metro' ? 'fa-subway' : 'fa-bus'} text-white text-sm`}></i>
                          </div>
                          <div>
                            <p className="font-medium">{ticket.type === 'day_pass' ? `${ticket.transportType} Day Pass` : `${ticket.transportType} Single Journey`}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(ticket.createdAt).toLocaleDateString()}, {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{ticket.fare}</p>
                          <p className="text-xs text-slate-500">{ticket.isUsed ? 'Used' : 'Valid'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
