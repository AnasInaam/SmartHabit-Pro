function Analytics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Analytics
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Progress Charts</h2>
          <p className="text-gray-600 dark:text-gray-400">Detailed progress charts and visualizations will be displayed here.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive statistics and insights will be shown here.</p>
        </div>
      </div>
    </div>
  )
}

export default Analytics