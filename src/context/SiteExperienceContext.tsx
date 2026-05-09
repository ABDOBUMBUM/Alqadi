"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SceneTheme = "day" | "night";
export type ColorMode = "dark" | "light";

type ReadingPrefs = {
  contrastBoost: boolean;
  largerText: boolean;
};

type SiteExperienceValue = {
  sceneTheme: SceneTheme;
  setSceneTheme: (t: SceneTheme) => void;
  colorMode: ColorMode;
  toggleColorMode: () => void;
  reading: ReadingPrefs;
  setReading: (r: Partial<ReadingPrefs>) => void;
  reduceMotion: boolean;
  lowBandwidth: boolean;
  setLowBandwidth: (v: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  interestCity: string;
  setInterestCity: (v: string) => void;
  abVariant: "a" | "b";
};

const SiteExperienceContext = createContext<SiteExperienceValue | null>(null);

function readReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function readSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return nav.connection?.saveData === true;
}

/** Reads persisted color mode — falls back to system preference */
function readColorMode(): ColorMode {
  if (typeof window === "undefined") return "dark";
  try {
    const stored = localStorage.getItem("alqadi_color_mode");
    if (stored === "light" || stored === "dark") return stored;
  } catch { /* ignore */ }
  // Respect OS preference as fallback
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function SiteExperienceProvider({ children }: { children: ReactNode }) {
  const [sceneTheme, setSceneThemeState] = useState<SceneTheme>("night");
  const [colorMode, setColorModeState] = useState<ColorMode>("dark");
  const [reading, setReadingState] = useState<ReadingPrefs>({
    contrastBoost: false,
    largerText: false,
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [interestCity, setInterestCity] = useState("");
  const [abVariant, setAbVariant] = useState<"a" | "b">("a");

  useEffect(() => {
    setReduceMotion(readReduceMotion());
    setLowBandwidth(readSaveData());

    // Restore color mode
    const mode = readColorMode();
    setColorModeState(mode);
    applyColorMode(mode);

    try {
      if (document.cookie.includes("low_bandwidth=1")) setLowBandwidth(true);
    } catch { /* ignore */ }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    try {
      const v = document.cookie.match(/(?:^|;\s*)ab_variant=(a|b)/)?.[1];
      if (v === "a" || v === "b") setAbVariant(v);
    } catch { /* ignore */ }
    try {
      const stored = localStorage.getItem("alqadi_interest_city");
      if (stored) setInterestCity(stored);
    } catch { /* ignore */ }
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /** Applies the color mode class to <html> */
  function applyColorMode(mode: ColorMode) {
    const el = document.documentElement;
    if (mode === "light") {
      el.classList.add("light");
      el.classList.remove("dark");
    } else {
      el.classList.remove("light");
      el.classList.add("dark");
    }
  }

  const toggleColorMode = useCallback(() => {
    setColorModeState((prev) => {
      const next: ColorMode = prev === "dark" ? "light" : "dark";
      applyColorMode(next);
      try { localStorage.setItem("alqadi_color_mode", next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const setSceneTheme = useCallback((t: SceneTheme) => {
    setSceneThemeState(t);
  }, []);

  const setReading = useCallback((r: Partial<ReadingPrefs>) => {
    setReadingState((prev) => ({ ...prev, ...r }));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.sceneTheme = sceneTheme;
  }, [sceneTheme]);

  useEffect(() => {
    const el = document.documentElement;
    const readingOn = reading.contrastBoost || reading.largerText;
    el.dataset.reading = readingOn ? "1" : "0";
    el.dataset.reduceMotion = reduceMotion ? "1" : "0";
    el.dataset.lowBandwidth = lowBandwidth ? "1" : "0";
  }, [reading, reduceMotion, lowBandwidth]);

  const value = useMemo(
    () => ({
      sceneTheme,
      setSceneTheme,
      colorMode,
      toggleColorMode,
      reading,
      setReading,
      reduceMotion,
      lowBandwidth,
      setLowBandwidth,
      soundEnabled,
      setSoundEnabled,
      interestCity,
      setInterestCity: (v: string) => {
        setInterestCity(v);
        try {
          localStorage.setItem("alqadi_interest_city", v);
        } catch { /* ignore */ }
      },
      abVariant,
    }),
    [
      sceneTheme,
      setSceneTheme,
      colorMode,
      toggleColorMode,
      reading,
      setReading,
      reduceMotion,
      lowBandwidth,
      soundEnabled,
      interestCity,
      abVariant,
    ],
  );

  return (
    <SiteExperienceContext.Provider value={value}>
      {children}
    </SiteExperienceContext.Provider>
  );
}

export function useSiteExperience() {
  const ctx = useContext(SiteExperienceContext);
  if (!ctx) {
    throw new Error("useSiteExperience must be used within SiteExperienceProvider");
  }
  return ctx;
}
