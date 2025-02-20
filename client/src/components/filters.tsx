import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { platformOptions } from "@shared/schema";

type SortField = "name" | "purchaseDate" | "releaseDate";
type SortOrder = "asc" | "desc";

interface FiltersProps {
  platform: string | null;
  onPlatformChange: (platform: string | null) => void;
  sortField: SortField;
  onSortFieldChange: (field: SortField) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
}

export default function Filters({
  platform,
  onPlatformChange,
  sortField,
  onSortFieldChange,
  sortOrder,
  onSortOrderChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <Select
        value={platform ?? "all"}
        onValueChange={(value) => onPlatformChange(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All platforms</SelectItem>
          {platformOptions.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortField} onValueChange={onSortFieldChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="purchaseDate">Purchase Date</SelectItem>
          <SelectItem value="releaseDate">Release Date</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}