const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  recurrenceHours: { type: Number, required: true, min: 1 }, // recurrence interval in hours
  xpPerCompletion: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now },
  completions: [
    {
      date: { type: Date, required: true }, // the date/time the habit was marked completed
    }
  ],
  streak: { type: Number, default: 0 }, // current streak for this habit
  lastCompletionDate: { type: Date, default: null }
});

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
