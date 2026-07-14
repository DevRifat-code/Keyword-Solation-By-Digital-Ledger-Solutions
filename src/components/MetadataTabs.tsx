import React, { useState, useEffect } from "react";
import { Copy, Check, FileText, Hash, Tags, Download, AlertTriangle, AlertCircle } from "lucide-react";

interface MetadataTabsProps {
  description: string;
  hashtags: string[];
  tags: string[];
  keyword: string;
  onShowToast?: (text: string, type?: "success" | "info" | "warning") => void;
  settingsLanguage?: "en" | "bn";
}

export default function MetadataTabs({ 
  description, 
  hashtags, 
  tags, 
  keyword, 
  onShowToast,
  settingsLanguage = "bn" 
}: MetadataTabsProps) {
  const [activeTab, setActiveTab] = useState<"description" | "tags">("description");
  const [copiedDescription, setCopiedDescription] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedIndividualTag, setCopiedIndividualTag] = useState<string | null>(null);
  const [localDescription, setLocalDescription] = useState(description);

  // Keep local description state updated when generated prop description changes
  useEffect(() => {
    setLocalDescription(description);
  }, [description]);

  const handleCopyDescription = () => {
    navigator.clipboard.writeText(localDescription);
    setCopiedDescription(true);
    const msg = settingsLanguage === "bn" ? "ডেসক্রিপশন কপি করা হয়েছে!" : "Description copied to clipboard!";
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedDescription(false), 2000);
  };

  const handleCopyHashtags = () => {
    const hashtagsText = hashtags.join(" ");
    navigator.clipboard.writeText(hashtagsText);
    setCopiedHashtags(true);
    const msg = settingsLanguage === "bn" ? "সব হ্যাশট্যাগ কপি করা হয়েছে!" : "All hashtags copied to clipboard!";
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  const handleCopyTags = () => {
    const tagsText = tags.join(", ");
    navigator.clipboard.writeText(tagsText);
    setCopiedTags(true);
    const msg = settingsLanguage === "bn" ? "সব সার্চ ট্যাগ কপি করা হয়েছে!" : "All search tags copied!";
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopySingleTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedIndividualTag(tag);
    const msg = settingsLanguage === "bn" ? `"${tag}" কপি করা হয়েছে!` : `Copied "${tag}"!`;
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopiedIndividualTag(null), 1500);
  };

  const downloadTxtFile = () => {
    const fileContent = `KEYWORD: ${keyword}\n\n====================\nVIRAL DESCRIPTION\n====================\n\n${localDescription}\n\n====================\nHASHTAGS\n====================\n\n${hashtags.join(" ")}\n\n====================\nSEARCH TAGS\n====================\n\n${tags.join(", ")}`;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${keyword.replace(/\s+/g, "_")}_youtube_seo.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const charCount = localDescription.length;
  const isOverLimit = charCount > 5000;
  const isNearLimit = charCount > 4500 && charCount <= 5000;

  let badgeColorClass = "text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
  if (isOverLimit) {
    badgeColorClass = "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 font-extrabold animate-pulse";
  } else if (isNearLimit) {
    badgeColorClass = "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 font-semibold";
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      {/* Tab Selectors */}
      <div className="flex border-b border-gray-100 dark:border-slate-800 mb-5 text-sm">
        <button
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 pb-3.5 px-4 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "description"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-250"
          }`}
        >
          <FileText className="w-4 h-4" />
          Optimized Description
        </button>
        <button
          onClick={() => setActiveTab("tags")}
          className={`flex items-center gap-2 pb-3.5 px-4 font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === "tags"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-250"
          }`}
        >
          <Tags className="w-4 h-4" />
          Tags & Hashtags
        </button>
      </div>

      {/* Tab Content: Description */}
      {activeTab === "description" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-md transition-all ${badgeColorClass}`}>
                {isOverLimit && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                {isNearLimit && <AlertCircle className="w-3.5 h-3.5 text-amber-500" />}
                <span>
                  Characters: <strong className={isOverLimit ? "text-rose-700 dark:text-rose-400 font-black" : isNearLimit ? "text-amber-700 dark:text-amber-400 font-bold" : "text-gray-700 dark:text-slate-200 font-bold"}>{charCount}</strong> / 5000
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={downloadTxtFile}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 text-xs font-semibold text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-200 transition-all cursor-pointer"
                title="Download SEO metadata as a TXT file"
              >
                <Download className="w-3.5 h-3.5" />
                Download TXT
              </button>
              <button
                onClick={handleCopyDescription}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  copiedDescription
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-600 border-red-600 text-white hover:bg-red-700 hover:border-red-700"
                }`}
              >
                {copiedDescription ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Description
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Warning Banner */}
          {isOverLimit && (
            <div className="flex items-start gap-2.5 p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-800 dark:text-rose-300 text-xs animate-fadeIn">
              <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="font-extrabold block">YouTube Description Limit Exceeded!</strong>
                <p className="mt-0.5 text-rose-700 dark:text-rose-400 font-medium">
                  Your current description is <span className="font-black underline">{charCount} characters</span>. YouTube Studio limits descriptions to <span className="font-black">5,000 characters</span>. Please trim at least <span className="font-black underline">{charCount - 5000} characters</span> before publishing.
                </p>
              </div>
            </div>
          )}

          {/* Textbox container */}
          <div className="relative">
            <textarea
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              placeholder="Enter or modify your video description here..."
              className={`w-full h-80 p-4 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100 border rounded-lg text-xs leading-relaxed focus:outline-hidden font-mono resize-none overflow-y-auto transition-all ${
                isOverLimit
                  ? "border-rose-300 dark:border-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-rose-50/10 dark:bg-rose-950/10"
                  : isNearLimit
                  ? "border-amber-300 dark:border-amber-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 bg-amber-50/5 dark:bg-amber-950/5"
                  : "border-gray-200 dark:border-slate-800 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              }`}
            />
            {/* Corner Count Indicator Helper */}
            <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 select-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2 py-0.5 rounded border border-gray-100 dark:border-slate-800 shadow-xs">
              {isOverLimit ? (
                <span className="text-rose-600 font-bold">
                  -{charCount - 5000} characters
                </span>
              ) : (
                <span>{5000 - charCount} remaining</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Tags & Hashtags */}
      {activeTab === "tags" && (
        <div className="space-y-6">
          {/* Hashtags Segment */}
          <div>
            <div className="flex items-center justify-between mb-2.5 border-b border-gray-50 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-500" />
                Viral Hashtags ({hashtags.length})
              </h4>
              <button
                onClick={handleCopyHashtags}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                  copiedHashtags
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {copiedHashtags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedHashtags ? "Copied" : "Copy All"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer transition-all"
                  title="Click to copy"
                  onClick={() => handleCopySingleTag(tag)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Search Tags Segment */}
          <div>
            <div className="flex items-center justify-between mb-2.5 border-b border-gray-50 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase text-gray-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                <Tags className="w-3.5 h-3.5 text-red-500" />
                Video Search Tags ({tags.length})
              </h4>
              <button
                onClick={handleCopyTags}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
                  copiedTags
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white"
                }`}
                title="Copy comma-separated tags for YouTube Tags box"
              >
                {copiedTags ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copiedTags ? "Copied CSV" : "Copy All (for YouTube Studio)"}
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-all ${
                    copiedIndividualTag === tag
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 scale-95"
                      : "bg-gray-50 dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 border-gray-300 dark:hover:border-slate-600"
                  }`}
                  title="Click to copy individual tag"
                  onClick={() => handleCopySingleTag(tag)}
                >
                  {tag}
                  {copiedIndividualTag === tag && <span className="ml-1 text-[9px] font-bold">(Copied)</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
