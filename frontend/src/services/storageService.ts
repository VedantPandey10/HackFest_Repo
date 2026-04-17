
import { InterviewSession, AdminConfig, EvaluationResult, Candidate, JobPost, Question, RoleSettings } from "../types";
import { supabase } from "./supabaseClient";

const SESSIONS_KEY = 'reicrew_sessions_v2';
const CONFIG_KEY = 'reicrew_config_v2';
const JOBS_KEY = 'reicrew_jobs_v2';
const ADMIN_KEY = 'reicrew_admins_v2';

const DEFAULT_SETTINGS: RoleSettings = {

  difficulty: 'Medium',
  preset: 'Normal',
  weights: {
    concept: 50,
    grammar: 20,
    fluency: 20,
    camera: 10
  },
  proctoring: {
    maxWarnings: 3,
    sensitivity: 'Medium',
    includeInScore: true
  }
};

// Seed Data for Jobs with HR Reference Logic
const SEED_JOBS: JobPost[] = [
  {
    id: 'job-frontend',
    title: 'Senior Frontend Engineer',
    description: 'React, TypeScript, and Performance Optimization focus.',
    status: 'ACTIVE',
    settings: { ...DEFAULT_SETTINGS, difficulty: 'Hard', preset: 'Strict' },
    questions: [
      {
        id: 1,
        text: "Explain the concept of the Virtual DOM in React and how it improves performance.",
        difficulty: 'Medium',
        topic: 'React Internals',
        referenceAnswer: "The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React updates the Virtual DOM first, compares it with the previous version (diffing), and only updates the actual DOM nodes that changed (reconciliation). This minimizes slow browser layout reflows.",
        keyPoints: [
          "In-memory representation",
          "Diffing algorithm",
          "Reconciliation",
          "Minimizes reflows/repaints"
        ],
        maxScore: 10
      },
      {
        id: 2,
        text: "What is the difference between useMemo and useCallback?",
        difficulty: 'Easy',
        topic: 'React Hooks',
        referenceAnswer: "useMemo caches the *result* of a calculation between renders. useCallback caches the *function definition* itself. Both rely on a dependency array to invalidate the cache.",
        keyPoints: [
          "useMemo caches values",
          "useCallback caches functions",
          "Dependency array",
          "Referential equality"
        ],
        maxScore: 10
      },
      {
        id: 3,
        text: "How would you handle global state in a complex React application?",
        difficulty: 'Hard',
        topic: 'Architecture',
        referenceAnswer: "For complex apps, I separate server state (TanStack Query) from client state. For client state, I avoid Prop Drilling by using Context for static data (themes) and libraries like Zustand or Redux Toolkit for complex, frequent updates.",
        keyPoints: [
          "Server vs Client state separation",
          "Context API limitations",
          "Redux/Zustand for complex state",
          "Avoid prop drilling"
        ],
        maxScore: 10
      }
    ]
  },
  {
    id: 'job-backend',
    title: 'Backend API Developer',
    description: 'Node.js, Systems Design, and Database focus.',
    status: 'ACTIVE',
    settings: DEFAULT_SETTINGS,
    questions: [
      {
        id: 1,
        text: "Explain the Event Loop in Node.js.",
        difficulty: 'Hard',
        topic: 'Node Runtime',
        referenceAnswer: "Node.js is single-threaded but non-blocking. The Event Loop offloads I/O operations to the system kernel. When operations complete, their callbacks are queued in phases (timers, I/O, check/immediate, close).",
        keyPoints: [
          "Single-threaded",
          "Non-blocking I/O",
          "Phases (Timers, Poll, Check)",
          "Call stack vs Callback queue"
        ],
        maxScore: 10
      },
      {
        id: 2,
        text: "What are the ACID properties in databases?",
        difficulty: 'Medium',
        topic: 'Databases',
        referenceAnswer: "Atomicity (all or nothing), Consistency (valid state), Isolation (transactions don't interfere), and Durability (committed data survives failure).",
        keyPoints: [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability"
        ],
        maxScore: 10
      }
    ]
  }
];

const DEFAULT_CONFIG: AdminConfig = {
  eyeTrackingSensitivity: 7,
  warningThreshold: 3,
  aiStrictness: 8
};

