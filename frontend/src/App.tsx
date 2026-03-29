import * as React from 'react';
const { useState, useEffect } = React;
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from './components/LandingPage';
import { HomePage } from './components/HomePage';
import { HowItWorks } from './components/HowItWorks';
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
import { supabase } from './services/supabaseClient';
import { useTheme } from './context/ThemeContext';

enum AppView {
  HOME,
  LANDING,
  LEARN_HOW_IT_WORKS,
  AUTHENTICATED,
  ADMIN
}

export default function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [sidebarView, setSidebarView] = useState<SidebarView>('DASHBOARD');
  
  // Custom navigation wrapper to sync with browser history
  const navigateTo = React.useCallback((newView: AppView, newSidebarView?: SidebarView) => {
    const nextSidebarView = newSidebarView || sidebarView;
    if (newView !== view || nextSidebarView !== sidebarView) {
      window.history.pushState({ appView: newView, sidebarView: nextSidebarView }, '', '');
      setView(newView);
      if (newSidebarView) setSidebarView(newSidebarView);
    }
  }, [view, sidebarView]);

  // Sync initial state and listen for back/forward buttons
  useEffect(() => {
    // Current history state
    const currentState = window.history.state;

    // 1. If we have NO state, initialize with HOME
    if (currentState === null) {
      console.log("App initialized: No history state found. Defaulting to HOME.");
      window.history.replaceState({ appView: AppView.HOME, sidebarView: 'DASHBOARD' }, '', '');
      setView(AppView.HOME);
    } 
    // 2. If we DO have state, sync the view to it (handles refresh/history)
    else if (typeof currentState.appView !== 'undefined') {
      console.log("App initialized: Restoring state from history:", currentState.appView);
      setView(currentState.appView as AppView);
      if (currentState.sidebarView) setSidebarView(currentState.sidebarView as SidebarView);
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        if (typeof event.state.appView !== 'undefined') {
          setView(event.state.appView as AppView);
        }
        if (typeof event.state.sidebarView !== 'undefined') {
          setSidebarView(event.state.sidebarView as SidebarView);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [showAuthModal, setShowAuthModal] = useState<AuthMode | null>(null);
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
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
          name: data.full_name || data.name || 'Candidate',
          email: data.email,
          position: data.position || 'Standard Node',
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
      {/* AnimatePresence for view transitions */}
      <AnimatePresence mode="wait">
        {!supabase && (
          <div className="fixed inset-0 z-[9999] bg-slate-900 flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full p-8 bg-slate-800 rounded-2xl border border-red-500/30 shadow-2xl shadow-red-500/10">
              <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter shimmer-text">Configuration Required</h2>
              <p className="text-slate-400 mb-6 font-medium leading-relaxed">
                Reicrew AI is running, but the <span className="text-indigo-400">Supabase environment variables</span> are missing or incorrect on Vercel.
              </p>
              <div className="bg-black/40 p-4 rounded-xl text-left border border-white/5 mb-8">
                <code className="text-xs text-indigo-300 block mb-2 opacity-70">Check Vercel Project Settings for:</code>
                <ul className="text-[11px] font-bold text-slate-500 space-y-1">
                  <li>• VITE_SUPABASE_URL</li>
                  <li>• VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-indigo-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all"
              >
                Re-check Configuration
              </button>
            </div>
          </div>
        )}

        {view === AppView.HOME && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen w-full"
          >
            <HomePage 
              onGoToLanding={() => navigateTo(AppView.LANDING)} 
              onEnterpriseCTA={() => setShowEnterpriseModal(true)}
            />
          </motion.div>
        )}
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
              onLearnMore={() => navigateTo(AppView.LEARN_HOW_IT_WORKS)}
            />
          </motion.div>
        )}

        {view === AppView.LEARN_HOW_IT_WORKS && (
          <motion.div 
            key="how-it-works"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen w-full"
          >
            <HowItWorks onBack={() => navigateTo(AppView.LANDING)} />
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
                navigateTo(AppView.AUTHENTICATED, v);
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
            <AdminDashboard onLogout={() => { setIsAdminAuthenticated(false); navigateTo(AppView.LANDING); }} />
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
