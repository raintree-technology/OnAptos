import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  column: any;
  title: string;
}

export function SortableHeader({ column, title }: SortableHeaderProps) {
  const sorted = column.getIsSorted();
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-4 h-auto p-0 hover:bg-transparent"
    >
      <div className="flex items-center gap-1">
        {title}
        {sorted === "desc" ? (
          <ChevronDown className="w-3 h-3" />
        ) : sorted === "asc" ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </Button>
  );
}
