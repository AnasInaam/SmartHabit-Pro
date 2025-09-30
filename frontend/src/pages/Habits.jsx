function Habits() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Habits
      </h1>
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Create New Habit</h2>
          <p className="text-gray-600 dark:text-gray-400">Habit creation form will be implemented here.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Your Habits</h2>
          <p className="text-gray-600 dark:text-gray-400">List of all your habits with CRUD operations will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default Habits