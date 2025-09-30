function Settings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <p className="text-gray-600 dark:text-gray-400">User profile management and preferences will be available here.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <p className="text-gray-600 dark:text-gray-400">Notification preferences and reminder settings will be configured here.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Privacy & Security</h2>
          <p className="text-gray-600 dark:text-gray-400">Privacy settings and security options will be managed here.</p>
        </div>
      </div>
    </div>
  )
}

export default Settings