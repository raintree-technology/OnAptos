"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { FADE_UP } from "@/lib/constants/animations";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string | ReactNode;
  className?: string;
}

export default function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <motion.div className={cn("text-center mb-12", className)} {...FADE_UP}>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-foreground tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </motion.div>
  );
}
