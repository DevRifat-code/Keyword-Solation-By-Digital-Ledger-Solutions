import React, { useState } from "react";
import { YouTubeTitle } from "../types";
import { Sparkles, Copy, Check, Eye } from "lucide-react";

interface TitleListProps {
  titles: YouTubeTitle[];
  selectedTitle: string;
  onSelectTitle: (title: string) => void;
  onShowToast?: (text: string, type?: "success" | "info" | "warning") => void;
  settingsLanguage?: "en" | "bn";
}

export default function TitleList({ 
  titles, 
  selectedTitle, 
  onSelectTitle,
  onShowToast,
  settingsLanguage = "bn"
}: TitleListProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    const msg = settingsLanguage === "bn" ? "ভিডিওর টাইটেল কপি করা হয়েছে!" : "Video title copied to clipboard!";
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getCTRColor = (score: number) => {
    if (score >= 90) return "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50";
    if (score >= 80) return "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50";
    return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50";
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          Viral Suggested Titles
        </h3>
        <span className="text-xs text-gray-400 dark:text-slate-400">Click title to preview in YouTube card</span>
      </div>

      <div className="space-y-3">
        {titles.map((title, index) => {
          const isSelected = selectedTitle === title.text;
          return (
            <div
              key={index}
              onClick={() => onSelectTitle(title.text)}
              className={`group flex items-center justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-red-50/20 dark:bg-red-950/20 border-red-500 dark:border-red-900 shadow-sm"
                  : "bg-white dark:bg-slate-950 border-gray-100 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 hover:bg-gray-50/40 dark:hover:bg-slate-800/40"
              }`}
            >
              <div className="flex-1 min-w-0">
                {/* Title Badge & Style Info */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                    Title {index + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200/50 dark:border-slate-700">
                    {title.style}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">
                      <Eye className="w-3 h-3" /> Selected for Preview
                    </span>
                  )}
                </div>

                {/* Title Text */}
                <p className={`text-sm font-semibold leading-relaxed ${isSelected ? "text-red-900 dark:text-red-400" : "text-gray-800 dark:text-slate-250"}`}>
                  {title.text}
                </p>
              </div>

              {/* CTR badge and copy button */}
              <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                {/* CTR Prediction Badge */}
                <div className={`flex flex-col items-center justify-center border px-2.5 py-1.5 rounded-lg text-center ${getCTRColor(title.ctrScore)}`}>
                  <span className="text-xs font-black tracking-tighter leading-none">{title.ctrScore}%</span>
                  <span className="text-[8px] font-extrabold uppercase mt-0.5 tracking-wider">Est CTR</span>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyToClipboard(title.text, index)}
                  className={`p-2 rounded-lg border transition-all cursor-pointer ${
                    copiedIndex === index
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                      : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                  title="Copy Title"
                >
                  {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
