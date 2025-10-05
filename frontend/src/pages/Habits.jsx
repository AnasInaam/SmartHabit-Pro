import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { toast } from 'react-hot-toast';
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  Trash2,
  Edit2,
  Pause,
  Play,
  Target,
  Calendar,
  Zap,
  TrendingUp,
  CheckCircle2,
  Circle,
  MoreVertical,
  SortAsc,
  SortDesc,
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

const CATEGORY_ICONS = {
  health: Heart,
  fitness: Dumbbell,
  productivity: Briefcase,
  learning: Book,
  mindfulness: Brain,
  social: Users,
  creative: Music,
  home: Home,
  custom: Star,
};

const FILTERS = [
  { value: 'all', label: 'All Habits' },
  { value: 'active', label: 'Active' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'streak', label: 'Streak' },
  { value: 'created', label: 'Date Created' },
  { value: 'xp', label: 'XP Value' },
];

function Habits() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  // Fetch habits with filters
  const habits = useQuery(api.habits.getUserHabits, {
    userId: user?.id,
    filter: filter === 'all' ? undefined : filter,
    category: category === 'all' ? undefined : category,
  });

  const deleteHabit = useMutation(api.habits.deleteHabit);
  const togglePause = useMutation(api.habits.toggleHabitPause);

  // Get unique categories from habits
  const categories = useMemo(() => {
    if (!habits) return [];
    const cats = new Set(habits.map(h => h.category));
    return ['all', ...Array.from(cats)];
  }, [habits]);

  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    if (!habits) return [];

    let filtered = [...habits];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (h.description && h.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'streak':
          aVal = a.currentStreak;
          bVal = b.currentStreak;
          break;
        case 'created':
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        case 'xp':
          aVal = a.xpValue;
          bVal = b.xpValue;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [habits, searchQuery, sortBy, sortOrder]);

  const handleDelete = async (habitId) => {
    if (confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      try {
        await deleteHabit({ habitId });
        toast.success('Habit deleted successfully');
        setShowMenu(null);
      } catch (error) {
        console.error('Error deleting habit:', error);
        toast.error('Failed to delete habit');
      }
    }
  };

  const handleTogglePause = async (habitId) => {
    try {
      const isPaused = await togglePause({ habitId });
      toast.success(isPaused ? 'Habit paused' : 'Habit resumed');
      setShowMenu(null);
    } catch (error) {
      console.error('Error toggling pause:', error);
      toast.error('Failed to update habit');
    }
  };

  const HabitCard = ({ habit }) => {
    const CategoryIcon = CATEGORY_ICONS[habit.category] || Target;
    const completionRate = habit.targetGoal > 0
      ? Math.round((habit.totalCompletions / habit.targetGoal) * 100)
      : 0;

    return (
      <Card className={`p-6 hover:shadow-lg transition-all ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}>
        {/* Icon & Color */}
        <div
          className={`rounded-lg flex items-center justify-center ${
            viewMode === 'list' ? 'w-14 h-14' : 'w-16 h-16 mb-4'
          }`}
          style={{ backgroundColor: habit.color }}
        >
          <CategoryIcon className="w-8 h-8 text-white" />
        </div>

        <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-2">
            <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
              <h3 className="font-semibold text-lg">{habit.name}</h3>
              {habit.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {habit.description}
                </p>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowMenu(showMenu === habit._id ? null : habit._id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMenu === habit._id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 z-10">
                  <button
                    onClick={() => {
                      navigate(`/habits/edit/${habit._id}`);
                      setShowMenu(null);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleTogglePause(habit._id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    {habit.isPaused ? (
                      <>
                        <Play className="w-4 h-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(habit._id)}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              {habit.category}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {habit.frequency}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {habit.difficulty}
            </Badge>
            {habit.isPaused && (
              <Badge variant="warning" className="text-xs">
                Paused
              </Badge>
            )}
            {habit.completedToday && (
              <Badge variant="success" className="text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Done Today
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className={`grid ${viewMode === 'list' ? 'grid-cols-4' : 'grid-cols-2'} gap-4 mb-4`}>
            <div>
              <div className="text-xs text-gray-500">Streak</div>
              <div className="font-semibold text-orange-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {habit.currentStreak} days
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Completions</div>
              <div className="font-semibold">
                {habit.totalCompletions}/{habit.targetGoal}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">XP Value</div>
              <div className="font-semibold text-purple-600 flex items-center gap-1">
                <Zap className="w-4 h-4" />
                {habit.xpValue}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Progress</div>
              <div className="font-semibold text-green-600">
                {completionRate}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(completionRate, 100)}%` }}
            />
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Your Habits
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {habits?.length || 0} habits · {habits?.filter(h => !h.isPaused).length || 0} active
            </p>
          </div>

          <Button
            onClick={() => navigate('/habits/create')}
            className="mt-4 md:mt-0"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Habit
          </Button>
        </div>

        {/* Filters & Controls */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search habits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              {FILTERS.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-700"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
            </button>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg border ${
                  viewMode === 'grid'
                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg border ${
                  viewMode === 'list'
                    ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>

        {/* Habits Grid/List */}
        {!habits ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading habits...</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">
              {searchQuery || filter !== 'all' || category !== 'all'
                ? 'No habits found'
                : 'No habits yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || filter !== 'all' || category !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Create your first habit to start building better routines'}
            </p>
            {!searchQuery && filter === 'all' && category === 'all' && (
              <Button onClick={() => navigate('/habits/create')}>
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Habit
              </Button>
            )}
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredHabits.map(habit => (
              <HabitCard key={habit._id} habit={habit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Habits;