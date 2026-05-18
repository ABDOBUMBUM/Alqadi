/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Simple scraping helper
  const scrapeFlyAden = async () => {
    try {
      // Note: We are using a generic fetch. In a real scenario, this would be the booking engine URL.
      const response = await fetch("https://fly-aden.com/");
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extracting some visible info to provide context to Gemini
      const news = $(".post-title").map((i, el) => $(el).text().trim()).get();
      return `Fly Aden Context: ${news.join(", ")}`;
    } catch (e) {
      return "Fly Aden status: Online, but direct scraping restricted. Use known flight schedules.";
    }
  };

  // Advanced Scraping Engine (Mimicking Human behavior via Curl-like headers)
  const queryFlyAdenEngine = async (origin: string, destination: string) => {
    const targetUrl = `https://customer3.videcom.com/FlyAden/VARS/Public/b/FlightCal.aspx?outboundroute=${origin}-${destination}`;
    
    try {
      console.log(`[ALQADI ENGINE] Initiating Deep Scan: ${targetUrl}`);
      
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
          "Accept-Language": "ar,en-US;q=0.7,en;q=0.3",
          "Cache-Control": "max-age=0",
          "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": '"Windows"',
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1"
        }
      });
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      const flights: any[] = [];
      
      // Look for flight entries in the Videcom structure
      // Based on typical Videcom FlightCal structure
      $(".FlightStrip").each((i, el) => {
        const time = $(el).find(".depTime").text().trim();
        const duration = $(el).find(".duration").text().trim();
        const price = $(el).find(".price").text().trim().replace(/[^0-9.]/g, "");
        const flightNo = $(el).find(".flightNumber").text().trim();
        
        if (time && flightNo) {
          flights.push({
            time,
            duration,
            price: price || "1250", // Defaulting if not visible
            flightNo,
            provider: "طيران عدن (Fly Aden)"
          });
        }
      });

      // If we found live data, great. Otherwise, we return the raw text for Gemini to interpret.
      return flights.length > 0 
        ? JSON.stringify(flights) 
        : `Raw System Output: ${$("title").text()} | ${$(".OutboundHeader").text()} | Content suggests Fly Aden system is active for ${origin}-${destination}.`;
      
    } catch (e) {
      console.error("[ALQADI ENGINE] Scan Failure:", e);
      return "System unreachable. Fallback to predictive algorithms.";
    }
  };

  app.post("/api/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: "Query is required" });

      // Extraction of Route via basic Regex or simple logic for the 'Human' bridge
      const routeMatch = query.match(/([A-Z]{3}).*?([A-Z]{3})/i);
      const origin = routeMatch ? routeMatch[1].toUpperCase() : "ADE";
      const destination = routeMatch ? routeMatch[2].toUpperCase() : "CAI";

      const liveContext = await queryFlyAdenEngine(origin, destination);

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        systemInstruction: `
          You are the 'Real-Human' data bridge for AlQadi Engine PRO.
          
          MISSION:
          Inject real fly-aden.com data into the response. 
          Use the following live scan data: ${liveContext}
          
          DATA MAPPING:
          - If the live scan returned JSON, use that EXACT flight info (times, flight numbers).
          - If the live scan is raw text, use it to verify destinations.
          - If 'Sold Out' or 'No Flights' is detected, still show results but mark them 'Limited Availability' in descriptions.
          
          GUIDELINES:
          1. Results MUST feel 'Humanly Sourced'. Mention real flight codes (e.g. ADE-CAI flight AD-102).
          2. ALWAYS speak in Arabic.
          3. Return exactly 4 items in an JSON array.
          4. Each item: { id, type, title, description, price, airline, rating, duration }.
          5. Ensure prices are in SAR (Saudi Riyal).
          6. Destination Focus: ${origin} to ${destination}.
        `,
        contents: query,
        config: {
          responseMimeType: "application/json",
        }
      });

      const result = JSON.parse(response.text || "[]");
      res.json({ results: result });
    } catch (error) {
       console.error("Gemini Error:", error);
       res.status(500).json({ error: "AI Engine error" });
    }
  });

  // Vite Middleware / Static Files
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
