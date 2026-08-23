import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Sparkles, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Play, 
  X,
  RotateCcw
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { TimetableBlock } from '../../types';

export const TimetableView: React.FC = () => {
  const { 
    timetableBlocks, 
    addTimetableBlock, 
    updateTimetableBlock, 
    deleteTimetableBlock, 
    setTimetableBlocks, 
    subjects, 
    profile, 
    openTimer, 
    addNotification 
  } = useStudy();

  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGeneratingAiTimetable, setIsGeneratingAiTimetable] = useState(false);

  // Form State
  const [formDay, setFormDay] = useState<'Monday'|'Tuesday'|'Wednesday'|'Thursday'|'Friday'|'Saturday'|'Sunday'>('Monday');
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || '');
  const [formTopic, setFormTopic] = useState('');
  const [formStartTime, setFormStartTime] = useState('18:00');
  const [formEndTime, setFormEndTime] = useState('19:00');
  const [formActivityType, setFormActivityType] = useState<'study' | 'college_class' | 'break' | 'revision' | 'quiz'>('study');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

  const handleOpenAdd = (day?: typeof daysOfWeek[number]) => {
    if (day) setFormDay(day);
    setFormTopic('');
    setIsAddModalOpen(true);
  };

  const handleSaveBlock = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects.find(s => s.id === formSubjectId);

    addTimetableBlock({
      dayOfWeek: formDay,
      startTime: formStartTime,
      endTime: formEndTime,
      subjectId: formSubjectId,
      subjectName: subject?.name || 'General Study',
      topicName: formTopic.trim() || 'Core Chapter Study',
      activityType: formActivityType,
      colorHex: formActivityType === 'revision' ? '#a855f7' : formActivityType === 'quiz' ? '#ec4899' : '#3b82f6',
      isCompleted: false
    });

    setIsAddModalOpen(false);
  };

  const handleGenerateAiTimetable = async () => {
    setIsGeneratingAiTimetable(true);
    try {
      const res = await fetch('/api/ai/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          subjects,
          collegeSchedule: [
            { day: 'Monday', start: '09:00', end: '16:00', label: 'College Lectures & Lab' },
            { day: 'Tuesday', start: '09:00', end: '16:00', label: 'College Lectures & Lab' },
            { day: 'Wednesday', start: '09:00', end: '16:00', label: 'College Lectures & Lab' },
            { day: 'Thursday', start: '09:00', end: '16:00', label: 'College Lectures & Lab' },
            { day: 'Friday', start: '09:00', end: '15:00', label: 'College Lectures & Lab' }
          ]
        })
      });
      const data = await res.json();
      if (data.success && data.schedule) {
        const convertedBlocks: TimetableBlock[] = [];
        data.schedule.forEach((daySchedule: any, dIdx: number) => {
          const dayName = daySchedule.day || daysOfWeek[dIdx % 7];
          daySchedule.blocks?.forEach((b: any, bIdx: number) => {
            convertedBlocks.push({
              id: `tt-ai-gen-${Date.now()}-${dIdx}-${bIdx}`,
              dayOfWeek: dayName,
              startTime: b.startTime || '18:00',
              endTime: b.endTime || '19:00',
              subjectId: b.subject || 'study',
              subjectName: b.subject || 'Study Session',
              topicName: b.topic || b.activity || 'Core Study',
              activityType: b.type === 'revision' ? 'revision' : b.type === 'quiz' ? 'quiz' : b.type === 'break' ? 'break' : 'study',
              colorHex: b.type === 'revision' ? '#a855f7' : b.type === 'break' ? '#10b981' : '#3b82f6',
              isCompleted: false
            });
          });
        });

        if (convertedBlocks.length > 0) {
          setTimetableBlocks(convertedBlocks);
          addNotification({
            type: 'ai_insight',
            title: 'AI Smart Timetable Generated',
            message: 'Balanced your weekly study hours avoiding college class overlaps.',
            priority: 'medium',
            actionUrl: 'timetable'
          });
        }
      }
    } catch (e) {
      console.error('Failed to generate timetable:', e);
    } finally {
      setIsGeneratingAiTimetable(false);
    }
  };

  const dayBlocks = timetableBlocks.filter(b => b.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Weekly Academic Timetable
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Interactive weekly schedule balancing college classes, deep self-study, and breaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ai-generate-timetable-btn"
            onClick={handleGenerateAiTimetable}
            disabled={isGeneratingAiTimetable}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition disabled:opacity-50"
          >
            <Sparkles className={`h-4 w-4 ${isGeneratingAiTimetable ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAiTimetable ? 'Generating Schedule...' : 'AI Auto-Schedule'}</span>
          </button>

          <button
            id="add-timetable-block-btn"
            onClick={() => handleOpenAdd(selectedDay as any)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      {/* 2. Days of the Week Navigation */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {daysOfWeek.map((day) => {
          const isSelected = selectedDay === day;
          const count = timetableBlocks.filter(b => b.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`p-2.5 sm:p-3 rounded-2xl text-center transition flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold block">{day.slice(0, 3)}</span>
              <span className={`text-[10px] font-medium mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {count} {count === 1 ? 'Slot' : 'Slots'}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Selected Day Schedule Blocks */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedDay} Schedule
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {dayBlocks.length} planned session{dayBlocks.length === 1 ? '' : 's'}
          </span>
        </div>

        {dayBlocks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-3">
            <p>No study slots scheduled for {selectedDay}.</p>
            <button
              onClick={() => handleOpenAdd(selectedDay as any)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              + Add Slot for {selectedDay}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayBlocks.map((block) => (
              <div
                key={block.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/50 transition"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-700 dark:text-slate-300 font-bold shrink-0 min-w-[72px] text-center">
                    <span>{block.startTime}</span>
                    <span className="text-[10px] text-slate-400 font-normal">to</span>
                    <span>{block.endTime}</span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        block.activityType === 'revision' 
                          ? 'bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300' 
                          : block.activityType === 'quiz'
                          ? 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                      }`}>
                        {block.subjectName}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {block.activityType.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {block.topicName}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => openTimer(block.subjectId, block.topicName)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition"
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Start</span>
                  </button>

                  <button
                    onClick={() => deleteTimetableBlock(block.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Delete Slot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Timetable Block
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Day of Week</label>
                <select
                  value={formDay}
                  onChange={(e) => setFormDay(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {daysOfWeek.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Topic / Objective</label>
                <input
                  type="text"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="e.g. Transaction ACID Properties & Schedules"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Activity Type</label>
                <select
                  value={formActivityType}
                  onChange={(e) => setFormActivityType(e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="study">Deep Study</option>
                  <option value="revision">Spaced Revision</option>
                  <option value="quiz">Practice Quiz</option>
                  <option value="college_class">College Class / Lecture</option>
                  <option value="break">Rest & Break</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
