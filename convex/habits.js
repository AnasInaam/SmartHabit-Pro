import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user's habits
export const getUserHabits = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

// Create new habit
export const createHabit = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    priority: v.string(),
    color: v.string(),
    icon: v.string(),
    frequency: v.object({
      type: v.string(),
      days: v.optional(v.array(v.number())),
      interval: v.optional(v.number()),
    }),
    xpReward: v.number(),
    targetCount: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("habits", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Complete habit
export const completeHabit = mutation({
  args: {
    userId: v.id("users"),
    habitId: v.id("habits"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error("Habit not found");

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    const existingCompletion = await ctx.db
      .query("completions")
      .withIndex("by_user_and_habit", (q) => 
        q.eq("userId", args.userId).eq("habitId", args.habitId)
      )
      .filter((q) => q.gte(q.field("completedAt"), todayTimestamp))
      .first();

    if (existingCompletion) {
      throw new Error("Habit already completed today");
    }

    // Create completion record
    await ctx.db.insert("completions", {
      userId: args.userId,
      habitId: args.habitId,
      completedAt: Date.now(),
      xpEarned: habit.xpReward,
      notes: args.notes,
    });

    return { xpEarned: habit.xpReward };
  },
});

// Update habit
export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    updates: v.object({
      title: v.optional(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
      priority: v.optional(v.string()),
      color: v.optional(v.string()),
      icon: v.optional(v.string()),
      xpReward: v.optional(v.number()),
      targetCount: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, {
      ...args.updates,
      updatedAt: Date.now(),
    });
  },
});

// Delete habit (soft delete)
export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.habitId, {
      isActive: false,
      updatedAt: Date.now(),
    });
  },
});