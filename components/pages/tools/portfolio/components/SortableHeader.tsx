import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  title: string;
  onClick: () => void;
}

export function SortableHeader({ title, onClick }: SortableHeaderProps) {
  return (
    <Button variant="ghost" onClick={onClick} className="-ml-4">
      {title}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}
