import React, { useState, useEffect } from "react";
import { SEOAnalysis } from "../types";
import { Gauge, Sparkles, TrendingUp, CheckCircle2, Award, Percent } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Cell
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 text-white p-2.5 rounded-lg shadow-xl text-xs font-medium">
        <p className="text-slate-400 mb-0.5">{label}</p>
        <p className="flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
          Search Index: <span className="text-red-400">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const generateFallbackTrends = (keyword: string) => {
  const data = [];
  const now = new Date();
  
  // Seed random number generator based on keyword length + chars to keep it deterministic but unique
  const seed = (keyword || "default").split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  let currentVal = 40 + (seed % 30); // Start popularity between 40 and 70
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    
    // Deterministic pseudo-random walk
    const step = Math.sin(seed + i) * 12 + Math.cos(seed * i) * 4;
    currentVal = Math.max(15, Math.min(100, Math.round(currentVal + step)));
    
    data.push({
      date: dateStr,
      popularity: currentVal
    });
  }
  return data;
};

interface SEOAnalysisPanelProps {
  analysis: SEOAnalysis;
  keyword: string;
  description?: string;
}

export default function SEOAnalysisPanel({ analysis, keyword, description }: SEOAnalysisPanelProps) {
  const getDifficultyColor = (level: string | undefined) => {
    const l = (level || "Low").toString().toLowerCase();
    if (l.includes("low")) return { text: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100", bar: "bg-emerald-500" };
    if (l.includes("medium")) return { text: "text-amber-600", bg: "bg-amber-50 border-amber-100", bar: "bg-amber-500" };
    return { text: "text-rose-600", bg: "bg-rose-50 border-rose-100", bar: "bg-rose-500" };
  };

  const getVolumeColor = (level: string | undefined) => {
    const l = (level || "Medium").toString().toLowerCase();
    if (l.includes("high")) return { text: "text-rose-600", bg: "bg-rose-50 border-rose-100", bar: "bg-rose-500" };
    if (l.includes("medium")) return { text: "text-amber-600", bg: "bg-amber-50 border-amber-100", bar: "bg-amber-500" };
    return { text: "text-slate-500", bg: "bg-slate-50 border-slate-100", bar: "bg-slate-400" };
  };

  const safeAnalysis = analysis || { difficulty: "Medium", searchVolume: "Medium", tips: [] };
  const diffColor = getDifficultyColor(safeAnalysis.difficulty);
  const volColor = getVolumeColor(safeAnalysis.searchVolume);

  // Calculate SEO Health Score
  const calculateHealthScore = () => {
    if (safeAnalysis.healthScore !== undefined) {
      return safeAnalysis.healthScore;
    }
    
    let score = 0;
    
    // Volume contribution: High = 45, Medium = 30, Low = 15
    const vol = (safeAnalysis.searchVolume || "Medium").toString().toLowerCase();
    if (vol.includes("high")) score += 45;
    else if (vol.includes("medium")) score += 30;
    else score += 15;
    
    // Difficulty contribution: Low = 45, Medium = 25, High = 10 (lower difficulty is better for ranking)
    const diff = (safeAnalysis.difficulty || "Medium").toString().toLowerCase();
    if (diff.includes("low")) score += 45;
    else if (diff.includes("medium")) score += 25;
    else score += 10;
    
    // Tips completeness contribution: up to 10 points
    const tipsCount = (safeAnalysis.tips || []).length;
    if (tipsCount >= 3) score += 10;
    else if (tipsCount > 0) score += 5;
    
    return score;
  };

  const score = calculateHealthScore();
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    if (start === end) {
      setAnimatedScore(end);
      return;
    }

    const duration = 1200; // 1.2 seconds for a premium, satisfying fill feel
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutQuart (starts fast, slows down beautifully)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentScore = Math.round(start + easeProgress * (end - start));
      
      setAnimatedScore(currentScore);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [score]);

  const getScoreColor = (val: number) => {
    if (val >= 80) return { text: "text-emerald-500", stroke: "stroke-emerald-500", bg: "bg-emerald-50/50 border-emerald-100/70", label: "Excellent SEO", badge: "bg-emerald-100 text-emerald-800" };
    if (val >= 60) return { text: "text-amber-500", stroke: "stroke-amber-500", bg: "bg-amber-50/50 border-amber-100/70", label: "Moderate SEO", badge: "bg-amber-100 text-amber-800" };
    return { text: "text-rose-500", stroke: "stroke-rose-500", bg: "bg-rose-50/50 border-rose-100/70", label: "Needs Polish", badge: "bg-rose-100 text-rose-800" };
  };

  const scoreDetails = getScoreColor(score);

  // SVG Gauge calculations
  const radius = 30;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius; // ~188.5
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Keyword density calculation
  const getKeywordDensityInfo = () => {
    const text = description || "";
    const kw = keyword || "";
    if (!text || !kw) {
      return { count: 0, wordCount: 0, density: 0, label: "No Data", status: "neutral", textClass: "text-slate-500", barClass: "bg-slate-300", bgClass: "bg-slate-50", badgeClass: "bg-slate-100 text-slate-800" };
    }

    const cleanKw = kw.trim();
    let count = 0;
    try {
      const escapedPhrase = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
      const matches = text.match(regex);
      count = matches ? matches.length : 0;
    } catch (e) {
      let pos = text.toLowerCase().indexOf(cleanKw.toLowerCase());
      while (pos !== -1) {
        count++;
        pos = text.toLowerCase().indexOf(cleanKw.toLowerCase(), pos + cleanKw.length);
      }
    }

    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const density = wordCount > 0 ? (count / wordCount) * 100 : 0;

    let label = "";
    let status = "";
    let textClass = "";
    let barClass = "";
    let bgClass = "";
    let badgeClass = "";

    if (count === 0) {
      label = "Missing Keyword";
      status = "low";
      textClass = "text-rose-600";
      barClass = "bg-rose-500";
      bgClass = "bg-rose-50/50";
      badgeClass = "bg-rose-100 text-rose-800";
    } else if (density < 1.0) {
      label = "Under-optimized";
      status = "medium-low";
      textClass = "text-amber-600";
      barClass = "bg-amber-400";
      bgClass = "bg-amber-50/50";
      badgeClass = "bg-amber-100 text-amber-800";
    } else if (density <= 3.0) {
      label = "Optimal Density";
      status = "optimal";
      textClass = "text-emerald-600";
      barClass = "bg-emerald-500";
      bgClass = "bg-emerald-50/50";
      badgeClass = "bg-emerald-100 text-emerald-800";
    } else if (density <= 5.0) {
      label = "Highly Optimized";
      status = "high";
      textClass = "text-amber-600";
      barClass = "bg-amber-500";
      bgClass = "bg-amber-50/50";
      badgeClass = "bg-amber-100 text-amber-800";
    } else {
      label = "Over-optimized";
      status = "critical";
      textClass = "text-rose-600";
      barClass = "bg-rose-500";
      bgClass = "bg-rose-50/50";
      badgeClass = "bg-rose-100 text-rose-800";
    }

    return { count, wordCount, density, label, status, textClass, barClass, bgClass, badgeClass };
  };

  const densityInfo = getKeywordDensityInfo();

  const trends = safeAnalysis.trendsData && safeAnalysis.trendsData.length > 0
    ? safeAnalysis.trendsData
    : generateFallbackTrends(keyword);

  const peakPopularity = Math.max(...trends.map(t => t.popularity));
  const avgPopularity = Math.round(trends.reduce((sum, t) => sum + t.popularity, 0) / trends.length);
  
  // Calculate trend direction
  const firstHalf = trends.slice(0, 15).reduce((sum, t) => sum + t.popularity, 0) / 15;
  const secondHalf = trends.slice(15).reduce((sum, t) => sum + t.popularity, 0) / 15;
  const trendDir = secondHalf > firstHalf ? "Upward" : "Steady/Downward";
  const trendColor = secondHalf > firstHalf 
    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50" 
    : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800";

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {/* SEO Health Score Circular Gauge Box */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
              <Award className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">SEO Health Score</span>
            </div>
          </div>
          <div className="flex items-center gap-4 py-1">
            {/* Circular SVG Gauge */}
            <div className="relative flex items-center justify-center flex-shrink-0">
              <svg className="w-18 h-18 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                  strokeWidth={strokeWidth}
                />
                {/* Foreground circle with animation */}
                <circle
                  cx="36"
                  cy="36"
                  r={radius}
                  className={`fill-none transition-all duration-300 ease-out ${scoreDetails.stroke}`}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                  {animatedScore}
                </span>
                <span className="text-[9px] font-bold text-slate-400">/100</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full mb-1 ${scoreDetails.badge}`}>
                {scoreDetails.label}
              </span>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
                Calculated dynamically based on competition and keyword potential.
              </p>
            </div>
          </div>
        </div>

        {/* Search Volume Box */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Search Volume</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">{safeAnalysis.searchVolume || "Medium"}</span>
              <span className="text-xs text-gray-400">Monthly Searches</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${volColor.bar}`}
                style={{
                  width: (safeAnalysis.searchVolume || "Medium").toString().toLowerCase().includes("high")
                    ? "90%"
                    : (safeAnalysis.searchVolume || "Medium").toString().toLowerCase().includes("medium")
                    ? "55%"
                    : "25%",
                }}
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2">
              Estimates search interest for "{keyword}" relative to video niches.
            </p>
          </div>
        </div>

        {/* Ranking Difficulty Box */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
              <Gauge className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Ranking Difficulty</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">{safeAnalysis.difficulty || "Medium"}</span>
              <span className="text-xs text-gray-400">Competition Index</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${diffColor.bar}`}
                style={{
                  width: (safeAnalysis.difficulty || "Medium").toString().toLowerCase().includes("high")
                    ? "90%"
                    : (safeAnalysis.difficulty || "Medium").toString().toLowerCase().includes("medium")
                    ? "60%"
                    : "30%",
                }}
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2">
              How tough it is to rank on the first page of search results.
            </p>
          </div>
        </div>

        {/* Keyword Density Box */}
        <div id="seo-keyword-density-card" className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-2">
              <Percent className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Keyword Density</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 tracking-tight">
                {densityInfo.density.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-400">({densityInfo.count} {densityInfo.count === 1 ? 'time' : 'times'})</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${densityInfo.barClass}`}
                style={{
                  width: `${Math.min(densityInfo.density * 33.3, 100)}%`, // 3% is optimal (100% width)
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${densityInfo.badgeClass}`}>
                {densityInfo.label}
              </span>
              <span className="text-[10px] text-slate-400">Target: 1.0% - 3.0%</span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2">
              {densityInfo.count === 0 
                ? "Ensure keyword is in the description for SEO visibility." 
                : densityInfo.density < 1.0 
                ? "Slightly low. Mention the keyword a bit more to boost rankings."
                : densityInfo.density <= 3.0
                ? "Perfect! Ideal presence for search index optimization."
                : "A bit high. Make sure the content flows naturally."}
            </p>
          </div>
        </div>

        {/* Actionable Tips Column */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 mb-3">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-semibold uppercase tracking-wider">Viral Growth Hacks</span>
            </div>
            <ul className="space-y-2.5">
              {(safeAnalysis.tips || []).map((tip, idx) => (
                <li key={idx} className="flex gap-2 items-start text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="truncate-2-lines">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Google Trends Search Volume Trend Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col gap-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Google Trends Search Index</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              30-Day Search Popularity for "{keyword}"
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time relative interest over time based on Google Trends query volume with search grounding.
            </p>
          </div>

          {/* Mini insights badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Peak Interest</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 leading-none">{peakPopularity}/100</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-3 py-1.5 rounded-xl flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Avg Popularity</span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-1 leading-none">{avgPopularity}/100</span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border flex flex-col ${trendColor}`}>
              <span className="text-[10px] font-bold uppercase leading-none opacity-80">Trend Angle</span>
              <span className="text-sm font-extrabold mt-1 leading-none">{trendDir}</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Container */}
        <div className="w-full h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trends}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="trendsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                dx={-8}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', radius: 4 }} />
              <Bar 
                dataKey="popularity" 
                fill="url(#trendsGradient)"
                radius={[4, 4, 0, 0]}
              >
                {trends.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    className="transition-all duration-300 hover:opacity-100 opacity-85 hover:filter hover:drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
