import { 
  StudentProfile, 
  Subject, 
  Exam, 
  Task, 
  TimetableBlock, 
  AchievementBadge, 
  StudyResource, 
  SpacedRevisionItem, 
  QuizResult, 
  NotificationItem, 
  StudySessionLog,
  GamificationState
} from '../types';

export const initialStudentProfile: StudentProfile = {
  id: 'student-rahul',
  fullName: 'Rahul Sharma',
  email: 'rahul.sharma15855@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  course: 'Bachelor of Technology (B.Tech)',
  branch: 'Computer Science & Engineering',
  college: 'National Institute of Technology',
  semester: 'Semester 4',
  academicYear: '2025-2026',
  dailyStudyHours: 3.5,
  preferredStudyTime: 'Evening',
  strongSubjects: ['Data Structures & Algorithms', 'Discrete Mathematics'],
  weakSubjects: ['Database Management Systems', 'Computer Networks'],
  targetCgpa: '9.2',
  currentCgpa: '8.7',
  dailyGoalMinutes: 210, // 3.5 hrs
  weeklyGoalHours: 24,
  isOnboarded: true,
  themePreference: 'dark'
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub-dbms',
    name: 'Database Management Systems',
    code: 'CS-401',
    color: '#3B82F6', // Blue
    teacherName: 'Dr. Anita Desai',
    totalUnits: 5,
    difficulty: 'hard',
    examDate: '2026-09-04',
    importanceWeightage: 'high',
    personalStrength: 'weak',
    targetGrade: 'A+',
    topics: [
      { id: 'top-db-1', unitNumber: 1, name: 'ER Modeling & Relational Algebra', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 3, masteryScore: 90 },
      { id: 'top-db-2', unitNumber: 2, name: 'SQL DDL, DML & Advanced Joins', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 4, masteryScore: 85 },
      { id: 'top-db-3', unitNumber: 3, name: 'Normalization (1NF, 2NF, 3NF, BCNF)', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 5, masteryScore: 48, notes: 'Struggling with multi-valued dependencies & BCNF decomposition.' },
      { id: 'top-db-4', unitNumber: 4, name: 'Transactions, ACID Properties & Serializability', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 4, masteryScore: 62 },
      { id: 'top-db-5', unitNumber: 5, name: 'Concurrency Control (2PL, Timestamping, Deadlocks)', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 4, masteryScore: 50 },
      { id: 'top-db-6', unitNumber: 5, name: 'Indexing, B-Trees & B+ Trees', completed: false, difficulty: 'medium', weightage: 'medium', estimatedHours: 3, masteryScore: 40 }
    ]
  },
  {
    id: 'sub-dsa',
    name: 'Data Structures & Algorithms',
    code: 'CS-402',
    color: '#10B981', // Emerald
    teacherName: 'Prof. Vikram Sen',
    totalUnits: 5,
    difficulty: 'medium',
    examDate: '2026-09-10',
    importanceWeightage: 'high',
    personalStrength: 'strong',
    targetGrade: 'O',
    topics: [
      { id: 'top-ds-1', unitNumber: 1, name: 'Asymptotic Analysis & Recurrences', completed: true, difficulty: 'easy', weightage: 'medium', estimatedHours: 2, masteryScore: 95 },
      { id: 'top-ds-2', unitNumber: 2, name: 'Stacks, Queues & Priority Queues', completed: true, difficulty: 'easy', weightage: 'medium', estimatedHours: 3, masteryScore: 92 },
      { id: 'top-ds-3', unitNumber: 3, name: 'Binary Search Trees & AVL Rotations', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 4, masteryScore: 88 },
      { id: 'top-ds-4', unitNumber: 4, name: 'Graph Algorithms (BFS, DFS, Dijkstra, Prim)', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 5, masteryScore: 84 },
      { id: 'top-ds-5', unitNumber: 5, name: 'Dynamic Programming (Knapsack, LCS, LIS)', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 6, masteryScore: 68 },
      { id: 'top-ds-6', unitNumber: 5, name: 'Greedy Algorithms & Divide and Conquer', completed: true, difficulty: 'medium', weightage: 'medium', estimatedHours: 3, masteryScore: 90 }
    ]
  },
  {
    id: 'sub-os',
    name: 'Operating Systems',
    code: 'CS-403',
    color: '#8B5CF6', // Purple
    teacherName: 'Dr. Rajesh Kumar',
    totalUnits: 5,
    difficulty: 'medium',
    examDate: '2026-09-16',
    importanceWeightage: 'high',
    personalStrength: 'average',
    targetGrade: 'A',
    topics: [
      { id: 'top-os-1', unitNumber: 1, name: 'OS Structures & System Calls', completed: true, difficulty: 'easy', weightage: 'low', estimatedHours: 2, masteryScore: 88 },
      { id: 'top-os-2', unitNumber: 2, name: 'Process Synchronization & Semaphores', completed: true, difficulty: 'hard', weightage: 'high', estimatedHours: 5, masteryScore: 78 },
      { id: 'top-os-3', unitNumber: 3, name: 'CPU Scheduling Algorithms', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 3, masteryScore: 92 },
      { id: 'top-os-4', unitNumber: 4, name: 'Deadlock Detection, Prevention & Avoidance', completed: false, difficulty: 'medium', weightage: 'high', estimatedHours: 4, masteryScore: 60 },
      { id: 'top-os-5', unitNumber: 5, name: 'Virtual Memory, Paging & Page Replacement', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 5, masteryScore: 55 }
    ]
  },
  {
    id: 'sub-cn',
    name: 'Computer Networks',
    code: 'CS-404',
    color: '#F59E0B', // Amber
    teacherName: 'Prof. Meera Pillai',
    totalUnits: 5,
    difficulty: 'hard',
    examDate: '2026-09-22',
    importanceWeightage: 'high',
    personalStrength: 'weak',
    targetGrade: 'A',
    topics: [
      { id: 'top-cn-1', unitNumber: 1, name: 'OSI vs TCP/IP Models & Physical Layer', completed: true, difficulty: 'easy', weightage: 'low', estimatedHours: 2, masteryScore: 85 },
      { id: 'top-cn-2', unitNumber: 2, name: 'Data Link Layer: Framing, CRC & Sliding Window', completed: true, difficulty: 'medium', weightage: 'high', estimatedHours: 4, masteryScore: 80 },
      { id: 'top-cn-3', unitNumber: 3, name: 'Network Layer: IPv4/IPv6 Subnetting & CIDR', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 5, masteryScore: 52 },
      { id: 'top-cn-4', unitNumber: 4, name: 'Routing Protocols (OSPF, BGP, Distance Vector)', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 4, masteryScore: 45 },
      { id: 'top-cn-5', unitNumber: 5, name: 'Transport Layer: TCP Congestion Control & UDP', completed: false, difficulty: 'hard', weightage: 'high', estimatedHours: 5, masteryScore: 58 }
    ]
  },
  {
    id: 'sub-math',
    name: 'Discrete Mathematics',
    code: 'MA-401',
    color: '#EC4899', // Pink
    teacherName: 'Dr. Sunil Menon',
    totalUnits: 4,
    difficulty: 'medium',
    examDate: '2026-09-28',
    importanceWeightage: 'medium',
    personalStrength: 'strong',
    targetGrade: 'A+',
    topics: [
      { id: 'top-ma-1', unitNumber: 1, name: 'Propositional & Predicate Logic', completed: true, difficulty: 'easy', weightage: 'medium', estimatedHours: 3, masteryScore: 96 },
      { id: 'top-ma-2', unitNumber: 2, name: 'Set Theory, Relations & Equivalence', completed: true, difficulty: 'easy', weightage: 'medium', estimatedHours: 3, masteryScore: 92 },
      { id: 'top-ma-3', unitNumber: 3, name: 'Combinatorics & Generating Functions', completed: true, difficulty: 'hard', weightage: 'high', estimatedHours: 4, masteryScore: 82 },
      { id: 'top-ma-4', unitNumber: 4, name: 'Graph Theory (Euler, Hamiltonian, Planar Graphs)', completed: false, difficulty: 'medium', weightage: 'high', estimatedHours: 4, masteryScore: 70 }
    ]
  }
];

