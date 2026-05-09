"use client";

import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";

export type CurrencyCode = "KWD" | "USD" | "EUR" | "SAR" | "AED" | "GBP";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  nameAr: string;
  nameEn: string;
  rate: number; // relative to KWD
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: "KWD", symbol: "د.ك", nameAr: "دينار كويتي", nameEn: "Kuwaiti Dinar", rate: 1 },
  { code: "USD", symbol: "$", nameAr: "دولار أمريكي", nameEn: "US Dollar", rate: 3.26 },
  { code: "EUR", symbol: "€", nameAr: "يورو", nameEn: "Euro", rate: 3.0 },
  { code: "SAR", symbol: "ر.س", nameAr: "ريال سعودي", nameEn: "Saudi Riyal", rate: 12.23 },
  { code: "AED", symbol: "د.إ", nameAr: "درهم إماراتي", nameEn: "UAE Dirham", rate: 11.97 },
  { code: "GBP", symbol: "£", nameAr: "جنيه إسترليني", nameEn: "British Pound", rate: 2.58 },
];

interface CurrencyContextValue {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (kwdAmount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState<CurrencyCode>("KWD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("alqadi_currency") as CurrencyCode | null;
      if (saved && CURRENCIES.find(c => c.code === saved)) setCode(saved);
    } catch { /* ignore */ }
  }, []);

  const currency = CURRENCIES.find(c => c.code === code)!;

  const setCurrency = (c: CurrencyCode) => {
    setCode(c);
    try { localStorage.setItem("alqadi_currency", c); } catch { /* ignore */ }
  };

  const formatPrice = (kwdAmount: number) => {
    const converted = kwdAmount * currency.rate;
    const formatted = converted.toLocaleString("ar-KW", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${currency.symbol} ${formatted}`;
  };

  const value = useMemo(() => ({ currency, setCurrency, formatPrice }), [currency]);

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be inside CurrencyProvider");
  return ctx;
}
