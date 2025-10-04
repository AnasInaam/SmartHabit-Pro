import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create user from Clerk - creates or updates user profile
export const createUser = mutation({
  args: {
    userId: v.string(), // Clerk user.id
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        avatar: args.avatar,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user with initial values
    const newUserId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      xp: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      totalHabitsCompleted: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newUserId;
  },
});

// Alias for backward compatibility
export const syncUser = createUser;

// Get user by Clerk user ID
export const getUserByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();
    return user;
  },
});

// Alias for backward compatibility
export const getUserByClerkId = getUserByUserId;

// Get user stats for dashboard
export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    // Calculate level progress
    const xpForNextLevel = calculateXPForLevel(user.level + 1);
    const xpForCurrentLevel = calculateXPForLevel(user.level);
    const levelProgress = ((user.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

    return {
      ...user,
      xpForNextLevel,
      xpForCurrentLevel,
      levelProgress: Math.min(100, Math.max(0, levelProgress)),
    };
  },
});

// Update user XP and level
export const updateUserXP = mutation({
  args: {
    userId: v.id("users"),
    xpToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const newXP = user.xp + args.xpToAdd;
    const newLevel = calculateLevel(newXP);

    await ctx.db.patch(args.userId, {
      xp: newXP,
      level: newLevel,
      updatedAt: Date.now(),
    });

    // Check if user leveled up
    if (newLevel > user.level) {
      return { leveledUp: true, newLevel, newXP };
    }

    return { leveledUp: false, newLevel, newXP };
  },
});

// Update user streak
export const updateUserStreak = mutation({
  args: {
    userId: v.id("users"),
    increment: v.boolean(), // true to increment, false to reset
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    if (args.increment) {
      const newStreak = user.currentStreak + 1;
      const newLongestStreak = Math.max(user.longestStreak, newStreak);

      await ctx.db.patch(args.userId, {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastCheckIn: Date.now(),
        updatedAt: Date.now(),
      });

      return { currentStreak: newStreak, longestStreak: newLongestStreak };
    } else {
      // Reset streak
      await ctx.db.patch(args.userId, {
        currentStreak: 0,
        updatedAt: Date.now(),
      });

      return { currentStreak: 0, longestStreak: user.longestStreak };
    }
  },
});

// Increment total habits completed
export const incrementHabitsCompleted = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      totalHabitsCompleted: user.totalHabitsCompleted + 1,
      updatedAt: Date.now(),
    });
  },
});

// Helper function to calculate level from XP
function calculateLevel(xp: number): number {
  // Level progression: 1: 0-100, 2: 100-250, 3: 250-500, 4: 500-1000, 5: 1000-2000, etc.
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 4000) return 6;
  if (xp < 8000) return 7;
  if (xp < 16000) return 8;
  if (xp < 32000) return 9;
  return 10; // Max level
}

// Helper function to calculate XP required for a specific level
function calculateXPForLevel(level: number): number {
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000];
  return xpThresholds[Math.min(level, xpThresholds.length - 1)];
}
