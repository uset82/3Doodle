import { pgTable, text, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (keeping existing structure)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Gallery items table for 3D images
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id).notNull(),
  objectType: varchar("object_type", { length: 50 }).notNull(),
  imageUrl: text("image_url").notNull(),
  created: timestamp("created").defaultNow().notNull(),
});

export const insertGalleryItemSchema = createInsertSchema(galleryItems)
  .omit({ id: true, created: true })
  .extend({
    imageData: z.string().optional(),
  });

export type InsertGalleryItem = z.infer<typeof insertGalleryItemSchema>;
export type GalleryItem = {
  id: string;
  objectType: string;
  imageUrl: string;
  soundUrl?: string;
  created?: string;
};

// Schema for the API request to generate 3D image
export const generateImageSchema = z.object({
  imageData: z.string().min(10, "Image data is required"),
});

export type GenerateImageRequest = z.infer<typeof generateImageSchema>;
