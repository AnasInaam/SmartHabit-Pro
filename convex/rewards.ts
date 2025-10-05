import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Weekly/Monthly summary report
export const getSummaryReport = query({
  args: { 
    userId: v.id("users"),
    period: v.string() // "week" or "month"
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    const now = Date.now();
    const daysAgo = args.period === "week" ? 7 : 30;
    const startDate = now - (daysAgo * 24 * 60 * 60 * 1000);

    // Get completions for the period
    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_date")
      .filter((q) => 
        q.and(
          q.eq(q.field("userId"), args.userId),
          q.gte(q.field("completedAt"), startDate)
        )
      )
      .collect();

    // Get all user habits
    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const totalCompletions = completions.length;
    const totalXP = completions.reduce((sum, c) => sum + c.xpEarned, 0);
    const uniqueHabitsCompleted = new Set(completions.map(c => c.habitId)).size;
    const averageCompletionsPerDay = totalCompletions / daysAgo;

    // Find best performing habit
    const habitCompletionCount: Record<string, number> = {};
    completions.forEach(c => {
      const id = c.habitId as string;
      habitCompletionCount[id] = (habitCompletionCount[id] || 0) + 1;
    });

    let bestHabit: { name: string; completions: number } | null = null;
    let maxCompletions = 0;
    for (const [habitId, count] of Object.entries(habitCompletionCount)) {
      if (count > maxCompletions) {
        maxCompletions = count;
        try {
          const habit = habits.find(h => h._id === habitId);
          if (habit) {
            bestHabit = { name: habit.name, completions: count };
          }
        } catch (e) {
          console.error("Error finding habit:", e);
        }
      }
    }

    // Calculate streak status
    const hasCompletionToday = completions.some(c => {
      const completedDate = new Date(c.completedAt).toDateString();
      const today = new Date().toDateString();
      return completedDate === today;
    });

    return {
      period: args.period,
      startDate,
      endDate: now,
      totalCompletions,
      totalXP,
      uniqueHabitsCompleted,
      totalHabits: habits.length,
      averageCompletionsPerDay: Math.round(averageCompletionsPerDay * 10) / 10,
      bestHabit,
      currentStreak: user.currentStreak,
      streakMaintained: hasCompletionToday,
      completionRate: habits.length > 0 
        ? Math.round((totalCompletions / (habits.length * daysAgo)) * 100) 
        : 0
    };
  },
});

// Get upcoming achievements (close to unlocking)
export const getUpcomingAchievements = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return [];

    // Get already unlocked achievements
    const unlockedAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const unlockedTypes = new Set(unlockedAchievements.map(a => a.type));

    // Define all possible achievements with progress
    const allAchievements = [
      {
        type: "first_habit",
        title: "Getting Started",
        description: "Create your first habit",
        icon: "🎯",
        xpReward: 50,
        progress: user.totalHabitsCompleted > 0 ? 100 : 0,
        required: 1,
        current: Math.min(user.totalHabitsCompleted, 1)
      },
      {
        type: "streak_3",
        title: "On a Roll",
        description: "Maintain a 3-day streak",
        icon: "🔥",
        xpReward: 100,
        progress: Math.min((user.currentStreak / 3) * 100, 100),
        required: 3,
        current: user.currentStreak
      },
      {
        type: "streak_7",
        title: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "⚔️",
        xpReward: 200,
        progress: Math.min((user.currentStreak / 7) * 100, 100),
        required: 7,
        current: user.currentStreak
      },
      {
        type: "streak_30",
        title: "Month Master",
        description: "Maintain a 30-day streak",
        icon: "👑",
        xpReward: 500,
        progress: Math.min((user.currentStreak / 30) * 100, 100),
        required: 30,
        current: user.currentStreak
      },
      {
        type: "complete_10",
        title: "Consistent",
        description: "Complete 10 habits",
        icon: "✅",
        xpReward: 100,
        progress: Math.min((user.totalHabitsCompleted / 10) * 100, 100),
        required: 10,
        current: user.totalHabitsCompleted
      },
      {
        type: "complete_50",
        title: "Dedicated",
        description: "Complete 50 habits",
        icon: "💪",
        xpReward: 300,
        progress: Math.min((user.totalHabitsCompleted / 50) * 100, 100),
        required: 50,
        current: user.totalHabitsCompleted
      },
      {
        type: "complete_100",
        title: "Unstoppable",
        description: "Complete 100 habits",
        icon: "🚀",
        xpReward: 500,
        progress: Math.min((user.totalHabitsCompleted / 100) * 100, 100),
        required: 100,
        current: user.totalHabitsCompleted
      },
      {
        type: "level_5",
        title: "Rising Star",
        description: "Reach Level 5",
        icon: "⭐",
        xpReward: 200,
        progress: Math.min((user.level / 5) * 100, 100),
        required: 5,
        current: user.level
      },
      {
        type: "level_10",
        title: "Elite Tracker",
        description: "Reach Level 10 (Max Level)",
        icon: "💎",
        xpReward: 1000,
        progress: Math.min((user.level / 10) * 100, 100),
        required: 10,
        current: user.level
      }
    ];

    // Filter out unlocked achievements and sort by progress
    const upcoming = allAchievements
      .filter(a => !unlockedTypes.has(a.type) && a.progress < 100)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5); // Top 5 closest to unlocking

    return upcoming;
  },
});

// Unlock theme customization
export const unlockTheme = mutation({
  args: {
    userId: v.id("users"),
    themeName: v.string()
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // Check if user level is high enough
    const themeRequirements: Record<string, number> = {
      "ocean": 3,
      "sunset": 5,
      "forest": 7,
      "galaxy": 10
    };

    const requiredLevel = themeRequirements[args.themeName] || 1;
    
    if (user.level < requiredLevel) {
      throw new Error(`Level ${requiredLevel} required to unlock this theme`);
    }

    return {
      unlocked: true,
      theme: args.themeName,
      message: `${args.themeName} theme unlocked!`
    };
  },
});
