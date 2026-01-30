import { FeedbackEntry, ResearchExportEntry } from "./types";

const STORAGE_KEY = "decretum_feedback_v1";

export function getStoredFeedback(): FeedbackEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveFeedback(entry: FeedbackEntry): void {
  try {
    const existing = getStoredFeedback();
    // Remove existing entry for same queryId + decisionId
    const filtered = existing.filter(
      (e) => !(e.queryId === entry.queryId && e.decisionId === entry.decisionId)
    );
    const updated = [...filtered, entry];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save feedback:", error);
  }
}

export function getFeedbackForDecision(
  queryId: string,
  decisionId: string
): FeedbackEntry | null {
  const all = getStoredFeedback();
  return (
    all.find((e) => e.queryId === queryId && e.decisionId === decisionId) ||
    null
  );
}

export function exportFeedbackJSON(entries: FeedbackEntry[]): void {
  const dataStr = JSON.stringify(entries, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `decretum_feedback_${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportFeedbackCSV(entries: FeedbackEntry[]): void {
  if (entries.length === 0) return;

  const headers = [
    "queryId",
    "decisionId",
    "value",
    "timestamp",
    "queryText",
    "decisionTitle",
    "court",
    "date",
    "scoreAtTime",
    "matchedTerms",
  ];

  const rows = entries.map((entry) => [
    entry.queryId,
    entry.decisionId,
    entry.value,
    entry.timestamp.toString(),
    escapeCSV(entry.queryText),
    escapeCSV(entry.decisionTitle),
    escapeCSV(entry.court),
    escapeCSV(entry.date),
    entry.scoreAtTime.toString(),
    escapeCSV(entry.matchedTerms.join("; ")),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `decretum_feedback_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// This export is intended for academic evaluation of AI-assisted legal search systems
const CLICK_LOG_KEY = "decretum_click_log_v1";

export type ClickLogEntry = {
  queryId: string;
  decisionId: string;
  timestamp: number;
};

export function logDecisionClick(queryId: string, decisionId: string): void {
  try {
    const existing = getStoredClickLogs();
    const newEntry: ClickLogEntry = {
      queryId,
      decisionId,
      timestamp: Date.now(),
    };
    // Avoid duplicates (same queryId + decisionId within 1 hour)
    const recent = existing.filter(
      (e) =>
        !(
          e.queryId === queryId &&
          e.decisionId === decisionId &&
          Date.now() - e.timestamp < 3600000
        )
    );
    const updated = [...recent, newEntry];
    localStorage.setItem(CLICK_LOG_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to log click:", error);
  }
}

function getStoredClickLogs(): ClickLogEntry[] {
  try {
    const stored = localStorage.getItem(CLICK_LOG_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// This export is intended for academic evaluation of AI-assisted legal search systems
// Build research export data from feedback entries and click logs
export function buildResearchExportData(): ResearchExportEntry[] {
  const feedbackEntries = getStoredFeedback();
  const clickLogs = getStoredClickLogs();
  
  // Create a map of clicks for quick lookup
  const clickMap = new Set(
    clickLogs.map((log) => `${log.queryId}:${log.decisionId}`)
  );

  return feedbackEntries.map((entry) => ({
    queryId: entry.queryId,
    queryText: entry.queryText,
    decisionId: entry.decisionId,
    decisionTitle: entry.decisionTitle,
    court: entry.court,
    date: entry.date,
    systemRelevanceScore: entry.scoreAtTime,
    userFeedback: entry.value,
    matchedTerms: entry.matchedTerms,
    clicked: clickMap.has(`${entry.queryId}:${entry.decisionId}`),
    timestamp: entry.timestamp,
  }));
}

export function exportResearchJSON(data: ResearchExportEntry[]): void {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  link.href = url;
  link.download = `decretum_research_export_${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportResearchCSV(data: ResearchExportEntry[]): void {
  if (data.length === 0) return;

  const headers = [
    "queryId",
    "queryText",
    "decisionId",
    "decisionTitle",
    "court",
    "date",
    "systemRelevanceScore",
    "userFeedback",
    "matchedTerms",
    "clicked",
    "timestamp",
  ];

  const rows = data.map((entry) => [
    entry.queryId,
    escapeCSV(entry.queryText),
    entry.decisionId,
    escapeCSV(entry.decisionTitle),
    escapeCSV(entry.court),
    escapeCSV(entry.date),
    entry.systemRelevanceScore.toString(),
    entry.userFeedback,
    escapeCSV(entry.matchedTerms.join("; ")),
    entry.clicked ? "true" : "false",
    entry.timestamp.toString(),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
  link.href = url;
  link.download = `decretum_research_export_${dateStr}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

