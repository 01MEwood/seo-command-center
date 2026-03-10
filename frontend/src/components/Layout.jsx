import { APP, NAV_ITEMS } from '../config/constants';

export default function Layout({ activeTab, onNav, user, onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <aside className="w-52 bg-gray-950 border-r border-gray-800/50 flex flex-col h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xs font-bold">S</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-xs tracking-tight">{APP.name}</h1>
              <p className="text-gray-600 text-[10px]">{APP.version}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2.5 transition-all mb-0.5 ${
                activeTab === item.id
                  ? 'bg-blue-600/15 text-blue-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-900/50'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-400 text-xs font-medium">{user?.username}</div>
              <div className="text-gray-700 text-[10px]">{user?.role}</div>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-400 text-xs transition-colors"
              title="Ausloggen"
            >
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-52 p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
