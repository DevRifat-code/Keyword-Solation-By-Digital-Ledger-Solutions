import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Search, 
  History, 
  RotateCcw, 
  AlertCircle, 
  Check, 
  Copy, 
  Play, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Tags,
  Hash,
  Download,
  FileText,
  Clock,
  Split,
  Type,
  Image,
  Video,
  Settings,
  Sun,
  Moon,
  Bell,
  BellOff,
  Globe,
  BookOpen,
  Facebook,
  MessageCircle
} from "lucide-react";
import { YouTubeSEOResponse, SearchHistoryItem, GenerationLanguage } from "./types";
import YouTubeCardPreview from "./components/YouTubeCardPreview";
import SEOAnalysisPanel from "./components/SEOAnalysisPanel";
import TitleList from "./components/TitleList";
import MetadataTabs from "./components/MetadataTabs";
import CreatorToolkit from "./components/CreatorToolkit";
import ThumbnailSuggestions from "./components/ThumbnailSuggestions";
import ReadmeView from "./components/ReadmeView";
import { motion, AnimatePresence } from "motion/react";

const TRANSLATIONS = {
  en: {
    brandName: "RankPilot AI",
    byDigitalLedger: "By Digital Ledger Solutions",
    generator: "Generator",
    history: "History",
    comma: "Comma Separator",
    case: "Text Case Changer",
    thumbnail: "Thumbnail Downloader",
    video: "Video Downloader",
    readme: "User Guide",
    bannerTitle: "RankPilot AI",
    bannerSubTitle: "By Digital Ledger Solutions",
    bannerDesc: "Formulate click-triggering titles, SEO-optimized descriptions, hashtags and viral tags in a flash with your keywords.",
    inputPlaceholder: "Enter your video keyword (e.g. How to fly a drone, Biryani recipe)...",
    generateBtn: "Generate Viral Pack",
    generatingBtn: "Generating SEO Pack...",
    tryPopular: "Try popular topics:",
    errorTitle: "Generation Failed",
    queryHistoryTitle: "Your Query History",
    queryHistoryDesc: "Revisit your previous viral asset formulations. Stored locally in your browser cache.",
    clearHistoryBtn: "Clear All History",
    noHistoryTitle: "No History Available Yet",
    noHistoryDesc: "Once you search for and generate metadata pack configurations, your record set will be displayed here.",
    restoreSeoPack: "Restore SEO Pack",
    serverStatus: "Server Status: Online",
    settingsTitle: "Settings",
    themeToggle: "Theme Mode",
    languageTitle: "Language",
    notificationsTitle: "Notifications",
    autoClearTitle: "Auto Clear History",
    historyClearedToast: "History cleared successfully!",
    seoGeneratedToast: "SEO Pack generated successfully!",
    settingsUpdatedToast: "Settings updated successfully!",
  },
  bn: {
    brandName: "র‍্যাঙ্কপাইলট এআই (RankPilot AI)",
    byDigitalLedger: "ডিজিটাল লেজার সলিউশনস দ্বারা",
    generator: "জেনারেটর",
    history: "ইতিহাস",
    comma: "কমা সেপারেটর",
    case: "টেক্সট কেস চেঞ্জার",
    thumbnail: "থাম্বনেইল ডাউনলোডার",
    video: "ভিডিও ডাউনলোডার",
    readme: "নির্দেশিকা",
    bannerTitle: "র‍্যাঙ্কপাইলট এআই (RankPilot AI)",
    bannerSubTitle: "ডিজিটাল লেজার সলিউশনস দ্বারা",
    bannerDesc: "আপনার কী-ওয়ার্ড দিয়ে ক্লিক-ট্রিগারিং টাইটেল, এসইও-অপ্টিমাইজড ডেসক্রিপশন, হ্যাশট্যাগ ও ভাইরাল ট্যাগ তৈরি করুন পলকেই।",
    inputPlaceholder: "আপনার ভিডিওর কিওয়ার্ড লিখুন (যেমন: How to fly a drone, বিরিয়ানি রেসিপি)...",
    generateBtn: "ভাইরাল প্যাক তৈরি করুন",
    generatingBtn: "এসইও প্যাক তৈরি হচ্ছে...",
    tryPopular: "জনপ্রিয় টপিকগুলো ট্রাই করুন:",
    errorTitle: "জেনারেট করা ব্যর্থ হয়েছে",
    queryHistoryTitle: "আপনার অনুসন্ধানের ইতিহাস",
    queryHistoryDesc: "আপনার পূর্ববর্তী ভাইরাল অ্যাসেট ফর্মুলেশনগুলি পুনরায় দেখুন। আপনার ব্রাউজার ক্যাশে সংরক্ষিত।",
    clearHistoryBtn: "সব ইতিহাস মুছুন",
    noHistoryTitle: "এখনও কোনো ইতিহাস নেই",
    noHistoryDesc: "আপনি যখন মেটাডেটা প্যাক অনুসন্ধান এবং তৈরি করবেন, তখন আপনার রেকর্ড এখানে প্রদর্শিত হবে।",
    restoreSeoPack: "রিস্টোর করুন",
    serverStatus: "সার্ভার স্ট্যাটাস: অনলাইন",
    settingsTitle: "সেটিংস",
    themeToggle: "থিম মোড",
    languageTitle: "ভাষা (Language)",
    notificationsTitle: "নোটিফিকেশন",
    autoClearTitle: "অটো-ক্লিয়ার ইতিহাস",
    historyClearedToast: "ইতিহাস সফলভাবে মুছে ফেলা হয়েছে!",
    seoGeneratedToast: "এসইও প্যাক সফলভাবে তৈরি হয়েছে!",
    settingsUpdatedToast: "সেটিংস সফলভাবে আপডেট করা হয়েছে!",
  }
};

