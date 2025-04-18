"use client"

import { useRoutine } from "./routine-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function DailyProgress() {
  const { tasks, completedTasks, categories } = useRoutine()

  const totalTasks = tasks.length
  const completedTasksCount = completedTasks.length
  const progressPercentage = Math.round((completedTasksCount / totalTasks) * 100) || 0

  // Calculate progress by category
  const categoryProgress = categories.map((category) => {
    const categoryTasks = tasks.filter((task) => task.category === category)
    const completedCategoryTasks = categoryTasks.filter((task) => completedTasks.includes(task.id))

    return {
      category,
      total: categoryTasks.length,
      completed: completedCategoryTasks.length,
      percentage: Math.round((completedCategoryTasks.length / categoryTasks.length) * 100) || 0,
    }
  })

  return (
    <Card id="progress">
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {completedTasksCount} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Progress by Category</h3>
            {categoryProgress.map((item) => (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs">{item.category}</span>
                  <span className="text-xs">{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-1.5" />
                <p className="text-xs text-muted-foreground">
                  {item.completed} of {item.total} tasks completed
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
