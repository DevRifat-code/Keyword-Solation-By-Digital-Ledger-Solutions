import React, { useState, useEffect } from "react";
import { 
  Split, 
  Type, 
  Image, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Play, 
  Trash2,
  Sliders,
  Sparkles,
  Search
} from "lucide-react";

type ActiveSubTool = "comma" | "case" | "thumbnail";

export interface CreatorToolkitProps {
  activeSubTool?: ActiveSubTool;
  onSubToolChange?: (tool: ActiveSubTool) => void;
  onShowToast?: (text: string, type?: "success" | "info" | "warning") => void;
  settingsLanguage?: "en" | "bn";
}

export default function CreatorToolkit({ 
  activeSubTool: propActiveSubTool, 
  onSubToolChange,
  onShowToast,
  settingsLanguage = "bn"
}: CreatorToolkitProps = {}) {
  const [localActiveSubTool, setLocalActiveSubTool] = useState<ActiveSubTool>("comma");

  const activeSubTool = propActiveSubTool !== undefined ? propActiveSubTool : localActiveSubTool;

  const setActiveSubTool = (tool: ActiveSubTool) => {
    if (onSubToolChange) {
      onSubToolChange(tool);
    } else {
      setLocalActiveSubTool(tool);
    }
  };

  // State for Comma Separator Tool
  const [commaInput, setCommaInput] = useState<string>("youtube seo\nviral keywords\ntrending tags\nvideo optimization\ncreator suite");
  const [inputDelimiter, setInputDelimiter] = useState<"newline" | "space" | "semicolon" | "comma">("newline");
  const [outputDelimiter, setOutputDelimiter] = useState<string>(", ");
  const [wrapQuotes, setWrapQuotes] = useState<"none" | "single" | "double">("none");
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [trimWords, setTrimWords] = useState<boolean>(true);
  const [sortAlphabetical, setSortAlphabetical] = useState<boolean>(false);
  const [commaOutput, setCommaOutput] = useState<string>("");
  const [copiedComma, setCopiedComma] = useState<boolean>(false);

  // State for Change Text Case Tool
  const [caseInput, setCaseInput] = useState<string>("optimize your youtube videos with keyword solation!");
  const [caseOutput, setCaseOutput] = useState<string>("");
  const [selectedCaseMode, setSelectedCaseMode] = useState<"upper" | "lower" | "title" | "sentence" | "capitalize" | "alternating" | "slugify">("lower");
  const [copiedCase, setCopiedCase] = useState<boolean>(false);

  // State for Thumbnail Downloader Tool
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [thumbnailVideoId, setThumbnailVideoId] = useState<string>("dQw4w9WgXcQ");
  const [thumbnailLoading, setThumbnailLoading] = useState<boolean>(false);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ title?: string; author?: string } | null>(null);

  // Comma Separator Logic
  useEffect(() => {
    if (!commaInput) {
      setCommaOutput("");
      return;
    }

    // Split input
    let items: string[] = [];
    if (inputDelimiter === "newline") {
      items = commaInput.split("\n");
    } else if (inputDelimiter === "space") {
      items = commaInput.split(/\s+/);
    } else if (inputDelimiter === "semicolon") {
      items = commaInput.split(";");
    } else if (inputDelimiter === "comma") {
      items = commaInput.split(",");
    }

    // Process items
    if (trimWords) {
      items = items.map(item => item.trim());
    }

    // Filter empty items
    items = items.filter(Boolean);

    // Deduplicate
    if (deduplicate) {
      items = Array.from(new Set(items));
    }

    // Sort
    if (sortAlphabetical) {
      items.sort((a, b) => a.localeCompare(b));
    }

    // Wrap in quotes
    if (wrapQuotes === "single") {
      items = items.map(item => `'${item}'`);
    } else if (wrapQuotes === "double") {
      items = items.map(item => `"${item}"`);
    }

    // Join with output delimiter
    const joined = items.join(outputDelimiter);
    setCommaOutput(joined);
  }, [commaInput, inputDelimiter, outputDelimiter, wrapQuotes, deduplicate, trimWords, sortAlphabetical]);

  // Text Case Logic
  const handleCaseChange = (mode: "upper" | "lower" | "title" | "sentence" | "capitalize" | "alternating" | "slugify") => {
    if (!caseInput) return;

    let result = "";
    switch (mode) {
      case "upper":
        result = caseInput.toUpperCase();
        break;
      case "lower":
        result = caseInput.toLowerCase();
        break;
      case "title":
        result = caseInput.toLowerCase().replace(/\b[a-z]/g, (char) => {
          return char.toUpperCase();
        });
        break;
      case "sentence":
        result = caseInput.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, prefix, char) => {
          return prefix + char.toUpperCase();
        });
        break;
      case "capitalize":
        result = caseInput.split(/\s+/).map(word => {
          if (!word) return "";
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(" ");
        break;
      case "alternating":
        result = caseInput.split("").map((char, index) => {
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        }).join("");
        break;
      case "slugify":
        result = caseInput
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_]+/g, "-")
          .replace(/^-+|-+$/g, "");
        break;
      default:
        result = caseInput;
    }
    setCaseOutput(result);
  };

  useEffect(() => {
    if (caseInput) {
      handleCaseChange(selectedCaseMode);
    } else {
      setCaseOutput("");
    }
  }, [caseInput, selectedCaseMode]);

  // Extract YouTube ID Helper
  const extractYoutubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Fetch YouTube Metadata via noembed (oEmbed)
  const fetchVideoMeta = async (id: string) => {
    try {
      const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`);
      if (res.ok) {
        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          console.warn("oEmbed response was not valid JSON");
          return;
        }
        if (data && !data.error) {
          setVideoMeta({
            title: data.title,
            author: data.author_name
          });
        }
      }
    } catch (e) {
      console.warn("Could not fetch YouTube meta oembed details:", e);
    }
  };

  // Thumbnail downloader load
  const handleLoadThumbnail = (e: React.FormEvent) => {
    e.preventDefault();
    setThumbnailError(null);
    setThumbnailLoading(true);

    const id = extractYoutubeId(thumbnailUrl);
    if (id) {
      setThumbnailVideoId(id);
      fetchVideoMeta(id);
    } else if (thumbnailUrl.length === 11) {
      setThumbnailVideoId(thumbnailUrl);
      fetchVideoMeta(thumbnailUrl);
    } else {
      setThumbnailError("দয়া করে একটি সঠিক ইউটিউব ভিডিওর লিঙ্ক বা আইডি লিখুন। (Invalid URL/ID)");
    }
    setThumbnailLoading(false);
  };

  // Helper to copy to clipboard
  const copyToClipboard = (text: string, setCopied: (v: boolean) => void, typeLabel: "comma" | "case") => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    let msg = "";
    if (typeLabel === "comma") {
      msg = settingsLanguage === "bn" ? "কমা সেপারেটেড ট্যাগ কপি করা হয়েছে!" : "Comma-separated tags copied to clipboard!";
    } else {
      msg = settingsLanguage === "bn" ? "রুপান্তরিত টেক্সট কপি করা হয়েছে!" : "Converted text copied to clipboard!";
    }
    if (onShowToast) {
      onShowToast(msg, "success");
    } else {
      window.dispatchEvent(new CustomEvent("app-show-toast", { detail: { text: msg, type: "success" } }));
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs transition-colors">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600 fill-red-100" />
            Creator Toolkit & Extra Utilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            আপনার দৈনন্দিন ক্রিয়েটর কাজের গতি বাড়াতে অতিরিক্ত ৩টি দরকারি টুলস একই সাথে। (3 ultimate companion tools for creators)
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTool("comma")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTool === "comma"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Split className="w-3.5 h-3.5 text-indigo-500" />
            <span>Comma Separator</span>
          </button>
          <button
            onClick={() => setActiveSubTool("case")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTool === "case"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Type className="w-3.5 h-3.5 text-emerald-500" />
            <span>Text Case Changer</span>
          </button>
          <button
            onClick={() => setActiveSubTool("thumbnail")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTool === "thumbnail"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Image className="w-3.5 h-3.5 text-rose-500" />
            <span>Thumbnail Downloader</span>
          </button>
        </div>
      </div>

      {/* 1. COMMA SEPARATOR TOOL PANEL */}
      {activeSubTool === "comma" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Input Keywords / Words
              </label>
              <textarea
                value={commaInput}
                onChange={(e) => setCommaInput(e.target.value)}
                placeholder="প্রতিটি শব্দ আলাদা লাইনে অথবা স্পেস দিয়ে লিখুন..."
                className="w-full h-44 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-50/30 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 font-mono"
              />
            </div>

            {/* Quick settings panel */}
            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-3.5">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Options
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">Detect Delimiter</label>
                  <select
                    value={inputDelimiter}
                    onChange={(e: any) => setInputDelimiter(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="newline">New Line (লাইনের পর লাইন)</option>
                    <option value="space">Space (স্পেস)</option>
                    <option value="semicolon">Semicolon (;)</option>
                    <option value="comma">Comma (,)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">Join Separator</label>
                  <input
                    type="text"
                    value={outputDelimiter}
                    onChange={(e) => setOutputDelimiter(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-900 font-mono text-slate-700 dark:text-slate-300 text-center focus:outline-none"
                    placeholder=", "
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block text-slate-400 dark:text-slate-500 font-bold mb-1">Wrap quotes</label>
                  <select
                    value={wrapQuotes}
                    onChange={(e: any) => setWrapQuotes(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-300 focus:outline-none"
                  >
                    <option value="none">No quotes</option>
                    <option value="single">Single quotes ('word')</option>
                    <option value="double">Double quotes ("word")</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2 mt-2 sm:mt-0">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={deduplicate}
                      onChange={(e) => setDeduplicate(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500/20 cursor-pointer"
                    />
                    <span>Remove Duplicates</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={sortAlphabetical}
                      onChange={(e) => setSortAlphabetical(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500/20 cursor-pointer"
                    />
                    <span>Sort A-Z</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Formatted Output
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                  {commaOutput ? commaOutput.split(",").length : 0} tags extracted
                </span>
              </div>
              <textarea
                readOnly
                value={commaOutput}
                placeholder="ফলাফল এখানে জেনারেট হবে..."
                className="w-full h-56 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 font-mono"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => copyToClipboard(commaOutput, setCopiedComma, "comma")}
                disabled={!commaOutput}
                className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                {copiedComma ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied Output!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Formatted List
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setCommaInput("");
                  setCommaOutput("");
                }}
                className="px-4 h-11 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-100 dark:hover:border-rose-900 text-slate-500 dark:text-slate-400 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. TEXT CASE CHANGER TOOL PANEL */}
      {activeSubTool === "case" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Input Text
                </label>
                <div className="flex gap-3 text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                  <span>Chars: {caseInput.length}</span>
                  <span>Words: {caseInput.trim() ? caseInput.trim().split(/\s+/).length : 0}</span>
                </div>
              </div>
              <textarea
                value={caseInput}
                onChange={(e) => {
                  setCaseInput(e.target.value);
                }}
                placeholder="টাইপ করুন বা আপনার ভিডিওর ডেসক্রিপশন / টাইটেল পেস্ট করুন..."
                className="w-full h-56 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-50/30 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300"
              />
            </div>

            {/* Formatting Action Grid */}
            <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
              <span className="block text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
                Change Case Options
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("lower")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "lower"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>lower case</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "lower" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>abc</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("upper")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "upper"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>UPPER CASE</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "upper" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>ABC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("capitalize")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "capitalize"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Capitalized Case</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "capitalize" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>Abc Def</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("title")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "title"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Title Case</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "title" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>Abc Def</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("sentence")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "sentence"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>Sentence case</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "sentence" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>Abc.</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("alternating")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer ${
                    selectedCaseMode === "alternating"
                      ? "bg-red-500 text-white border-red-500 shadow-xs"
                      : "bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <span>aLtErNaTiNg</span>
                  <span className={`text-[9px] font-mono font-normal ${selectedCaseMode === "alternating" ? "text-red-200" : "text-slate-400 dark:text-slate-550"}`}>aBc</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCaseMode("slugify")}
                  className={`px-3 py-2 border font-bold rounded-lg text-[11px] transition-all text-left flex items-center justify-between cursor-pointer col-span-2 sm:col-span-1 ${
                    selectedCaseMode === "slugify"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300"
                  }`}
                >
                  <span>URL Slugify</span>
                  <span className={`text-[9px] font-mono ${selectedCaseMode === "slugify" ? "text-indigo-200" : "text-indigo-400"}`}>abc-def</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Case Modified Output
              </span>
              <textarea
                readOnly
                value={caseOutput}
                placeholder="রুপান্তরিত টেক্সট এখানে প্রদর্শিত হবে..."
                className="w-full h-56 p-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-hidden bg-slate-50/50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => copyToClipboard(caseOutput, setCopiedCase, "case")}
                disabled={!caseOutput}
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
              >
                {copiedCase ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied case!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Converted Text
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setCaseInput("");
                  setCaseOutput("");
                }}
                className="px-4 h-11 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-100 dark:hover:border-rose-900 text-slate-500 dark:text-slate-400 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. THUMBNAIL DOWNLOADER TOOL PANEL */}
      {activeSubTool === "thumbnail" && (
        <div className="space-y-6">
          <form onSubmit={handleLoadThumbnail} className="flex gap-2 max-w-3xl">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ইউটিউব ভিডিওর লিঙ্ক বা আইডি পেস্ট করুন (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)..."
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 bg-slate-50/40 text-slate-850 dark:text-slate-100"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
              />
              <div className="absolute right-3 top-3 text-slate-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
            <button
              type="submit"
              disabled={thumbnailLoading}
              className="px-6 h-11 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {thumbnailLoading ? "Loading..." : "Get Thumbnails"}
            </button>
          </form>

          {thumbnailError && (
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 p-2.5 rounded-lg">
              {thumbnailError}
            </p>
          )}

          {thumbnailVideoId && (
            <div className="space-y-6">
              {videoMeta && (
                <div className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{videoMeta.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-550">Uploader: {videoMeta.author}</p>
                  </div>
                </div>
              )}

              {/* Grid of thumbnail formats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. Ultra HD Resolution (1080p / maxresdefault) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${thumbnailVideoId}/maxresdefault.jpg`}
                      alt="Ultra HD"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to high quality if 1080p doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${thumbnailVideoId}/hqdefault.jpg`;
                      }}
                    />
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Ultra HD (1080p)
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-250">Maximum Resolution</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">1280 x 720 (Max)</span>
                    </div>
                    <a
                      href={`/api/proxy-thumbnail?id=${thumbnailVideoId}&quality=maxresdefault`}
                      download={`thumbnail-${thumbnailVideoId}-1080p.jpg`}
                      className="h-8 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Direct Download</span>
                    </a>
                  </div>
                </div>

                {/* 2. HD Resolution (720p / sddefault) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${thumbnailVideoId}/sddefault.jpg`}
                      alt="HD Quality"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${thumbnailVideoId}/hqdefault.jpg`;
                      }}
                    />
                    <span className="absolute top-2.5 right-2.5 bg-indigo-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      Standard HD
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-250">HD Quality</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">640 x 480</span>
                    </div>
                    <a
                      href={`/api/proxy-thumbnail?id=${thumbnailVideoId}&quality=sddefault`}
                      download={`thumbnail-${thumbnailVideoId}-720p.jpg`}
                      className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Direct Download</span>
                    </a>
                  </div>
                </div>

                {/* 3. High Quality (hqdefault) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${thumbnailVideoId}/hqdefault.jpg`}
                      alt="HQ Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 right-2.5 bg-slate-800 dark:text-black text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                      High Quality
                    </span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-xs font-extrabold text-slate-800 dark:text-slate-250">High Quality</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-mono">480 x 360</span>
                    </div>
                    <a
                      href={`/api/proxy-thumbnail?id=${thumbnailVideoId}&quality=hqdefault`}
                      download={`thumbnail-${thumbnailVideoId}-hq.jpg`}
                      className="h-8 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Direct Download</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
