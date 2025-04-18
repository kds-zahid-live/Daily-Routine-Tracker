"use client"

import { motion } from "framer-motion"
import { useRoutine } from "./routine-provider"
import { CategoryFilter } from "./category-filter"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function RoutineView() {
  const { filteredTasks, completedTasks, completeTask } = useRoutine()

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      prayer: <span className="text-xl">🕌</span>,
      meal: <span className="text-xl">🍽️</span>,
      study: <span className="text-xl">📚</span>,
      work: <span className="text-xl">💼</span>,
      rest: <span className="text-xl">😴</span>,
      exercise: <span className="text-xl">🏃</span>,
      family: <span className="text-xl">👨‍👩‍👧‍👦</span>,
      personal: <span className="text-xl">🧘</span>,
    }
    return icons[iconName] || <span className="text-xl">📝</span>
  }

  // Define the correct order of time periods
  const periodOrder = ["Morning", "Noon", "Afternoon", "Evening", "Night"]

  // Group tasks by time period
  const groupedTasks = filteredTasks.reduce(
    (acc, task) => {
      // Extract hour and minute from the time string
      const timeStart = task.time.split(" - ")[0]
      const [hourStr, minuteStr] = timeStart.split(":")
      const hour = Number.parseInt(hourStr)
      const minute = Number.parseInt(minuteStr.split(" ")[0])
      const isPM = timeStart.includes("PM")

      // Convert to 24-hour format for easier comparison
      const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour

      // Calculate time in minutes since midnight for precise comparison
      const timeInMinutes = hour24 * 60 + minute

      let period = "Morning"

      // Morning: Before 12:00 PM (720 minutes)
      // Noon: 12:00 PM - 2:59 PM (720-899 minutes)
      // Afternoon: 3:00 PM - 5:29 PM (900-1049 minutes)
      // Evening: 5:30 PM - 6:59 PM (1050-1139 minutes)
      // Night: 7:00 PM and later (1140+ minutes)

      if (timeInMinutes >= 720 && timeInMinutes < 900) {
        period = "Noon"
      } else if (timeInMinutes >= 900 && timeInMinutes < 1050) {
        period = "Afternoon"
      } else if (timeInMinutes >= 1050 && timeInMinutes < 1140) {
        period = "Evening"
      } else if (timeInMinutes >= 1140 || timeInMinutes < 240) {
        // 240 = 4:00 AM
        period = "Night"
      }

      if (!acc[period]) {
        acc[period] = []
      }

      acc[period].push(task)
      return acc
    },
    {} as Record<string, typeof filteredTasks>,
  )

  // Sort periods in the correct order
  const sortedPeriods = periodOrder.filter((period) => groupedTasks[period] && groupedTasks[period].length > 0)

  return (
    <div className="space-y-6">
      <CategoryFilter />

      {sortedPeriods.map((period) => (
        <div key={period} className="space-y-4">
          <h2 className="text-xl font-semibold">{period}</h2>
          <div className="grid gap-4">
            {groupedTasks[period].map((task) => {
              const isCompleted = completedTasks.includes(task.id)

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card className={`overflow-hidden ${isCompleted ? "opacity-70" : ""}`}>
                    <CardContent className="p-0">
                      <div className="flex items-center p-4">
                        <div className="flex-shrink-0 mr-4">{getIconComponent(task.icon)}</div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className={`font-medium ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                                {task.description}
                              </p>
                              <p className="text-sm text-muted-foreground">{task.time}</p>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          className="ml-4 flex-shrink-0"
                          onClick={() => completeTask(task.id)}
                        >
                          {isCompleted ? <Check className="h-4 w-4 text-green-500" /> : "Complete"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
