import { Decision } from "../CaseSearchPage";

export type FeedbackValue = "relevant" | "not_relevant";

export type FeedbackEntry = {
  queryId: string;
  decisionId: string;
  value: FeedbackValue;
  timestamp: number;
  queryText: string;
  decisionTitle: string;
  court: string;
  date: string;
  scoreAtTime: number;
  matchedTerms: string[];
};

export type RelevanceBreakdown = {
  keywordScore: number;
  titleScore: number;
  summaryScore: number;
  fullTextScore: number;
  totalScore: number;
  matchedTerms: string[];
  topTerms: string[];
};

export type DetailedRelevance = {
  breakdown: RelevanceBreakdown;
  decision: Decision;
};

// This export is intended for academic evaluation of AI-assisted legal search systems
export type ResearchExportEntry = {
  queryId: string;
  queryText: string;
  decisionId: string;
  decisionTitle: string;
  court: string;
  date: string;
  systemRelevanceScore: number;
  userFeedback: "relevant" | "not_relevant";
  matchedTerms: string[];
  clicked: boolean;
  timestamp: number;
};

