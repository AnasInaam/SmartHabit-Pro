import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/clerk-react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

// User hooks
export function useCurrentUser() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(
    api.users.getUserByUserId,
    clerkUser?.id ? { userId: clerkUser.id } : "skip"
  );
  return { clerkUser, convexUser };
}

export function useUserStats() {
  const { user } = useUser();
  return useQuery(
    api.users.getUserStats,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useCreateUser() {
  return useMutation(api.users.createUser);
}

// Habit hooks
export function useUserHabits(filter?: string, category?: string) {
  const { user } = useUser();
  return useQuery(
    api.habits.getUserHabits,
    user?.id ? { userId: user.id, filter, category } : "skip"
  );
}

export function useTodaysHabits() {
  const { user } = useUser();
  return useQuery(
    api.habits.getTodaysHabits,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useHabit(habitId: Id<"habits"> | undefined) {
  return useQuery(
    api.habits.getHabit,
    habitId ? { habitId } : "skip"
  );
}

export function useHabitHistory(habitId: Id<"habits"> | undefined, days?: number) {
  return useQuery(
    api.habits.getHabitHistory,
    habitId ? { habitId, days } : "skip"
  );
}

export function useCreateHabit() {
  return useMutation(api.habits.createHabit);
}

export function useUpdateHabit() {
  return useMutation(api.habits.updateHabit);
}

export function useDeleteHabit() {
  return useMutation(api.habits.deleteHabit);
}

export function useToggleHabitPause() {
  return useMutation(api.habits.toggleHabitPause);
}

export function useCompleteHabit() {
  return useMutation(api.habits.completeHabit);
}

// Achievement hooks
export function useUserAchievements() {
  const { user } = useUser();
  return useQuery(
    api.achievements.getUserAchievements,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useAchievementProgress() {
  const { user } = useUser();
  return useQuery(
    api.achievements.getAchievementProgress,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useCheckAchievements() {
  return useMutation(api.achievements.checkAchievements);
}

// Analytics hooks
export function useCompletionStats(days?: number) {
  const { user } = useUser();
  return useQuery(
    api.analytics.getCompletionStats,
    user?.id ? { userId: user.id, days } : "skip"
  );
}

export function useCompletionRateByCategory() {
  const { user } = useUser();
  return useQuery(
    api.analytics.getCompletionRateByCategory,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useStreakAnalysis() {
  const { user } = useUser();
  return useQuery(
    api.analytics.getStreakAnalysis,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useTimeOfDayAnalysis() {
  const { user } = useUser();
  return useQuery(
    api.analytics.getTimeOfDayAnalysis,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useWeeklyProgress() {
  const { user } = useUser();
  return useQuery(
    api.analytics.getWeeklyProgress,
    user?.id ? { userId: user.id } : "skip"
  );
}

export function useBestPerformingHabits(limit?: number) {
  const { user } = useUser();
  return useQuery(
    api.analytics.getBestPerformingHabits,
    user?.id ? { userId: user.id, limit } : "skip"
  );
}
