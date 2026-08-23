import React, { useState } from 'react';
import { 
  Hourglass, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Exam, PriorityLevel } from '../../types';

export const ExamsView: React.FC = () => {
  const { exams, addExam, updateExam, deleteExam, subjects, generateAIStudyPlan, setActiveTab } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [examName, setExamName] = useState('Mid-Semester Examination');
  const [examDate, setExamDate] = useState('2026-09-10');
  const [durationMinutes, setDurationMinutes] = useState(180);
  const [weightagePercentage, setWeightagePercentage] = useState(40);
  const [targetMarks, setTargetMarks] = useState(90);
  const [totalMarks, setTotalMarks] = useState(100);
  const [syllabusUnitsCovered, setSyllabusUnitsCovered] = useState('Units 1, 2 & 3');
  const [priority, setPriority] = useState<PriorityLevel>('high');

  const handleOpenAdd = () => {
    setEditingExam(null);
    setExamName('Mid-Semester Examination');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (e: Exam) => {
    setEditingExam(e);
    setSubjectId(e.subjectId);
    setExamName(e.examName);
    setExamDate(e.examDate);
    setDurationMinutes(e.durationMinutes || 180);
    setWeightagePercentage(e.weightagePercentage || 40);
    setTargetMarks(e.targetMarks || 90);
    setTotalMarks(e.totalMarks || 100);
    setSyllabusUnitsCovered(e.syllabusUnitsCovered || 'All Units');
    setPriority(e.priority);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = subjects.find(s => s.id === subjectId);

    if (editingExam) {
      updateExam(editingExam.id, {
        subjectId,
        subjectName: sub?.name || 'General Subject',
        subjectCode: sub?.code || 'EXAM-101',
        examName,
        examDate,
        durationMinutes: Number(durationMinutes),
        weightagePercentage: Number(weightagePercentage),
        targetMarks: Number(targetMarks),
        totalMarks: Number(totalMarks),
        syllabusUnitsCovered,
        priority
      });
    } else {
      addExam({
        subjectId,
        subjectName: sub?.name || 'General Subject',
        subjectCode: sub?.code || 'EXAM-101',
        examName,
        examDate,
        durationMinutes: Number(durationMinutes),
        weightagePercentage: Number(weightagePercentage),
        targetMarks: Number(targetMarks),
        totalMarks: Number(totalMarks),
        syllabusUnitsCovered,
        priority
      });
    }

    setIsAddModalOpen(false);
  };

  const handleGenerateExamSprint = async (exam: Exam) => {
    await generateAIStudyPlan(7, `EXAM CRASH SPRINT: Maximize marks for upcoming ${exam.subjectName} (${exam.examName}) on ${exam.examDate}. Heavy numerical and revision focus.`);
    setActiveTab('planner');
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Upcoming Exam Countdowns & Targets
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track exam countdowns, target marks, and trigger AI crash revision sprints.
          </p>
        </div>

        <button
          id="add-exam-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add Exam Date</span>
        </button>
      </div>

      {/* 2. Exams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sortedExams.map((exam) => {
          const daysLeft = Math.max(0, Math.ceil((new Date(exam.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          const isCritical = daysLeft <= 14;

          // Subject syllabus progress
          const sub = subjects.find(s => s.id === exam.subjectId || s.name === exam.subjectName);
          const totalTopics = sub?.topics.length || 0;
          const completedTopics = sub?.topics.filter(t => t.completed).length || 0;
          const syllabusPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          return (
            <div
              key={exam.id}
              className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
                isCritical
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60 shadow-md'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {exam.subjectCode}
                  </span>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isCritical ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                  }`}>
                    {daysLeft} Days Remaining
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {exam.subjectName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{exam.examName}</p>

                {/* Metrics */}
                <div className="mt-4 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Exam Date</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.examDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target Score</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{exam.targetMarks}/{exam.totalMarks} ({Math.round((exam.targetMarks/exam.totalMarks)*100)}%)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Weightage</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.weightagePercentage}% of CGPA</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Duration</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{exam.durationMinutes} mins</span>
                  </div>
                </div>

                {/* Syllabus Readiness Progress Bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Syllabus Readiness</span>
                    <span className="text-slate-900 dark:text-white font-mono">{syllabusPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        syllabusPercent >= 75 ? 'bg-emerald-500' : syllabusPercent >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${syllabusPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 block">Covering: {exam.syllabusUnitsCovered}</span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleGenerateExamSprint(exam)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Sprint Plan</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(exam)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Exam"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {exams.length > 1 && (
                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete Exam"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Exam Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingExam ? 'Edit Exam Details' : 'Add Approaching Exam'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Exam Title / Type</label>
                <input
                  type="text"
                  required
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Mid-Semester Theory Exam"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={targetMarks}
                    onChange={(e) => setTargetMarks(parseInt(e.target.value) || 90)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(parseInt(e.target.value) || 100)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Weightage %</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={weightagePercentage}
                    onChange={(e) => setWeightagePercentage(parseInt(e.target.value) || 40)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Syllabus Scope</label>
                <input
                  type="text"
                  value={syllabusUnitsCovered}
                  onChange={(e) => setSyllabusUnitsCovered(e.target.value)}
                  placeholder="e.g. Units 1, 2 & 3"
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
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
                  Save Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
