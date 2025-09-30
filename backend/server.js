require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');
const cron = require('node-cron');

const User = require('./models/User');
const Habit = require('./models/Habit');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smarthabit', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Utility for generating JWT
const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '7d' });
};

// Signup route
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, passwordHash });
    await user.save();

    const token = generateToken(user);
    res.json({ token, username: user.username, xp: user.xp, level: user.level, streak: user.streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password required' });

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, username: user.username, xp: user.xp, level: user.level, streak: user.streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to protect below routes
app.use('/api', authMiddleware);

// Create a new habit
app.post('/api/habits', async (req, res) => {
  try {
    const user = req.user;
    const { title, description, recurrenceHours, xpPerCompletion } = req.body;

    if (!title || !recurrenceHours || recurrenceHours < 1) {
      return res.status(400).json({ message: 'Title and valid recurrenceHours required' });
    }

    const habit = new Habit({
      user: user._id,
      title,
      description: description || '',
      recurrenceHours,
      xpPerCompletion: xpPerCompletion || 10,
    });
    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all habits for current user
app.get('/api/habits', async (req, res) => {
  try {
    const user = req.user;
    const habits = await Habit.find({ user: user._id });
    res.json(habits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark habit completion
app.post('/api/habits/:habitId/complete', async (req, res) => {
  try {
    const user = req.user;
    const { habitId } = req.params;
    const habit = await Habit.findOne({ _id: habitId, user: user._id });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const now = new Date();

    // Check if this completion is within recurrence period to avoid double count
    if (habit.lastCompletionDate) {
      const diffHours = (now - habit.lastCompletionDate) / (1000 * 60 * 60);
      if (diffHours < habit.recurrenceHours) {
        return res.status(400).json({ message: 'You already completed this habit recently' });
      }
    }

    // Add completion record
    habit.completions.push({ date: now });

    // Update streak logic: if lastCompletionDate was yesterday or within recurrence, increment streak, else reset
    if (habit.lastCompletionDate) {
      const last = habit.lastCompletionDate;
      // We consider streak if last completion was within 1.5x recurrence hours ago
      if ((now - last) / (1000 * 60 * 60) <= habit.recurrenceHours * 1.5) {
        habit.streak += 1;
      } else {
        habit.streak = 1;
      }
    } else {
      habit.streak = 1;
    }
    habit.lastCompletionDate = now;
    await habit.save();

    // Update user XP and level
    user.xp += habit.xpPerCompletion;
    // Level up for every 100 XP
    const newLevel = Math.floor(user.xp / 100) + 1;
    user.level = newLevel;

    // User overall streak as max streak among habits (simple calculation)
    const habits = await Habit.find({ user: user._id });
    let maxStreak = 0;
    habits.forEach(h => {
      if (h.streak > maxStreak) maxStreak = h.streak;
    });
    user.streak = maxStreak;
    await user.save();

    res.json({ message: 'Habit marked as completed', habit, user: { xp: user.xp, level: user.level, streak: user.streak } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dashboard daily habits (to show pending and completed habits)
// We assume completion within recurrence period means habit is done for current slot
app.get('/api/dashboard', async (req, res) => {
  try {
    const user = req.user;
    const habits = await Habit.find({ user: user._id });

    const now = new Date();

    const pending = [];
    const completed = [];

    habits.forEach(habit => {
      let done = false;
      if (habit.lastCompletionDate) {
        // If last completion is within recurrence hours, consider done
        const diff = (now - habit.lastCompletionDate) / (1000 * 60 * 60);
        if (diff < habit.recurrenceHours) {
          done = true;
        }
      }
      if (done) {
        completed.push(habit);
      } else {
        pending.push(habit);
      }
    });

    // Prepare weekly progress data (last 7 days)
    const dailyCompletions = {};
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      dailyCompletions[dayStr] = 0;
    }

    habits.forEach(habit => {
      habit.completions.forEach(comp => {
        const compDay = comp.date.toISOString().slice(0, 10);
        if (compDay in dailyCompletions) {
          dailyCompletions[compDay]++;
        }
      });
    });

    const weeklyData = Object.entries(dailyCompletions).map(([date, count]) => ({ date, count }));

    res.json({
      pending,
      completed,
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      weeklyData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulated notification logic - logs reminder of habits pending every hour
cron.schedule('0 * * * *', async () => {
  console.log(`[Reminder] Checking pending habits for all users at ${new Date().toLocaleString()}`);

  const users = await User.find({});
  for (const user of users) {
    const habits = await Habit.find({ user: user._id });
    const now = new Date();

    habits.forEach(habit => {
      let done = false;
      if (habit.lastCompletionDate) {
        const diff = (now - habit.lastCompletionDate) / (1000 * 60 * 60);
        if (diff < habit.recurrenceHours) {
          done = true;
        }
      }
      if (!done) {
        console.log(` - User: ${user.username}, Habit: ${habit.title} - Reminder: Time to complete!`);
      }
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`SmartHabit backend listening on port ${PORT}`);
});
