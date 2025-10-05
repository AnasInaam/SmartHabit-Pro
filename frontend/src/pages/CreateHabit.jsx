import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { toast } from 'react-hot-toast';
import {
  Target,
  Calendar,
  Clock,
  Bell,
  Zap,
  Palette,
  Save,
  ArrowLeft,
  Dumbbell,
  Book,
  Heart,
  Brain,
  Briefcase,
  Coffee,
  Music,
  Home,
  Users,
  Star,
} from 'lucide-react';

const CATEGORIES = [
  { value: 'health', label: 'Health', icon: Heart },
  { value: 'fitness', label: 'Fitness', icon: Dumbbell },
  { value: 'productivity', label: 'Productivity', icon: Briefcase },
  { value: 'learning', label: 'Learning', icon: Book },
  { value: 'mindfulness', label: 'Mindfulness', icon: Brain },
  { value: 'social', label: 'Social', icon: Users },
  { value: 'creative', label: 'Creative', icon: Music },
  { value: 'home', label: 'Home', icon: Home },
  { value: 'custom', label: 'Custom', icon: Star },
];

const TIME_OPTIONS = [
  { value: 'morning', label: 'Morning (6AM - 12PM)' },
  { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
  { value: 'evening', label: 'Evening (6PM - 12AM)' },
  { value: 'anytime', label: 'Anytime' },
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', xp: 5, description: 'Quick and simple tasks' },
  { value: 'medium', label: 'Medium', xp: 10, description: 'Moderate effort required' },
  { value: 'hard', label: 'Hard', xp: 20, description: 'Challenging and demanding' },
];

const ICONS = [
  { icon: Dumbbell, name: 'dumbbell' },
  { icon: Book, name: 'book' },
  { icon: Heart, name: 'heart' },
  { icon: Brain, name: 'brain' },
  { icon: Briefcase, name: 'briefcase' },
  { icon: Coffee, name: 'coffee' },
  { icon: Music, name: 'music' },
  { icon: Home, name: 'home' },
  { icon: Target, name: 'target' },
  { icon: Star, name: 'star' },
  { icon: Zap, name: 'zap' },
  { icon: Users, name: 'users' },
];

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // orange
  '#10b981', // green
  '#06b6d4', // cyan
  '#ef4444', // red
  '#84cc16', // lime
  '#6366f1', // indigo
  '#f97316', // orange-red
];

const WEEKDAYS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export default function CreateHabit() {
  const navigate = useNavigate();
  const { user } = useUser();
  const createHabit = useMutation(api.habits.createHabit);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    weekDays: [],
    targetGoal: 30,
    timeOfDay: 'anytime',
    reminderEnabled: false,
    reminderTime: '09:00',
    difficulty: 'medium',
    icon: 'target',
    color: '#3b82f6',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    }

    if (formData.frequency === 'weekly' && formData.weekDays.length === 0) {
      newErrors.weekDays = 'Please select at least one day';
    }

    if (formData.targetGoal < 1) {
      newErrors.targetGoal = 'Target goal must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      await createHabit({
        userId: user.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        frequency: formData.frequency,
        weekDays: formData.frequency === 'weekly' ? formData.weekDays : undefined,
        targetGoal: formData.targetGoal,
        timeOfDay: formData.timeOfDay,
        reminderEnabled: formData.reminderEnabled,
        reminderTime: formData.reminderEnabled ? formData.reminderTime : undefined,
        difficulty: formData.difficulty,
        icon: formData.icon,
        color: formData.color,
      });

      toast.success('🎉 Habit created successfully!');
      navigate('/habits');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWeekDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      weekDays: prev.weekDays.includes(day)
        ? prev.weekDays.filter(d => d !== day)
        : [...prev.weekDays, day].sort()
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/habits')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Habits
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Habit
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Build a new habit and start your journey to self-improvement
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Habit Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Habit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Morning Meditation, Read 30 minutes, Workout"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add more details about your habit..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.value })}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                          formData.category === cat.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Frequency & Schedule */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Frequency & Schedule
            </h2>

            <div className="space-y-4">
              {/* Frequency Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  How often?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: 'daily' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      formData.frequency === 'daily'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-medium">Daily</div>
                    <div className="text-xs text-gray-500">Every day</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, frequency: 'weekly' })}
                    className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                      formData.frequency === 'weekly'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="font-medium">Weekly</div>
                    <div className="text-xs text-gray-500">Specific days</div>
                  </button>
                </div>
              </div>

              {/* Week Days (only for weekly) */}
              {formData.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Days <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    {WEEKDAYS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleWeekDayToggle(day.value)}
                        className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                          formData.weekDays.includes(day.value)
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                  {errors.weekDays && (
                    <p className="text-red-500 text-sm mt-1">{errors.weekDays}</p>
                  )}
                </div>
              )}

              {/* Target Goal */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Goal (days)
                </label>
                <input
                  type="number"
                  value={formData.targetGoal}
                  onChange={(e) => setFormData({ ...formData, targetGoal: parseInt(e.target.value) || 0 })}
                  min={1}
                  max={365}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 ${
                    errors.targetGoal ? 'border-red-500' : ''
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Complete this habit {formData.targetGoal} times to reach your goal
                </p>
                {errors.targetGoal && (
                  <p className="text-red-500 text-sm mt-1">{errors.targetGoal}</p>
                )}
              </div>

              {/* Time of Day */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Preferred Time
                </label>
                <select
                  value={formData.timeOfDay}
                  onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                >
                  {TIME_OPTIONS.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Reminder Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Reminder Settings
            </h2>

            <div className="space-y-4">
              {/* Enable Reminder */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Reminders</div>
                  <div className="text-sm text-gray-500">
                    Get notified when it's time to complete your habit
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, reminderEnabled: !formData.reminderEnabled })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    formData.reminderEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      formData.reminderEnabled ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Time */}
              {formData.reminderEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={formData.reminderTime}
                    onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Difficulty & Rewards */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Difficulty & Rewards
            </h2>

            <div>
              <label className="block text-sm font-medium mb-3">
                Select Difficulty Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level.value })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.difficulty === level.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-lg">{level.label}</div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium">
                      +{level.xp} XP
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Personalization */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalization
            </h2>

            <div className="space-y-4">
              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Choose an Icon
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
                  {ICONS.map(({ icon: Icon, name }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.icon === name
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Choose a Color
                </label>
                <div className="flex gap-3">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        formData.color === color
                          ? 'border-gray-900 dark:border-white scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-sm font-medium mb-2">Preview:</div>
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  {React.createElement(
                    ICONS.find(i => i.name === formData.icon)?.icon || Target,
                    { className: 'w-5 h-5' }
                  )}
                  <span className="font-medium">
                    {formData.name || 'Your Habit Name'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/habits')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Habit
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
