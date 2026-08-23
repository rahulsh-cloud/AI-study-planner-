import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  Bell, 
  Moon, 
  Sun,
  CheckCircle2, 
  AlertTriangle,
  User,
  LogOut,
  KeyRound
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const SettingsView: React.FC = () => {
  const { 
    exportDataJSON, 
    importDataJSON, 
    resetToSampleData, 
    theme, 
    toggleTheme, 
    profile,
    logout,
    addNotification 
  } = useStudy();

  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cognistudy-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    addNotification({
      type: 'general',
      title: 'Backup Downloaded',
      message: 'Your study planner database has been exported to JSON.',
      priority: 'low'
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importDataJSON(content);
        if (success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => setImportStatus(null), 4000);
        } else {
          setImportStatus('Invalid backup file format.');
        }
      } catch (err) {
        setImportStatus('Failed to parse backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to default demo state? This will restore sample subjects, timetable, and exams.')) {
      resetToSampleData();
      addNotification({
        type: 'general',
        title: 'App Reset',
        message: 'Loaded standard academic curriculum demo dataset.',
        priority: 'low'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Application Preferences & Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage local backups, account session, appearance themes, and reset states.
        </p>
      </div>

      {/* 2. Account & Session Management */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-200 dark:border-indigo-800">
              {profile.fullName ? profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'ST'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{profile.fullName}</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.2 rounded-full font-semibold">
                  Active Student
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{profile.email} • {profile.course}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3. Theme & Visual Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="h-4 w-4 text-indigo-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
          <span>Appearance & Study Mode</span>
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">Dark Mode</span>
            <span className="text-[11px] text-slate-500">Enable high-contrast night study mode (#0F172A theme)</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300'
            }`}
            aria-label="Toggle dark mode"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                theme === 'dark' ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* 4. AI Engine Status */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Engine Integration</h2>
              <p className="text-[11px] text-slate-500">Google Gemini 2.5 Engine</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Active & Ready
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Gemini powers your master study planner, active recall quiz generator, spaced repetition intervals, and tutor chat. All requests are securely proxied via server-side endpoints.
        </p>
      </div>

      {/* 5. Data Import / Export */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Local Storage & Backup Management</span>
        </h2>
        <p className="text-xs text-slate-500">
          Your syllabus, timetable, quizzes, and focus telemetry are saved persistently in browser storage. Download a full JSON backup to transfer between devices.
        </p>

        {importStatus && (
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 text-xs font-medium">
            {importStatus}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleDownloadBackup}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON Backup</span>
          </button>

          <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition">
            <Upload className="h-4 w-4" />
            <span>Restore Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold transition border border-rose-200 dark:border-rose-900"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
