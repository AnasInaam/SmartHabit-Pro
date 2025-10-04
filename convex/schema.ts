import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Clerk user.id
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    xp: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalHabitsCompleted: v.number(),
    lastCheckIn: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_email", ["email"]),

  habits: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    frequency: v.string(), // "daily", "weekly", "monthly"
    weekDays: v.optional(v.array(v.number())), // [0-6] for weekly habits
    targetGoal: v.number(), // target days/completions
    timeOfDay: v.string(), // "morning", "afternoon", "evening", "anytime"
    reminderEnabled: v.boolean(),
    reminderTime: v.optional(v.string()),
    difficulty: v.string(), // "easy", "medium", "hard"
    xpValue: v.number(), // 5, 10, or 20 based on difficulty
    icon: v.string(),
    color: v.string(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalCompletions: v.number(),
    isPaused: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_active", ["userId", "isActive"]),

  completions: defineTable({
    userId: v.id("users"),
    habitId: v.id("habits"),
    completedAt: v.number(),
    dateString: v.string(), // "YYYY-MM-DD" for easy date queries
    xpEarned: v.number(),
    streakDay: v.number(), // day number in the streak when completed
    notes: v.optional(v.string()),
  }).index("by_user_and_habit", ["userId", "habitId"])
    .index("by_habit_and_date", ["habitId", "dateString"])
    .index("by_user_and_date", ["userId", "dateString"])
    .index("by_date", ["completedAt"]),

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