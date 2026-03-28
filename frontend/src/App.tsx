import * as React from 'react';
const { useState, useEffect } = React;
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { AuthModal, AuthMode } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MainLayout } from './components/MainLayout';
import { SidebarView } from './components/Sidebar';
import { UserDashboard } from './components/UserDashboard';
import { ReportsScreen } from './components/ReportsScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { ProfileSetup } from './components/ProfileSetup';
import { CameraCheckScreen } from './components/CameraCheckScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { EnterpriseRegistrationModal } from './components/EnterpriseRegistrationModal';
import { UploadedDocuments } from './components/UploadedDocuments';
import { Candidate, EvaluationResult, WarningEvent } from './types';
import { StorageService } from './services/storageService';
import { useTheme } from './context/ThemeContext';

enum AppView {
  LANDING,
  AUTHENTICATED,
  ADMIN
}

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [showAuthModal, setShowAuthModal] = useState<AuthMode | null>(null);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const [sidebarView, setSidebarView] = useState<SidebarView>('DASHBOARD');
  const [interviewStep, setInterviewStep] = useState<'IDLE' | 'PROFILE_SETUP' | 'CAMERA_CHECK' | 'INTERVIEW' | 'SUMMARY'>('IDLE');
  
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const { theme } = useTheme();

  const [proctoringSettings, setProctoringSettings] = useState({
    eyeTracking: true,
    multiFace: true,
    tabSwitching: true
  });

  const handleAuthSuccess = (role: 'ADMIN' | 'CANDIDATE', data: any) => {
    if (role === 'ADMIN') {
      setIsAdminAuthenticated(true);
      setView(AppView.ADMIN);
    } else {
      setCandidate({
          id: data.candidateId,
          name: data.name,
          email: data.email,
          position: data.position,
          passwordHash: 'SHA256:7B9A2C...F310',
          plan: 'Professional Node',
          proctoringSettings: { ...proctoringSettings }
      } as any);
      setIsAuthenticated(true);
      setView(AppView.AUTHENTICATED);
      setSidebarView('DASHBOARD');
    }
    setShowAuthModal(null);
  };

  // Sync candidate proctoring settings when root state changes
  useEffect(() => {
    if (candidate) {
      setCandidate(prev => prev ? { ...prev, proctoringSettings } : null);
    }
  }, [proctoringSettings]);

  const handleInterviewComplete = (finalResults: EvaluationResult[], warnings: WarningEvent[], status: 'COMPLETED' | 'TERMINATED') => {
    setResults(finalResults);
    setSessionScore(85); // Placeholder for now
    setInterviewStep('SUMMARY');
  };

  const handleRestart = (fullReset: boolean) => {
    if (fullReset) {
      setIsAuthenticated(false);
      setCandidate(null);
      setResults([]);
      setSessionScore(0);
      setSidebarView('DASHBOARD');
      setInterviewStep('PROFILE_SETUP');
    }
    setView(AppView.LANDING);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans transition-colors duration-300 bg-bg-main text-text-main">
      <AnimatePresence mode="wait">
        {view === AppView.LANDING && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full"
          >
            <LandingPage 
              onCandidateLogin={() => setShowAuthModal('CANDIDATE_LOGIN')}
              onAdminLogin={() => setShowAuthModal('ADMIN_LOGIN')}
              onEnterpriseCTA={() => setShowEnterpriseModal(true)}
            />
          </motion.div>
        )}

        {view === AppView.AUTHENTICATED && isAuthenticated && candidate && (
          <motion.div 
            key="app"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="h-full w-full"
          >
            <MainLayout
              activeView={sidebarView}
              onViewChange={(v) => {
                setSidebarView(v);
                if (v === 'INTERVIEW_FLOW') setInterviewStep('PROFILE_SETUP');
              }}
              onLogout={() => handleRestart(true)}
              candidate={candidate}
              onProctoringSettingsChange={setProctoringSettings}
            >
              <div className="h-full w-full overflow-y-auto">
                {sidebarView === 'DASHBOARD' && <UserDashboard candidateId={candidate?.id as any} />}
                {sidebarView === 'REPORTS' && <ReportsScreen candidateId={candidate?.id as any} />}
                {sidebarView === 'ANALYTICS' && <AnalyticsScreen candidateId={candidate?.id as any} />}
                {sidebarView === 'UPLOADED_DOCS' && (
                  <UploadedDocuments 
                    candidate={candidate} 
                    onUpdateCandidate={setCandidate}
                  />
                )}
                {sidebarView === 'INTERVIEW_FLOW' && (
                  <div className="h-full p-6">
                    {interviewStep === 'PROFILE_SETUP' && candidate && (
                      <ProfileSetup
                        initialData={candidate}
                        onComplete={(c) => { setCandidate(c); setInterviewStep('CAMERA_CHECK'); }}
                        onViewDocs={() => setSidebarView('UPLOADED_DOCS')}
                      />
                    )}
                    {interviewStep === 'CAMERA_CHECK' && (
                      <CameraCheckScreen onComplete={() => setInterviewStep('INTERVIEW')} />
                    )}
                    {interviewStep === 'INTERVIEW' && candidate && (
                      <InterviewScreen candidate={candidate} onComplete={handleInterviewComplete} />
                    )}
                    {interviewStep === 'SUMMARY' && candidate && (
                      <SummaryScreen
                        candidate={candidate}
                        results={results}
                        overallScore={sessionScore}
                        onRestart={() => handleRestart(false)}
                      />
                    )}
                  </div>
                )}
              </div>
            </MainLayout>
          </motion.div>
        )}

        {view === AppView.ADMIN && isAdminAuthenticated && (
          <motion.div 
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full"
          >
            <AdminDashboard onLogout={() => { setIsAdminAuthenticated(false); setView(AppView.LANDING); }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            key="auth-modal"
            initialMode={showAuthModal}
            onClose={() => setShowAuthModal(null)}
            onSuccess={handleAuthSuccess}
            onAdminRegistrationRedirect={() => {
              setShowAuthModal(null);
              setShowEnterpriseModal(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEnterpriseModal && (
          <EnterpriseRegistrationModal
            key="enterprise-modal"
            onClose={() => setShowEnterpriseModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
