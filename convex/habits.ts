import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new habit
export const createHabit = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    category: v.string(),
    frequency: v.string(),
    weekDays: v.optional(v.array(v.number())),
    targetGoal: v.number(),
    timeOfDay: v.string(),
    reminderEnabled: v.boolean(),
    reminderTime: v.optional(v.string()),
    difficulty: v.string(),
    icon: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    // Calculate XP based on difficulty
    let xpValue = 5; // easy
    if (args.difficulty === "medium") xpValue = 10;
    if (args.difficulty === "hard") xpValue = 20;

    const habitId = await ctx.db.insert("habits", {
      userId: user._id,
      name: args.name,
      description: args.description,
      category: args.category,
      frequency: args.frequency,
      weekDays: args.weekDays,
      targetGoal: args.targetGoal,
      timeOfDay: args.timeOfDay,
      reminderEnabled: args.reminderEnabled,
      reminderTime: args.reminderTime,
      difficulty: args.difficulty,
      xpValue,
      icon: args.icon,
      color: args.color,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      isPaused: false,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return habitId;
  },
});

// Get all habits for a user
export const getUserHabits = query({
  args: { 
    userId: v.string(),
    filter: v.optional(v.string()), // "all", "active", "paused", "completed"
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    let habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Apply filters
    if (args.filter === "active") {
      habits = habits.filter(h => h.isActive && !h.isPaused);
    } else if (args.filter === "paused") {
      habits = habits.filter(h => h.isPaused);
    } else if (args.filter === "completed") {
      habits = habits.filter(h => h.totalCompletions >= h.targetGoal);
    }

    if (args.category && args.category !== "all") {
      habits = habits.filter(h => h.category === args.category);
    }

    // Get today's completions for each habit
    const today = new Date().toISOString().split('T')[0];
    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        const todayCompletion = await ctx.db
          .query("completions")
          .withIndex("by_habit_and_date", (q) => 
            q.eq("habitId", habit._id).eq("dateString", today)
          )
          .first();

        return {
          ...habit,
          completedToday: !!todayCompletion,
        };
      })
    );

    return habitsWithStatus;
  },
});

// Get a single habit by ID
export const getHabit = query({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.habitId);
  },
});

// Update habit
export const updateHabit = mutation({
  args: {
    habitId: v.id("habits"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    frequency: v.optional(v.string()),
    weekDays: v.optional(v.array(v.number())),
    targetGoal: v.optional(v.number()),
    timeOfDay: v.optional(v.string()),
    reminderEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { habitId, ...updates } = args;
    
    // If difficulty changed, recalculate XP
    if (updates.difficulty) {
      let xpValue = 5;
      if (updates.difficulty === "medium") xpValue = 10;
      if (updates.difficulty === "hard") xpValue = 20;
      (updates as any).xpValue = xpValue;
    }

    await ctx.db.patch(habitId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Toggle habit pause state
export const toggleHabitPause = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error("Habit not found");

    await ctx.db.patch(args.habitId, {
      isPaused: !habit.isPaused,
      updatedAt: Date.now(),
    });

    return !habit.isPaused;
  },
});

// Delete habit
export const deleteHabit = mutation({
  args: { habitId: v.id("habits") },
  handler: async (ctx, args) => {
    // Delete all completions for this habit
    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_habit")
      .filter((q) => q.eq(q.field("habitId"), args.habitId))
      .collect();

    for (const completion of completions) {
      await ctx.db.delete(completion._id);
    }

    // Delete the habit
    await ctx.db.delete(args.habitId);
  },
});

// Complete a habit (check-in)
export const completeHabit = mutation({
  args: {
    habitId: v.id("habits"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const habit = await ctx.db.get(args.habitId);
    if (!habit) throw new Error("Habit not found");

    const today = new Date().toISOString().split('T')[0];

    // Check if already completed today
    const existingCompletion = await ctx.db
      .query("completions")
      .withIndex("by_habit_and_date", (q) => 
        q.eq("habitId", args.habitId).eq("dateString", today)
      )
      .first();

    if (existingCompletion) {
      throw new Error("Habit already completed today");
    }

    // Check if streak should continue or reset
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const yesterdayCompletion = await ctx.db
      .query("completions")
      .withIndex("by_habit_and_date", (q) => 
        q.eq("habitId", args.habitId).eq("dateString", yesterday)
      )
      .first();

    const newStreak = yesterdayCompletion ? habit.currentStreak + 1 : 1;
    const newLongestStreak = Math.max(habit.longestStreak, newStreak);

    // Create completion record
    await ctx.db.insert("completions", {
      userId: habit.userId,
      habitId: args.habitId,
      completedAt: Date.now(),
      dateString: today,
      xpEarned: habit.xpValue,
      streakDay: newStreak,
      notes: args.notes,
    });

    // Update habit stats
    await ctx.db.patch(args.habitId, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      totalCompletions: habit.totalCompletions + 1,
      updatedAt: Date.now(),
    });

    // Update user stats
    const user = await ctx.db.get(habit.userId);
    if (user) {
      const newXP = user.xp + habit.xpValue;
      const newLevel = calculateLevel(newXP);

      // Check for streak bonuses
      let bonusXP = 0;
      if (newStreak === 7) bonusXP = 10;
      if (newStreak === 30) bonusXP = 50;
      if (newStreak === 100) bonusXP = 200;

      await ctx.db.patch(habit.userId, {
        xp: newXP + bonusXP,
        level: newLevel,
        totalHabitsCompleted: user.totalHabitsCompleted + 1,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        xpEarned: habit.xpValue + bonusXP,
        newStreak,
        bonusXP,
        leveledUp: newLevel > user.level,
        newLevel,
      };
    }

    return {
      success: true,
      xpEarned: habit.xpValue,
      newStreak,
      bonusXP: 0,
      leveledUp: false,
    };
  },
});

// Get habit completion history
export const getHabitHistory = query({
  args: {
    habitId: v.id("habits"),
    days: v.optional(v.number()), // last N days, default 30
  },
  handler: async (ctx, args) => {
    const days = args.days || 30;
    const startDate = Date.now() - (days * 86400000);

    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_habit")
      .filter((q) => 
        q.and(
          q.eq(q.field("habitId"), args.habitId),
          q.gte(q.field("completedAt"), startDate)
        )
      )
      .collect();

    return completions;
  },
});

// Get today's habits for dashboard
export const getTodaysHabits = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const allHabits = await ctx.db
      .query("habits")
      .withIndex("by_user_and_active", (q) => 
        q.eq("userId", user._id).eq("isActive", true)
      )
      .filter((q) => q.eq(q.field("isPaused"), false))
      .collect();

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const todayString = today.toISOString().split('T')[0];

    // Filter habits that should be done today
    const todaysHabits = allHabits.filter(habit => {
      if (habit.frequency === "daily") return true;
      if (habit.frequency === "weekly" && habit.weekDays) {
        return habit.weekDays.includes(dayOfWeek);
      }
      return false;
    });

    // Check completion status for each
    const habitsWithStatus = await Promise.all(
      todaysHabits.map(async (habit) => {
        const completion = await ctx.db
          .query("completions")
          .withIndex("by_habit_and_date", (q) => 
            q.eq("habitId", habit._id).eq("dateString", todayString)
          )
          .first();

        return {
          ...habit,
          completedToday: !!completion,
        };
      })
    );

    return habitsWithStatus;
  },
});

// Helper function to calculate level from XP
function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 4000) return 6;
  if (xp < 8000) return 7;
  if (xp < 16000) return 8;
  if (xp < 32000) return 9;
  return 10;
}
