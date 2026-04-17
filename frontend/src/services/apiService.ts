
import { GoogleGenAI } from "@google/genai";
import { Candidate, EvaluationResult, Question, RoleSettings, VisualMetrics } from "../types";
import { StorageService } from "./storageService";

// ── Singleton AI Client ──────────────────────────────────────────────────────
let aiInstance: GoogleGenAI | null = null;
const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (!apiKey || !apiKey.startsWith('AIza')) {
      throw new Error("VITE_API_KEY is missing or invalid in your .env.local file.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// gemini-2.0-flash: free-tier, stable, supports PDF multimodal input
const MODEL = "gemini-2.0-flash";

// Session storage key for cached questions
const SESSION_QUESTIONS_KEY = 'reicrew_questions_v3';

// ── High-quality fallback questions (if Gemini is unavailable) ────────────────
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 9001,
    text: "Walk me through your most impactful technical project — your role, the key architectural decisions, and what the outcome was.",
    difficulty: "Medium", topic: "Experience",
    referenceAnswer: "Should describe a specific project with clear ownership, technical decisions with rationale, and measurable results.",
    keyPoints: ["Own contribution", "Technical decisions", "Architecture choices", "Measurable outcome"],
    maxScore: 10
  },
  {
    id: 9002,
    text: "Describe the most difficult bug you have ever debugged. How did you isolate it, and what was the root cause?",
    difficulty: "Medium", topic: "Problem Solving",
    referenceAnswer: "Should walk through a systematic process: reproducing the bug, eliminating variables, forming and testing hypotheses, and the ultimate fix.",
    keyPoints: ["Reproduction strategy", "Isolation approach", "Root cause identification", "Prevention applied"],
    maxScore: 10
  },
  {
    id: 9003,
    text: "How would you design a system that needs to handle 10x its current load? Walk me through the approach.",
    difficulty: "Hard", topic: "System Design",
    referenceAnswer: "Should cover horizontal scaling, caching, database read replicas/sharding, async queues, CDN, and monitoring.",
    keyPoints: ["Horizontal scaling", "Caching strategy", "Database scaling", "Observability"],
    maxScore: 10
  },
  {
    id: 9004,
    text: "Tell me about a time you had to make a significant technical decision with incomplete information. How did you decide?",
    difficulty: "Hard", topic: "Decision Making",
    referenceAnswer: "Should describe gathering available data, consulting stakeholders, making a time-bounded decision, and evaluating the outcome.",
    keyPoints: ["Data gathering", "Stakeholder input", "Decision framework", "Outcome reflection"],
    maxScore: 10
  },
  {
    id: 9005,
    text: "How do you ensure code quality across a fast-moving team? What practices are non-negotiable for you?",
    difficulty: "Medium", topic: "Engineering Practices",
    referenceAnswer: "Should mention testing pyramid, code review culture, CI/CD, linting, documentation, and managing technical debt.",
    keyPoints: ["Testing strategy", "Code review process", "CI/CD", "Technical debt management"],
    maxScore: 10
  }
];

// ── Detect resume type ────────────────────────────────────────────────────────
const isPdfDataUrl = (s: string) => s.startsWith('data:application/pdf;base64,');
const isUsableText  = (s: string) => !s.startsWith('data:') && s.length > 80;

// ── Strip markdown fences from Gemini response ────────────────────────────────
const extractJSON = (raw: string): string => {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
  }
  // Sometimes Gemini wraps the array in an object key like {"questions": [...]}
  // Try to extract just the array
  const arrayMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
  if (arrayMatch) return arrayMatch[0];
  return text;
};

