"use client";

import { motion } from "framer-motion";
import { BookOpen, Check, Copy, ExternalLink, Github, Terminal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { developerTools } from "@/components/landing/data/landing-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FADE_UP } from "@/lib/constants/animations";
import { Section } from "../shared/Section";
import SectionHeader from "../shared/SectionHeader";

export default function DevelopersSection() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText("npx create-aptos-dapp");
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    // biome-ignore lint/correctness/useUniqueElementIds: stable anchor ID for scroll navigation
    <Section id="developers">
      <SectionHeader title="Build on Aptos" description="Everything you need to start building" />

      <motion.div {...FADE_UP}>
        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto mb-8">
            <TabsTrigger value="quickstart" className="gap-2">
              <Terminal className="w-4 h-4" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="tools" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Developer Tools
            </TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="mt-0">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Create Your First dApp
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full-stack scaffold with wallet integration and Move smart contracts
                </p>
              </div>

              {/* Terminal */}
              <div className="bg-zinc-900 rounded-lg overflow-hidden mb-6 border border-zinc-800">
                <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono ml-2">terminal</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="px-4 py-3 font-mono text-sm">
                  <span className="text-zinc-500">$</span>
                  <span className="text-zinc-100 ml-2">npx create-aptos-dapp</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="https://aptos.dev/" target="_blank" rel="noopener noreferrer">
                  <Button variant="default" className="gap-2 w-full sm:w-auto">
                    <BookOpen className="w-4 h-4" />
                    Documentation
                  </Button>
                </Link>
                <Link
                  href="https://github.com/aptos-labs/aptos-core"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="gap-2 w-full sm:w-auto">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Button>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Developer Tools Tab */}
          <TabsContent value="tools" className="mt-0">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {developerTools.map((tool, index) => {
                const Icon = tool.icon;
                return (
                  <Link key={index} href={tool.href} target="_blank" rel="noopener noreferrer">
                    <div className="group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors h-full">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0 flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-foreground">{tool.name}</h4>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </Section>
  );
}
