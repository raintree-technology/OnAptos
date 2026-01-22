"use client";

import { type ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";

import i18n, { applySavedLanguage } from "@/lib/i18n";

export function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Apply saved language preference AFTER hydration to prevent mismatch errors
    applySavedLanguage();
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
