import React from "react";
import { Decision } from "../CaseSearchPage";
import { RelevanceBreakdown } from "./types";

// Stop words for Turkish and English
const STOP_WORDS = new Set([
  // English
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must", "can", "this", "that", "these", "those", "it", "its", "they", "them", "their", "there", "here", "where", "when", "what", "which", "who", "how", "why",
  // Turkish
  "ve", "ile", "için", "gibi", "kadar", "daha", "çok", "az", "en", "bir", "bu", "şu", "o", "bunlar", "şunlar", "onlar", "ben", "sen", "biz", "siz", "onlar", "benim", "senin", "onun", "bizim", "sizin", "onların", "burada", "şurada", "orada", "nerede", "ne", "hangi", "kim", "nasıl", "niye", "niçin", "neden", "de", "da", "te", "ta", "mi", "mı", "mu", "mü", "ki", "ise", "ise", "olan", "ile", "bir", "birkaç", "bazı", "hep", "her", "hiç", "tüm", "bütün"
]);

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  const normalized = normalizeText(query);
  const tokens = normalized
    .split(" ")
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));
  
  // Remove duplicates
  return Array.from(new Set(tokens));
}

export function computeRelevanceDetailed(
  query: string,
  decision: Decision
): RelevanceBreakdown {
  const queryTokens = tokenizeQuery(query);
  
  if (queryTokens.length === 0) {
    return {
      keywordScore: 0,
      titleScore: 0,
      summaryScore: 0,
      fullTextScore: 0,
      totalScore: 0,
      matchedTerms: [],
      topTerms: [],
    };
  }

  const matchedTermsSet = new Set<string>();
  
  // Title matches (weight: 40)
  const titleText = normalizeText(decision.title);
  const titleTokens = titleText.split(" ").filter((w) => w.length >= 3);
  const titleMatches = queryTokens.filter((qt) =>
    titleTokens.some((tt) => tt.includes(qt) || qt.includes(tt))
  );
  titleMatches.forEach((m) => matchedTermsSet.add(m));
  const titleWeight = 40;
  const titleScore = (titleMatches.length / queryTokens.length) * titleWeight;

  // Keywords matches (weight: 35)
  const normalizedKeywords = decision.keywords.map((k) => normalizeText(k));
  const keywordMatches = queryTokens.filter((qt) =>
    normalizedKeywords.some((kw) => {
      const kwTokens = kw.split(" ");
      return kwTokens.some((kwt) => kwt.includes(qt) || qt.includes(kwt));
    })
  );
  keywordMatches.forEach((m) => matchedTermsSet.add(m));
  const keywordWeight = 35;
  const keywordScore = (keywordMatches.length / queryTokens.length) * keywordWeight;

  // Summary matches (weight: 20)
  const summaryText = normalizeText(decision.summary);
  const summaryTokens = summaryText.split(" ").filter((w) => w.length >= 3);
  const summaryMatches = queryTokens.filter((qt) =>
    summaryTokens.some((st) => st.includes(qt) || qt.includes(st))
  );
  summaryMatches.forEach((m) => matchedTermsSet.add(m));
  const summaryWeight = 20;
  const summaryScore = (summaryMatches.length / queryTokens.length) * summaryWeight;

  // Full text matches (weight: 5) - limited to first 1000 chars for performance
  const fullTextPreview = normalizeText(decision.fullText.substring(0, 1000));
  const fullTextTokens = fullTextPreview.split(" ").filter((w) => w.length >= 3);
  const fullTextMatches = queryTokens.filter((qt) => fullTextTokens.includes(qt));
  fullTextMatches.forEach((m) => matchedTermsSet.add(m));
  const fullTextWeight = 5;
  const fullTextScore = (fullTextMatches.length / queryTokens.length) * fullTextWeight;

  // Calculate total score (0-100)
  const maxPossibleScore = titleWeight + keywordWeight + summaryWeight + fullTextWeight;
  const totalScore = Math.round(
    ((titleScore + keywordScore + summaryScore + fullTextScore) / maxPossibleScore) * 100
  );

  // Top contributing terms (most matched terms, up to 5)
  const termFrequency: Record<string, number> = {};
  [titleMatches, keywordMatches, summaryMatches, fullTextMatches].flat().forEach((term) => {
    termFrequency[term] = (termFrequency[term] || 0) + 1;
  });
  
  const topTerms = Object.entries(termFrequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([term]) => term);

  return {
    keywordScore: Math.round(keywordScore),
    titleScore: Math.round(titleScore),
    summaryScore: Math.round(summaryScore),
    fullTextScore: Math.round(fullTextScore),
    totalScore,
    matchedTerms: Array.from(matchedTermsSet),
    topTerms,
  };
}

export function highlightMatches(
  text: string,
  queryTokens: string[],
  maxHighlights: number = 20
): React.ReactNode[] {
  if (queryTokens.length === 0) return [text];

  const normalizedText = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let highlightCount = 0;

  // Find all match positions
  const matches: Array<{ start: number; end: number; term: string }> = [];
  
  for (const token of queryTokens) {
    if (highlightCount >= maxHighlights) break;
    
    let searchIndex = 0;
    while (searchIndex < normalizedText.length && highlightCount < maxHighlights) {
      const index = normalizedText.indexOf(token.toLowerCase(), searchIndex);
      if (index === -1) break;
      
      // Check if it's a whole word (preceded and followed by non-word chars or boundaries)
      const before = index === 0 || !/\w/.test(normalizedText[index - 1]);
      const after = index + token.length >= normalizedText.length || !/\w/.test(normalizedText[index + token.length]);
      
      if (before && after) {
        matches.push({
          start: index,
          end: index + token.length,
          term: text.substring(index, index + token.length),
        });
        highlightCount++;
      }
      
      searchIndex = index + 1;
    }
  }

  // Sort matches by position
  matches.sort((a, b) => a.start - b.start);

  // Merge overlapping matches
  const mergedMatches: Array<{ start: number; end: number; term: string }> = [];
  for (const match of matches) {
    if (mergedMatches.length === 0) {
      mergedMatches.push(match);
    } else {
      const last = mergedMatches[mergedMatches.length - 1];
      if (match.start <= last.end) {
        // Overlapping, merge
        last.end = Math.max(last.end, match.end);
        last.term = text.substring(last.start, last.end);
      } else {
        mergedMatches.push(match);
      }
    }
  }

  // Build React nodes
  for (const match of mergedMatches) {
    // Add text before match
    if (match.start > lastIndex) {
      parts.push(text.substring(lastIndex, match.start));
    }
    
    // Add highlighted match
    parts.push(
      <mark
        key={`${match.start}-${match.end}`}
        className="bg-yellow-200 dark:bg-yellow-900/50 rounded px-0.5"
      >
        {match.term}
      </mark>
    );
    
    lastIndex = match.end;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

