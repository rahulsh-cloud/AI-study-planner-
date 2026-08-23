import React, { useState } from 'react';
import { 
  User, 
  Save, 
  GraduationCap, 
  Target, 
  Clock, 
  BookOpen, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const ProfileView: React.FC = () => {
  const { profile, updateProfile, addNotification } = useStudy();

  const [fullName, setFullName] = useState(profile.fullName || '');
  const [email, setEmail] = useState(profile.email || '');
  const [course, setCourse] = useState(profile.course || '');
  const [semester, setSemester] = useState(profile.semester || 5);
  const [targetGpa, setTargetGpa] = useState(profile.targetGpa || 9.2);
  const [currentGpa, setCurrentGpa] = useState(profile.currentGpa || 8.6);
  const [dailyStudyHours, setDailyStudyHours] = useState(profile.dailyStudyHours || 3.5);
  const [preferredStudyTime, setPreferredStudyTime] = useState<'morning'|'afternoon'|'evening'|'night'>(profile.preferredStudyTime || 'evening');
  const [studyPace, setStudyPace] = useState<'steady'|'cram'|'balanced'>(profile.studyPace || 'balanced');
  const [collegeStart, setCollegeStart] = useState(profile.collegeSchedule?.startTime || '09:00');
  const [collegeEnd, setCollegeEnd] = useState(profile.collegeSchedule?.endTime || '16:00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      course,
      semester: Number(semester),
      targetGpa: Number(targetGpa),
      currentGpa: Number(currentGpa),
      dailyStudyHours: Number(dailyStudyHours),
      preferredStudyTime,
      studyPace,
      collegeSchedule: {
        startTime: collegeStart,
        endTime: collegeEnd,
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      }
    });

    setSavedSuccess(true);
    addNotification({
      type: 'general',
      title: 'Profile Updated',
      message: 'Your academic goals and daily study target settings were successfully saved.',
      priority: 'low'
    });
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Student Academic Profile & Goals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Personalize your course curriculum, target CGPA, study preferences, and daily hours.
        </p>
      </div>

      {/* 2. Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md shadow-blue-500/25">
            {fullName ? fullName[0] : 'S'}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">{fullName}</h2>
            <p className="text-xs text-slate-500">{course} • Semester {semester}</p>
          </div>
        </div>

        {/* Academic Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Curriculum</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree / Major</label>
              <input
                type="text"
                required
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current Semester</label>
              <input
                type="number"
                min="1"
                max="12"
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Goals & Study Telemetry */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Target Goals & Focus Pace</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target CGPA / GPA (out of 10)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={targetGpa}
                onChange={(e) => setTargetGpa(parseFloat(e.target.value) || 9.0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Current CGPA</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                value={currentGpa}
                onChange={(e) => setCurrentGpa(parseFloat(e.target.value) || 8.0)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Daily Target Study Hours</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="12"
                value={dailyStudyHours}
                onChange={(e) => setDailyStudyHours(parseFloat(e.target.value) || 3.5)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Time of Day</label>
              <select
                value={preferredStudyTime}
                onChange={(e) => setPreferredStudyTime(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="morning">Morning (06:00 - 11:00)</option>
                <option value="afternoon">Afternoon (12:00 - 17:00)</option>
                <option value="evening">Evening (18:00 - 22:00)</option>
                <option value="night">Night Owl (22:00 - 02:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Study Strategy Style</label>
              <select
                value={studyPace}
                onChange={(e) => setStudyPace(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="balanced">Balanced Daily Distribution</option>
                <option value="steady">Steady & Spaced Out</option>
                <option value="cram">High-Intensity Exam Focus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          {savedSuccess && (
            <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-4 w-4" />
              <span>Settings successfully saved!</span>
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
          >
            <Save className="h-4 w-4" />
            <span>Save Profile Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
