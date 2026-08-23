import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  Trash2, 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  BrainCircuit
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Subject, SyllabusTopic } from '../../types';

export const OnboardingFlow: React.FC = () => {
  const { profile, updateProfile, subjects, addSubject, addExam, generateAIStudyPlan, setActiveTab } = useStudy();

  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [college, setCollege] = useState(profile.college || 'National Institute of Technology');
  const [course, setCourse] = useState(profile.course || 'B.Tech Computer Science');
  const [branch, setBranch] = useState(profile.branch || 'CSE');
  const [semester, setSemester] = useState(profile.semester || 'Semester 4');
  const [academicYear, setAcademicYear] = useState(profile.academicYear || '2025-2026');
  
  // Quick subjects during onboarding
  const [tempSubjects, setTempSubjects] = useState<string[]>([
    'Database Management Systems',
    'Data Structures & Algorithms',
    'Operating Systems',
    'Computer Networks'
  ]);
  const [newSubInput, setNewSubInput] = useState('');

  // Exam info
  const [examSubject, setExamSubject] = useState(tempSubjects[0] || 'Database Management Systems');
  const [examDate, setExamDate] = useState('2026-09-04');
  const [examName, setExamName] = useState('Mid-Semester Theory Examination');

  // Weak / Strong
  const [weakSubjects, setWeakSubjects] = useState<string[]>(['Database Management Systems']);
  const [strongSubjects, setStrongSubjects] = useState<string[]>(['Data Structures & Algorithms']);

  // Targets
  const [dailyHours, setDailyHours] = useState<number>(3.5);
  const [targetCgpa, setTargetCgpa] = useState<string>('9.2');
  const [preferredTime, setPreferredTime] = useState<'Morning' | 'Evening' | 'Late Night'>('Evening');

  const [isGeneratingFirstPlan, setIsGeneratingFirstPlan] = useState(false);

  const handleAddSubject = () => {
    if (newSubInput.trim() && !tempSubjects.includes(newSubInput.trim())) {
      setTempSubjects([...tempSubjects, newSubInput.trim()]);
      setNewSubInput('');
    }
  };

  const handleRemoveSubject = (index: number) => {
    setTempSubjects(tempSubjects.filter((_, i) => i !== index));
  };

  const toggleWeak = (sub: string) => {
    if (weakSubjects.includes(sub)) {
      setWeakSubjects(weakSubjects.filter(s => s !== sub));
    } else {
      setWeakSubjects([...weakSubjects, sub]);
      setStrongSubjects(strongSubjects.filter(s => s !== sub));
    }
  };

  const toggleStrong = (sub: string) => {
    if (strongSubjects.includes(sub)) {
      setStrongSubjects(strongSubjects.filter(s => s !== sub));
    } else {
      setStrongSubjects([...strongSubjects, sub]);
      setWeakSubjects(weakSubjects.filter(s => s !== sub));
    }
  };

  const handleFinalize = async () => {
    setIsGeneratingFirstPlan(true);

    // Save profile
    updateProfile({
      fullName,
      college,
      course,
      branch,
      semester,
      academicYear,
      dailyStudyHours: dailyHours,
      targetCgpa,
      weakSubjects,
      strongSubjects,
      preferredStudyTime: preferredTime as any,
      isOnboarded: true
    });

    // Add exam
    addExam({
      subjectId: 'sub-primary',
      subjectName: examSubject,
      subjectCode: 'EXAM-101',
      examName,
      examDate,
      durationMinutes: 180,
      weightagePercentage: 40,
      targetMarks: 90,
      totalMarks: 100,
      syllabusUnitsCovered: 'All Units',
      priority: 'high'
    });

    // Generate initial plan
    await generateAIStudyPlan(7, `Student prefers ${preferredTime} study sessions focusing heavily on weak subject: ${weakSubjects.join(', ')}.`);

    setIsGeneratingFirstPlan(false);
    setActiveTab('dashboard');
  };

  const totalSteps = 8;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header with Step Progress */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">Student Academic Setup</h1>
                <p className="text-xs text-slate-400">Step {step} of {totalSteps}: Configure your academic profile</p>
              </div>
            </div>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-800/60">
              {Math.round((step / totalSteps) * 100)}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 1: Personal Information</h2>
              <p className="text-xs text-slate-400">Let's personalize your academic copilot with your name and university.</p>
              
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 2: Degree, Branch & Semester</h2>
              <p className="text-xs text-slate-400">Tell us what you are studying so the AI can calibrate syllabus standards.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Program</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech / B.S. / MBA"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5,6,7,8].map(s => (
                      <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 3: Enrolled Subjects</h2>
              <p className="text-xs text-slate-400">List all courses you are attending this semester.</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubInput}
                  onChange={(e) => setNewSubInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                  placeholder="e.g. Computer Networks"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus className="h-4 w-4" /> Add
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {tempSubjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-blue-400" />
                      <span className="text-xs font-medium text-slate-200">{sub}</span>
                    </div>
                    {tempSubjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 4: Syllabus & Units Setup</h2>
              <p className="text-xs text-slate-400">The AI pre-populates standardized university units for your subjects.</p>

              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/50 space-y-2.5 text-xs text-blue-200">
                <div className="flex items-center gap-2 font-semibold text-blue-300">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <span>Automatic Syllabus Categorization Ready</span>
                </div>
                <p>
                  We have mapped core modules for <strong>Database Management Systems</strong>, <strong>Data Structures</strong>, <strong>Operating Systems</strong>, and <strong>Computer Networks</strong> including Normalization, AVL trees, CPU Scheduling, and Subnetting.
                </p>
                <p className="text-slate-400 text-[11px]">
                  You can easily mark topics completed, add custom chapters, and view topic mastery in the Syllabus Tracker anytime.
                </p>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 5: Approaching Exam Dates</h2>
              <p className="text-xs text-slate-400">Add your nearest midterm or final exam so the AI elevates urgency.</p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                  <select
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {tempSubjects.map((s, i) => (
                      <option key={i} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Name</label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Exam Date</label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 6: Weak vs Strong Areas</h2>
              <p className="text-xs text-slate-400">Click a subject to tag your current confidence level.</p>

              <div className="space-y-2 pt-2">
                {tempSubjects.map((sub, idx) => {
                  const isWeak = weakSubjects.includes(sub);
                  const isStrong = strongSubjects.includes(sub);
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                      <span className="text-xs font-medium text-slate-200">{sub}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleWeak(sub)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                            isWeak ? 'bg-rose-600 text-white' : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          ⚠️ Weak Area
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStrong(sub)}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold transition ${
                            isStrong ? 'bg-emerald-600 text-white' : 'bg-slate-700/60 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          ⭐ Strong
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-lg font-bold text-white">Step 7: Daily Study Goal & Target CGPA</h2>
              <p className="text-xs text-slate-400">Calibrate your daily study bandwidth and preferred study windows.</p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>Available Daily Self-Study</span>
                    <span className="text-blue-400 font-mono">{dailyHours} hours/day</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target CGPA / Percentage</label>
                    <input
                      type="text"
                      value={targetCgpa}
                      onChange={(e) => setTargetCgpa(e.target.value)}
                      placeholder="e.g. 9.2 or 85%"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Study Time</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Morning">Early Morning (6 AM - 9 AM)</option>
                      <option value="Evening">Evening (5 PM - 9 PM)</option>
                      <option value="Late Night">Late Night (9 PM - 1 AM)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4 text-center py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                <BrainCircuit className="h-8 w-8 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-white">Generate Your Personalized AI Study Plan</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Gemini will synthesize your <strong>{tempSubjects.length} subjects</strong>, upcoming <strong>{examSubject}</strong> exam, <strong>{dailyHours} hours/day</strong> target, and weak topic priorities to construct your optimized 7-day master schedule.
              </p>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-left max-w-md mx-auto space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Academic Profile Configured
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Spaced Repetition Engine Activated
                </div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> Weak Area Detection Enabled
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/25 transition"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isGeneratingFirstPlan}
              onClick={handleFinalize}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/30 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGeneratingFirstPlan ? 'Building AI Master Plan...' : 'Launch Dashboard'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
