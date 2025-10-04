import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Achievement definitions
type Achievement = {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  requirement: {
    completions?: number;
    streak?: number;
    level?: number;
    count?: number;
    categories?: number;
    timeOfDay?: string;
    allComplete?: number;
  };
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    type: "completion",
    title: "First Step",
    description: "Complete your first habit",
    icon: "👣",
    xpReward: 10,
    requirement: { completions: 1 },
  },
  {
    id: "week_warrior",
    type: "streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak on any habit",
    icon: "🔥",
    xpReward: 25,
    requirement: { streak: 7 },
  },
  {
    id: "month_master",
    type: "streak",
    title: "Month Master",
    description: "Maintain a 30-day streak on any habit",
    icon: "🏆",
    xpReward: 100,
    requirement: { streak: 30 },
  },
  {
    id: "century_club",
    type: "completion",
    title: "Century Club",
    description: "Complete 100 total habits",
    icon: "💯",
    xpReward: 50,
    requirement: { completions: 100 },
  },
  {
    id: "overachiever",
    type: "daily",
    title: "Overachiever",
    description: "Complete all habits for 30 consecutive days",
    icon: "⭐",
    xpReward: 150,
    requirement: { allComplete: 30 },
  },
  {
    id: "early_bird",
    type: "time",
    title: "Early Bird",
    description: "Complete 10 morning habits",
    icon: "🌅",
    xpReward: 30,
    requirement: { timeOfDay: "morning", count: 10 },
  },
  {
    id: "night_owl",
    type: "time",
    title: "Night Owl",
    description: "Complete 10 evening habits",
    icon: "🦉",
    xpReward: 30,
    requirement: { timeOfDay: "evening", count: 10 },
  },
  {
    id: "diversified",
    type: "category",
    title: "Diversified",
    description: "Have active habits in 5+ categories",
    icon: "🌈",
    xpReward: 40,
    requirement: { categories: 5 },
  },
  {
    id: "level_5",
    type: "level",
    title: "Rising Star",
    description: "Reach Level 5",
    icon: "⭐",
    xpReward: 50,
    requirement: { level: 5 },
  },
  {
    id: "level_10",
    type: "level",
    title: "Habit Master",
    description: "Reach Level 10",
    icon: "👑",
    xpReward: 200,
    requirement: { level: 10 },
  },
];

// Get all achievements for a user
export const getUserAchievements = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) return [];

    const unlockedAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Map all achievements with unlock status
    return ACHIEVEMENTS.map(achievement => {
      const unlocked = unlockedAchievements.find(a => a.type === achievement.id);
      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
      };
    });
  },
});

// Check and unlock achievements
export const checkAchievements = mutation({
  args: { 
    userId: v.id("users"),
    eventType: v.string(), // "completion", "streak", "level", etc.
    eventData: v.any(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return [];

    const habits = await ctx.db
      .query("habits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const completions = await ctx.db
      .query("completions")
      .withIndex("by_user_and_habit")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const existingAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENTS) {
      // Skip if already unlocked
      if (existingAchievements.some(a => a.type === achievement.id)) {
        continue;
      }

      let shouldUnlock = false;

      switch (achievement.type) {
        case "completion":
          if (achievement.requirement.completions && 
              user.totalHabitsCompleted >= achievement.requirement.completions) {
            shouldUnlock = true;
          }
          break;

        case "streak":
          const maxStreak = Math.max(...habits.map(h => h.currentStreak), 0);
          if (achievement.requirement.streak && 
              maxStreak >= achievement.requirement.streak) {
            shouldUnlock = true;
          }
          break;

        case "level":
          if (achievement.requirement.level && 
              user.level >= achievement.requirement.level) {
            shouldUnlock = true;
          }
          break;

        case "time":
          const timeCompletions = habits
            .filter(h => h.timeOfDay === achievement.requirement.timeOfDay)
            .reduce((sum, h) => sum + h.totalCompletions, 0);
          if (achievement.requirement.count && 
              timeCompletions >= achievement.requirement.count) {
            shouldUnlock = true;
          }
          break;

        case "category":
          const uniqueCategories = new Set(
            habits.filter(h => h.isActive).map(h => h.category)
          );
          if (achievement.requirement.categories && 
              uniqueCategories.size >= achievement.requirement.categories) {
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock) {
        const achievementId = await ctx.db.insert("achievements", {
          userId: args.userId,
          type: achievement.id,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          xpReward: achievement.xpReward,
          unlockedAt: Date.now(),
        });

        // Award XP for achievement
        await ctx.db.patch(args.userId, {
          xp: user.xp + achievement.xpReward,
          updatedAt: Date.now(),
        });

        newlyUnlocked.push({
          ...achievement,
          _id: achievementId,
        });
      }
    }

    return newlyUnlocked;
  },
});

// Get achievement progress
export const getAchievementProgress = query({
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

    const existingAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return ACHIEVEMENTS.map(achievement => {
      const unlocked = existingAchievements.find(a => a.type === achievement.id);
      let progress = 0;
      let total = 1;

      if (!unlocked) {
        switch (achievement.type) {
          case "completion":
            progress = user.totalHabitsCompleted;
            total = achievement.requirement.completions || 1;
            break;

          case "streak":
            progress = Math.max(...habits.map(h => h.currentStreak), 0);
            total = achievement.requirement.streak || 1;
            break;

          case "level":
            progress = user.level;
            total = achievement.requirement.level || 1;
            break;

          case "time":
            progress = habits
              .filter(h => h.timeOfDay === achievement.requirement.timeOfDay)
              .reduce((sum, h) => sum + h.totalCompletions, 0);
            total = achievement.requirement.count || 1;
            break;

          case "category":
            progress = new Set(habits.filter(h => h.isActive).map(h => h.category)).size;
            total = achievement.requirement.categories || 1;
            break;
        }
      } else {
        progress = total;
      }

      return {
        ...achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        progress: Math.min(progress, total),
        total,
        percentage: Math.min(100, (progress / total) * 100),
      };
    });
  },
});
