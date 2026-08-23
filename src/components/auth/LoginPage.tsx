import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BookOpen,
  Calendar,
  BrainCircuit,
  Award,
  Sun,
  Moon,
  School,
  AlertCircle
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const LoginPage: React.FC = () => {
  const { login, demoLogin, updateProfile, theme, toggleTheme } = useStudy();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  
  // Login form states
  const [email, setEmail] = useState('rahul.sharma15855@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign up form states
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [semester, setSemester] = useState('Semester 4');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your student email and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      login(email, password);
    }, 450);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required registration fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        college: college.trim() || 'National Institute of Technology',
        course: course.trim(),
        semester: semester,
        isOnboarded: false
      });
      setIsLoading(false);
      login(email, password);
    }, 500);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your registered student email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Password reset instructions have been sent to ${email}. Check your inbox!`);
      setTimeout(() => {
        setMode('login');
        setSuccessMsg(null);
      }, 3500);
    }, 600);
  };

  const handleGoogleSso = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      demoLogin();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white font-sans">
      {/* Top Header Bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30">
            C
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block leading-tight">
              CogniStudy <span className="text-indigo-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Academic Copilot & Study Planner
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-300" />}
          </button>
          
          <button
            onClick={demoLogin}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>1-Click Demo</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Split 2-Column Showcase */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: AI Value Proposition & Live Academic Highlights */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Personalized AI Study Engine & Exam Copilot</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Ace your college exams without <span className="text-indigo-400">burnout</span>.
            </h1>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
              CogniStudy AI synthesizes your semester syllabus, lecture timetable, and upcoming exam dates into an optimized daily study schedule with spaced repetition and 24/7 AI tutoring.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                  <Calendar className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Smart Dynamic Planner</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Auto-adjusts your daily study blocks when you miss a session or have surprise tests.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                  <BrainCircuit className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Spaced Revision (SRS)</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Ebbinghaus-based active recall schedules to retain formulas and definitions permanently.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Gemini Academic Tutor</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instant doubts solver, concept simplifier (Hinglish/English), and mock quiz generator.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                  <Award className="h-4 w-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">Gamified Streaks & XP</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  Earn level badges, maintain study streaks, and track real-time target CGPA progress.
                </p>
              </div>
            </div>

            {/* Testimonial / Social Proof Pill */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Student Profile"
                className="w-10 h-10 rounded-full object-cover border border-indigo-400 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs text-slate-200 italic line-clamp-2">
                  "CogniStudy helped me organize 5 heavy engineering subjects and prepare for DBMS midterms systematically. My GPA jumped to 9.2!"
                </p>
                <p className="text-[11px] text-indigo-300 font-semibold mt-0.5">
                  — Rahul Sharma, 4th Sem Computer Science
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
              
              {/* Subtle top ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

              {/* Mode Header Switcher (Sign In / Sign Up) */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'login' && 'Welcome Back'}
                    {mode === 'signup' && 'Create Student Account'}
                    {mode === 'forgot' && 'Reset Password'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {mode === 'login' && 'Sign in to access your study planner and schedule.'}
                    {mode === 'signup' && 'Join thousands of students achieving their dream GPA.'}
                    {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
                  </p>
                </div>

                {mode !== 'forgot' && (
                  <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(null); }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        mode === 'login' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setErrorMsg(null); }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        mode === 'signup' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>

              {/* Instant 1-Click Demo Login Banner Button */}
              <div className="mb-5">
                <button
                  type="button"
                  id="login-quick-demo-btn"
                  onClick={demoLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 hover:from-amber-500/30 hover:via-indigo-600/30 hover:to-purple-600/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-between transition-all group shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                    <span>Instant Demo (Pre-loaded CS Student)</span>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Single Sign-On Button */}
              <div className="space-y-3 mb-5">
                <button
                  type="button"
                  onClick={handleGoogleSso}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with University Google Account</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-widest text-slate-500 absolute">
                    Or with email
                  </span>
                </div>
              </div>

              {/* Alert message display */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in duration-150">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 1. Sign In Form */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Student Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="login-email-input"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setErrorMsg(null); }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="login-password-input"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 accent-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-slate-400">Remember this device</span>
                    </label>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Sign In to Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 2. Sign Up / Register Form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        College / University
                      </label>
                      <div className="relative">
                        <School className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. NIT / IIT"
                          className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Semester
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Degree & Major
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        placeholder="e.g. B.Tech Computer Science"
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Student Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 chars"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      <>
                        <span>Create Account & Setup Plan</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* 3. Forgot Password Form */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Registered Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="student@university.edu"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
                  >
                    {isLoading ? 'Sending Link...' : 'Send Password Reset Link'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMsg(null); }}
                      className="text-xs font-semibold text-indigo-400 hover:underline"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* Trust Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>256-Bit Encrypted • Private AI Session</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-4 px-6 border-t border-slate-800/80 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© 2026 CogniStudy AI • All Academic Rights Reserved</p>
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <button onClick={demoLogin} className="hover:text-indigo-400 transition">Sample Student Demo</button>
          <span>•</span>
          <button onClick={() => setMode('signup')} className="hover:text-indigo-400 transition">New Registration</button>
          <span>•</span>
          <span>Security & Privacy</span>
        </div>
      </footer>
    </div>
  );
};