export const initialExams: Exam[] = [
  {
    id: 'exam-1',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS-401',
    examName: 'Mid-Semester Theory Examination',
    examDate: '2026-09-04',
    startTime: '10:00 AM',
    durationMinutes: 180,
    weightagePercentage: 40,
    targetMarks: 88,
    totalMarks: 100,
    syllabusUnitsCovered: 'Units 1, 2, 3 & 4 (ER, SQL, Normalization, ACID)',
    priority: 'critical',
    notes: 'Heavy weightage on BCNF decomposition and Serializability graph checks.'
  },
  {
    id: 'exam-2',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS-402',
    examName: 'Midterm Theory & Lab Practical',
    examDate: '2026-09-10',
    startTime: '02:00 PM',
    durationMinutes: 180,
    weightagePercentage: 40,
    targetMarks: 95,
    totalMarks: 100,
    syllabusUnitsCovered: 'Units 1 through 5 (BST, AVL, DP, Graphs)',
    priority: 'high',
    notes: 'Prepare C++ code for AVL rotations and Dijkstra.'
  },
  {
    id: 'exam-3',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    subjectCode: 'CS-403',
    examName: 'Midterm Examination',
    examDate: '2026-09-16',
    startTime: '10:00 AM',
    durationMinutes: 120,
    weightagePercentage: 35,
    targetMarks: 85,
    totalMarks: 100,
    syllabusUnitsCovered: 'Units 1 to 4 (Processes, Threads, Scheduling, Semaphores)',
    priority: 'high'
  },
  {
    id: 'exam-4',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    subjectCode: 'CS-404',
    examName: 'Midterm Written Examination',
    examDate: '2026-09-22',
    startTime: '10:00 AM',
    durationMinutes: 120,
    weightagePercentage: 35,
    targetMarks: 82,
    totalMarks: 100,
    syllabusUnitsCovered: 'Units 1, 2 & 3 (OSI, CRC, Subnetting)',
    priority: 'medium'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Solve 10 BCNF Decomposition Problems',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    topicName: 'Normalization',
    priority: 'urgent',
    estimatedMinutes: 50,
    deadline: '2026-08-23',
    status: 'pending',
    difficulty: 'hard',
    isAiGenerated: true,
    notes: 'Identified as critical weak spot (48% mastery score).'
  },
  {
    id: 'task-2',
    title: 'Practice 0/1 Knapsack & Subset Sum in DP',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    topicName: 'Dynamic Programming',
    priority: 'high',
    estimatedMinutes: 45,
    deadline: '2026-08-23',
    status: 'in_progress',
    difficulty: 'hard',
    isAiGenerated: false
  },
  {
    id: 'task-3',
    title: 'Review Banker\'s Algorithm & Resource Allocation Graph',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    topicName: 'Deadlock Detection',
    priority: 'medium',
    estimatedMinutes: 35,
    deadline: '2026-08-24',
    status: 'pending',
    difficulty: 'medium',
    isAiGenerated: true
  },
  {
    id: 'task-4',
    title: 'CIDR Subnet Mask Calculation Drills',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    topicName: 'IPv4 Subnetting',
    priority: 'high',
    estimatedMinutes: 40,
    deadline: '2026-08-24',
    status: 'pending',
    difficulty: 'hard',
    isAiGenerated: true
  },
  {
    id: 'task-5',
    title: 'Write SQL Queries for Group By & Nested Subqueries',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    topicName: 'SQL Advanced Joins',
    priority: 'medium',
    estimatedMinutes: 30,
    deadline: '2026-08-22',
    status: 'completed',
    completedAt: '2026-08-22T20:15:00Z',
    difficulty: 'medium'
  },
  {
    id: 'task-6',
    title: 'Implement AVL Tree Left-Right Rotations in C++',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    topicName: 'AVL Trees',
    priority: 'high',
    estimatedMinutes: 60,
    deadline: '2026-08-21',
    status: 'completed',
    completedAt: '2026-08-21T18:40:00Z',
    difficulty: 'medium'
  },
  {
    id: 'task-7',
    title: 'Understand 2-Phase Locking (2PL) Concurrency Protocol',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    topicName: 'Concurrency Control',
    priority: 'urgent',
    estimatedMinutes: 45,
    deadline: '2026-08-21',
    status: 'missed',
    difficulty: 'hard',
    isAiGenerated: true,
    notes: 'Missed due to college project lab. AI Reschedule recommended!'
  }
];

