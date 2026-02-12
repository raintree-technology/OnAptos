"use client";

import { Home } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { LanguageToggle } from "@/components/ui/language-toggle";

interface MinimalNavProps {
  currentPage: string;
  parentHref?: string;
  parentLabel?: string;
}

export function MinimalNav({ currentPage, parentHref, parentLabel }: MinimalNavProps) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-2 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/" className="flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Home</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {parentHref && parentLabel && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={parentHref}>{parentLabel}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPage}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </div>
  );
}
