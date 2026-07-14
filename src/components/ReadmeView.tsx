import React, { useState } from "react";
import { 
  Sparkles, 
  Split, 
  Type, 
  Image as ImageIcon, 
  Download, 
  Check, 
  ArrowRight, 
  ExternalLink,
  BookOpen,
  Terminal,
  HelpCircle,
  Video,
  Globe,
  Sliders,
  Award
} from "lucide-react";
import { motion } from "motion/react";

interface ReadmeViewProps {
  settingsLanguage?: "en" | "bn";
  onSwitchTab?: (tab: "generator" | "history" | "comma" | "case" | "thumbnail" | "video") => void;
}

export default function ReadmeView({ settingsLanguage = "bn", onSwitchTab }: ReadmeViewProps) {
  const [lang, setLang] = useState<"bn" | "en">(settingsLanguage);

  const t = {
    en: {
      title: "Interactive Guide & Documentation",
      subtitle: "Learn how to maximize your reach and workflow using RankPilot AI Creator Suite",
      badge: "User Manual",
      featuresTitle: "Suite Capabilities Breakdown",
      howToUse: "How to Use RankPilot AI",
      steps: [
        {
          title: "1. Enter Keywords",
          desc: "Go to the 'Generator' tab, type your primary keyword (e.g. 'Biryani Recipe' or 'Tech Review'), and choose the category and video language."
        },
        {
          title: "2. Generate SEO Pack",
          desc: "Click 'Generate Viral Pack'. In 5-10 seconds, the Gemini AI will formulate highly optimized titles, SEO description, and search tags."
        },
        {
          title: "3. Copy & Apply",
          desc: "Use the instant copy buttons to transfer metadata directly to YouTube Studio. Use the Card Preview to see how it looks live."
        },
        {
          title: "4. Enhance via Tools",
          desc: "Format extra tags in Comma Separator, polish descriptions in Case Changer, or download 1080p thumbnails in Thumbnail Downloader."
        }
      ],
      developerNote: "Technical Specification",
      developerText: "Developed using React 19, TypeScript, and Tailwind CSS. Backed by @google/genai & Gemini AI Core. Built with performance and user-centered design at heart.",
      creatorLogoText: "Designed for Digital Creators worldwide.",
      credits: "Developed and maintained with ❤️ by Digital Ledger Solutions. Connect via Facebook: https://www.facebook.com/DigitalLedgerSolutions or WhatsApp: +01889933520",
      actionBtn: "Launch SEO Generator",
      viewSource: "Explore Creator Suite",
      features: [
        {
          id: "generator" as const,
          icon: <Sparkles className="w-5 h-5 text-red-500" />,
          title: "AI SEO Generator",
          desc: "Auto-generates catchy titles, tags, and description utilizing semantic SEO principles.",
          bnDesc: "এসইও ফ্রেন্ডলি টাইটেল, ডেসক্রিপশন এবং ভাইরাল ট্যাগ স্বয়ংক্রিয়ভাবে জেনারেট করে।"
        },
        {
          id: "comma" as const,
          icon: <Split className="w-5 h-5 text-indigo-500" />,
          title: "Comma Separator",
          desc: "Deduplicates, cleans up, and formats plain lists into valid tags formats.",
          bnDesc: "লিস্ট আকারে থাকা কিওয়ার্ডকে এক ক্লিকে কমা-সেপারেটেড টেক্সটে রুপান্তর করে।"
        },
        {
          id: "case" as const,
          icon: <Type className="w-5 h-5 text-emerald-500" />,
          title: "Case Changer",
          desc: "Adapts case formats like title case, sentence case, and SEO URL slugs in one click.",
          bnDesc: "টাইটেল ও টেক্সটের কেস সহজেই UPPER, lower, বা Title Case-এ রুপান্তর করে।"
        },
        {
          id: "thumbnail" as const,
          icon: <ImageIcon className="w-5 h-5 text-rose-500" />,
          title: "Thumbnail Downloader",
          desc: "Downloads max resolution (1080p) thumbnails of any YouTube video instantly.",
          bnDesc: "লিঙ্ক দিয়ে সর্বোচ্চ রেজোলিউশনের (Ultra HD 1080p) থাম্বনেইল সরাসরি ডাউনলোড করুন।"
        }
      ]
    },
    bn: {
      title: "ইন্টারেক্টিভ গাইড ও নির্দেশিকা",
      subtitle: "কীওয়ার্ডসোলেশন ক্রিয়েটর স্যুট ব্যবহার করে আপনার ভিডিওর এসইও ও কাজের গতি বৃদ্ধির উপায় জানুন",
      badge: "ইউজার ম্যানুয়াল",
      featuresTitle: "টুলকিটের চমৎকার ফিচারসমূহ",
      howToUse: "কিভাবে RankPilot AI ব্যবহার করবেন?",
      steps: [
        {
          title: "১. কিওয়ার্ড লিখুন",
          desc: "জেনারেটর ট্যাবে গিয়ে আপনার ভিডিওর মূল বিষয়বস্তু বা কীওয়ার্ড লিখুন (যেমন: 'বিরিয়ানি রেসিপি' বা 'আইফোন ১৭ প্রফি রিভিউ') এবং ভাষা সিলেক্ট করুন।"
        },
        {
          title: "২. এসইও প্যাক তৈরি করুন",
          desc: "'ভাইরাল প্যাক তৈরি করুন' বাটনে ক্লিক করুন। মাত্র ৫-১০ সেকেন্ডের মধ্যে Gemini AI আপনার ভিডিওর জন্য আকর্ষণীয় এবং ভাইরাল মেটাডেটা সেট প্রস্তুত করবে।"
        },
        {
          title: "৩. কপি ও পেস্ট করুন",
          desc: "সহজ কপি বাটনে ক্লিক করে জেনারেট হওয়া টাইটেল, ডেসক্রিপশন ও ট্যাগ ইউটিউব স্টুডিওতে পেস্ট করুন। ইউটিউব প্রিভিউ কার্ডে দেখে নিন কেমন লাগবে।"
        },
        {
          title: "৪. ক্রিয়েটর স্যুটের অতিরিক্ত সুবিধা",
          desc: "ট্যাগ অপ্টিমাইজেশনের জন্য কমা সেপারেটর, টাইটেল ফরমেটিং এর জন্য কেস চেঞ্জার বা থাম্বনেইল ডাউনলোডার ব্যবহার করে কাজ দ্রুত করুন।"
        }
      ],
      developerNote: "প্রযুক্তিগত বৈশিষ্ট্য",
      developerText: "React 19, TypeScript, এবং Tailwind CSS দিয়ে আধুনিকতম পদ্ধতিতে ডিজাইন করা। ব্যাকএন্ডে যুক্ত আছে @google/genai এবং Gemini AI Core প্রযুক্তি।",
      creatorLogoText: "ডিজিটাল ক্রিয়েটরদের জন্য উৎসর্গীকৃত অনন্য ক্রিয়েটর স্যুট।",
      credits: "ডিজিটাল লেজার সলিউশনস (Digital Ledger Solutions) দ্বারা অত্যন্ত যত্ন সহকারে তৈরি। যেকোনো প্রয়োজনে আমাদের ফেইসবুক: https://www.facebook.com/DigitalLedgerSolutions অথবা হোয়াটসঅ্যাপ: +01889933520-এ যোগাযোগ করুন।",
      actionBtn: "এসইও জেনারেটর শুরু করুন",
      viewSource: "ক্রিয়েটর স্যুট ঘুরে দেখুন",
      features: [
        {
          id: "generator" as const,
          icon: <Sparkles className="w-5 h-5 text-red-500" />,
          title: "এআই এসইও জেনারেটর",
          desc: "Auto-generates catchy titles, tags, and description utilizing semantic SEO principles.",
          bnDesc: "এসইও ফ্রেন্ডলি টাইটেল, ডেসক্রিপশন এবং ভাইরাল ট্যাগ স্বয়ংক্রিয়ভাবে জেনারেট করে।"
        },
        {
          id: "comma" as const,
          icon: <Split className="w-5 h-5 text-indigo-500" />,
          title: "কমা সেপারেটর",
          desc: "Deduplicates, cleans up, and formats plain lists into valid tags formats.",
          bnDesc: "লিস্ট আকারে থাকা কিওয়ার্ডকে এক ক্লিকে কমা-সেপারেটেড টেক্সটে রুপান্তর করে।"
        },
        {
          id: "case" as const,
          icon: <Type className="w-5 h-5 text-emerald-500" />,
          title: "কেস চেঞ্জার",
          desc: "Adapts case formats like title case, sentence case, and SEO URL slugs in one click.",
          bnDesc: "টাইটেল ও টেক্সটের কেস সহজেই UPPER, lower, বা Title Case-এ রুপান্তর করে।"
        },
        {
          id: "thumbnail" as const,
          icon: <ImageIcon className="w-5 h-5 text-rose-500" />,
          title: "থাম্বনেইল ডাউনলোডার",
          desc: "Downloads max resolution (1080p) thumbnails of any YouTube video instantly.",
          bnDesc: "লিঙ্ক দিয়ে সর্বোচ্চ রেজোলিউশনের (Ultra HD 1080p) থাম্বনেইল সরাসরি ডাউনলোড করুন।"
        }
      ]
    }
  };

  const current = lang === "bn" ? t.bn : t.en;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-red-950 text-white rounded-3xl p-6 md:p-10 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
              <BookOpen className="w-3 h-3 animate-pulse" />
              {current.badge}
            </span>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
              {current.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium">
              {current.subtitle}
            </p>
          </div>

          {/* Language toggle inside Readme */}
          <div className="flex gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                lang === "en" ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> English
            </button>
            <button
              onClick={() => setLang("bn")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                lang === "bn" ? "bg-red-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> বাংলা
            </button>
          </div>
        </div>

        {/* Action button inside Hero */}
        {onSwitchTab && (
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onSwitchTab("generator")}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg hover:shadow-red-900/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-red-100" />
              <span>{current.actionBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href="#technical-spec"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-black flex items-center gap-2 transition-colors"
            >
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>{current.viewSource}</span>
            </a>
          </div>
        )}
      </div>

      {/* Grid of Features explained in depth */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-5 h-5 text-red-500" />
          {current.featuresTitle}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {current.features.map((feat) => (
            <div 
              key={feat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-850 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex gap-4"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl self-start">
                {feat.icon}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{feat.title}</h3>
                  {onSwitchTab && (
                    <button
                      onClick={() => onSwitchTab(feat.id)}
                      className="text-[10px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      Open <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                  {lang === "bn" ? feat.bnDesc : feat.desc}
                </p>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 px-2 py-0.5 rounded-md inline-block">
                  {feat.id.toUpperCase()} MODULE
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Step-by-Step Guide */}
      <div className="bg-slate-100/50 dark:bg-slate-950/25 border border-slate-200/60 dark:border-slate-900 p-6 md:p-8 rounded-3xl space-y-6">
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            {current.howToUse}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {lang === "bn" ? "কিভাবে মাত্র কয়েক ক্লিকে আপনার ভাইরাল এসইও মেটাডেটা প্রস্তুত করবেন" : "How to formulate your viral metadata assets in just 4 simple steps"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {current.steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl relative shadow-xs"
            >
              <div className="absolute top-4 right-4 text-3xl font-black text-slate-100 dark:text-slate-800/60 font-mono select-none">
                0{idx + 1}
              </div>
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">
                {step.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Specifications Section */}
      <div 
        id="technical-spec"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl space-y-4"
      >
        <span className="text-xs font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest block">
          {current.developerNote}
        </span>
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between border-t border-slate-100 dark:border-slate-850 pt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl font-semibold leading-relaxed">
            {current.developerText}
          </p>
          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-550 flex flex-col gap-1 border-l-2 border-red-500 pl-4">
            <span>VERSION: v1.2.0</span>
            <span>BUILD: PRODUCTION-READY</span>
            <span>POWERED BY: GEMINI-2.5-FLASH</span>
          </div>
        </div>
      </div>

      {/* Footer Branding & Disclaimer */}
      <div className="text-center space-y-2 py-4">
        <p className="text-[11px] font-black tracking-widest text-slate-400 dark:text-slate-550 uppercase">
          {current.creatorLogoText}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          {current.credits}
        </p>
      </div>

    </div>
  );
}
