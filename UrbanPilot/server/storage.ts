import {
  users,
  transportStops,
  transportRoutes,
  journeys,
  tickets,
  chatMessages,
  type User,
  type UpsertUser,
  type TransportStop,
  type InsertTransportStop,
  type TransportRoute,
  type InsertTransportRoute,
  type Journey,
  type InsertJourney,
  type Ticket,
  type InsertTicket,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, asc, or, like } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Transport stops
  getNearbyStops(lat: number, lng: number, type?: string): Promise<TransportStop[]>;
  getStopById(id: string): Promise<TransportStop | undefined>;
  createStop(stop: InsertTransportStop): Promise<TransportStop>;

  // Transport routes
  findRoutes(fromLocation: string, toLocation: string): Promise<TransportRoute[]>;
  getRouteById(id: string): Promise<TransportRoute | undefined>;
  createRoute(route: InsertTransportRoute): Promise<TransportRoute>;

  // Journeys
  getUserJourneys(userId: string): Promise<Journey[]>;
  createJourney(journey: InsertJourney): Promise<Journey>;
  updateJourneyStatus(id: string, status: string): Promise<Journey | undefined>;

  // Tickets
  getUserTickets(userId: string): Promise<Ticket[]>;
  getActiveTickets(userId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  useTicket(id: string): Promise<Ticket | undefined>;

  // Chat messages
  getUserChatHistory(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatResponse(id: string, response: string): Promise<ChatMessage | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Transport stops
  async getNearbyStops(lat: number, lng: number, type?: string): Promise<TransportStop[]> {
    let conditions = [eq(transportStops.isActive, true)];
    
    if (type) {
      conditions.push(eq(transportStops.type, type));
    }
    
    // In a real implementation, you'd use PostGIS for distance calculations
    // For now, we'll return all active stops
    return await db.select().from(transportStops)
      .where(and(...conditions))
      .orderBy(asc(transportStops.name));
  }

  async getStopById(id: string): Promise<TransportStop | undefined> {
    const [stop] = await db.select().from(transportStops).where(eq(transportStops.id, id));
    return stop;
  }

  async createStop(stop: InsertTransportStop): Promise<TransportStop> {
    const [newStop] = await db.insert(transportStops).values(stop).returning();
    return newStop;
  }

  // Transport routes
  async findRoutes(fromLocation: string, toLocation: string): Promise<TransportRoute[]> {
    // In a real implementation, this would involve complex route finding algorithms
    // For now, we'll return sample routes based on location names
    return await db.select().from(transportRoutes)
      .where(eq(transportRoutes.isActive, true))
      .orderBy(asc(transportRoutes.duration));
  }

  async getRouteById(id: string): Promise<TransportRoute | undefined> {
    const [route] = await db.select().from(transportRoutes).where(eq(transportRoutes.id, id));
    return route;
  }

  async createRoute(route: InsertTransportRoute): Promise<TransportRoute> {
    const [newRoute] = await db.insert(transportRoutes).values(route).returning();
    return newRoute;
  }

  // Journeys
  async getUserJourneys(userId: string): Promise<Journey[]> {
    return await db.select().from(journeys)
      .where(eq(journeys.userId, userId))
      .orderBy(desc(journeys.createdAt));
  }

  async createJourney(journey: InsertJourney): Promise<Journey> {
    const [newJourney] = await db.insert(journeys).values(journey).returning();
    return newJourney;
  }

  async updateJourneyStatus(id: string, status: string): Promise<Journey | undefined> {
    const [updatedJourney] = await db.update(journeys)
      .set({ status })
      .where(eq(journeys.id, id))
      .returning();
    return updatedJourney;
  }

  // Tickets
  async getUserTickets(userId: string): Promise<Ticket[]> {
    return await db.select().from(tickets)
      .where(eq(tickets.userId, userId))
      .orderBy(desc(tickets.createdAt));
  }

  async getActiveTickets(userId: string): Promise<Ticket[]> {
    const now = new Date();
    return await db.select().from(tickets)
      .where(
        and(
          eq(tickets.userId, userId),
          eq(tickets.isUsed, false),
          gte(tickets.validUntil, now)
        )
      )
      .orderBy(desc(tickets.validFrom));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    // Generate a unique QR code
    const qrCode = `QR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [newTicket] = await db.insert(tickets).values({
      ...ticket,
      qrCode
    }).returning();
    return newTicket;
  }

  async useTicket(id: string): Promise<Ticket | undefined> {
    const [usedTicket] = await db.update(tickets)
      .set({ isUsed: true, usedAt: new Date() })
      .where(eq(tickets.id, id))
      .returning();
    return usedTicket;
  }

  // Chat messages
  async getUserChatHistory(userId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(asc(chatMessages.createdAt))
      .limit(50); // Limit to last 50 messages
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async updateChatResponse(id: string, response: string): Promise<ChatMessage | undefined> {
    const [updatedMessage] = await db.update(chatMessages)
      .set({ response })
      .where(eq(chatMessages.id, id))
      .returning();
    return updatedMessage;
  }
}

export const storage = new DatabaseStorage();
