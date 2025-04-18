"use client"

import { useState, useEffect } from "react"
import { useRoutine } from "./routine-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Clock } from "lucide-react"
import { motion } from "framer-motion"

export function ClockNav() {
  const { tasks, completedTasks, filterTasks } = useRoutine()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [hoveredTask, setHoveredTask] = useState<string | null>(null)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Convert time string to hours and minutes
  const parseTime = (timeStr: string) => {
    const timePart = timeStr.split(" - ")[0]
    const [hourStr, minuteStr] = timePart.split(":")
    let hour = Number.parseInt(hourStr)
    const minute = Number.parseInt(minuteStr.split(" ")[0])
    const isPM = timePart.includes("PM")

    // Convert to 24-hour format
    if (isPM && hour !== 12) {
      hour += 12
    } else if (!isPM && hour === 12) {
      hour = 0
    }

    return { hour, minute }
  }

  // Group tasks by hour
  const tasksByHour = tasks.reduce(
    (acc, task) => {
      const { hour } = parseTime(task.time)
      if (!acc[hour]) {
        acc[hour] = []
      }
      acc[hour].push(task)
      return acc
    },
    {} as Record<number, typeof tasks>,
  )

  // Calculate positions for clock elements
  const getPosition = (hour: number, minute = 0, radius = 40) => {
    // Convert 24-hour time to angle (0 at top, clockwise)
    const angle = ((hour * 60 + minute) / (24 * 60)) * 360 - 90
    const radian = (angle * Math.PI) / 180
    const x = 80 + radius * Math.cos(radian)
    const y = 80 + radius * Math.sin(radian)
    return { x, y, angle }
  }

  // Calculate positions for minute markers
  const getMinutePosition = (minute: number, radius = 40) => {
    // Convert minute to angle (0 at top, clockwise)
    const angle = (minute / 60) * 360 - 90
    const radian = (angle * Math.PI) / 180
    const x = 80 + radius * Math.cos(radian)
    const y = 80 + radius * Math.sin(radian)
    return { x, y, angle }
  }

  // Calculate angles for clock hands
  const hours = currentTime.getHours()
  const minutes = currentTime.getMinutes()
  const seconds = currentTime.getSeconds()
  const milliseconds = currentTime.getMilliseconds()

  // Calculate precise angles for smooth movement
  // Hour hand: 15 degrees per hour (360/24) + partial movement based on minutes
  const hourAngle = hours * 15 + (minutes / 60) * 15
  // Minute hand: 6 degrees per minute + partial movement based on seconds
  const minuteAngle = minutes * 6 + (seconds / 60) * 6
  // Second hand: 6 degrees per second + partial movement based on milliseconds
  const secondAngle = seconds * 6 + (milliseconds / 1000) * 6

  // Handle hour selection
  const handleHourClick = (hour: number) => {
    setSelectedHour(selectedHour === hour ? null : hour)

    // If there are tasks at this hour, filter to show them
    if (tasksByHour[hour] && tasksByHour[hour].length > 0) {
      // Find the category of the first task at this hour to filter by
      const category = tasksByHour[hour][0].category
      filterTasks(category)
    }
  }

  // Get color for task marker based on category and completion status
  const getTaskColor = (task: (typeof tasks)[0]) => {
    const isCompleted = completedTasks.includes(task.id)

    const categoryColors: Record<string, string> = {
      Religious: isCompleted ? "#8B5CF6" : "#C4B5FD", // Purple
      Health: isCompleted ? "#10B981" : "#A7F3D0", // Green
      Education: isCompleted ? "#3B82F6" : "#BFDBFE", // Blue
      Work: isCompleted ? "#F59E0B" : "#FDE68A", // Amber
      Meal: isCompleted ? "#EF4444" : "#FCA5A5", // Red
      Rest: isCompleted ? "#6B7280" : "#D1D5DB", // Gray
      Personal: isCompleted ? "#EC4899" : "#FBCFE8", // Pink
      Chores: isCompleted ? "#6366F1" : "#C7D2FE", // Indigo
    }

    return categoryColors[task.category] || (isCompleted ? "#1F2937" : "#9CA3AF")
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          24-Hour Routine Clock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-xs mx-auto aspect-square">
          {/* Clock face */}
          <svg viewBox="0 0 160 160" className="w-full h-full">
            {/* Outermost ring for minute numbers */}
            <circle
              cx="80"
              cy="80"
              r="76"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
              className="text-muted-foreground/30"
            />

            {/* Minute numbers on outermost ring */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isMultipleOf5 = i % 5 === 0
              const isCurrentMinute = i === minutes

              // Calculate position for the minute number
              const { x, y, angle } = getMinutePosition(i, 70)

              // Only show every 5th minute number to avoid crowding
              if (isMultipleOf5 || i % 15 === 0 || isCurrentMinute) {
                return (
                  <g key={`outer-minute-${i}`}>
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={isCurrentMinute ? "6" : isMultipleOf5 ? "4.5" : "3.5"}
                      fontWeight={isCurrentMinute ? "bold" : isMultipleOf5 ? "bold" : "normal"}
                      fill={
                        isCurrentMinute
                          ? "#FF0000"
                          : isMultipleOf5
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(229, 231, 235, 0.7)"
                      }
                      className="pointer-events-none"
                      style={{ transition: "all 0.3s ease" }}
                    >
                      {i}
                    </text>
                  </g>
                )
              } else {
                // Show smaller dots for other minutes
                return (
                  <g key={`outer-minute-dot-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isCurrentMinute ? 1.5 : 0.6}
                      fill={isCurrentMinute ? "#FF0000" : "rgba(255, 255, 255, 0.3)"}
                      className="pointer-events-none"
                      style={{ transition: "all 0.3s ease" }}
                    />
                  </g>
                )
              }
            })}

            {/* Hour ring */}
            <circle
              cx="80"
              cy="80"
              r="58"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
              className="text-muted-foreground/30"
            />

            {/* Hour numbers on hour ring */}
            {Array.from({ length: 24 }).map((_, i) => {
              const isActive = selectedHour === i
              const isCurrentHour = i === hours

              // Calculate position for the hour number
              const { x, y } = getPosition(i, 0, 52)

              return (
                <g key={`hour-${i}`} className="text-muted-foreground/70">
                  {/* Hour number */}
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isCurrentHour ? "5.5" : "4"}
                    fontWeight="bold"
                    fill={isCurrentHour ? "#FF0000" : isActive ? "rgba(96, 165, 250, 0.9)" : "rgba(255, 255, 255, 0.7)"}
                    className="pointer-events-none"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    {i}
                  </text>
                </g>
              )
            })}

            {/* Main clock circle */}
            <circle
              cx="80"
              cy="80"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/30"
            />

            {/* Hour markers for 24-hour clock (without numbers) */}
            {Array.from({ length: 24 }).map((_, i) => {
              const { x, y } = getPosition(i, 0, 45)

              const isActive = selectedHour === i
              const hasTask = tasksByHour[i] && tasksByHour[i].length > 0
              const isCurrentHour = i === hours

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isCurrentHour ? 3 : hasTask ? 2 : 1}
                    fill={
                      isCurrentHour
                        ? "#FF0000"
                        : isActive
                          ? "var(--primary)"
                          : hasTask
                            ? "var(--primary-foreground)"
                            : "var(--muted-foreground)"
                    }
                    className={`cursor-pointer ${hasTask ? "hover:fill-primary" : ""}`}
                    onClick={() => handleHourClick(i)}
                    style={{ transition: "all 0.3s ease" }}
                  />
                </g>
              )
            })}

            {/* Minute markers */}
            {Array.from({ length: 60 }).map((_, i) => {
              const isMultipleOf5 = i % 5 === 0
              const isCurrentMinute = i === minutes

              if (isMultipleOf5 || isCurrentMinute) {
                const { x, y } = getMinutePosition(i, 45)

                return (
                  <g key={`minute-marker-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isCurrentMinute ? 1.5 : 0.8}
                      fill={isCurrentMinute ? "#FF0000" : "rgba(255, 255, 255, 0.3)"}
                      className="pointer-events-none"
                      style={{ transition: "all 0.3s ease" }}
                    />
                  </g>
                )
              }
              return null
            })}

            {/* Task markers */}
            {tasks.map((task) => {
              const { hour, minute } = parseTime(task.time)
              const { x, y } = getPosition(hour, minute, 35)

              const isCompleted = completedTasks.includes(task.id)
              const isHovered = hoveredTask === task.id

              return (
                <g
                  key={task.id}
                  onMouseEnter={() => setHoveredTask(task.id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  className="cursor-pointer"
                  onClick={() => filterTasks(task.category)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 3 : 2.5}
                    fill={getTaskColor(task)}
                    stroke={isHovered ? "var(--foreground)" : "none"}
                    strokeWidth="0.5"
                  />
                  {isCompleted && (
                    <path
                      d={`M${x - 1},${y} L${x},${y + 1} L${x + 1.5},${y - 1.5}`}
                      stroke="white"
                      strokeWidth="0.7"
                      fill="none"
                    />
                  )}
                </g>
              )
            })}

            {/* Current time indicator for 24-hour clock */}
            <g>
              {/* Current time hand */}
              <line
                x1="80"
                y1="80"
                x2={getPosition(currentTime.getHours(), currentTime.getMinutes(), 35).x}
                y2={getPosition(currentTime.getHours(), currentTime.getMinutes(), 35).y}
                stroke="var(--destructive)"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
              <circle cx="80" cy="80" r="1.5" fill="var(--destructive)" />
            </g>

            {/* Hour hand (24-hour) */}
            <motion.line
              x1="80"
              y1="80"
              x2="80"
              y2="60"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                rotate: hourAngle,
                originX: "80px",
                originY: "80px",
              }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            />

            {/* Minute hand */}
            <motion.line
              x1="80"
              y1="80"
              x2="80"
              y2="55"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              style={{
                rotate: minuteAngle,
                originX: "80px",
                originY: "80px",
              }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
            />

            {/* Second hand with enhanced visibility */}
            <motion.g
              style={{
                rotate: secondAngle,
                originX: "80px",
                originY: "80px",
              }}
              transition={{ type: "tween", duration: 0.1 }}
            >
              {/* Main second hand */}
              <line x1="80" y1="80" x2="80" y2="50" stroke="#FF0000" strokeWidth="2" strokeLinecap="round" />

              {/* Small counterbalance */}
              <line x1="80" y1="80" x2="80" y2="85" stroke="#FF0000" strokeWidth="1.5" strokeLinecap="round" />

              {/* Dot at the end of second hand for better visibility */}
              <circle cx="80" cy="50" r="1.5" fill="#FF0000" />
            </motion.g>

            {/* Center dot */}
            <circle cx="80" cy="80" r="2.5" fill="#FF0000" />
            <circle cx="80" cy="80" r="1" fill="white" />
          </svg>

          {/* Task tooltip */}
          {hoveredTask && (
            <div className="absolute top-0 left-0 right-0 bg-popover text-popover-foreground text-xs p-2 rounded shadow-md">
              {tasks.find((t) => t.id === hoveredTask)?.description} - {tasks.find((t) => t.id === hoveredTask)?.time}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
            <span>Selected Hour</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-destructive mr-2"></div>
            <span>Current Time</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/30 mr-2"></div>
            <span>No Tasks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 flex items-center justify-center bg-primary-foreground">
              <Check className="h-2 w-2 text-primary" />
            </div>
            <span>Completed Task</span>
          </div>
        </div>

        {/* Current time display */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center bg-muted/20 p-3 rounded-md">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Hours</span>
            <span className="text-2xl font-bold tabular-nums">{hours.toString().padStart(2, "0")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Minutes</span>
            <span className="text-2xl font-bold tabular-nums">{minutes.toString().padStart(2, "0")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Seconds</span>
            <span className="text-2xl font-bold tabular-nums text-red-500">{seconds.toString().padStart(2, "0")}</span>
          </div>
        </div>

        {/* Selected hour tasks */}
        {selectedHour !== null && tasksByHour[selectedHour] && (
          <div className="mt-4 border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Tasks at {selectedHour}:00</h4>
            <div className="space-y-2">
              {tasksByHour[selectedHour].map((task) => {
                const isCompleted = completedTasks.includes(task.id)

                return (
                  <div
                    key={task.id}
                    className={`text-xs p-2 rounded flex items-center justify-between ${
                      isCompleted ? "bg-muted/50 text-muted-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: getTaskColor(task) }}></div>
                      <span className={isCompleted ? "line-through" : ""}>{task.description}</span>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      {task.category}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
