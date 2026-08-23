import React from 'react';
import { 
  Award, 
  Flame, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Zap, 
  Target, 
  Clock, 
  BrainCircuit,
  Trophy
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const AchievementsView: React.FC = () => {
  const { userStats, profile } = useStudy();

  const xpForNextLevel = userStats.level * 500;
  const currentLevelXp = userStats.xp % 500;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXp / 500) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Level Progress Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Level {userStats.level} Scholar
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {userStats.xp} Total XP
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                {profile.fullName}'s Academic Prestige
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">Daily Streak</span>
              <span className="text-lg font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 fill-current" /> {userStats.streakDays} Days
              </span>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-400 block font-medium">Focus Hours</span>
              <span className="text-lg font-black text-blue-400 font-mono">
                {(userStats.totalStudyMinutes / 60).toFixed(1)}h
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Next Level Milestone: Level {userStats.level + 1}</span>
            <span className="font-mono text-amber-400">{currentLevelXp} / 500 XP ({levelProgressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${levelProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Badges Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Academic Mastery Badges ({userStats.badges.filter(b => b.unlocked).length}/{userStats.badges.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Unlocked through study milestones</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {userStats.badges.map((badge) => {
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-3xl border transition flex items-start gap-4 ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500/50'
                    : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-500 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="h-5 w-5" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {badge.name}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      +{badge.xpBonus} XP
                    </span>
                    {isUnlocked && badge.unlockedAt && (
                      <span className="text-[10px] text-slate-400">
                        {new Date(badge.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