export const initialTimetableBlocks: TimetableBlock[] = [
  // Monday
  { id: 'tt-m-1', day: 'Monday', startTime: '09:00', endTime: '16:00', type: 'college', title: 'College Lectures & Lab', color: 'slate' },
  { id: 'tt-m-2', day: 'Monday', startTime: '17:30', endTime: '19:00', type: 'study', title: 'DBMS: Normalization & BCNF', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'blue' },
  { id: 'tt-m-3', day: 'Monday', startTime: '19:15', endTime: '20:30', type: 'study', title: 'DSA: Dynamic Programming Knapsack', subject: 'Data Structures & Algorithms', subjectId: 'sub-dsa', color: 'emerald' },
  { id: 'tt-m-4', day: 'Monday', startTime: '21:30', endTime: '22:15', type: 'revision', title: 'Spaced Recall: SQL Joins', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'purple' },

  // Tuesday
  { id: 'tt-tu-1', day: 'Tuesday', startTime: '09:00', endTime: '16:00', type: 'college', title: 'College Classes & OS Lab', color: 'slate' },
  { id: 'tt-tu-2', day: 'Tuesday', startTime: '17:30', endTime: '19:00', type: 'study', title: 'OS: Deadlock Banker\'s Algorithm', subject: 'Operating Systems', subjectId: 'sub-os', color: 'purple' },
  { id: 'tt-tu-3', day: 'Tuesday', startTime: '19:15', endTime: '20:30', type: 'study', title: 'CN: IPv4 Subnetting & CIDR', subject: 'Computer Networks', subjectId: 'sub-cn', color: 'amber' },
  { id: 'tt-tu-4', day: 'Tuesday', startTime: '21:30', endTime: '22:00', type: 'quiz', title: 'AI Quiz: OS Scheduling', subject: 'Operating Systems', subjectId: 'sub-os', color: 'indigo' },

  // Wednesday
  { id: 'tt-w-1', day: 'Wednesday', startTime: '09:00', endTime: '16:00', type: 'college', title: 'College Lectures', color: 'slate' },
  { id: 'tt-w-2', day: 'Wednesday', startTime: '17:30', endTime: '19:00', type: 'study', title: 'DBMS: ACID & Serializability', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'blue' },
  { id: 'tt-w-3', day: 'Wednesday', startTime: '19:15', endTime: '20:30', type: 'study', title: 'Discrete Math: Graph Planarity', subject: 'Discrete Mathematics', subjectId: 'sub-math', color: 'pink' },
  { id: 'tt-w-4', day: 'Wednesday', startTime: '21:30', endTime: '22:15', type: 'revision', title: 'DSA Spaced Revision: Trees', subject: 'Data Structures & Algorithms', subjectId: 'sub-dsa', color: 'emerald' },

  // Thursday
  { id: 'tt-th-1', day: 'Thursday', startTime: '09:00', endTime: '16:00', type: 'college', title: 'College Classes', color: 'slate' },
  { id: 'tt-th-2', day: 'Thursday', startTime: '17:30', endTime: '19:00', type: 'study', title: 'CN: TCP Congestion Control', subject: 'Computer Networks', subjectId: 'sub-cn', color: 'amber' },
  { id: 'tt-th-3', day: 'Thursday', startTime: '19:15', endTime: '20:30', type: 'study', title: 'DBMS: 2PL & Concurrency', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'blue' },
  { id: 'tt-th-4', day: 'Thursday', startTime: '21:30', endTime: '22:15', type: 'quiz', title: 'AI Quiz: DBMS Normalization', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'indigo' },

  // Friday
  { id: 'tt-f-1', day: 'Friday', startTime: '09:00', endTime: '15:30', type: 'college', title: 'College Classes & Seminar', color: 'slate' },
  { id: 'tt-f-2', day: 'Friday', startTime: '17:00', endTime: '18:45', type: 'study', title: 'DSA: Longest Common Subsequence', subject: 'Data Structures & Algorithms', subjectId: 'sub-dsa', color: 'emerald' },
  { id: 'tt-f-3', day: 'Friday', startTime: '19:00', endTime: '20:30', type: 'study', title: 'OS: Virtual Memory Paging', subject: 'Operating Systems', subjectId: 'sub-os', color: 'purple' },

  // Saturday (Weekend Sprint)
  { id: 'tt-sa-1', day: 'Saturday', startTime: '09:30', endTime: '12:00', type: 'study', title: 'Deep Work: DBMS Normalization Proofs', subject: 'Database Management Systems', subjectId: 'sub-dbms', color: 'blue' },
  { id: 'tt-sa-2', day: 'Saturday', startTime: '14:00', endTime: '16:30', type: 'study', title: 'Competitive Coding & DP Drills', subject: 'Data Structures & Algorithms', subjectId: 'sub-dsa', color: 'emerald' },
  { id: 'tt-sa-3', day: 'Saturday', startTime: '17:00', endTime: '18:30', type: 'revision', title: 'Comprehensive Weekly Spaced Recall', subject: 'All Subjects', color: 'rose' },

  // Sunday
  { id: 'tt-su-1', day: 'Sunday', startTime: '10:00', endTime: '12:00', type: 'quiz', title: 'Full AI Mock Exam: DBMS & DSA', subject: 'Mixed', color: 'indigo' },
  { id: 'tt-su-2', day: 'Sunday', startTime: '15:00', endTime: '17:00', type: 'study', title: 'CN Subnetting & Routing Protocols', subject: 'Computer Networks', subjectId: 'sub-cn', color: 'amber' },
  { id: 'tt-su-3', day: 'Sunday', startTime: '19:00', endTime: '20:00', type: 'revision', title: 'Weekly Performance Review & Plan Refinement', subject: 'AI Copilot', color: 'cyan' }
];