// ── Build Gemini contents based on resume type ────────────────────────────────
const buildContents = (position: string, resumeText?: string) => {
  const questionPromptSuffix = `
POSITION APPLIED FOR: ${position}

TASK: Generate exactly 5 interview questions.

STRICT RULES:
1. Read the resume CAREFULLY. Base questions DIRECTLY on:
   - Specific technologies, languages, and frameworks mentioned
   - Projects the candidate has worked on (ask about architecture, challenges, outcomes)
   - Work experience and roles listed
   - Skills and certifications found in the resume
2. Progress difficulty: Q1 Easy-Medium, Q2 Medium, Q3 Hard, Q4 Hard, Q5 Very Hard.
3. Questions must require detailed technical explanations — no yes/no answers.
4. Include questions about:
   - Technical implementation of specific projects from the resume
   - Technology choices and trade-offs they have made
   - Domain-specific knowledge relevant to their experience
5. NEVER ask "tell me about yourself", "what are your strengths", or generic personality questions.
6. Each question must have: referenceAnswer (2-3 sentences of ideal coverage) + 4 keyPoints (must-mention concepts).

Respond ONLY with a JSON array. No markdown, no explanation:
[
  {
    "text": "specific technical question tied to resume",
    "difficulty": "Medium",
    "topic": "specific topic from resume",
    "referenceAnswer": "what a great answer covers",
    "keyPoints": ["concept1", "concept2", "concept3", "concept4"]
  }
]`;

  if (resumeText && isPdfDataUrl(resumeText)) {
    // ── MULTIMODAL: Send PDF directly — Gemini reads it natively ──────────
    const base64Data = resumeText.replace('data:application/pdf;base64,', '');
    return [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: `You are a senior technical interviewer. The following is the candidate's resume as a PDF.
Analyze the resume thoroughly — extract their skills, tech stack, projects, and work experience.
${questionPromptSuffix}`
          }
        ]
      }
    ];
  } else if (resumeText && isUsableText(resumeText)) {
    // ── TEXT: Resume is plain text ─────────────────────────────────────────
    return [
      {
        role: 'user',
        parts: [
          {
            text: `You are a senior technical interviewer. Here is the candidate's resume:

=== RESUME START ===
${resumeText.substring(0, 4000)}
=== RESUME END ===

${questionPromptSuffix}`
          }
        ]
      }
    ];
  } else {
    // ── NO RESUME: Ask strong role-specific questions ──────────────────────
    return [
      {
        role: 'user',
        parts: [
          {
            text: `You are a senior technical interviewer. No resume is provided.
Generate 5 strong technical interview questions for a ${position} role.
Questions should test system design, debugging, architecture, and coding best practices.
${questionPromptSuffix}`
          }
        ]
      }
    ];
  }
};

// ── Generate resume-aware questions via Gemini ────────────────────────────────
const generateQuestionsWithAI = async (candidate: Candidate): Promise<Question[]> => {
  const position = candidate.position || "Software Engineer";
  const { resumeText } = candidate;

  const hasPdf  = !!(resumeText && isPdfDataUrl(resumeText));
  const hasText = !!(resumeText && isUsableText(resumeText));

  console.log('[AI] Generating questions:', {
    position,
    resumeType: hasPdf ? 'PDF' : hasText ? 'TEXT' : 'NONE',
    resumeSize: resumeText?.length ?? 0
  });

  const contents = buildContents(position, resumeText);

  const response = await getAI().models.generateContent({
    model: MODEL,
    contents: contents as any
  });

  const rawText = response.text || "";
  console.log('[AI] Raw response (first 300 chars):', rawText.substring(0, 300));

  const jsonText = extractJSON(rawText);
  const data = JSON.parse(jsonText);

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("AI returned empty or invalid data");
  }

  const questions: Question[] = data.slice(0, 5).map((q: any, idx: number) => ({
    id: 8000 + idx,
    text: String(q.text || "").trim(),
    difficulty: String(q.difficulty || "Medium"),
    topic: String(q.topic || "General"),
    referenceAnswer: String(q.referenceAnswer || ""),
    keyPoints: Array.isArray(q.keyPoints) ? q.keyPoints.map(String) : [],
    maxScore: 10
  }));

  console.log(`[AI] ✅ Generated ${questions.length} questions from ${hasPdf ? 'PDF resume' : hasText ? 'text resume' : 'no resume'}`);
  console.log('[AI] Q1:', questions[0]?.text?.substring(0, 100));
  console.log('[AI] Q2:', questions[1]?.text?.substring(0, 100));

  return questions;
};

// ── startInterview — generates all questions upfront and caches them ──────────
export const startInterview = async (candidate: Candidate): Promise<{
  question: Question;
  totalQuestions: number;
  settings?: RoleSettings;
}> => {
  // Clear stale cache from any previous session or old version
  ['reicrew_interview_questions', 'reicrew_interview_questions_v2', SESSION_QUESTIONS_KEY,
   'current_interview_questions', 'ai_generated_questions'].forEach(k => sessionStorage.removeItem(k));

  let questions: Question[] = [];
  let settings: RoleSettings | undefined;

  // 1. Use HR-configured job questions if the candidate has a role assigned
  if (candidate.jobPostId) {
    const job = StorageService.getJobById(candidate.jobPostId);
    if (job?.questions?.length) {
      questions = [...job.questions];
      settings = job.settings;
      console.log(`[Interview] Using ${questions.length} HR-configured questions for: ${job.title}`);
    }
  }

  // 2. Generate AI questions (with resume context)
  if (questions.length === 0) {
    try {
      questions = await generateQuestionsWithAI(candidate);
    } catch (err: any) {
      console.error("[Interview] AI generation failed, using fallback:", err?.message ?? err);
      questions = FALLBACK_QUESTIONS.map(q => ({ ...q }));
    }
  }

  if (questions.length === 0) {
    questions = FALLBACK_QUESTIONS.map(q => ({ ...q }));
  }

  // Cache ALL questions — submitAnswer uses them to advance
  sessionStorage.setItem(SESSION_QUESTIONS_KEY, JSON.stringify(questions));
  console.log(`[Interview] Ready: ${questions.length} questions queued.`);

  return { question: questions[0], totalQuestions: questions.length, settings };
};