export const StorageService = {
  // --- Sessions (Database) ---

  registerAdmin: (username: string, pass: string): boolean => {
    const stored = localStorage.getItem(ADMIN_KEY);
    const admins = stored ? JSON.parse(stored) : [{ u: 'admin', p: 'admin123' }];
    if (admins.find((a: any) => a.u === username)) return false;
    admins.push({ u: username, p: pass });
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admins));
    return true;
  },

  verifyAdmin: (username: string, pass: string): boolean => {
    const stored = localStorage.getItem(ADMIN_KEY);
    const admins = stored ? JSON.parse(stored) : [{ u: 'admin', p: 'admin123' }];
    return !!admins.find((a: any) => a.u === username && a.p === pass);
  },

  getSessionsApi: async (candidateId?: number): Promise<InterviewSession[]> => {
    try {
      let query = supabase
        .from('interview_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (candidateId !== undefined) {
        query = (query as any).eq('candidate_id', candidateId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Map snake_case from DB to camelCase for frontend
      return (data || []).map((s: any) => ({
        ...s,
        overallScore: s.overall_score,
        candidateId: s.candidate_id
      }));
    } catch (e) {
      console.error("Failed to fetch sessions from Supabase", e);
      return [];
    }
  },

  saveSession: async (session: any) => {
    try {
      // Map camelCase from frontend to snake_case for DB
      const dbSession = {
        ...session,
        overall_score: session.overallScore,
        candidate_id: session.candidateId
      };
      
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert([dbSession]);
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Failed to save session to Supabase", e);
      // Fallback to local storage
      const stored = localStorage.getItem(SESSIONS_KEY);
      const sessions = stored ? JSON.parse(stored) : [];
      localStorage.setItem(SESSIONS_KEY, JSON.stringify([session, ...sessions]));
    }
  },

  // --- Candidates (Database) ---

  getAllCandidates: async (): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'candidate')
        .order('created_at', { ascending: false });
      if (error) throw error;
      
      // Map snake_case to camelCase
      return (data || []).map((p: any) => ({
        ...p,
        name: p.full_name,
        isVerified: p.is_verified
      }));
    } catch (e) {
      console.error("Failed to fetch candidates from Supabase", e);
      return [];
    }
  },

  addCandidate: async (candidateData: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{ 
          full_name: candidateData.name,
          email: candidateData.email,
          phone: candidateData.phone,
          role: 'candidate',
          is_verified: candidateData.isVerified || false
        }]);
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Failed to add candidate directly to Supabase", e);
      throw e;
    }
  },

  bulkAddCandidates: async (candidates: any[]) => {
    try {
      if (candidates.length === 0) return [];
      const formatted = candidates.map(c => ({
        full_name: c.name,
        email: c.email,
        phone: c.phone,
        role: 'candidate',
        is_verified: c.isVerified || false
      }));
      const { data, error } = await supabase
        .from('profiles')
        .insert(formatted);
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Failed to bulk add candidates to Supabase", e);
      throw e;
    }
  },

  // --- Enterprise Requests (Database) ---

  submitEnterpriseRequest: async (requestData: any) => {
    const { data, error } = await supabase
      .from('enterprise_requests')
      .insert([
        {
          company_name: requestData.companyName,
          contact_name: requestData.contactName,
          email: requestData.email,
          phone: requestData.phone,
          team_size: requestData.teamSize,
          password: requestData.password,
          status: 'pending'
        }
      ]);
    if (error) throw error;
    return data;
  },

  getEnterpriseRequests: async () => {
    const { data, error } = await supabase
      .from('enterprise_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  approveEnterpriseRequest: async (id: number) => {
    const { data, error } = await supabase
      .from('enterprise_requests')
      .update({ status: 'approved', reviewed_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  rejectEnterpriseRequest: async (id: number, notes?: string) => {
    const { data, error } = await supabase
      .from('enterprise_requests')
      .update({ 
        status: 'rejected', 
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
    return data;
  },

  // --- Local Settings & Metadata ---

  getJobs: (): JobPost[] => {
    const stored = localStorage.getItem(JOBS_KEY);
    if (!stored) {
      localStorage.setItem(JOBS_KEY, JSON.stringify(SEED_JOBS));
      return SEED_JOBS;
    }
    return JSON.parse(stored);
  },

  getJobById: (id: string): JobPost | undefined => {
    return StorageService.getJobs().find(j => j.id === id);
  },

  getConfig: (): AdminConfig => {
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
  },

  saveConfig: (config: AdminConfig) => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  saveJobs: (jobs: JobPost[]) => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }
};
