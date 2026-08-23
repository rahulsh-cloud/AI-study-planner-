import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  BookOpen, 
  Hourglass, 
  RotateCw, 
  CheckCircle2,
  Sparkles,
  Plus
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const CalendarView: React.FC = () => {
  const { exams, tasks, spacedRevisions, timetableBlocks, openTimer, setActiveTab } = useStudy();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayNum, setSelectedDayNum] = useState<number>(currentDate.getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days calculation
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDayNum).padStart(2, '0')}`;

  // Find events for selected day
  const dayExams = exams.filter(e => e.examDate === selectedDateStr);
  const dayTasks = tasks.filter(t => t.dueDate === selectedDateStr);
  const dayRevisions = spacedRevisions.filter(r => r.nextDueDate === selectedDateStr);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Academic Master Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Unified view of upcoming exams, task milestones, study slots, and spaced repetitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 px-2">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots for offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDayNum === dayNum;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              const hasExam = exams.some(e => e.examDate === dateStr);
              const hasTask = tasks.some(t => t.dueDate === dateStr);
              const hasRevision = spacedRevisions.some(r => r.nextDueDate === dateStr);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDayNum(dayNum)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-xs'
                      : isToday
                      ? 'bg-slate-50 dark:bg-slate-800/80 border-blue-400/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold font-mono ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : isToday ? 'text-blue-500 font-extrabold' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold text-blue-500 hidden sm:inline">Today</span>
                    )}
                  </div>

                  {/* Indicator dots */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {hasExam && (
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" title="Exam Date" />
                    )}
                    {hasTask && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" title="Study Task" />
                    )}
                    {hasRevision && (
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500" title="Spaced Revision" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Selected Date Agenda */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">Selected Date</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {selectedDayNum}, {year}
              </h3>
            </div>
            <button
              onClick={() => openTimer()}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100"
              title="Start Study Timer"
            >
              <Clock className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Exams on this day */}
            {dayExams.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                  <Hourglass className="h-3.5 w-3.5" /> Exams Scheduled
                </span>
                {dayExams.map(e => (
                  <div key={e.id} className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60">
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">{e.subjectName}</h4>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300">{e.examName}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tasks on this day */}
            {dayTasks.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Due Tasks
                </span>
                {dayTasks.map(t => (
                  <div key={t.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t.title}</h4>
                    <p className="text-[10px] text-slate-500">{t.subjectName} • {t.estimatedMinutes} mins</p>
                  </div>
                ))}
              </div>
            )}

            {/* Revisions on this day */}
            {dayRevisions.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-purple-500 uppercase tracking-wider flex items-center gap-1">
                  <RotateCw className="h-3.5 w-3.5" /> Spaced Revisions
                </span>
                {dayRevisions.map(r => (
                  <div key={r.id} className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60">
                    <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-200">{r.topicName}</h4>
                    <p className="text-[10px] text-purple-700 dark:text-purple-300">{r.subjectName} • Stage {r.stage}</p>
                  </div>
                ))}
              </div>
            )}

            {dayExams.length === 0 && dayTasks.length === 0 && dayRevisions.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No formal exams or milestones on this date. Perfect for flexible self-study!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
