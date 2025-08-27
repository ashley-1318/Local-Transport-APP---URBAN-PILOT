import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertJourneySchema, insertTicketSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

const routeQuerySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  preference: z.enum(['fastest', 'cheapest', 'safest']).optional().default('fastest')
});

const nearbyStopsSchema = z.object({
  lat: z.string().transform(Number),
  lng: z.string().transform(Number),
  type: z.enum(['bus', 'metro', 'auto', 'taxi']).optional()
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Transport routes API
  app.post('/api/routes/search', isAuthenticated, async (req: any, res) => {
    try {
      const { from, to, preference } = routeQuerySchema.parse(req.body);
      
      // Mock AI route generation based on preference
      const routes = await generateRouteOptions(from, to, preference);
      
      res.json({ routes });
    } catch (error) {
      console.error("Error searching routes:", error);
      res.status(500).json({ message: "Failed to search routes" });
    }
  });

  // Nearby stops API
  app.get('/api/stops/nearby', isAuthenticated, async (req: any, res) => {
    try {
      const { lat, lng, type } = nearbyStopsSchema.parse(req.query);
      
      const stops = await storage.getNearbyStops(lat, lng, type);
      
      res.json({ stops });
    } catch (error) {
      console.error("Error fetching nearby stops:", error);
      res.status(500).json({ message: "Failed to fetch nearby stops" });
    }
  });

  // Journey management
  app.post('/api/journeys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const journeyData = insertJourneySchema.parse({ ...req.body, userId });
      
      const journey = await storage.createJourney(journeyData);
      
      res.json({ journey });
    } catch (error) {
      console.error("Error creating journey:", error);
      res.status(500).json({ message: "Failed to create journey" });
    }
  });

  app.get('/api/journeys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const journeys = await storage.getUserJourneys(userId);
      
      res.json({ journeys });
    } catch (error) {
      console.error("Error fetching journeys:", error);
      res.status(500).json({ message: "Failed to fetch journeys" });
    }
  });

  // Ticket management
  app.post('/api/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketData = insertTicketSchema.parse({ ...req.body, userId });
      
      const ticket = await storage.createTicket(ticketData);
      
      res.json({ ticket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Failed to create ticket" });
    }
  });

  app.get('/api/tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getUserTickets(userId);
      
      res.json({ tickets });
    } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  app.get('/api/tickets/active', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const activeTickets = await storage.getActiveTickets(userId);
      
      res.json({ tickets: activeTickets });
    } catch (error) {
      console.error("Error fetching active tickets:", error);
      res.status(500).json({ message: "Failed to fetch active tickets" });
    }
  });

  app.post('/api/tickets/:id/use', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const ticket = await storage.useTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
      
      res.json({ ticket });
    } catch (error) {
      console.error("Error using ticket:", error);
      res.status(500).json({ message: "Failed to use ticket" });
    }
  });

  // AI Chat API
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({ ...req.body, userId });
      
      const chatMessage = await storage.createChatMessage(messageData);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(messageData.message, messageData.messageType || undefined);
      
      const updatedMessage = await storage.updateChatResponse(chatMessage.id, aiResponse);
      
      res.json({ message: updatedMessage });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messages = await storage.getUserChatHistory(userId);
      
      res.json({ messages });
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// AI response generation functions
async function generateRouteOptions(from: string, to: string, preference: string) {
  // Mock AI route generation
  const baseRoutes = [
    {
      id: "route_1",
      type: "fastest",
      duration: 32,
      fare: 45,
      transfers: 1,
      steps: [
        {
          mode: "metro",
          line: "Metro Line 1",
          from: from,
          to: "Central Station",
          duration: 18,
          fare: 25,
          color: "#3B82F6"
        },
        {
          mode: "bus",
          line: "Bus 42A",
          from: "Central Station",
          to: to,
          duration: 11,
          fare: 20,
          color: "#EF4444"
        }
      ],
      aiRecommended: preference === 'fastest'
    },
    {
      id: "route_2",
      type: "cheapest",
      duration: 48,
      fare: 25,
      transfers: 0,
      steps: [
        {
          mode: "bus",
          line: "Bus 15",
          from: from,
          to: to,
          duration: 48,
          fare: 25,
          color: "#EF4444"
        }
      ],
      aiRecommended: preference === 'cheapest'
    },
    {
      id: "route_3",
      type: "alternative",
      duration: 35,
      fare: 55,
      transfers: 1,
      steps: [
        {
          mode: "auto",
          line: "Auto Rickshaw",
          from: from,
          to: "Metro Station",
          duration: 8,
          fare: 35,
          color: "#F59E0B"
        },
        {
          mode: "metro",
          line: "Metro Line 2",
          from: "Metro Station",
          to: to,
          duration: 27,
          fare: 20,
          color: "#3B82F6"
        }
      ],
      aiRecommended: false
    }
  ];

  // Sort based on preference
  if (preference === 'fastest') {
    return baseRoutes.sort((a, b) => a.duration - b.duration);
  } else if (preference === 'cheapest') {
    return baseRoutes.sort((a, b) => a.fare - b.fare);
  } else {
    return baseRoutes; // 'safest' - keep default order
  }
}

async function generateAIResponse(message: string, messageType?: string): Promise<string> {
  // Mock AI response generation
  const responses = {
    route_request: `Based on current traffic conditions, I recommend taking the Metro Line 1 to Central Station, then Bus 42A to your destination. This route takes about 32 minutes and costs ₹45. You'll arrive 10 minutes early!`,
    fare_inquiry: `The most cost-effective option is Bus 15 for ₹25. If you prefer faster travel, Metro + Bus combination costs ₹45 but saves 16 minutes.`,
    default: `I can help you with route planning, fare comparisons, real-time delays, and transport schedules. What would you like to know?`
  };

  // Simple keyword matching for demo
  if (message.toLowerCase().includes('route') || message.toLowerCase().includes('reach')) {
    return responses.route_request;
  } else if (message.toLowerCase().includes('fare') || message.toLowerCase().includes('cost') || message.toLowerCase().includes('cheap')) {
    return responses.fare_inquiry;
  } else {
    return responses.default;
  }
}