export const initialSpacedRevisions: SpacedRevisionItem[] = [
  {
    id: 'rev-1',
    subjectId: 'sub-dbms',
    subjectName: 'DBMS',
    topicId: 'top-db-1',
    topicName: 'ER Modeling & Relational Algebra',
    stage: 4, // 7 days interval
    lastReviewedDate: '2026-08-16',
    nextDueDate: '2026-08-23',
    intervalDays: 7,
    repetitionsCount: 4,
    status: 'due_today',
    easeFactor: 2.5
  },
  {
    id: 'rev-2',
    subjectId: 'sub-dbms',
    subjectName: 'DBMS',
    topicId: 'top-db-4',
    topicName: 'Transactions & ACID Properties',
    stage: 2, // 2 days interval
    lastReviewedDate: '2026-08-20',
    nextDueDate: '2026-08-22',
    intervalDays: 2,
    repetitionsCount: 2,
    status: 'overdue',
    easeFactor: 2.1
  },
  {
    id: 'rev-3',
    subjectId: 'sub-dsa',
    subjectName: 'DSA',
    topicId: 'top-ds-3',
    topicName: 'Binary Search Trees & AVL Rotations',
    stage: 5, // 14 days interval
    lastReviewedDate: '2026-08-10',
    nextDueDate: '2026-08-24',
    intervalDays: 14,
    repetitionsCount: 5,
    status: 'pending',
    easeFactor: 2.8
  },
  {
    id: 'rev-4',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    topicId: 'top-os-2',
    topicName: 'Process Synchronization & Semaphores',
    stage: 3, // 4 days interval
    lastReviewedDate: '2026-08-19',
    nextDueDate: '2026-08-23',
    intervalDays: 4,
    repetitionsCount: 3,
    status: 'due_today',
    easeFactor: 2.3
  }
];

