"use client"

import { useRoutine } from "./routine-provider"
import { Button } from "@/components/ui/button"

export function CategoryFilter() {
  const { categories, filterTasks, activeFilter } = useRoutine()

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">Filter by Category</h2>
      <div className="flex flex-wrap gap-2">
        <Button variant={activeFilter === null ? "default" : "outline"} size="sm" onClick={() => filterTasks(null)}>
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeFilter === category ? "default" : "outline"}
            size="sm"
            onClick={() => filterTasks(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  )
}
