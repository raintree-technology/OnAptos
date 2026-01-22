"use client";

import { motion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FADE_IN } from "@/lib/constants/animations";
import { formatCompactNumber } from "@/lib/utils/format/format";

interface HeroSectionProps {
  assetValues: {
    stables: { value: number; label: string; description: string };
    rwas: { value: number; label: string; description: string };
    btc: { value: number; label: string; description: string };
    tokens: { value: number; label: string; description: string };
  } | null;
  isLoadingValues: boolean;
}

export default function HeroSection({ assetValues, isLoadingValues }: HeroSectionProps) {
  const stables = useSpring(0, { duration: 1200 });
  const rwas = useSpring(0, { duration: 1200 });
  const btc = useSpring(0, { duration: 1200 });
  const tokens = useSpring(0, { duration: 1200 });

  useEffect(() => {
    if (assetValues) {
      stables.set(assetValues.stables.value);
      rwas.set(assetValues.rwas.value);
      btc.set(assetValues.btc.value);
      tokens.set(assetValues.tokens.value);
    }
  }, [assetValues, stables, rwas, btc, tokens]);

  return (
    <section
      id="overview"
      className="pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Background Aptos Logo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 translate-y-[5%] pointer-events-none z-0">
        <div className="relative w-[1200px] sm:w-[1800px] md:w-[2400px] lg:w-[3000px] h-[600px] sm:h-[900px] md:h-[1200px] lg:h-[1500px]">
          {/* Light mode logo */}
          <div className="dark:hidden relative w-full h-full">
            <Image
              src="/icons/apt.png"
              alt=""
              fill
              className="object-contain"
              priority
              style={{
                opacity: 0.12,
                filter: "blur(2px)",
                maskImage:
                  "radial-gradient(ellipse 80% 60% at center top, black 30%, transparent 65%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at center top, black 30%, transparent 65%)",
              }}
            />
          </div>

          {/* Dark mode logo */}
          <div className="hidden dark:block relative w-full h-full">
            <Image
              src="/icons/apt.png"
              alt=""
              fill
              className="object-contain"
              priority
              style={{
                opacity: 0.15,
                filter: "blur(2px) invert(1)",
                maskImage:
                  "radial-gradient(ellipse 80% 60% at center top, black 30%, transparent 65%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 80% 60% at center top, black 30%, transparent 65%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main heading */}
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold mb-6 text-foreground tracking-tight"
            {...FADE_IN}
          >
            Aptos Ecosystem
          </motion.h1>

          {/* Subheading */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Track your portfolio, explore DeFi protocols, and discover tools
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link href="/portfolio">
              <button className="px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors">
                View Portfolio
              </button>
            </Link>
            <Link href="#defi">
              <button className="px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors">
                Explore Protocols
              </button>
            </Link>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link href="/markets/stables" className="group">
              <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1 font-mono">
                  {isLoadingValues ? (
                    <span className="inline-block w-20 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    <motion.span>
                      {stables.get() ? formatCompactNumber(Math.floor(stables.get())) : "$0"}
                    </motion.span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  Stablecoins
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </Link>

            <Link href="/markets/rwas" className="group">
              <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1 font-mono">
                  {isLoadingValues ? (
                    <span className="inline-block w-20 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    <motion.span>
                      {rwas.get() ? formatCompactNumber(Math.floor(rwas.get())) : "$0"}
                    </motion.span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  Real World Assets
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </Link>

            <Link href="/markets/bitcoin" className="group">
              <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1 font-mono">
                  {isLoadingValues ? (
                    <span className="inline-block w-20 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    <motion.span>
                      {btc.get() ? formatCompactNumber(Math.floor(btc.get())) : "$0"}
                    </motion.span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  Bitcoin
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </Link>

            <Link href="/protocols/defi" className="group">
              <div className="text-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                <p className="text-2xl md:text-3xl font-semibold text-foreground mb-1 font-mono">
                  {isLoadingValues ? (
                    <span className="inline-block w-20 h-8 bg-muted animate-pulse rounded" />
                  ) : (
                    <motion.span>
                      {tokens.get() ? formatCompactNumber(Math.floor(tokens.get())) : "$0"}
                    </motion.span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  Total Value Locked
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