export const initialQuizzes: QuizResult[] = [
  {
    id: 'qres-1',
    quizTitle: 'DBMS Normalization & Functional Dependencies',
    subjectName: 'Database Management Systems',
    topicName: 'Normalization (1NF to BCNF)',
    difficulty: 'hard',
    takenAt: '2026-08-21T19:30:00Z',
    totalQuestions: 5,
    score: 2,
    percentage: 40,
    timeSpentSeconds: 280,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Which of the following normal forms eliminates transitive dependency?',
        options: ['1NF', '2NF', '3NF', '4NF'],
        correctAnswer: '3NF',
        userAnswer: '2NF',
        isCorrect: false,
        explanation: '3NF explicitly removes transitive dependencies. 2NF removes partial dependency on composite candidate keys.'
      },
      {
        id: 'q2',
        type: 'true_false',
        question: 'In BCNF, for every non-trivial FD X -> Y, X must strictly be a Superkey.',
        options: ['True', 'False'],
        correctAnswer: 'True',
        userAnswer: 'True',
        isCorrect: true,
        explanation: 'This is the strict definition of Boyce-Codd Normal Form.'
      }
    ]
  },
  {
    id: 'qres-2',
    quizTitle: 'Binary Search Trees & AVL Balancing',
    subjectName: 'Data Structures & Algorithms',
    topicName: 'Trees',
    difficulty: 'medium',
    takenAt: '2026-08-20T21:00:00Z',
    totalQuestions: 5,
    score: 5,
    percentage: 100,
    timeSpentSeconds: 195,
    questions: []
  },
  {
    id: 'qres-3',
    quizTitle: 'CPU Scheduling & Gantt Charts',
    subjectName: 'Operating Systems',
    topicName: 'CPU Scheduling',
    difficulty: 'medium',
    takenAt: '2026-08-18T18:00:00Z',
    totalQuestions: 5,
    score: 4,
    percentage: 80,
    timeSpentSeconds: 240,
    questions: []
  }
];

