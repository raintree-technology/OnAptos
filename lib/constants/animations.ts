/**
 * Reusable animation configurations for framer-motion
 * Following best practices: GPU-accelerated properties (opacity, transform)
 * @see https://motion.dev/
 */

export const FADE_UP = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
} as const;

export const FADE_UP_DELAYED = (delay: number) =>
  ({
    initial: { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
  }) as const;

export const FADE_IN = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
} as const;
