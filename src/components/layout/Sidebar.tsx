import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ListTree, 
  Sparkles, 
  CalendarDays, 
  CheckSquare, 
  Calendar, 
  Hourglass, 
  RotateCw, 
  BrainCircuit, 
  MessageSquare, 
  Bookmark, 
  BarChart3, 
  Trophy, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  X,
  GraduationCap
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { TabType } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, profile, notifications, logout } = useStudy();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navGroups = [
    {
      group: 'Core',
      items: [
        { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
        { id: 'planner' as TabType, label: 'AI Planner', icon: Sparkles, badge: 'AI' },
        { id: 'timetable' as TabType, label: 'Timetable', icon: CalendarDays },
        { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare },
        { id: 'calendar' as TabType, label: 'Calendar', icon: Calendar },
      ]
    },
    {
      group: 'Academics',
      items: [
        { id: 'subjects' as TabType, label: 'My Subjects', icon: BookOpen },
        { id: 'syllabus' as TabType, label: 'Syllabus Tracker', icon: ListTree },
        { id: 'exams' as TabType, label: 'Exam Countdown', icon: Hourglass },
        { id: 'revision' as TabType, label: 'Spaced Revision', icon: RotateCw },
      ]
    },
    {
      group: 'AI Learning Tools',
      items: [
        { id: 'quiz' as TabType, label: 'AI Quiz Arena', icon: BrainCircuit, badge: 'Smart' },
        { id: 'assistant' as TabType, label: 'AI Study Tutor', icon: MessageSquare },
        { id: 'resources' as TabType, label: 'Study Resources', icon: Bookmark },
        { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
      ]
    },
    {
      group: 'Personal',
      items: [
        { id: 'achievements' as TabType, label: 'Achievements', icon: Trophy },
        { id: 'notifications' as TabType, label: 'Notifications', icon: Bell, count: unreadCount },
        { id: 'profile' as TabType, label: 'Student Profile', icon: User },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleSelect = (id: TabType) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-main-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#0F172A] text-slate-300 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleSelect('dashboard')}>
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-sm">
              C
            </div>
            <div>
              <span className="text-white font-bold text-base tracking-tight block leading-tight">
                CogniStudy <span className="text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                Academic Copilot
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {group.group}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => handleSelect(item.id)}
                    className={`group flex w-full items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600/20 text-white font-semibold border-l-2 border-indigo-500'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`h-4 w-4 transition-colors ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tracking-wide ${
                          isActive 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500 text-white">
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Mini Card in Sidebar Footer */}
        <div className="border-t border-slate-800 p-4 bg-[#0B1120]/60 mt-auto">
          <div className="flex items-center justify-between gap-3 p-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-3 min-w-0 cursor-pointer" onClick={() => handleSelect('profile')}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                  {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {profile.fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {profile.course?.split(' ')[0] || 'B.Tech'} • Sem {profile.semester || 4}
                </p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
