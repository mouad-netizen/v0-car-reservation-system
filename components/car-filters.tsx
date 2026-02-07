"use client"

import { Button } from "@/components/ui/button"
import { Car } from "@/lib/types"

interface CarFiltersProps {
  categories: Car["category"][]
  selectedCategory: Car["category"] | "all"
  onCategoryChange: (category: Car["category"] | "all") => void
}

export function CarFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: CarFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange("all")}
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
