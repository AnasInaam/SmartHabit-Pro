import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    kindeId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    xp: v.number(),
    level: v.number(),
    streak: v.number(),
    longestStreak: v.number(),
    totalHabitsCompleted: v.number(),
    joinedAt: v.number(),
    preferences: v.object({
      theme: v.string(),
      notifications: v.boolean(),
      reminderTime: v.string(),
    }),
  }).index("by_kinde_id", ["kindeId"]),

  habits: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    priority: v.string(), // high, medium, low
    color: v.string(),
    icon: v.string(),
    frequency: v.object({
      type: v.string(), // daily, weekly, custom
      days: v.optional(v.array(v.number())), // [0,1,2,3,4,5,6] for weekly
      interval: v.optional(v.number()), // for custom intervals
    }),
    xpReward: v.number(),
    targetCount: v.number(), // times per day/week
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  completions: defineTable({
    userId: v.id("users"),
    habitId: v.id("habits"),
    completedAt: v.number(),
    xpEarned: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user_and_habit", ["userId", "habitId"])
    .index("by_date", ["completedAt"]),

  categories: defineTable({
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    isDefault: v.boolean(),
  }),

  achievements: defineTable({
    userId: v.id("users"),
    type: v.string(), // streak, completion, level, etc.
    title: v.string(),
    description: v.string(),
    icon: v.string(),
    xpReward: v.number(),
    unlockedAt: v.number(),
  }).index("by_user", ["userId"]),

  friends: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
    status: v.string(), // pending, accepted, blocked
    createdAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_friend", ["friendId"]),

  challenges: defineTable({
    creatorId: v.id("users"),
    title: v.string(),
    description: v.string(),
    habitType: v.string(),
    duration: v.number(), // days
    xpReward: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    participants: v.array(v.id("users")),
    isPublic: v.boolean(),
    status: v.string(), // active, completed, cancelled
  }).index("by_creator", ["creatorId"])
    .index("by_status", ["status"]),
});