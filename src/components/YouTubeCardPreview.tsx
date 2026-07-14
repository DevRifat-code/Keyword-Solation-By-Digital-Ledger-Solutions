import React, { useState } from "react";
import { Play, Eye, Calendar, Laptop, Smartphone } from "lucide-react";

interface YouTubeCardPreviewProps {
  title: string;
  channelName?: string;
  descriptionSnippet?: string;
}

export default function YouTubeCardPreview({
  title,
  channelName = "My Creator Studio",
  descriptionSnippet = "Click on any generated title below to preview how it looks inside YouTube's desktop or mobile search results card layout in real-time."
}: YouTubeCardPreviewProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Play className="w-4 h-4 text-red-600 fill-red-600" />
          Live Search Card Preview
        </h3>
        <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-medium text-gray-600 dark:text-slate-400">
          <button
            onClick={() => setPreviewMode("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              previewMode === "desktop" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs" : "hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            Desktop
          </button>
          <button
            onClick={() => setPreviewMode("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              previewMode === "mobile" ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-xs" : "hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Mobile
          </button>
        </div>
      </div>

      {previewMode === "desktop" ? (
        /* YouTube Desktop Mockup */
        <div className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-zinc-950 p-4 rounded-lg border border-gray-100 dark:border-zinc-800 max-w-3xl mx-auto">
          {/* Thumbnail Mock */}
          <div className="relative aspect-video w-full md:w-56 bg-zinc-900 rounded-md flex-shrink-0 overflow-hidden flex items-center justify-center border border-zinc-800 shadow-sm group">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/45 to-zinc-900 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-red-600/90 flex items-center justify-center shadow-md">
                <Play className="w-5 h-5 text-white fill-white ml-0.5" />
              </div>
            </div>
            {/* Length Badge */}
            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-medium px-1 rounded-sm tracking-wide">
              10:45
            </span>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-[16px] font-medium text-zinc-900 dark:text-zinc-100 leading-tight mb-1 font-sans line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
              {title || "Your Viral Video Title Goes Here"}
            </h4>
            
            {/* View & Date */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="hover:text-zinc-800 dark:hover:text-zinc-200 font-medium">{channelName}</span>
              <span className="text-[10px]">•</span>
              <span>120K views</span>
              <span className="text-[10px]">•</span>
              <span>2 hours ago</span>
            </div>

            {/* Profile pic & channel name row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200 text-[10px] font-bold uppercase border border-zinc-400 dark:border-zinc-600">
                {channelName.charAt(0)}
              </div>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 cursor-pointer">{channelName}</span>
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-normal">
              {descriptionSnippet || "Learn how to optimize video tags, find search volumes, and craft high CTR titles..."}
            </p>
          </div>
        </div>
      ) : (
        /* YouTube Mobile Mockup */
        <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-lg border border-gray-100 dark:border-zinc-800 max-w-sm mx-auto">
          {/* Mobile Thumbnail */}
          <div className="relative aspect-video w-full bg-zinc-900 rounded-md overflow-hidden flex items-center justify-center border border-zinc-800 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/45 to-zinc-900 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-red-600/90 flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 bg-black/85 text-white text-[10px] font-medium px-1 rounded-sm">
              10:45
            </span>
          </div>

          {/* Details Row */}
          <div className="flex gap-3 mt-3">
            {/* Channel Avatar */}
            <div className="w-9 h-9 rounded-full bg-zinc-300 dark:bg-zinc-700 flex-shrink-0 flex items-center justify-center text-zinc-700 dark:text-zinc-200 text-xs font-bold uppercase border border-zinc-400 dark:border-zinc-600">
              {channelName.charAt(0)}
            </div>

            {/* Title & Info */}
            <div className="min-w-0 flex-1">
              <h4 className="text-[14px] font-medium text-zinc-900 dark:text-zinc-100 leading-snug font-sans line-clamp-2">
                {title || "Your Viral Video Title Goes Here"}
              </h4>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex-wrap">
                <span>{channelName}</span>
                <span className="text-[8px]">•</span>
                <span>120K views</span>
                <span className="text-[8px]">•</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
