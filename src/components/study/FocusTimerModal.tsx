import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const FocusTimerModal: React.FC = () => {
  const { isTimerOpen, closeTimer, subjects, logStudySession } = useStudy();

  const [mode, setMode] = useState<'pomodoro' | 'deep' | 'short_break' | 'long_break'>('pomodoro');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState<string>('');
  
  // Timer durations in seconds
  const modeDurations = {
    pomodoro: 25 * 60,
    deep: 50 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60
  };

  const [timeLeft, setTimeLeft] = useState<number>(modeDurations.pomodoro);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<string>('none');
  const modalRef = useRef<HTMLDivElement>(null);

  // When mode changes, reset time
  useEffect(() => {
    setTimeLeft(modeDurations[mode]);
    setIsRunning(false);
  }, [mode]);

  // Tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleCompleteSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  if (!isTimerOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
  };

  const handleCompleteSession = () => {
    setIsRunning(false);
    const totalDurationSecs = modeDurations[mode] - timeLeft;
    const durationMinutes = Math.max(1, Math.round(totalDurationSecs / 60));

    if (mode === 'pomodoro' || mode === 'deep') {
      const subject = subjects.find(s => s.id === selectedSubjectId);
      logStudySession({
        subjectId: selectedSubjectId || 'general',
        subjectName: subject?.name || 'General Study',
        topicName: topicName.trim() || 'Focused Study Session',
        durationMinutes,
        startTime: new Date(Date.now() - durationMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sessionType: mode === 'deep' ? 'deep_work' : 'pomodoro',
        productivityRating: 5
      });
    }

    closeTimer();
  };

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const totalDuration = modeDurations[mode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        ref={modalRef}
        id="focus-timer-modal-card"
        className={`w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col transition-all ${
          isFullscreen ? 'fixed inset-4 max-w-none max-h-none z-50' : ''
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Focus Studio</h3>
              <p className="text-[11px] text-slate-500">Pomodoro & Deep Work Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              id="close-timer-modal-btn"
              onClick={closeTimer}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center flex-1 justify-center space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setMode('pomodoro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                mode === 'pomodoro'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pomodoro (25m)
            </button>
            <button
              onClick={() => setMode('deep')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                mode === 'deep'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Deep Work (50m)
            </button>
            <button
              onClick={() => setMode('short_break')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                mode === 'short_break'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Break (5m)
            </button>
          </div>

          {/* Circular Countdown Display */}
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-56 h-56 -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="6"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-blue-600 dark:stroke-blue-500 transition-all duration-1000 ease-linear"
                strokeWidth="6"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Numbers */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                {mode === 'short_break' || mode === 'long_break' ? 'Relax & Recharge' : (currentSubject?.code || 'Focus')}
              </span>
            </div>
          </div>

          {/* Subject & Topic Selectors (Only for study modes) */}
          {(mode === 'pomodoro' || mode === 'deep') && (
            <div className="w-full space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject</label>
                  <select
                    id="timer-subject-select"
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Specific Topic</label>
                  <input
                    id="timer-topic-input"
                    type="text"
                    placeholder="e.g. Normalization BCNF"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    className="w-full text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              id="timer-reset-btn"
              onClick={handleReset}
              className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              id="timer-play-pause-btn"
              onClick={handleTogglePlay}
              className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                  <span>Start Focus</span>
                </>
              )}
            </button>

            <button
              id="timer-complete-btn"
              onClick={handleCompleteSession}
              className="p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition"
              title="Finish & Log Session"
            >
              <CheckCircle2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Footer Ambient Info */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
            <span>Earns +{mode === 'deep' ? '40' : '20'} XP upon completion</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Ambient:</span>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="text-[11px] bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="none">Off (Silence)</option>
              <option value="binaural">40Hz Binaural Waves</option>
              <option value="rain">Soft Rain</option>
              <option value="library">Oxford Library</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
