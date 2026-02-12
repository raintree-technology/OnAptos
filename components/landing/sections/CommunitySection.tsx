"use client";

import { motion } from "framer-motion";
import { Globe, Hash, MapPin } from "lucide-react";
import Link from "next/link";
import {
  officialLinks,
  regionalCommunities,
  socialLinks,
} from "@/components/landing/data/landing-data";
import { FADE_UP, FADE_UP_DELAYED } from "@/lib/constants/animations";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";

export default function CommunitySection() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="community">
      <SectionHeader
        title="Community"
        description="Connect with the community and access resources"
      />

      <div className="space-y-6">
        <motion.div className="p-5 rounded-lg border border-border bg-card" {...FADE_UP}>
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Social Media</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-center"
              >
                {social.name}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-lg border border-border bg-card"
          {...FADE_UP_DELAYED(0.05)}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Regional Communities</h3>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {regionalCommunities.map((community) => (
              <Link
                key={community.name}
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-center"
              >
                {community.name}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="p-5 rounded-lg border border-border bg-card"
          {...FADE_UP_DELAYED(0.1)}
        >
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium text-foreground">Official Resources</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {officialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-center"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
