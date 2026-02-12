"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null before mount to avoid hydration mismatch (next-themes best practice)
  if (!mounted) {
    return null;
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="rounded-lg p-2 bg-gradient-to-r from-[#F4603E]/10 to-[#1E1870]/10 hover:from-[#F4603E]/20 hover:to-[#1E1870]/20 transition-all duration-200 border-2 border-[#F4603E]/20 hover:border-[#F4603E]/40"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#F4603E]" />
      ) : (
        <Moon className="h-4 w-4 text-[#1E1870]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
