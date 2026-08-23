export type ThemeMode = 'dark' | 'light';

export type TabType = 
  | 'dashboard'
  | 'subjects'
  | 'syllabus'
  | 'planner'
  | 'timetable'
  | 'tasks'
  | 'calendar'
  | 'exams'
  | 'revision'
  | 'quiz'
  | 'assistant'
  | 'resources'
  | 'analytics'
  | 'achievements'
  | 'notifications'
  | 'profile'
  | 'settings';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent' | 'critical';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'missed';
export type ResourceType = 'youtube' | 'pdf' | 'website' | 'notes' | 'book' | 'cheatsheet' | 'cheat_sheet';

export interface StudentProfile {
  id?: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  course: string;
  branch?: string;
  college?: string;
  semester: string | number;
  academicYear?: string;
  dailyStudyHours: number;
  preferredStudyTime?: 'morning' | 'afternoon' | 'evening' | 'night' | 'Early Morning' | 'Morning' | 'Afternoon' | 'Evening' | 'Late Night';
  studyPace?: 'steady' | 'cram' | 'balanced';
  strongSubjects?: string[];
  weakSubjects?: string[];
  targetCgpa?: string;
  targetGpa?: number;
  currentCgpa?: string;
  currentGpa?: number;
  dailyGoalMinutes?: number;
  weeklyGoalHours?: number;
  collegeSchedule?: {
    startTime: string;
    endTime: string;
    days?: string[];
  };
  isOnboarded?: boolean;
  themePreference?: ThemeMode;
}

export interface SyllabusTopic {
  id: string;
  unitNumber?: number;
  name: string;
  subtopics?: string[];
  completed: boolean;
  completedAt?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  weightage?: 'high' | 'medium' | 'low';
  estimatedHours?: number;
  masteryScore?: number; // 0-100
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color?: string;
  teacherName?: string;
  teacher?: string;
  credits?: number;
  totalUnits?: number;
  topics: SyllabusTopic[];
  difficulty?: 'easy' | 'medium' | 'hard';
  examDate?: string;
  importanceWeightage?: 'high' | 'medium' | 'low';
  weightage?: 'high' | 'medium' | 'low';
  personalStrength?: 'strong' | 'average' | 'weak';
  strengthLevel?: 'strong' | 'average' | 'weak';
  targetGrade?: string;
  targetPercentage?: number;
}

export interface Exam {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  examName: string; // e.g. "Midterm 1", "Final University Theory Exam"
  examDate: string; // YYYY-MM-DD
  startTime?: string;
  durationMinutes: number;
  weightagePercentage: number;
  targetMarks: number;
  totalMarks: number;
  syllabusUnitsCovered: string;
  priority: PriorityLevel;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  topicName?: string;
  priority: PriorityLevel;
  estimatedMinutes: number;
  deadline?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  status: TaskStatus;
  difficulty?: DifficultyLevel;
  isAiGenerated?: boolean;
  completedAt?: string;
  notes?: string;
}

export interface TimetableBlock {
  id: string;
  day?: string;
  dayOfWeek?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | string;
  startTime: string;
  endTime: string;
  type?: 'study' | 'college' | 'college_class' | 'break' | 'revision' | 'quiz' | 'custom';
  activityType?: 'study' | 'college' | 'college_class' | 'break' | 'revision' | 'quiz' | 'custom';
  title?: string;
  subject?: string;
  subjectId?: string;
  subjectName?: string;
  topicName?: string;
  color?: string;
  colorHex?: string;
  notes?: string;
  isCompleted?: boolean;
}

export interface StudyPlanSlot {
  id?: string;
  subject?: string;
  subjectName?: string;
  subjectCode?: string;
  topic: string;
  durationMinutes?: number;
  timeWindow?: string;
  priority?: string;
  strategicReason?: string;
  activityType?: string;
  completed?: boolean;
}

export interface DailyStudyPlan {
  dayNumber: number;
  dayName?: string;
  focusTheme?: string;
  theme?: string;
  targetHours?: number;
  totalEstimatedMinutes?: number;
  studySlots?: StudyPlanSlot[];
  slots?: StudyPlanSlot[];
}

export interface AIStudyPlan {
  id?: string;
  createdAt?: string;
  summary: string;
  focusStrategy?: string;
  dailyPlans: DailyStudyPlan[];
  recommendations?: string[];
  appliedToTimetable?: boolean;
}

export interface QuizQuestion {
  id?: string;
  type?: 'mcq' | 'true_false' | 'short_answer';
  question: string;
  options: string[];
  correctAnswerIndex?: number;
  correctAnswer?: string;
  explanation: string;
  hint?: string;
  userAnswer?: string | number;
  isCorrect?: boolean;
}

export interface QuizResult {
  id: string;
  quizTitle?: string;
  subjectId?: string;
  subjectName: string;
  topicName: string;
  difficulty: DifficultyLevel | string;
  takenAt: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  questions?: QuizQuestion[];
}

export interface SpacedRevisionItem {
  id: string;
  subjectId: string;
  subjectName: string;
  topicId: string;
  topicName: string;
  stage: number; // 1 to 6
  lastReviewedDate: string;
  nextDueDate: string;
  intervalDays: number;
  repetitionsCount: number;
  status: 'pending' | 'due_today' | 'overdue' | 'completed';
  easeFactor: number;
}

export interface StudyResource {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  topicName?: string;
  type: ResourceType;
  url?: string;
  description?: string;
  notes?: string;
  isFavorite: boolean;
  tags: string[];
  addedAt?: string;
}

export interface NotificationItem {
  id: string;
  type: 'exam' | 'exam_alert' | 'task' | 'revision' | 'revision_due' | 'streak' | 'streak_warning' | 'ai_insight' | 'achievement' | 'quiz' | 'general';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: PriorityLevel;
  actionUrl?: TabType | string;
  actionPayload?: any;
}

export type AppNotification = NotificationItem;

export interface AchievementBadge {
  id: string;
  name?: string;
  title?: string;
  description: string;
  icon: string;
  category?: 'streak' | 'tasks' | 'quizzes' | 'study_hours' | 'mastery';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  xpReward?: number;
  xpBonus?: number;
}

export interface DailyStudyLog {
  date: string; // YYYY-MM-DD
  totalStudyMinutes: number;
  tasksCompleted: number;
  quizzesTaken: number;
  revisionsDone: number;
}

export interface UserStats {
  xp: number;
  level: number;
  streakDays: number;
  totalStudyMinutes: number;
  completedTasksCount: number;
  quizzesTakenCount: number;
  revisionsCompletedCount: number;
  badges: AchievementBadge[];
}

export interface StudySessionLog {
  id: string;
  subjectId: string;
  subjectName: string;
  topicName?: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  sessionType: 'pomodoro' | 'deep_work' | 'revision' | 'practice';
  productivityRating: number; // 1-5
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  subject: string;
  actionLabel: string;
  priority: 'urgent' | 'high' | 'medium';
  estimatedMinutes: number;
  targetTab?: TabType;
}

export interface GamificationState {
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: string;
  totalXp: number;
  level: number;
  levelTitle: string;
  todayMinutesStudied: number;
  weeklyHoursStudied: number;
}
