import React, { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Image, HelpCircle, Check, Copy, AlertCircle, Palette, FileText } from "lucide-react";
import { ThumbnailConcept, GenerationLanguage } from "../types";

interface ThumbnailSuggestionsProps {
  keyword: string;
  language: GenerationLanguage;
  onShowToast?: (text: string, type?: "success" | "info" | "warning") => void;
  settingsLanguage?: "en" | "bn";
}

export default function ThumbnailSuggestions({ 
  keyword, 
  language,
  onShowToast,
  settingsLanguage = "bn"
}: ThumbnailSuggestionsProps) {
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Clear suggestions if the keyword changes so we don't show stale data
  useEffect(() => {
    setConcepts([]);
    setError(null);
  }, [keyword]);

  const handleGenerateConcepts = async () => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/suggest-thumbnails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: keyword.trim(),
          language: language,
        }),
      });

      const text = await response.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const snippet = text.length > 150 ? text.substring(0, 150) + "..." : text || "Empty response";
        throw new Error(`Invalid server response: ${snippet}`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch suggestions");
      }
      if (data && data.concepts) {
        setConcepts(data.concepts);
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating visual concepts.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    const msg = settingsLanguage === "bn" ? "থাম্বনেইল টেক্সট ওভারলে কপি করা হয়েছে!" : "Thumbnail text overlay copied!";
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 dark:border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Image className="w-4 h-4 text-rose-500" />
            AI Thumbnail Concept Architect
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Generate 3 psychological visual layout angles to double your video's Click-Through-Rate (CTR).
          </p>
        </div>

        {concepts.length > 0 && !loading && (
          <button
            onClick={handleGenerateConcepts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Ideas
          </button>
        )}
      </div>

      {/* Main State Container */}
      {concepts.length === 0 && !loading && !error && (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center border border-dashed border-gray-200 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-950/20">
          <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-500 mb-3.5 animate-pulse">
            <Sparkles className="w-6 h-6 fill-rose-100" />
          </div>
          <h4 className="text-sm font-bold text-gray-700 dark:text-slate-200">Need the Perfect Thumbnail Visual?</h4>
          <p className="text-xs text-gray-500 dark:text-slate-400 max-w-sm mt-1.5 leading-relaxed">
            Get 3 distinct visual layouts, text overlay copy, color pallet selections, and CTR justifications custom crafted for: <strong className="text-gray-800 dark:text-slate-100 font-bold">"{keyword}"</strong>.
          </p>
          <button
            onClick={handleGenerateConcepts}
            className="mt-4 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            Suggest Thumbnail Concepts
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-2 text-rose-600 font-semibold text-xs bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-3 rounded-lg animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AI is brainstorming viral visual designs and layout triggers...</span>
          </div>
          {/* Skeleton Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/30 dark:bg-slate-950/20 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-2/3" />
                <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-md w-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase">Thumbnail Suggestion Failed</h4>
            <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">{error}</p>
            <button
              onClick={handleGenerateConcepts}
              className="mt-3 px-3 py-1.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-slate-700 text-rose-700 dark:text-rose-300 rounded-lg text-[11px] font-bold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Concept Results Display */}
      {concepts.length > 0 && !loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {concepts.map((concept, index) => {
              const conceptId = `concept-${index}`;
              const overlayId = `overlay-${index}`;
              return (
                <div
                  key={index}
                  className="bg-slate-50/30 dark:bg-slate-950/10 hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-gray-200/80 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all group hover:shadow-xs"
                >
                  <div className="space-y-3.5">
                    {/* Header: Name and Angle Badge */}
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-extrabold uppercase bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100/75 dark:border-rose-900/50 px-2 py-0.5 rounded-full">
                        Concept {index + 1}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 font-mono">
                        CTR Boost Angle
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {concept.name}
                    </h4>

                    {/* Visual Description */}
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Scene Description
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg p-2.5">
                        {concept.visualDescription}
                      </p>
                    </div>

                    {/* Text Overlay mockup */}
                    {concept.textOverlay && (
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Text Overlay
                        </span>
                        <div className="flex items-center justify-between gap-2 bg-slate-900 dark:bg-black text-white rounded-lg px-3 py-2 font-mono text-xs font-black relative overflow-hidden group/overlay shadow-xs">
                          {/* Left warning stripe border mimicking CTR element */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-yellow-400" />
                          <span className="pl-1.5 text-yellow-400 select-all">{concept.textOverlay}</span>
                          <button
                            onClick={() => copyToClipboard(concept.textOverlay, overlayId)}
                            className="text-slate-400 hover:text-white transition-colors"
                            title="Copy overlay text"
                          >
                            {copiedText === overlayId ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Color Palette */}
                    {concept.colors && (
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Palette className="w-3 h-3 text-indigo-400" /> Colors & Contrast
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5">
                          {concept.colors}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Justification */}
                  <div className="mt-4 pt-3.5 border-t border-dashed border-gray-200/80 dark:border-slate-800">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-teal-400" /> Psychological Justification
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-teal-50/10 dark:bg-teal-950/10 border border-teal-500/15 dark:border-teal-900/30 rounded-lg p-2.5">
                      {concept.justification}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
