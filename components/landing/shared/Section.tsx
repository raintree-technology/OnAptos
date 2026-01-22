import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24 px-4 sm:px-6", className)}>
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </div>
    </section>
  );
}
