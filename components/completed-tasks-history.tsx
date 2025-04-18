"use client"

import { useRoutine } from "./routine-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export function CompletedTasksHistory() {
  const { completedTasksByDate, getTaskById } = useRoutine()
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Toggle expanded state for a date
  const toggleDateExpanded = (date: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }))
  }

  // Get dates in reverse chronological order (newest first)
  const sortedDates = Object.keys(completedTasksByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Calculate completion statistics
  const getCompletionStats = (date: string) => {
    const tasksForDate = completedTasksByDate[date] || []

    // Group by category
    const categoryCounts: Record<string, number> = {}
    tasksForDate.forEach((taskId) => {
      const task = getTaskById(taskId)
      if (task) {
        categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1
      }
    })

    return {
      total: tasksForDate.length,
      categories: Object.entries(categoryCounts).map(([category, count]) => ({ category, count })),
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Completed Tasks History</h2>
        <Badge variant="outline" className="text-sm">
          {sortedDates.length} Days
        </Badge>
      </div>

      {sortedDates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No completed tasks history yet.</p>
            <p className="text-sm mt-2">Complete some tasks to see them here!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedDates.map((date) => {
            const isExpanded = expandedDates[date] || false
            const stats = getCompletionStats(date)

            return (
              <Card key={date} className="overflow-hidden">
                <CardHeader
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleDateExpanded(date)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">{formatDate(date)}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{stats.total} Tasks</Badge>
                      <div
                        className="transform transition-transform duration-200"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  {/* Category summary */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {stats.categories.map(({ category, count }) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}: {count}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="p-0">
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t max-h-[300px] overflow-y-auto">
                        <div className="space-y-2">
                          {completedTasksByDate[date].map((taskId) => {
                            const task = getTaskById(taskId)
                            if (!task) return null

                            return (
                              <div key={taskId} className="flex items-center justify-between p-2 rounded bg-muted/30">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-shrink-0">
                                    {task.icon === "prayer" && <span className="text-lg">🕌</span>}
                                    {task.icon === "meal" && <span className="text-lg">🍽️</span>}
                                    {task.icon === "study" && <span className="text-lg">📚</span>}
                                    {task.icon === "work" && <span className="text-lg">💼</span>}
                                    {task.icon === "rest" && <span className="text-lg">😴</span>}
                                    {task.icon === "exercise" && <span className="text-lg">🏃</span>}
                                    {task.icon === "family" && <span className="text-lg">👨‍👩‍👧‍👦</span>}
                                    {task.icon === "personal" && <span className="text-lg">🧘</span>}
                                  </div>
                                  <div>
                                    <p className="font-medium">{task.description}</p>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {task.time}
                                    </div>
                                  </div>
                                </div>
                                <Badge>{task.category}</Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
