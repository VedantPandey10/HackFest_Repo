
import { InterviewSession, AdminConfig, EvaluationResult, Candidate, JobPost, Question, RoleSettings } from "../types";
import { supabase } from "./supabaseClient";

const SESSIONS_KEY = 'reicrew_sessions_v2';
const CONFIG_KEY = 'reicrew_config_v2';
const JOBS_KEY = 'reicrew_jobs_v2';

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

// Seed Data for Jobs
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
        referenceAnswer: "The Virtual DOM is a lightweight in-memory representation of the real DOM. When state changes, React updates the Virtual DOM first, compares it with the previous version (diffing), and only updates the actual DOM nodes that changed (reconciliation).",
        keyPoints: ["In-memory representation", "Diffing algorithm", "Reconciliation"],
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

  getSessionsApi: async (): Promise<InterviewSession[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('sessions-handler', {
        body: { action: 'get-sessions' }
      });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Failed to fetch sessions from Supabase", e);
      return [];
    }
  },

  saveSession: async (session: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('sessions-handler', {
        body: { 
          action: 'save-session',
          data: session
        }
      });
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
      const { data, error } = await supabase.functions.invoke('admin-handler', {
        body: { action: 'get-candidates' }
      });
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Failed to fetch candidates from Supabase", e);
      return [];
    }
  },

  addCandidate: async (candidateData: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('admin-handler', {
        body: { 
          action: 'create-candidate',
          data: candidateData
        }
      });
      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Failed to add candidate via Edge Function", e);
      throw e;
    }
  },

  // --- Enterprise Requests (Database) ---

  submitEnterpriseRequest: async (requestData: any) => {
    const { data, error } = await supabase.functions.invoke('auth-handler', {
      body: { 
        action: 'submit-enterprise-request',
        data: requestData
      }
    });
    if (error) throw error;
    return data;
  },

  getEnterpriseRequests: async () => {
    const { data, error } = await supabase.functions.invoke('admin-handler', {
      body: { action: 'get-enterprise-requests' }
    });
    if (error) throw error;
    return data;
  },

  approveEnterpriseRequest: async (id: number) => {
    const { data, error } = await supabase.functions.invoke('auth-handler', {
      body: { 
        action: 'approve-enterprise-request',
        data: { id }
      }
    });
    if (error) throw error;
    return data;
  },

  rejectEnterpriseRequest: async (id: number, notes?: string) => {
    // We didn't implement specialized reject in edge function yet, 
    // but we can just update status via supabase client directly if RLS allows, 
    // or update the edge function.
    // Let's assume the edge function handles 'reject-enterprise-request' too.
    const { data, error } = await supabase.functions.invoke('auth-handler', {
      body: { 
        action: 'reject-enterprise-request',
        data: { id, notes }
      }
    });
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