export const initialResources: StudyResource[] = [
  {
    id: 'res-1',
    title: 'Gate Smashers DBMS Complete Normalization Playlist',
    subjectId: 'sub-dbms',
    subjectName: 'Database Management Systems',
    topicName: 'Normalization',
    type: 'youtube',
    url: 'https://youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8C9XdK_9956Q49P4x',
    description: 'Crisp 10-minute video breakdowns of 1NF, 2NF, 3NF, BCNF with solved previous-year exam problems.',
    isFavorite: true,
    tags: ['Gate Exam', 'University Exams', 'Fast Revision'],
    addedAt: '2026-08-15'
  },
  {
    id: 'res-2',
    title: 'NeetCode 150 - Dynamic Programming Master Patterns',
    subjectId: 'sub-dsa',
    subjectName: 'Data Structures & Algorithms',
    topicName: 'Dynamic Programming',
    type: 'website',
    url: 'https://neetcode.io/practice',
    description: 'Visual breakdowns of 1D and 2D DP problems including Knapsack, LCS, and Matrix Chain Multiplication.',
    isFavorite: true,
    tags: ['LeetCode', 'Coding Interviews', 'DP'],
    addedAt: '2026-08-10'
  },
  {
    id: 'res-3',
    title: 'Silberschatz OS Concepts 10th Edition PDF Notes',
    subjectId: 'sub-os',
    subjectName: 'Operating Systems',
    topicName: 'Deadlocks & Virtual Memory',
    type: 'pdf',
    url: 'https://os-book.com',
    description: 'Core textbook reference chapter summary on Semaphores and Banker\'s algorithm.',
    isFavorite: false,
    tags: ['Textbook', 'Notes'],
    addedAt: '2026-08-12'
  },
  {
    id: 'res-4',
    title: 'Kurose & Ross Computer Networks Cheat Sheet',
    subjectId: 'sub-cn',
    subjectName: 'Computer Networks',
    topicName: 'IPv4 Subnetting',
    type: 'cheatsheet',
    url: 'https://github.com/cheat-sheets/networking',
    description: 'Formulas for CIDR subnets, TCP 3-way handshake flags, and sliding window efficiency math.',
    isFavorite: true,
    tags: ['Formula Sheet', 'Subnetting'],
    addedAt: '2026-08-18'
  }
];

