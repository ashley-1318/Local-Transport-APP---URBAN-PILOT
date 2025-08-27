import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/chat-message";

export default function AIChat() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading } = useQuery({
    queryKey: ['/api/chat/history'],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; messageType?: string }) => {
      const response = await apiRequest('POST', '/api/chat', data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Message Failed",
        description: "Unable to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const messageType = detectMessageType(message);
    sendMessageMutation.mutate({ message, messageType });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const detectMessageType = (text: string): string => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('route') || lowerText.includes('reach') || lowerText.includes('go to')) {
      return 'route_request';
    } else if (lowerText.includes('fare') || lowerText.includes('cost') || lowerText.includes('price')) {
      return 'fare_inquiry';
    }
    return 'query';
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [(chatHistory as any)?.messages]);

  const messages = (chatHistory as any)?.messages || [];

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen shadow-2xl relative">
      <div className="h-screen flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-transport-green to-green-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transport-green/20 to-green-600/20 backdrop-blur-sm"></div>
          <Button 
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-3 rounded-xl hover:bg-white/10 text-white interactive-scale relative z-10"
            data-testid="button-back"
          >
            <i className="fas fa-arrow-left"></i>
          </Button>
          <div className="flex items-center space-x-3 relative z-10">
            <div className="w-12 h-12 bg-white/20 glass-effect rounded-full flex items-center justify-center pulse-glow">
              <i className="fas fa-robot text-white text-lg"></i>
            </div>
            <div>
              <h2 className="font-semibold text-white text-lg">AI Assistant</h2>
              <p className="text-xs text-white/90 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse-glow"></div>
                Online • Ready to help
              </p>
            </div>
          </div>
          <Button 
            variant="ghost"
            size="sm"
            className="p-3 rounded-xl hover:bg-white/10 text-white interactive-scale relative z-10"
            data-testid="button-voice-input"
          >
            <i className="fas fa-microphone"></i>
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-slate-50/50 to-white/50 backdrop-blur-sm">
          {isLoading && (
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-transport-green rounded-full animate-pulse"></div>
              <div className="bg-white rounded-xl p-4 max-w-xs">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="flex space-x-3 fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-transport-green to-green-600 rounded-full flex items-center justify-center flex-shrink-0 pulse-glow">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-white/90 glass-effect rounded-2xl rounded-tl-sm p-5 max-w-xs shadow-2xl interactive-lift">
                <p className="text-sm font-medium mb-3">Hi! I'm your AI transport assistant. I can help you with:</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-route text-transport-blue mr-2 w-4"></i>
                    Finding the best routes
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-clock text-auto-amber mr-2 w-4"></i>
                    Real-time delays & alerts
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-coins text-transport-green mr-2 w-4"></i>
                    Fare comparisons
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-microphone text-purple-500 mr-2 w-4"></i>
                    Voice & image queries
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((msg: any) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-white/20 bg-white/90 glass-effect">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost"
              size="sm"
              className="p-3 text-slate-400 hover:text-slate-600 rounded-xl glass-effect interactive-scale"
              data-testid="button-attach-image"
            >
              <i className="fas fa-camera"></i>
            </Button>
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Ask me anything about transport..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendMessageMutation.isPending}
                className="w-full pl-4 pr-14 py-4 bg-white/90 glass-effect rounded-2xl border-0 focus:bg-white focus:ring-2 focus:ring-transport-green shadow-lg text-slate-800 placeholder-slate-500"
                data-testid="input-chat-message"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-transport-green to-green-600 text-white rounded-full flex items-center justify-center disabled:bg-slate-300 interactive-scale pulse-glow"
                data-testid="button-send-message"
              >
                {sendMessageMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-paper-plane text-sm"></i>
                )}
              </Button>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              className="p-3 text-slate-400 hover:text-slate-600 rounded-xl glass-effect interactive-scale"
              data-testid="button-voice-record"
            >
              <i className="fas fa-microphone"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
