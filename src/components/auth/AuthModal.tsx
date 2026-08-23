import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen }) => {
  const { login, demoLogin, updateProfile } = useStudy();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('rahul.sharma15855@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setSubmittedMessage(`Password reset link sent to ${email}. Check your inbox!`);
      setTimeout(() => {
        setMode('login');
        setSubmittedMessage(null);
      }, 3000);
      return;
    }

    if (mode === 'signup') {
      updateProfile({
        fullName,
        email,
        course,
        isOnboarded: false
      });
      login(email, password);
    } else {
      login(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Modal Brand Header */}
        <div className="relative p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 shadow-inner">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Study<span className="text-blue-200">AI</span>
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xs">
              The intelligent AI study planner and academic copilot for college students.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submittedMessage ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{submittedMessage}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Degree / Course
                    </label>
                    <input
                      type="text"
                      required
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Student Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/25 transition active:scale-[0.99]"
              >
                <span>{mode === 'login' ? 'Sign In to StudyAI' : mode === 'signup' ? 'Create Student Account' : 'Send Reset Link'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* 1-Click Instant Demo Login */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={demoLogin}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
                >
                  <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span>Explore Demo (Instant 1-Click Access)</span>
                </button>
              </div>

              {/* Toggle Login / Signup */}
              <div className="text-center pt-2">
                {mode === 'login' ? (
                  <p className="text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Sign up for free
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>
          )}

          {/* Privacy Note */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure Student Data & Private AI Integration</span>
          </div>
        </div>
      </div>
    </div>
  );
};
