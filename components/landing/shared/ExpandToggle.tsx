import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExpandToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ExpandToggle({ expanded, onToggle }: ExpandToggleProps) {
  return (
    <Button variant="ghost" size="sm" onClick={onToggle} className="gap-1">
      {expanded ? "Show Less" : "Show All"}
      {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </Button>
  );
}
