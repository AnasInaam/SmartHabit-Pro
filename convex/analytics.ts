import { query } from "./_generated/server";
import { v } from "convex/values";

// Get completion statistics for a date range
export const getCompletionStats = query({
  args: {
    userId: v.string(),
    days: v.optional(v.number()), // last N days, default 30
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    const days = args.days || 30;
    const startDate = Date.now() - (days * 86400000);

    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.gte(q.field("completedAt"), startDate)
        )
      )
      .collect();

    // Group by date
    const completionsByDate: { [key: string]: number } = {};
    const xpByDate: { [key: string]: number } = {};

    completions.forEach(completion => {
      const date = completion.dateString;
      completionsByDate[date] = (completionsByDate[date] || 0) + 1;
      xpByDate[date] = (xpByDate[date] || 0) + completion.xpEarned;
    });

    // Fill in missing dates with 0
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 86400000));
      const dateString = date.toISOString().split('T')[0];
      result.push({
        date: dateString,
        completions: completionsByDate[dateString] || 0,
        xp: xpByDate[dateString] || 0,
      });
    }

    return result;
  },
});

// Get habit completion rate by category
export const getCompletionRateByCategory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const categoryStats: { [key: string]: { total: number; completed: number } } = {};

    habits.forEach(habit => {
      if (!categoryStats[habit.category]) {
        categoryStats[habit.category] = { total: 0, completed: 0 };
      }
      categoryStats[habit.category].total += habit.targetGoal;
      categoryStats[habit.category].completed += habit.totalCompletions;
    });

    return Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      rate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      completed: stats.completed,
      total: stats.total,
    }));
  },
});

// Get streak analysis
export const getStreakAnalysis = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return null;

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const activeHabits = habits.filter(h => h.isActive && !h.isPaused);

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      currentStreaks: activeHabits.map(h => ({
        habitName: h.name,
        streak: h.currentStreak,
        longest: h.longestStreak,
      })),
      averageStreak: activeHabits.length > 0 
        ? activeHabits.reduce((sum, h) => sum + h.currentStreak, 0) / activeHabits.length 
        : 0,
      longestOverallStreak: Math.max(...habits.map(h => h.longestStreak), 0),
    };
  },
});

// Get time of day analysis
export const getTimeOfDayAnalysis = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const timeStats: { [key: string]: number } = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      anytime: 0,
    };

    habits.forEach(habit => {
      timeStats[habit.timeOfDay] = (timeStats[habit.timeOfDay] || 0) + habit.totalCompletions;
    });

    return Object.entries(timeStats).map(([time, completions]) => ({
      time,
      completions,
    }));
  },
});

// Get weekly progress
export const getWeeklyProgress = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), user._id),
          q.gte(q.field("completedAt"), startOfWeek.getTime())
        )
      )
      .collect();

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekData = weekDays.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + index);
      const dateString = date.toISOString().split('T')[0];
      
      const dayCompletions = completions.filter(c => c.dateString === dateString);
      
      return {
        day,
        date: dateString,
        completions: dayCompletions.length,
        xp: dayCompletions.reduce((sum, c) => sum + c.xpEarned, 0),
      };
    });

    return weekData;
  },
});

// Get best performing habits
export const getBestPerformingHabits = query({
  args: { 
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const limit = args.limit || 5;

    // Sort by completion rate
    const habitsWithRate = habits.map(habit => ({
      ...habit,
      completionRate: habit.targetGoal > 0 
        ? (habit.totalCompletions / habit.targetGoal) * 100 
        : 0,
    }));

    return habitsWithRate
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, limit);
  },
});