const POPULAR_TOPICS = [
  { text: "ঝটপট বিরিয়ানি রেসিপি", lang: "Bengali", category: "Cooking & Recipes" },
  { text: "How to earn money online", lang: "English", category: "Business & Finance" },
  { text: "kivabe subscriber barano jay 2026", lang: "Banglish", category: "Education & Tech" },
  { text: "React JS Crash Course for Beginners", lang: "English", category: "Education & Tech" },
  { text: "iPhone 17 Pro Review Bangla", lang: "Bengali", category: "Tech & Gadgets" }
];

const CATEGORIES = [
  "General / All",
  "Education & Tech",
  "Cooking & Recipes",
  "Gaming",
  "Vlogs & Travel",
  "Business & Finance",
  "Health & Fitness",
  "Music & Entertainment",
  "Comedy & Skits",
  "News & Politics"
];

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("General / All");
  const [language, setLanguage] = useState<GenerationLanguage>("English");
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seoResult, setSeoResult] = useState<YouTubeSEOResponse | null>(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<"generator" | "history" | "comma" | "case" | "thumbnail" | "readme">("generator");

  // Smooth simulation for progress bar
  useEffect(() => {
    let interval: any;
    let timer: any;
    if (loading) {
      setShowProgress(true);
      setProgress(0);
      
      timer = setTimeout(() => {
        setProgress(15);
      }, 100);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 50) {
            return prev + (Math.random() * 8 + 2);
          } else if (prev < 85) {
            return prev + (Math.random() * 4 + 1);
          } else if (prev < 98) {
            return prev + (Math.random() * 1.5);
          }
          return prev;
        });
      }, 300);
    } else {
      if (showProgress) {
        setProgress(100);
        const hideTimer = setTimeout(() => {
          setShowProgress(false);
          setProgress(0);
        }, 500);
        return () => clearTimeout(hideTimer);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [loading, showProgress]);

  // Settings States
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
  const [settingsLanguage, setSettingsLanguage] = useState<"en" | "bn">(() => {
    try {
      return (localStorage.getItem("settings_lang") as "en" | "bn") || "bn";
    } catch {
      return "bn";
    }
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("notifications_enabled") !== "false";
    } catch {
      return true;
    }
  });
  const [autoClearHistory, setAutoClearHistory] = useState<boolean>(() => {
    try {
      return localStorage.getItem("auto_clear_history") === "true";
    } catch {
      return false;
    }
  });
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [appNotifications, setAppNotifications] = useState<{ id: string; text: string; type: "success" | "info" | "warning" }[]>([]);

  const addAppToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now().toString();
    setAppNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setAppNotifications((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  // Listen for global custom show-toast events
  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ text: string; type?: "success" | "info" | "warning" }>;
      if (customEvent.detail) {
        addAppToast(customEvent.detail.text, customEvent.detail.type || "success");
      }
    };
    window.addEventListener("app-show-toast", handleToastEvent);
    return () => window.removeEventListener("app-show-toast", handleToastEvent);
  }, []);

  const t = settingsLanguage === "bn" ? TRANSLATIONS.bn : TRANSLATIONS.en;

  // Load search history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("youtube_seo_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save search history
  const saveToHistory = (kw: string, cat: string, lang: string, response: YouTubeSEOResponse) => {
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      keyword: kw,
      category: cat,
      language: lang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: response
    };
    const updated = [newItem, ...history.slice(0, 19)]; // Keep last 20 queries
    setHistory(updated);
    try {
      localStorage.setItem("youtube_seo_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  const handleGenerate = async (e?: React.FormEvent, customKeyword?: string, customLang?: GenerationLanguage, customCat?: string) => {
    if (e) e.preventDefault();
    
    const activeKeyword = customKeyword || keyword;
    const activeLang = customLang || language;
    const activeCat = customCat || category;

    if (!activeKeyword.trim()) {
      setError("দয়া করে একটি সঠিক কিওয়ার্ড বা ভিডিওর টপিক লিখুন। (Please write a keyword or topic)");
      return;
    }

    setLoading(true);
    setError(null);
    setSeoResult(null);

    // Sync state if clicked suggestion
    if (customKeyword) setKeyword(customKeyword);
    if (customLang) setLanguage(customLang);
    if (customCat) setCategory(customCat);

    try {
      const res = await fetch("/api/generate-seo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          keyword: activeKeyword.trim(),
          category: activeCat === "General / All" ? "" : activeCat,
          language: activeLang
        })
      });

      const text = await res.text();
      let data: YouTubeSEOResponse;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const snippet = text.length > 150 ? text.substring(0, 150) + "..." : text || "Empty response";
        throw new Error(`সার্ভার থেকে সঠিক ডাটা পাওয়া যায়নি (Invalid server response): ${snippet}`);
      }

      if (!res.ok) {
        throw new Error((data as any).error || "Internal server error");
      }
      setSeoResult(data);
      if (data.titles && data.titles.length > 0) {
        setSelectedTitle(data.titles[0].text);
      }
      saveToHistory(activeKeyword, activeCat, activeLang, data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistoryItem = (item: SearchHistoryItem) => {
    setKeyword(item.keyword);
    setCategory(item.category);
    setLanguage(item.language as GenerationLanguage);
    setSeoResult(item.data);
    if (item.data.titles && item.data.titles.length > 0) {
      setSelectedTitle(item.data.titles[0].text);
    }
    setActiveTab("generator");
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("youtube_seo_history");
    } catch (e) {
      console.error(e);
    }
  };

  // Auto Clear History logic
  useEffect(() => {
    if (autoClearHistory && history.length > 0) {
      const timer = setTimeout(() => {
        setHistory([]);
        try {
          localStorage.removeItem("youtube_seo_history");
        } catch (e) {
          console.error(e);
        }
        if (notificationsEnabled) {
          addAppToast(
            settingsLanguage === "bn"
              ? "অটো-ক্লিয়ার সক্রিয়: অনুসন্ধানের ইতিহাস স্বয়ংক্রিয়ভাবে মুছে ফেলা হয়েছে!"
              : "Auto Clear Active: Query history has been automatically cleared!",
            "info"
          );
        }
      }, 15000); // clear after 15 seconds of inactivity/activity
      return () => clearTimeout(timer);
    }
  }, [history, autoClearHistory, settingsLanguage, notificationsEnabled]);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === "dark" 
        ? "dark bg-slate-950 text-slate-100" 
        : "bg-[#F8FAFC] text-slate-900"
    } selection:bg-red-100 selection:text-red-900`}>
      {/* Top Header Navigation */}
      <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-xs">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              {t.brandName}
            </span>
            <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 tracking-wider uppercase leading-none">
              {t.byDigitalLedger}
            </span>
          </div>
        </div>

        {/* Tab Buttons (Middle, takes full available center space) */}
        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="flex gap-4 md:gap-5 items-center text-xs md:text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar whitespace-nowrap max-w-full py-1">
            <button
              onClick={() => {
                setActiveTab("generator");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "জেনারেটর ট্যাবে সুইচ করা হয়েছে" : "Switched to Generator tab", "info");
              }}
              className={`pb-1 transition-colors relative font-semibold flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeTab === "generator" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-4 h-4 text-red-500" />
              {t.generator}
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "ইতিহাস ট্যাবে সুইচ করা হয়েছে" : "Switched to History tab", "info");
              }}
              className={`pb-1 transition-colors relative flex items-center gap-1.5 flex-shrink-0 font-semibold cursor-pointer ${
                activeTab === "history" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <History className="w-4 h-4 text-amber-500" />
              {t.history} ({history.length})
            </button>

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 flex-shrink-0 mx-1" />

            <button
              onClick={() => {
                setActiveTab("comma");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "কমা সেপারেটর ট্যাবে সুইচ করা হয়েছে" : "Switched to Comma Separator tab", "info");
              }}
              className={`pb-1 transition-colors relative flex items-center gap-1.5 flex-shrink-0 font-semibold cursor-pointer ${
                activeTab === "comma" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Split className="w-4 h-4 text-indigo-500" />
              {t.comma}
            </button>
            <button
              onClick={() => {
                setActiveTab("case");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "কেস চেঞ্জার ট্যাবে সুইচ করা হয়েছে" : "Switched to Case Changer tab", "info");
              }}
              className={`pb-1 transition-colors relative flex items-center gap-1.5 flex-shrink-0 font-semibold cursor-pointer ${
                activeTab === "case" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Type className="w-4 h-4 text-emerald-500" />
              {t.case}
            </button>
            <button
              onClick={() => {
                setActiveTab("thumbnail");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "থাম্বনেইল ডাউনলোডার ট্যাবে সুইচ করা হয়েছে" : "Switched to Thumbnail Downloader tab", "info");
              }}
              className={`pb-1 transition-colors relative flex items-center gap-1.5 flex-shrink-0 font-semibold cursor-pointer ${
                activeTab === "thumbnail" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Image className="w-4 h-4 text-rose-500" />
              {t.thumbnail}
            </button>
            <button
              onClick={() => {
                setActiveTab("readme");
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "নির্দেশিকা ট্যাবে সুইচ করা হয়েছে" : "Switched to User Guide tab", "info");
              }}
              className={`pb-1 transition-colors relative flex items-center gap-1.5 flex-shrink-0 font-semibold cursor-pointer ${
                activeTab === "readme" 
                  ? "text-slate-900 dark:text-white border-b-2 border-red-600" 
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 text-red-500" />
              {t.readme}
            </button>
          </div>
        </div>

        {/* Right side controls (Settings Button) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-shrink-0">
            <button
              id="settings-menu-btn"
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 shadow-xs"
              title={t.settingsTitle}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-bold">{t.settingsTitle}</span>
            </button>

            {showSettingsDropdown && (
              <>
                {/* Overlay back to close */}
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setShowSettingsDropdown(false)} 
                />
                
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                      <Settings className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
                      {t.settingsTitle}
                    </span>
                    <button 
                      onClick={() => setShowSettingsDropdown(false)}
                      className="text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* 1. Theme Toggle */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.themeToggle}</span>
                      <button
                        onClick={() => {
                          const nextTheme = theme === "light" ? "dark" : "light";
                          setTheme(nextTheme);
                          localStorage.setItem("theme", nextTheme);
                          if (notificationsEnabled) {
                            addAppToast(
                              settingsLanguage === "bn"
                                ? `ডার্ক মোড ${nextTheme === "dark" ? "চালু" : "বন্ধ"} করা হয়েছে!`
                                : `Dark Theme turned ${nextTheme === "dark" ? "ON" : "OFF"}!`,
                              "success"
                            );
                          }
                        }}
                        className="w-10 h-5 bg-slate-200 dark:bg-red-600 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer relative"
                      >
                        <div className={`w-4 h-4 bg-white dark:bg-slate-100 rounded-full shadow-md transform transition-transform duration-200 flex items-center justify-center ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}>
                          {theme === "dark" ? (
                            <Moon className="w-2.5 h-2.5 text-red-600" />
                          ) : (
                            <Sun className="w-2.5 h-2.5 text-amber-500" />
                          )}
                        </div>
                      </button>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setTheme("light");
                          localStorage.setItem("theme", "light");
                          if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "লাইট মোড চালু করা হয়েছে!" : "Light Theme Activated!", "success");
                        }}
                        className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          theme === "light"
                            ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:border-red-900"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <Sun className="w-3 h-3 text-amber-500" /> Light
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark");
                          localStorage.setItem("theme", "dark");
                          if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "ডার্ক মোড চালু করা হয়েছে!" : "Dark Theme Activated!", "success");
                        }}
                        className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          theme === "dark"
                            ? "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <Moon className="w-3 h-3 text-red-400" /> Dark
                      </button>
                    </div>
                  </div>

                  {/* 2. Language Selection */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">{t.languageTitle}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setSettingsLanguage("en");
                          localStorage.setItem("settings_lang", "en");
                          if (notificationsEnabled) addAppToast("Language switched to English!", "success");
                        }}
                        className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          settingsLanguage === "en"
                            ? "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <Globe className="w-3 h-3" /> English
                      </button>
                      <button
                        onClick={() => {
                          setSettingsLanguage("bn");
                          localStorage.setItem("settings_lang", "bn");
                          if (notificationsEnabled) addAppToast("ভাষা পরিবর্তন করে বাংলা করা হয়েছে!", "success");
                        }}
                        className={`flex-1 py-1 px-2 text-[10px] font-bold rounded-lg border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          settingsLanguage === "bn"
                            ? "bg-red-500 text-white border-red-500 dark:bg-red-600 dark:border-red-600"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-400"
                        }`}
                      >
                        <Globe className="w-3 h-3" /> বাংলা
                      </button>
                    </div>
                  </div>

                  {/* 3. Notifications Toggle */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      {notificationsEnabled ? (
                        <Bell className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <BellOff className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.notificationsTitle}</span>
                    </div>
                    <button
                      onClick={() => {
                        const nextVal = !notificationsEnabled;
                        setNotificationsEnabled(nextVal);
                        localStorage.setItem("notifications_enabled", String(nextVal));
                        if (nextVal) {
                          addAppToast("Notifications Enabled!", "success");
                        }
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer relative ${
                        notificationsEnabled ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${notificationsEnabled ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* 4. Auto Clear History Toggle */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{t.autoClearTitle}</span>
                    </div>
                    <button
                      onClick={() => {
                        const nextVal = !autoClearHistory;
                        setAutoClearHistory(nextVal);
                        localStorage.setItem("auto_clear_history", String(nextVal));
                        if (notificationsEnabled) {
                          addAppToast(
                            settingsLanguage === "bn"
                              ? `ইতিহাস অটো-মুছে ফেলা ${nextVal ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে!`
                              : `Auto Clear History turned ${nextVal ? "ON" : "OFF"}!`,
                            "info"
                          );
                        }
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-hidden cursor-pointer relative ${
                        autoClearHistory ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ${autoClearHistory ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Generation Progress Bar */}
        <AnimatePresence>
          {showProgress && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                  {progress < 100 ? (
                    <span>{settingsLanguage === "bn" ? "ভাইরাল এসইও প্যাক তৈরি হচ্ছে..." : "Formulating Viral SEO Pack..."}</span>
                  ) : (
                    <span className="text-emerald-500 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      {settingsLanguage === "bn" ? "তৈরি সম্পন্ন!" : "Formulation Complete!"}
                    </span>
                  )}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-200/40 dark:border-slate-800/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-red-600 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.4)] relative"
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/35 blur-xs rounded-full animate-pulse" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Banner Area */}
        {activeTab === "generator" && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 transition-colors">
            <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-2 mb-6">
              <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Fast AI Model Integration
              </span>
              <h1 className="text-2xl md:text-3.5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {t.bannerTitle}
              </h1>
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mt-1">
                {t.bannerSubTitle}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-lg leading-relaxed">
                {t.bannerDesc}
              </p>
            </div>

            {/* Search Inputs */}
            <form onSubmit={(e) => {
              handleGenerate(e);
              if (notificationsEnabled) {
                addAppToast(settingsLanguage === "bn" ? "ভাইরাল প্যাক তৈরির অনুরোধ পাঠানো হয়েছে..." : "Viral Pack generation request sent...", "info");
              }
            }} className="max-w-4xl mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Keyword / Topic Input */}
                <div className="md:col-span-6 relative">
                  <input
                    type="text"
                    placeholder={t.inputPlaceholder}
                    className="w-full h-12 pl-4 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-gray-400 font-medium text-slate-800 dark:text-slate-100"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <div className="absolute right-3.5 top-3.5 text-slate-400">
                    <Search className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="md:col-span-3">
                  <select
                    className="w-full h-12 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:outline-hidden focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat} className="dark:bg-slate-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Language Selection */}
                <div className="md:col-span-3 flex bg-slate-100 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800 relative">
                  {(["English", "Bengali", "Banglish"] as GenerationLanguage[]).map((lang) => {
                    const isActive = language === lang;
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setLanguage(lang)}
                        className={`relative flex-1 text-center text-xs font-bold py-2 rounded-lg transition-colors z-10 cursor-pointer ${
                          isActive
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeLanguageBg"
                            className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm -z-10"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        {lang === "Bengali" ? "বাংলা" : lang === "Banglish" ? "Banglish" : "English"}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CTA Generate Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 h-12 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl transition-all shadow-md shadow-red-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>{t.generatingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 fill-white" />
                      <span>{t.generateBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Suggestions / Try This */}
            <div className="mt-6 max-w-4xl mx-auto flex items-center gap-2 flex-wrap justify-center border-t border-slate-100 dark:border-slate-800 pt-5">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {t.tryPopular}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_TOPICS.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleGenerate(undefined, topic.text, topic.lang as GenerationLanguage, topic.category);
                      if (notificationsEnabled) {
                        addAppToast(settingsLanguage === "bn" ? `"${topic.text}" জেনারেট হচ্ছে...` : `Generating "${topic.text}"...`, "info");
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{topic.text}</span>
                    <span className="text-[9px] bg-slate-200/60 dark:bg-slate-800 px-1 rounded text-slate-500 dark:text-slate-400">{topic.lang}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl p-4 flex items-start gap-3 max-w-3xl mx-auto w-full">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase">{t.errorTitle}</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* LOADING SHIMMER SKELETON */}
        {loading && (
          <div className="space-y-6 max-w-7xl w-full animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
              <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
              <div className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 h-96 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
              <div className="lg:col-span-5 space-y-4">
                <div className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
                <div className="h-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-xs" />
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWS - GENERATOR TAB */}
        {activeTab === "generator" && seoResult && !loading && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* SEO Metrics Row */}
            <SEOAnalysisPanel analysis={seoResult.seoAnalysis} keyword={keyword} description={seoResult.description} />

            {/* Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Title List & Live Preview */}
              <div className="lg:col-span-7 space-y-6">
                <TitleList
                  titles={seoResult.titles}
                  selectedTitle={selectedTitle}
                  onSelectTitle={(title) => {
                    setSelectedTitle(title);
                    if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "টাইটেল সিলেক্ট করা হয়েছে!" : "Title selected!", "success");
                  }}
                  onShowToast={addAppToast}
                  settingsLanguage={settingsLanguage}
                />

                <YouTubeCardPreview
                  title={selectedTitle}
                  channelName="Keyword Dila Creator"
                  descriptionSnippet={seoResult.description.split("\n")[0] || ""}
                />

                <ThumbnailSuggestions
                  keyword={keyword}
                  language={language}
                  onShowToast={addAppToast}
                  settingsLanguage={settingsLanguage}
                />
              </div>

              {/* Right Column: Copyable description, tags, hashtags */}
              <div className="lg:col-span-5">
                <MetadataTabs
                  description={seoResult.description}
                  hashtags={seoResult.hashtags}
                  tags={seoResult.tags}
                  keyword={keyword}
                  onShowToast={addAppToast}
                  settingsLanguage={settingsLanguage}
                />
              </div>
            </div>
          </div>
        )}

        {/* MAIN VIEWS - HISTORY TAB */}
        {activeTab === "history" && !loading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex-wrap gap-2">
              <div>
                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-red-600" />
                  {t.queryHistoryTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {t.queryHistoryDesc}
                </p>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => {
                    clearHistory();
                    if (notificationsEnabled) addAppToast(t.historyClearedToast, "success");
                  }}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-850 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 border border-slate-200 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-900 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {t.clearHistoryBtn}
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t.noHistoryTitle}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1">
                  {t.noHistoryDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      loadFromHistoryItem(item);
                      if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "এসইও প্যাক রিস্টোর করা হয়েছে!" : "SEO Pack Restored!", "success");
                    }}
                    className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200/70 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/50 px-2 py-0.5 rounded-full">
                          {item.language}
                        </span>
                        {item.category && (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            {item.category}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.keyword}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center gap-1 transition-colors">
                        {t.restoreSeoPack}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MAIN VIEWS - CREATOR TOOLKIT TAB */}
        {(activeTab === "comma" || activeTab === "case" || activeTab === "thumbnail") && !loading && (
          <div className="animate-in fade-in duration-300">
            <CreatorToolkit 
              activeSubTool={activeTab}
              onSubToolChange={(tool) => {
                setActiveTab(tool);
                if (notificationsEnabled) addAppToast(settingsLanguage === "bn" ? "টুলকিট অপশন পরিবর্তন করা হয়েছে!" : "Toolkit option changed!", "info");
              }}
              onShowToast={addAppToast}
              settingsLanguage={settingsLanguage}
            />
          </div>
        )}

        {/* MAIN VIEWS - README TAB */}
        {activeTab === "readme" && !loading && (
          <div className="animate-in fade-in duration-300">
            <ReadmeView 
              settingsLanguage={settingsLanguage}
              onSwitchTab={(tab) => {
                setActiveTab(tab);
                if (notificationsEnabled) {
                  const label = settingsLanguage === "bn" ? "ট্যাব পরিবর্তন করা হয়েছে!" : "Tab switched!";
                  addAppToast(label, "info");
                }
              }}
            />
          </div>
        )}

      </main>

      {/* Bottom Status Footer */}
      <footer className="mt-auto py-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
        <span className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
          {t.serverStatus}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 text-center">
          <span className="text-slate-400 dark:text-slate-500">
            Development By <span className="text-slate-800 dark:text-slate-200 font-extrabold">Digital Ledger Solutions</span>
          </span>
          <span className="text-slate-300 dark:text-slate-750 hidden md:inline">|</span>
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com/DigitalLedgerSolutions" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all normal-case font-bold hover:scale-105"
            >
              <Facebook className="w-4 h-4" />
              <span>Facebook</span>
            </a>
            <span className="text-slate-300 dark:text-slate-750">|</span>
            <a 
              href="https://wa.me/8801889933520" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all normal-case font-bold hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: +01889933520</span>
            </a>
          </div>
        </div>
        <span className="text-[9px] text-slate-400 dark:text-slate-500">© 2026 RankPilot AI</span>
      </footer>

      {/* Toast Notifications System */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {notificationsEnabled && appNotifications.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="pointer-events-auto p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl flex items-center gap-3"
            >
              <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-emerald-500" : toast.type === "warning" ? "bg-amber-500" : "bg-sky-500"}`} />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex-1 leading-snug">{toast.text}</p>
              <button 
                onClick={() => setAppNotifications((prev) => prev.filter((item) => item.id !== toast.id))}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-black cursor-pointer ml-2"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
