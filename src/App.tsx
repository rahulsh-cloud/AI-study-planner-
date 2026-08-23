import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { FocusTimerModal } from './components/study/FocusTimerModal';
import { AuthModal } from './components/auth/AuthModal';
import { LoginPage } from './components/auth/LoginPage';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { SyllabusView } from './components/syllabus/SyllabusView';
import { AIPlannerView } from './components/planner/AIPlannerView';
import { TimetableView } from './components/timetable/TimetableView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { ExamsView } from './components/exams/ExamsView';
import { RevisionView } from './components/revision/RevisionView';
import { AIQuizView } from './components/quiz/AIQuizView';
import { AIAssistantView } from './components/assistant/AIAssistantView';
import { ResourcesView } from './components/resources/ResourcesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AchievementsView } from './components/achievements/AchievementsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { activeTab, hasCompletedOnboarding, isAuthenticated } = useStudy();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'subjects':
        return <SubjectsView />;
      case 'syllabus':
        return <SyllabusView />;
      case 'planner':
        return <AIPlannerView />;
      case 'timetable':
        return <TimetableView />;
      case 'tasks':
        return <TasksView />;
      case 'calendar':
        return <CalendarView />;
      case 'exams':
        return <ExamsView />;
      case 'revision':
        return <RevisionView />;
      case 'quiz':
        return <AIQuizView />;
      case 'assistant':
        return <AIAssistantView />;
      case 'resources':
        return <ResourcesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      <div className="flex flex-1 min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

        {/* Main Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Global Modals */}
      <FocusTimerModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainAppContent />
    </StudyProvider>
  );
}
