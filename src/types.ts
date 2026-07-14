export interface YouTubeTitle {
  text: string;
  style: string;
  ctrScore: number;
}

export interface SEOAnalysis {
  difficulty: "Low" | "Medium" | "High" | string;
  searchVolume: "Low" | "Medium" | "High" | string;
  tips: string[];
  healthScore?: number;
  trendsData?: { date: string; popularity: number }[];
}

export interface YouTubeSEOResponse {
  titles: YouTubeTitle[];
  description: string;
  hashtags: string[];
  tags: string[];
  seoAnalysis: SEOAnalysis;
}

export interface SearchHistoryItem {
  id: string;
  keyword: string;
  category: string;
  language: string;
  timestamp: string;
  data: YouTubeSEOResponse;
}

export type GenerationLanguage = "English" | "Bengali" | "Banglish";

export interface ThumbnailConcept {
  name: string;
  visualDescription: string;
  textOverlay: string;
  colors: string;
  justification: string;
}

export interface ThumbnailConceptsResponse {
  concepts: ThumbnailConcept[];
}

