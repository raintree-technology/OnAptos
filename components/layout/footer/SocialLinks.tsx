"use client";

import type React from "react";

import { FaGithub, FaGlobe, FaXTwitter } from "@/components/icons/SocialIcons";
import { DEVELOPER_CONFIG } from "@/lib/config/app";
import { useTranslation } from "@/lib/hooks/useTranslation";

function SocialLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactElement;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 sm:p-2.5 -m-2 sm:-m-2.5 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md touch-manipulation"
      aria-label={label}
    >
      {icon}
    </a>
  );
}

interface SocialLinksProps {
  className?: string;
}

interface SocialLink {
  href: string;
  icon: React.ReactElement;
  label: string;
}

export function SocialLinks({ className = "" }: SocialLinksProps) {
  const { t } = useTranslation("common");

  const socialLinks: SocialLink[] = [
    DEVELOPER_CONFIG.website && {
      href: DEVELOPER_CONFIG.website,
      icon: <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: t("actions.visit_personal_website"),
    },
    DEVELOPER_CONFIG.github && {
      href: DEVELOPER_CONFIG.github,
      icon: <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: t("actions.view_github"),
    },
    DEVELOPER_CONFIG.twitter && {
      href: DEVELOPER_CONFIG.twitter,
      icon: <FaXTwitter className="w-4 h-4 sm:w-5 sm:h-5" />,
      label: t("actions.follow_on_twitter"),
    },
  ].filter(Boolean) as SocialLink[];

  return (
    <div className={`flex items-center gap-2 xl:gap-3 ${className}`}>
      {socialLinks.map((link, index) => (
        <SocialLink key={index} href={link.href} icon={link.icon} label={link.label} />
      ))}
    </div>
  );
}
