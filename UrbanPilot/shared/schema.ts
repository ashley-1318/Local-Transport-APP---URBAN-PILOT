import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transport stops/stations
export const transportStops = pgTable("transport_stops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'bus', 'metro', 'auto', 'taxi'
  address: text("address"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Transport routes
export const transportRoutes = pgTable("transport_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // 'bus', 'metro', 'auto', 'taxi'
  fromStopId: varchar("from_stop_id").references(() => transportStops.id),
  toStopId: varchar("to_stop_id").references(() => transportStops.id),
  duration: integer("duration"), // in minutes
  distance: decimal("distance", { precision: 8, scale: 2 }), // in km
  fare: decimal("fare", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Journey history
export const journeys = pgTable("journeys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  routeData: jsonb("route_data"), // stores route suggestions and selected route
  totalFare: decimal("total_fare", { precision: 8, scale: 2 }),
  totalDuration: integer("total_duration"), // in minutes
  status: varchar("status").default("completed"), // 'planned', 'active', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
});

// Digital tickets
export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: varchar("type").notNull(), // 'single', 'day_pass', 'monthly'
  transportType: varchar("transport_type").notNull(), // 'bus', 'metro'
  fare: decimal("fare", { precision: 8, scale: 2 }).notNull(),
  validFrom: timestamp("valid_from").defaultNow(),
  validUntil: timestamp("valid_until").notNull(),
  qrCode: varchar("qr_code").notNull().unique(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// AI chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response"),
  messageType: varchar("message_type").default("query"), // 'query', 'route_request', 'fare_inquiry'
  createdAt: timestamp("created_at").defaultNow(),
});

// Type exports for Replit Auth
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Other type exports
export type TransportStop = typeof transportStops.$inferSelect;
export type InsertTransportStop = typeof transportStops.$inferInsert;

export type TransportRoute = typeof transportRoutes.$inferSelect;
export type InsertTransportRoute = typeof transportRoutes.$inferInsert;

export type Journey = typeof journeys.$inferSelect;
export type InsertJourney = typeof journeys.$inferInsert;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Insert schemas
export const insertJourneySchema = createInsertSchema(journeys).omit({
  id: true,
  createdAt: true,
});

export const insertTicketSchema = createInsertSchema(tickets).omit({
  id: true,
  createdAt: true,
  qrCode: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
  response: true,
});
