import React from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  Hourglass, 
  RotateCw, 
  ArrowRight 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { AppNotification } from '../../types';

export const NotificationsView: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    clearAllNotifications, 
    setActiveTab 
  } = useStudy();

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'ai_insight': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'exam_alert': return <Hourglass className="h-4 w-4 text-rose-500" />;
      case 'revision_due': return <RotateCw className="h-4 w-4 text-amber-500" />;
      case 'streak_warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleActionClick = (notif: AppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.actionUrl) {
      setActiveTab(notif.actionUrl as any);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Notifications & AI Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {unreadCount} unread alert{unreadCount === 1 ? '' : 's'} regarding approaching exams, due revisions, and AI recommendations.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Trash2 className="h-4 w-4 text-slate-400" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 2. Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <Bell className="h-8 w-8 text-slate-400 mx-auto" />
            <p>You have no notifications right now. Everything is up to date!</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                notif.read
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-75'
                  : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 font-mono block pt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {notif.actionUrl && (
                  <button
                    onClick={() => handleActionClick(notif)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <span>View</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}

                {!notif.read && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
