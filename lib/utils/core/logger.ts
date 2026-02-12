// Development logger that uses console
const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  // biome-ignore lint/suspicious/noConsole: logger utility
  info: (...args: unknown[]) => isDevelopment && console.log("[INFO]", ...args),
  // biome-ignore lint/suspicious/noConsole: logger utility
  debug: (...args: unknown[]) => isDevelopment && console.debug("[DEBUG]", ...args),
  // biome-ignore lint/suspicious/noConsole: logger utility
  warn: (...args: unknown[]) => isDevelopment && console.warn("[WARN]", ...args),
  // biome-ignore lint/suspicious/noConsole: logger utility
  error: (...args: unknown[]) => isDevelopment && console.error("[ERROR]", ...args),
  // biome-ignore lint/suspicious/noConsole: logger utility
  fatal: (...args: unknown[]) => console.error("[FATAL]", ...args),
  // biome-ignore lint/suspicious/noConsole: logger utility
  trace: (...args: unknown[]) => isDevelopment && console.trace("[TRACE]", ...args),
  child: () => logger,
};

// Create child loggers for different modules
export const createLogger = (_module: string) => {
  return logger;
};

// Specialized loggers for different parts of the application
export const apiLogger = createLogger("api");
export const serviceLogger = createLogger("service");
export const dbLogger = createLogger("database");
export const utilLogger = createLogger("util");
export const errorLogger = createLogger("error");
export const perfLogger = createLogger("performance");

// Backward compatibility exports
export const log = (...args: unknown[]) => {
  logger.info(args.length === 1 ? args[0] : args.join(" "));
};

export const warn = (...args: unknown[]) => {
  logger.warn(args.length === 1 ? args[0] : args.join(" "));
};

export const error = (...args: unknown[]) => {
  if (args[0] instanceof Error) {
    logger.error(args[0]);
  } else {
    logger.error(args.length === 1 ? args[0] : args.join(" "));
  }
};

// Default export
export default logger;
