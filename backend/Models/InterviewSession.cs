using System;
using System.Collections.Generic;

namespace ReincrewBackend.Models
{
    public class InterviewSession
    {
        public int Id { get; set; }
        public int CandidateId { get; set; }
        public Candidate Candidate { get; set; } = new();
        public DateTime Date { get; set; }
        public string Status { get; set; } = "IN_PROGRESS"; // COMPLETED, TERMINATED, IN_PROGRESS
        public int OverallScore { get; set; }
        public List<EvaluationResult> Results { get; set; } = new();
        public List<WarningEvent> Warnings { get; set; } = new();
        public int DurationSeconds { get; set; }
    }

    public class EvaluationResult
    {
        public int Id { get; set; }
        public int InterviewSessionId { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string UserAnswer { get; set; } = string.Empty;
        public int ContentScore { get; set; }
        public int GrammarScore { get; set; }
        public int FluencyScore { get; set; }
        public int? CommunicationScore { get; set; }
        public List<string> MatchedKeyPoints { get; set; } = new();
        public List<string> MissingKeyPoints { get; set; } = new();
        public string Verdict { get; set; } = string.Empty; // Pass, Borderline, Fail
        public string Feedback { get; set; } = string.Empty;
        public int ConfidenceScore { get; set; }
        public string ExpressionAnalysis { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }

    public class WarningEvent
    {
        public int Id { get; set; }
        public int InterviewSessionId { get; set; }
        public DateTime Timestamp { get; set; }
        public string Type { get; set; } = string.Empty; // GAZE, FACE_MISSING, etc.
        public string Message { get; set; } = string.Empty;
    }
}
