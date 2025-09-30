import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// User Queries and Mutations
export const getUser = query({
  args: { kindeId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", args.kindeId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    kindeId: v.string(),
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_kinde_id", (q) => q.eq("kindeId", args.kindeId))
      .first();

    if (existingUser) {
      return existingUser;
    }

    return await ctx.db.insert("users", {
      ...args,
      xp: 0,
      level: 1,
      streak: 0,
      longestStreak: 0,
      totalHabitsCompleted: 0,
      joinedAt: Date.now(),
      preferences: {
        theme: "light",
        notifications: true,
        reminderTime: "09:00",
      },
    });
  },
});

export const updateUserStats = mutation({
  args: {
    userId: v.id("users"),
    xpGained: v.number(),
    streakUpdate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const newXp = user.xp + args.xpGained;
    const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level
    const newStreak = args.streakUpdate ?? user.streak;

    await ctx.db.patch(args.userId, {
      xp: newXp,
      level: newLevel,
      streak: newStreak,
      longestStreak: Math.max(user.longestStreak, newStreak),
      totalHabitsCompleted: user.totalHabitsCompleted + 1,
    });

    return { newXp, newLevel, newStreak };
  },
});