export const initialAchievements: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'First Study Session',
    description: 'Completed your very first logged study session using the Focus Timer.',
    icon: '🏆',
    category: 'study_hours',
    unlocked: true,
    unlockedAt: '2026-08-10',
    progress: 1,
    maxProgress: 1,
    xpReward: 50
  },
  {
    id: 'ach-2',
    title: '7-Day Study Streak',
    description: 'Maintained consistent study habits every single day for a full week.',
    icon: '🔥',
    category: 'streak',
    unlocked: true,
    unlockedAt: '2026-08-22',
    progress: 7,
    maxProgress: 7,
    xpReward: 150
  },
  {
    id: 'ach-3',
    title: '30-Day Master Habit',
    description: 'Reach a formidable 30-day continuous study streak.',
    icon: '⚡',
    category: 'streak',
    unlocked: false,
    progress: 7,
    maxProgress: 30,
    xpReward: 500
  },
  {
    id: 'ach-4',
    title: '10 Syllabus Topics Mastered',
    description: 'Mark 10 syllabus topics completed across any subjects.',
    icon: '📚',
    category: 'mastery',
    unlocked: true,
    unlockedAt: '2026-08-19',
    progress: 12,
    maxProgress: 10,
    xpReward: 200
  },
  {
    id: 'ach-5',
    title: '50 Tasks Completed',
    description: 'Conquer 50 academic tasks in the task manager.',
    icon: '🎯',
    category: 'tasks',
    unlocked: false,
    progress: 26,
    maxProgress: 50,
    xpReward: 300
  },
  {
    id: 'ach-6',
    title: 'Quiz Champion',
    description: 'Score 100% on at least 3 AI generated topic quizzes.',
    icon: '🧠',
    category: 'quizzes',
    unlocked: false,
    progress: 1,
    maxProgress: 3,
    xpReward: 250
  },
  {
    id: 'ach-7',
    title: 'Exam Ready',
    description: 'Achieve 80%+ syllabus completion in any subject with an approaching exam.',
    icon: '🏅',
    category: 'mastery',
    unlocked: true,
    unlockedAt: '2026-08-21',
    progress: 83,
    maxProgress: 80,
    xpReward: 400
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'exam',
    title: 'DBMS Midterm in 12 Days',
    message: 'Your DBMS Exam is approaching! You still have 4 high-weightage topics pending including BCNF & 2PL.',
    timestamp: '2026-08-22T08:00:00Z',
    read: false,
    priority: 'urgent',
    actionUrl: 'exams'
  },
  {
    id: 'notif-2',
    type: 'revision',
    title: '2 Spaced Revisions Due Today',
    message: 'ER Modeling and Process Synchronization need active recall today to prevent memory decay.',
    timestamp: '2026-08-22T09:30:00Z',
    read: false,
    priority: 'high',
    actionUrl: 'revision'
  },
  {
    id: 'notif-3',
    type: 'streak',
    title: '🔥 7-Day Streak Achieved!',
    message: 'Congratulations! You unlocked the 7-Day Study Streak Badge (+150 XP).',
    timestamp: '2026-08-22T19:00:00Z',
    read: true,
    priority: 'medium',
    actionUrl: 'achievements'
  },
  {
    id: 'notif-4',
    type: 'ai_insight',
    title: 'AI Insight: DBMS Normalization Alert',
    message: 'Your quiz score of 40% indicates high risk. We added a focused 45-min review slot to your planner.',
    timestamp: '2026-08-22T21:15:00Z',
    read: false,
    priority: 'high',
    actionUrl: 'planner'
  }
];

export const initialSessions: StudySessionLog[] = [
  { id: 'sess-1', subjectId: 'sub-dsa', subjectName: 'DSA', topicName: 'AVL Trees', durationMinutes: 60, date: '2026-08-21', startTime: '18:00', endTime: '19:00', sessionType: 'deep_work', productivityRating: 5 },
  { id: 'sess-2', subjectId: 'sub-dbms', subjectName: 'DBMS', topicName: 'SQL Joins', durationMinutes: 45, date: '2026-08-21', startTime: '19:30', endTime: '20:15', sessionType: 'pomodoro', productivityRating: 4 },
  { id: 'sess-3', subjectId: 'sub-os', subjectName: 'OS', topicName: 'Semaphores', durationMinutes: 50, date: '2026-08-20', startTime: '17:30', endTime: '18:20', sessionType: 'pomodoro', productivityRating: 4 },
  { id: 'sess-4', subjectId: 'sub-math', subjectName: 'Discrete Math', topicName: 'Combinatorics', durationMinutes: 60, date: '2026-08-19', startTime: '18:00', endTime: '19:00', sessionType: 'deep_work', productivityRating: 5 },
  { id: 'sess-5', subjectId: 'sub-cn', subjectName: 'CN', topicName: 'CRC Framing', durationMinutes: 40, date: '2026-08-18', startTime: '19:00', endTime: '19:40', sessionType: 'practice', productivityRating: 3 },
  { id: 'sess-6', subjectId: 'sub-dbms', subjectName: 'DBMS', topicName: 'ER Modeling', durationMinutes: 45, date: '2026-08-17', startTime: '17:30', endTime: '18:15', sessionType: 'revision', productivityRating: 4 },
  { id: 'sess-7', subjectId: 'sub-dsa', subjectName: 'DSA', topicName: 'Binary Search', durationMinutes: 50, date: '2026-08-16', startTime: '18:00', endTime: '18:50', sessionType: 'deep_work', productivityRating: 5 }
];

export const initialGamification: GamificationState = {
  currentStreak: 7,
  longestStreak: 12,
  lastStudiedDate: '2026-08-22',
  totalXp: 780,
  level: 3,
  levelTitle: 'Consistent Scholar',
  todayMinutesStudied: 135,
  weeklyHoursStudied: 19.5
};
