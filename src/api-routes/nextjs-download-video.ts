/**
 * NEXT.JS SERVERLESS API ROUTE FOR ALL-IN-ONE VIDEO DOWNLOADER
 * 
 * This file contains fully compatible, pure TypeScript implementations of the RapidAPI video downloader.
 * It is built strictly on standard Web APIs (global fetch, URLSearchParams) and runs flawlessly in
 * Serverless, Edge, and traditional cloud environments (like Vercel, Netlify, Cloudflare Workers).
 * 
 * - ZERO Node-specific modules (no 'stream', 'http', 'https', 'dns', etc.)
 * - ZERO CommonJS 'require' statements (strictly ES imports/exports)
 * - Safe from CORS and environment incompatibilities
 */

// ============================================================================
// 1. NEXT.JS APP ROUTER FORMAT (app/api/download-video/route.ts)
// ============================================================================

/*
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the JSON request body
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, message: "A valid URL string is required." },
        { status: 400 }
      );
    }

    const videoUrl = url.trim();
    console.log(`Serverless Route: Fetching download links for URL: ${videoUrl}`);

    // Standard url-encoded parameters for RapidAPI
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", videoUrl);

    const apiUrl = "https://best-all-in-one-video-downloader5.p.rapidapi.com/index.php";
    const apiKey = process.env.RAPID_API_KEY || "";

    // Call the RapidAPI Video Downloader endpoint using modern global fetch
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "best-all-in-one-video-downloader5.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodedParams
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `RapidAPI server error: status ${response.status}` },
        { status: response.status }
      );
    }

    // Parse response robustly as JSON
    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Next.js Serverless Downloader Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to analyze video using serverless route." },
      { status: 500 }
    );
  }
}
*/


// ============================================================================
// 2. NEXT.JS PAGES ROUTER FORMAT (pages/api/download-video.ts)
// ============================================================================

/*
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enforce POST method
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} not allowed.` });
  }

  try {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
      return res.status(400).json({ success: false, message: "A valid URL string is required." });
    }

    const videoUrl = url.trim();
    const encodedParams = new URLSearchParams();
    encodedParams.set("url", videoUrl);

    const apiUrl = "https://best-all-in-one-video-downloader5.p.rapidapi.com/index.php";
    const apiKey = process.env.RAPID_API_KEY || "";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "best-all-in-one-video-downloader5.p.rapidapi.com",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: encodedParams
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `RapidAPI server error: status ${response.status}`
      });
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Pages Router Downloader Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to analyze video using pages API route."
    });
  }
}
*/
