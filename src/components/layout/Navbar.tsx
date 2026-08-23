import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Moon, 
  Sun, 
  Bell, 
  Timer, 
  Menu, 
  Search, 
  Zap, 
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { 
    profile, 
    theme, 
    toggleTheme, 
    gamification, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    setActiveTab, 
    openTimer 
  } = useStudy();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] px-4 md:px-8 backdrop-blur-md transition-colors">
      {/* Left: Mobile Toggle & Brand/Search */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-md">
        <button
          id="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global Quick Search Shortcut */}
        <div className="relative w-full max-w-xs hidden sm:flex items-center bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Ask AI anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right: Status Badges, Streak, Level, Timer, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Streak Badge */}
        <button 
          id="streak-indicator-btn"
          onClick={() => setActiveTab('achievements')}
          className="flex items-center gap-1.5 text-orange-500 font-bold text-xs sm:text-sm hover:opacity-80 transition"
          title="Daily Study Streak"
        >
          <Flame className="h-4 w-4 fill-orange-500 text-orange-500" />
          <span className="text-slate-800 dark:text-slate-200">{gamification.currentStreak} Day Streak</span>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* XP Level Badge */}
        <button
          id="xp-level-btn"
          onClick={() => setActiveTab('achievements')}
          className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-3 py-1.5 rounded-full hover:scale-105 transition"
          title={`Level ${gamification.level} ${gamification.levelTitle}`}
        >
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs">Level {gamification.level}</span>
          <span className="text-slate-400 text-[11px]">{gamification.levelTitle || 'Scholar'}</span>
        </button>

        {/* Quick Focus Timer Launch Button */}
        <button
          id="quick-focus-timer-btn"
          onClick={() => openTimer()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
          title="Start Pomodoro Focus Session"
        >
          <Timer className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Focus</span>
        </button>

        {/* AI Copilot Quick Jump */}
        <button
          id="nav-ai-assistant-btn"
          onClick={() => setActiveTab('assistant')}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
          title="Open AI Academic Tutor"
        >
          <Sparkles className="h-4 w-4 text-indigo-500" />
        </button>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div 
              id="notifications-dropdown-menu"
              className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
            >
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.2 rounded-full font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <CheckCheck className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No new notifications right now.
                  </div>
                ) : (
                  notifications.slice(0, 6).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        if (notif.actionUrl) {
                          setActiveTab(notif.actionUrl);
                          setShowNotifications(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition flex items-start gap-3 ${
                        !notif.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-500" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setShowNotifications(false);
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  View All Notifications <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <button
          id="navbar-profile-avatar-btn"
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
              {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
            </div>
          )}
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden lg:inline">
            {profile.fullName.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
