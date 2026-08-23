import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  StudentProfile,
  Subject,
  Exam,
  Task,
  TimetableBlock,
  AIStudyPlan,
  QuizResult,
  SpacedRevisionItem,
  StudyResource,
  NotificationItem,
  AchievementBadge,
  StudySessionLog,
  GamificationState,
  ChatMessage,
  AIRecommendation,
  TabType,
  ThemeMode,
  SyllabusTopic
} from '../types';
import {
  initialStudentProfile,
  initialSubjects,
  initialExams,
  initialTasks,
  initialTimetableBlocks,
  initialQuizzes,
  initialSpacedRevisions,
  initialResources,
  initialAchievements,
  initialNotifications,
  initialSessions,
  initialGamification
} from '../data/initialData';

interface StudyContextType {
  // Navigation & Theme
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  login: (email?: string, password?: string) => boolean;
  logout: () => void;
  demoLogin: () => void;
  hasCompletedOnboarding: boolean;

  // Student Profile
  profile: StudentProfile;
  updateProfile: (updated: Partial<StudentProfile>) => void;

  // Subjects & Syllabus
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'topics'> & { topics?: SyllabusTopic[] }) => void;
  updateSubject: (id: string, updated: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  toggleTopicCompleted: (subjectId: string, topicId: string) => void;
  addTopic: (subjectId: string, topic: Omit<SyllabusTopic, 'id'>) => void;
  deleteTopic: (subjectId: string, topicId: string) => void;

  // Exams
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updated: Partial<Exam>) => void;
  deleteExam: (id: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  adjustMissedTask: (task: Task) => Promise<any>;

  // Timetable
  timetableBlocks: TimetableBlock[];
  addTimetableBlock: (block: Omit<TimetableBlock, 'id'>) => void;
  updateTimetableBlock: (id: string, updated: Partial<TimetableBlock>) => void;
  deleteTimetableBlock: (id: string) => void;
  setTimetableBlocks: (blocks: TimetableBlock[]) => void;

  // AI Study Planner
  currentStudyPlan: AIStudyPlan | null;
  setCurrentStudyPlan: (plan: AIStudyPlan | null) => void;
  generateAIStudyPlan: (daysCount?: number, preferences?: string) => Promise<AIStudyPlan | null>;
  isGeneratingPlan: boolean;

  // Spaced Revision
  spacedRevisions: SpacedRevisionItem[];
  completeRevision: (revisionId: string) => void;
  addCustomRevision: (revision: Omit<SpacedRevisionItem, 'id'>) => void;

  // Quizzes
  quizHistory: QuizResult[];
  saveQuizResult: (result: Omit<QuizResult, 'id' | 'takenAt'>) => void;

  // Resources
  resources: StudyResource[];
  addResource: (resource: Omit<StudyResource, 'id' | 'addedAt'>) => void;
  updateResource: (id: string, updated: Partial<StudyResource>) => void;
  deleteResource: (id: string) => void;
  toggleResourceFavorite: (id: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  // Achievements & Gamification
  gamification: GamificationState;
  achievements: AchievementBadge[];
  addXp: (amount: number, reason?: string) => void;
  logStudySession: (session: Omit<StudySessionLog, 'id' | 'date'>) => void;
  sessions: StudySessionLog[];

  // Chat & AI Copilot
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => Promise<void>;
  isChatLoading: boolean;
  clearChatHistory: () => void;

  // AI Recommendations
  recommendations: AIRecommendation[];
  refreshRecommendations: () => Promise<void>;
  isRecommendationsLoading: boolean;

  // Quick Timer Modal
  isTimerOpen: boolean;
  openTimer: (subjectId?: string, topicName?: string) => void;
  closeTimer: () => void;

  // Data management
  resetToSampleData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'studyai_profile_v1',
  SUBJECTS: 'studyai_subjects_v1',
  EXAMS: 'studyai_exams_v1',
  TASKS: 'studyai_tasks_v1',
  TIMETABLE: 'studyai_timetable_v1',
  STUDY_PLAN: 'studyai_study_plan_v1',
  REVISIONS: 'studyai_revisions_v1',
  QUIZZES: 'studyai_quizzes_v1',
  RESOURCES: 'studyai_resources_v1',
  NOTIFICATIONS: 'studyai_notifications_v1',
  ACHIEVEMENTS: 'studyai_achievements_v1',
  GAMIFICATION: 'studyai_gamification_v1',
  SESSIONS: 'studyai_sessions_v1',
  AUTH: 'studyai_auth_v1',
  THEME: 'studyai_theme_v1',
  CHAT: 'studyai_chat_v1'
};

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from local storage or fallback to realistic initial data
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved ? JSON.parse(saved) : true;
  });

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialStudentProfile;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : initialSubjects;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return saved ? JSON.parse(saved) : initialExams;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [timetableBlocks, setTimetableBlocks] = useState<TimetableBlock[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return saved ? JSON.parse(saved) : initialTimetableBlocks;
  });

  const [currentStudyPlan, setCurrentStudyPlan] = useState<AIStudyPlan | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDY_PLAN);
    return saved ? JSON.parse(saved) : null;
  });

  const [spacedRevisions, setSpacedRevisions] = useState<SpacedRevisionItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVISIONS);
    return saved ? JSON.parse(saved) : initialSpacedRevisions;
  });

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  const [resources, setResources] = useState<StudyResource[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESOURCES);
    return saved ? JSON.parse(saved) : initialResources;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [achievements, setAchievements] = useState<AchievementBadge[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : initialAchievements;
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GAMIFICATION);
    return saved ? JSON.parse(saved) : initialGamification;
  });

  const [sessions, setSessions] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: `Hi **${profile.fullName || 'Rahul'}**! 👋 I'm your AI Academic Copilot.\n\nI have full context of your **${subjects.length} enrolled subjects**, approaching **${exams[0]?.subjectName || 'DBMS'} exam** in ${Math.max(1, Math.ceil((new Date(exams[0]?.examDate || '2026-09-04').getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days, and your weak topics.\n\nHow can I help you excel today? You can ask me to explain concepts simply, generate practice questions, or create an instant revision session!`,
        timestamp: new Date().toISOString(),
        suggestedActions: [
          { label: 'Explain Normalization simply', action: 'Explain Normalization in simple terms with examples' },
          { label: 'Test me on Trees', action: 'Generate 5 conceptual questions on Binary Search Trees' },
          { label: 'What should I study today?', action: 'What should I study today based on my weak areas and upcoming exams?' },
          { label: 'Explain in Hinglish', action: 'Explain ACID Properties in simple Hinglish with a banking transaction example' }
        ]
      }
    ];
  });

  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([
    {
      id: 'rec-1',
      title: 'Revise DBMS Normalization (3NF & BCNF)',
      reason: 'Your last quiz score was 40% and DBMS Midterm is in 12 days.',
      subject: 'Database Management Systems',
      actionLabel: 'Start 45m Session',
      priority: 'urgent',
      estimatedMinutes: 45,
      targetTab: 'planner'
    },
    {
      id: 'rec-2',
      title: 'Complete Pending AVL Rotations Task',
      reason: 'Carried over from yesterday; key concept for DSA Lab exam.',
      subject: 'Data Structures & Algorithms',
      actionLabel: 'Complete Task',
      priority: 'high',
      estimatedMinutes: 35,
      targetTab: 'tasks'
    },
    {
      id: 'rec-3',
      title: 'Active Spaced Repetition Due Today',
      reason: 'ER Modeling and Process Synchronization need active recall.',
      subject: 'Discrete Mathematics',
      actionLabel: '15m Flashcards',
      priority: 'medium',
      estimatedMinutes: 15,
      targetTab: 'revision'
    }
  ]);

  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isRecommendationsLoading, setIsRecommendationsLoading] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist all state slices to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(isAuthenticated));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetableBlocks));
    localStorage.setItem(STORAGE_KEYS.STUDY_PLAN, JSON.stringify(currentStudyPlan));
    localStorage.setItem(STORAGE_KEYS.REVISIONS, JSON.stringify(spacedRevisions));
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizHistory));
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    localStorage.setItem(STORAGE_KEYS.GAMIFICATION, JSON.stringify(gamification));
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [
    isAuthenticated, profile, subjects, exams, tasks, timetableBlocks,
    currentStudyPlan, spacedRevisions, quizHistory, resources,
    notifications, achievements, gamification, sessions, chatMessages
  ]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore in environments without canvas
    }
  };

  const login = (email?: string, password?: string) => {
    setIsAuthenticated(true);
    if (email && email.trim()) {
      updateProfile({ email });
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const demoLogin = () => {
    setIsAuthenticated(true);
    setProfile(initialStudentProfile);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updated }));
  };

  const addXp = (amount: number, reason?: string) => {
    setGamification(prev => {
      const newXp = prev.totalXp + amount;
      const newLevel = Math.floor(newXp / 300) + 1;
      const titles = ['Beginner', 'Learner', 'Consistent Scholar', 'Academic Master', 'Elite Polymath'];
      const newTitle = titles[Math.min(newLevel - 1, titles.length - 1)];

      if (newLevel > prev.level) {
        triggerConfetti();
        addNotification({
          type: 'achievement',
          title: `🎉 Level Up! You reached Level ${newLevel}`,
          message: `Congratulations! You are now an "${newTitle}". Keep up the momentum!`,
          priority: 'high',
          actionUrl: 'achievements'
        });
      }

      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
        levelTitle: newTitle
      };
    });
  };

  // Subjects & Topics
  const addSubject = (sub: Omit<Subject, 'id' | 'topics'> & { topics?: SyllabusTopic[] }) => {
    const newSubject: Subject = {
      ...sub,
      id: `sub-${Date.now()}`,
      topics: sub.topics || []
    };
    setSubjects(prev => [...prev, newSubject]);
    addXp(30, 'Added New Subject');
    addNotification({
      type: 'ai_insight',
      title: `Subject Added: ${sub.name}`,
      message: `Added ${sub.name} (${sub.code}). AI will integrate its syllabus into your planner.`,
      priority: 'low',
      actionUrl: 'syllabus'
    });
  };

  const updateSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setTasks(prev => prev.filter(t => t.subjectId !== id));
    setExams(prev => prev.filter(e => e.subjectId !== id));
  };

  const toggleTopicCompleted = (subjectId: string, topicId: string) => {
    let justCompleted = false;
    let completedTopicName = '';
    let subjectName = '';

    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      subjectName = sub.name;
      const updatedTopics = sub.topics.map(t => {
        if (t.id === topicId) {
          justCompleted = !t.completed;
          completedTopicName = t.name;
          return {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? new Date().toISOString() : undefined,
            masteryScore: !t.completed ? Math.max(t.masteryScore || 0, 80) : t.masteryScore
          };
        }
        return t;
      });
      return { ...sub, topics: updatedTopics };
    }));

    if (justCompleted) {
      triggerConfetti();
      addXp(25, 'Completed Syllabus Topic');

      // Schedule Spaced Repetition (Day 1 -> Day 2)
      const existingRev = spacedRevisions.find(r => r.topicId === topicId);
      if (!existingRev) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const newRev: SpacedRevisionItem = {
          id: `rev-${Date.now()}`,
          subjectId,
          subjectName,
          topicId,
          topicName: completedTopicName,
          stage: 1,
          lastReviewedDate: new Date().toISOString().split('T')[0],
          nextDueDate: tomorrow.toISOString().split('T')[0],
          intervalDays: 1,
          repetitionsCount: 1,
          status: 'pending',
          easeFactor: 2.5
        };
        setSpacedRevisions(prev => [newRev, ...prev]);
        addNotification({
          type: 'revision',
          title: `Spaced Revision Scheduled: ${completedTopicName}`,
          message: `Scheduled Stage 1 recall review for tomorrow based on the forgetting curve.`,
          priority: 'medium',
          actionUrl: 'revision'
        });
      }
    }
  };

  const addTopic = (subjectId: string, topic: Omit<SyllabusTopic, 'id'>) => {
    const newTopic: SyllabusTopic = {
      ...topic,
      id: `top-${Date.now()}`
    };
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, topics: [...s.topics, newTopic] } : s));
  };

  const deleteTopic = (subjectId: string, topicId: string) => {
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, topics: s.topics.filter(t => t.id !== topicId) } : s));
  };

  // Exams
  const addExam = (exam: Omit<Exam, 'id'>) => {
    const newExam: Exam = {
      ...exam,
      id: `exam-${Date.now()}`
    };
    setExams(prev => [...prev, newExam].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()));
    addXp(20, 'Added Exam Date');
    addNotification({
      type: 'exam',
      title: `Exam Countdown Started: ${exam.subjectName}`,
      message: `Exam scheduled on ${exam.examDate}. AI Study Planner will elevate topic priorities.`,
      priority: 'high',
      actionUrl: 'exams'
    });
  };

  const updateExam = (id: string, updated: Partial<Exam>) => {
    setExams(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e).sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()));
  };

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id));
  };

  // Tasks
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    addXp(10, 'Created Study Task');
  };

  const updateTask = (id: string, updated: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updated } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        if (nextStatus === 'completed') {
          triggerConfetti();
          addXp(20, 'Completed Study Task');
          // Update today's minutes
          setGamification(g => ({
            ...g,
            todayMinutesStudied: g.todayMinutesStudied + (t.estimatedMinutes || 30)
          }));
        }
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  const adjustMissedTask = async (task: Task) => {
    try {
      const response = await fetch('/api/ai/adjust-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missedTask: task,
          remainingAvailableHours: profile.dailyStudyHours * 4,
          upcomingExams: exams
        })
      });
      const data = await response.json();
      if (data.success && data.adjustment) {
        // Mark task as adjusted / in_progress and add notification
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'in_progress', notes: `AI Rebalanced: ${data.adjustment.adjustmentSummary}` } : t));
        addNotification({
          type: 'ai_insight',
          title: `Schedule Rebalanced for: ${task.title}`,
          message: data.adjustment.adjustmentSummary,
          priority: 'high',
          actionUrl: 'tasks'
        });
        return data.adjustment;
      }
    } catch (e) {
      console.error('Adjust missed task error:', e);
    }
    return null;
  };

  // Timetable
  const addTimetableBlock = (block: Omit<TimetableBlock, 'id'>) => {
    const newBlock: TimetableBlock = {
      ...block,
      id: `tt-${Date.now()}`
    };
    setTimetableBlocks(prev => [...prev, newBlock]);
  };

  const updateTimetableBlock = (id: string, updated: Partial<TimetableBlock>) => {
    setTimetableBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteTimetableBlock = (id: string) => {
    setTimetableBlocks(prev => prev.filter(b => b.id !== id));
  };

  // AI Study Plan Generator
  const generateAIStudyPlan = async (daysCount: number = 7, preferences?: string) => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/ai/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          subjects,
          exams,
          preferences,
          daysCount
        })
      });
      const data = await response.json();
      if (data.success && data.plan) {
        const plan: AIStudyPlan = {
          id: `plan-${Date.now()}`,
          createdAt: new Date().toISOString(),
          summary: data.plan.summary,
          focusStrategy: data.plan.focusStrategy,
          dailyPlans: data.plan.dailyPlans,
          recommendations: data.plan.recommendations
        };
        setCurrentStudyPlan(plan);
        addXp(50, 'Generated AI Study Plan');
        triggerConfetti();
        addNotification({
          type: 'ai_insight',
          title: `New AI Study Plan Generated 🚀`,
          message: data.plan.summary,
          priority: 'high',
          actionUrl: 'planner'
        });
        return plan;
      }
    } catch (err) {
      console.error('Failed to generate AI study plan:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
    return null;
  };

  // Spaced Revision
  const completeRevision = (revisionId: string) => {
    setSpacedRevisions(prev => prev.map(rev => {
      if (rev.id !== revisionId) return rev;

      const nextStage = rev.stage + 1;
      const intervals = [1, 2, 4, 7, 14, 30];
      const nextInterval = intervals[Math.min(nextStage - 1, intervals.length - 1)];

      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + nextInterval);

      triggerConfetti();
      addXp(30, 'Completed Spaced Repetition');

      return {
        ...rev,
        stage: nextStage,
        intervalDays: nextInterval,
        repetitionsCount: rev.repetitionsCount + 1,
        lastReviewedDate: new Date().toISOString().split('T')[0],
        nextDueDate: nextDate.toISOString().split('T')[0],
        status: nextStage >= 6 ? 'completed' : 'pending'
      };
    }));
  };

  const addCustomRevision = (revision: Omit<SpacedRevisionItem, 'id'>) => {
    const newRev: SpacedRevisionItem = {
      ...revision,
      id: `rev-${Date.now()}`
    };
    setSpacedRevisions(prev => [newRev, ...prev]);
  };

  // Quizzes
  const saveQuizResult = (result: Omit<QuizResult, 'id' | 'takenAt'>) => {
    const newResult: QuizResult = {
      ...result,
      id: `qres-${Date.now()}`,
      takenAt: new Date().toISOString()
    };
    setQuizHistory(prev => [newResult, ...prev]);

    // Update topic mastery score in syllabus
    setSubjects(prev => prev.map(sub => {
      if (sub.name.toLowerCase().includes(result.subjectName.toLowerCase()) || sub.id === result.subjectName) {
        return {
          ...sub,
          topics: sub.topics.map(t => {
            if (t.name.toLowerCase().includes(result.topicName.toLowerCase())) {
              return {
                ...t,
                masteryScore: Math.round(((t.masteryScore || 50) + result.percentage) / 2)
              };
            }
            return t;
          })
        };
      }
      return sub;
    }));

    addXp(Math.max(20, Math.round(result.percentage * 0.5)), 'Completed AI Quiz');
    if (result.percentage >= 80) {
      triggerConfetti();
    }

    addNotification({
      type: 'quiz',
      title: `Quiz Result: ${result.percentage}% on ${result.topicName}`,
      message: result.percentage >= 70
        ? `Great job! You showed strong understanding with ${result.score}/${result.totalQuestions} correct answers.`
        : `Score was ${result.score}/${result.totalQuestions}. We added a spaced revision reminder for this topic.`,
      priority: result.percentage < 50 ? 'high' : 'medium',
      actionUrl: 'quiz'
    });
  };

  // Resources
  const addResource = (res: Omit<StudyResource, 'id' | 'addedAt'>) => {
    const newRes: StudyResource = {
      ...res,
      id: `res-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
    addXp(15, 'Saved Study Resource');
  };

  const updateResource = (id: string, updated: Partial<StudyResource>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const toggleResourceFavorite = (id: string) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Study Sessions
  const logStudySession = (session: Omit<StudySessionLog, 'id' | 'date'>) => {
    const newSession: StudySessionLog = {
      ...session,
      id: `sess-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setSessions(prev => [newSession, ...prev]);
    
    // Update streak and studied minutes
    setGamification(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDay = prev.lastStudiedDate !== today;
      return {
        ...prev,
        lastStudiedDate: today,
        currentStreak: isNewDay ? prev.currentStreak + 1 : prev.currentStreak,
        longestStreak: Math.max(prev.longestStreak, isNewDay ? prev.currentStreak + 1 : prev.currentStreak),
        todayMinutesStudied: prev.todayMinutesStudied + session.durationMinutes,
        weeklyHoursStudied: +(prev.weeklyHoursStudied + (session.durationMinutes / 60)).toFixed(1)
      };
    });

    addXp(Math.round(session.durationMinutes * 0.8), 'Completed Focus Study Session');
    triggerConfetti();
  };

  // Chatbot
  const sendChatMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory: chatMessages.map(m => ({ role: m.role, content: m.content })),
          studentContext: {
            fullName: profile.fullName,
            course: profile.course,
            semester: profile.semester,
            subjects: subjects.map(s => ({ name: s.name, code: s.code, difficulty: s.difficulty })),
            exams: exams.map(e => ({ name: e.examName, subject: e.subjectName, date: e.examDate })),
            weakTopics: profile.weakSubjects,
            targetCgpa: profile.targetCgpa
          }
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toISOString(),
          suggestedActions: [
            { label: 'Generate practice quiz', action: 'Create a 5-question quick quiz on this topic' },
            { label: 'Add to revision queue', action: 'Schedule a spaced revision session for this concept' },
            { label: 'Explain with diagram/code', action: 'Show code example or visual text diagram' }
          ]
        };
        setChatMessages(prev => [...prev, assistantMsg]);
        addXp(5, 'Chat with AI Tutor');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `I analyzed your query on **${content}**. Break this concept into core definitions, practice solved numericals/code, and test yourself using active recall!`,
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChatHistory = () => {
    setChatMessages([]);
  };

  // Recommendations
  const refreshRecommendations = async () => {
    setIsRecommendationsLoading(true);
    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          subjects,
          exams,
          recentQuizzes: quizHistory.slice(0, 3),
          tasks: tasks.slice(0, 5)
        })
      });
      const data = await response.json();
      if (data.success && data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error('Failed to refresh recommendations:', err);
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  // Timer Modal
  const openTimer = (_subjectId?: string, _topicName?: string) => {
    setIsTimerOpen(true);
  };

  const closeTimer = () => {
    setIsTimerOpen(false);
  };

  // Data Reset & Backup
  const resetToSampleData = () => {
    setProfile(initialStudentProfile);
    setSubjects(initialSubjects);
    setExams(initialExams);
    setTasks(initialTasks);
    setTimetableBlocks(initialTimetableBlocks);
    setCurrentStudyPlan(null);
    setSpacedRevisions(initialSpacedRevisions);
    setQuizHistory(initialQuizzes);
    setResources(initialResources);
    setAchievements(initialAchievements);
    setGamification(initialGamification);
    setSessions(initialSessions);
    setNotifications(initialNotifications);
    addNotification({
      type: 'ai_insight',
      title: 'Database Reset to Sample Data',
      message: 'All academic subjects, syllabus modules, exams, and timetable restored to fresh demo state.',
      priority: 'medium',
      actionUrl: 'dashboard'
    });
  };

  const exportDataJSON = () => {
    const fullBackup = {
      profile,
      subjects,
      exams,
      tasks,
      timetableBlocks,
      currentStudyPlan,
      spacedRevisions,
      quizHistory,
      resources,
      achievements,
      gamification,
      sessions,
      notifications,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const importDataJSON = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) setProfile(parsed.profile);
      if (parsed.subjects) setSubjects(parsed.subjects);
      if (parsed.exams) setExams(parsed.exams);
      if (parsed.tasks) setTasks(parsed.tasks);
      if (parsed.timetableBlocks) setTimetableBlocks(parsed.timetableBlocks);
      if (parsed.currentStudyPlan) setCurrentStudyPlan(parsed.currentStudyPlan);
      if (parsed.spacedRevisions) setSpacedRevisions(parsed.spacedRevisions);
      if (parsed.quizHistory) setQuizHistory(parsed.quizHistory);
      if (parsed.resources) setResources(parsed.resources);
      if (parsed.achievements) setAchievements(parsed.achievements);
      if (parsed.gamification) setGamification(parsed.gamification);
      if (parsed.sessions) setSessions(parsed.sessions);
      if (parsed.notifications) setNotifications(parsed.notifications);
      triggerConfetti();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <StudyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        demoLogin,
        hasCompletedOnboarding: profile.isOnboarded !== false,
        profile,
        updateProfile,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        toggleTopicCompleted,
        addTopic,
        deleteTopic,
        exams,
        addExam,
        updateExam,
        deleteExam,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        adjustMissedTask,
        timetableBlocks,
        addTimetableBlock,
        updateTimetableBlock,
        deleteTimetableBlock,
        setTimetableBlocks,
        currentStudyPlan,
        setCurrentStudyPlan,
        generateAIStudyPlan,
        isGeneratingPlan,
        spacedRevisions,
        completeRevision,
        addCustomRevision,
        quizHistory,
        saveQuizResult,
        resources,
        addResource,
        updateResource,
        deleteResource,
        toggleResourceFavorite,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        addNotification,
        gamification,
        achievements,
        addXp,
        logStudySession,
        sessions,
        chatMessages,
        sendChatMessage,
        isChatLoading,
        clearChatHistory,
        recommendations,
        refreshRecommendations,
        isRecommendationsLoading,
        isTimerOpen,
        openTimer,
        closeTimer,
        resetToSampleData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