// ── submitAnswer — evaluates the answer and returns the next question ─────────
export const submitAnswer = async (
  candidate: Candidate,
  currentQuestion: Question,
  answer: string,
  visualMetrics?: VisualMetrics,
  settings?: RoleSettings
): Promise<{ evaluation: EvaluationResult; nextQuestion: Question | null }> => {

  const keyPoints = currentQuestion.keyPoints || [];
  const preset = settings?.preset || "Normal";

  let persona = "You are a rigorous but fair technical interviewer.";
  if (preset === "Strict") persona += " Be highly critical — deduct for vagueness and missing key concepts.";
  if (preset === "Relaxed") persona += " Be encouraging and give benefit of the doubt for minor gaps.";

  const evalPrompt = `${persona}

QUESTION: "${currentQuestion.text}"
REFERENCE ANSWER: "${currentQuestion.referenceAnswer || 'A clear, technical, structured response.'}"
REQUIRED KEY POINTS:
${keyPoints.map(k => `- ${k}`).join("\n")}

CANDIDATE'S ANSWER:
"${answer.replace(/"/g, "'").substring(0, 2000)}"

VISUAL: Confidence ${visualMetrics?.confidenceLevel ?? "N/A"}, Expression: ${visualMetrics?.currentExpression ?? "N/A"}

Score the answer. Respond ONLY with JSON (no markdown):
{
  "contentScore": <0-10>,
  "grammarScore": <0-10>,
  "fluencyScore": <0-10>,
  "matchedKeyPoints": ["<actually covered>"],
  "missingKeyPoints": ["<not covered>"],
  "verdict": "<Pass if contentScore>=7, Borderline if 5-6, Fail if <5>",
  "feedback": "<2-3 sentence constructive feedback>",
  "expressionAnalysis": "<brief visual confidence note>"
}`;

  let evaluation: EvaluationResult;

  try {
    const evalResponse = await getAI().models.generateContent({
      model: MODEL,
      contents: evalPrompt
    });

    const evalData = JSON.parse(extractJSON(evalResponse.text || "{}"));

    evaluation = {
      questionId:         currentQuestion.id,
      questionText:       currentQuestion.text,
      userAnswer:         answer,
      contentScore:       Number(evalData.contentScore ?? 5),
      grammarScore:       Number(evalData.grammarScore ?? 5),
      fluencyScore:       Number(evalData.fluencyScore ?? 5),
      communicationScore: (Number(evalData.grammarScore ?? 5) + Number(evalData.fluencyScore ?? 5)) / 2,
      matchedKeyPoints:   Array.isArray(evalData.matchedKeyPoints) ? evalData.matchedKeyPoints : [],
      missingKeyPoints:   Array.isArray(evalData.missingKeyPoints) ? evalData.missingKeyPoints : keyPoints,
      verdict:            ["Pass", "Borderline", "Fail"].includes(evalData.verdict) ? evalData.verdict : "Borderline",
      feedback:           evalData.feedback || "Answer recorded.",
      confidenceScore:    visualMetrics?.confidenceLevel ?? 0,
      expressionAnalysis: evalData.expressionAnalysis || "N/A",
      timestamp:          new Date().toISOString()
    };

  } catch (err) {
    console.error("[Evaluation] AI failed:", err);
    evaluation = {
      questionId: currentQuestion.id, questionText: currentQuestion.text, userAnswer: answer,
      contentScore: 5, grammarScore: 5, fluencyScore: 5, communicationScore: 5,
      matchedKeyPoints: [], missingKeyPoints: keyPoints,
      verdict: "Borderline",
      feedback: "System could not generate feedback. Answer recorded for manual review.",
      confidenceScore: visualMetrics?.confidenceLevel ?? 0,
      expressionAnalysis: "N/A", timestamp: new Date().toISOString()
    };
  }

  // ── Find next question ─────────────────────────────────────────────────────
  let nextQuestion: Question | null = null;
  let allQuestions: Question[] = [];

  if (candidate.jobPostId) {
    const job = StorageService.getJobById(candidate.jobPostId);
    if (job?.questions?.length) allQuestions = job.questions;
  }

  if (allQuestions.length === 0) {
    try {
      const cached = sessionStorage.getItem(SESSION_QUESTIONS_KEY);
      if (cached) allQuestions = JSON.parse(cached);
    } catch {
      console.error("[Interview] Could not read cached questions from sessionStorage");
    }
  }

  if (allQuestions.length > 0) {
    const idx = allQuestions.findIndex(q => q.id === currentQuestion.id);
    console.log(`[Interview] Q${idx + 1}/${allQuestions.length} answered`);
    if (idx >= 0 && idx < allQuestions.length - 1) {
      nextQuestion = allQuestions[idx + 1];
      console.log(`[Interview] Next: "${nextQuestion.text.substring(0, 80)}..."`);
    } else {
      console.log("[Interview] ✅ All questions answered!");
    }
  }

  return { evaluation, nextQuestion };
};
