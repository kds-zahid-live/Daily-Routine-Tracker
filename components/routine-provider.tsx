"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { routineData } from "@/data/routine-data"

type RoutineContextType = {
  tasks: Task[]
  completedTasks: string[]
  completeTask: (id: string) => void
  resetTasks: () => void
  filterTasks: (category: string | null) => void
  filteredTasks: Task[]
  activeFilter: string | null
  categories: string[]
  completedTasksByDate: Record<string, string[]>
  getTaskById: (id: string) => Task | undefined
}

export interface Task {
  id: string
  time: string
  description: string
  category: string
  icon: string
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined)

export function RoutineProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(routineData)
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(routineData)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [completedTasksByDate, setCompletedTasksByDate] = useState<Record<string, string[]>>({})

  // Extract unique categories
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  // Helper function to get today's date as a string
  const getTodayString = () => {
    const today = new Date()
    return today.toISOString().split("T")[0] // Format: YYYY-MM-DD
  }

  // Helper function to get task by ID
  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  useEffect(() => {
    // Load completed tasks from localStorage
    const savedCompletedTasks = localStorage.getItem("completedTasks")
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks))
    }

    // Load completed tasks by date from localStorage
    const savedCompletedTasksByDate = localStorage.getItem("completedTasksByDate")
    if (savedCompletedTasksByDate) {
      setCompletedTasksByDate(JSON.parse(savedCompletedTasksByDate))
    }

    // Reset completed tasks at midnight
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const resetTimer = setTimeout(() => {
      // Don't clear the completedTasksByDate, just the current day's tasks
      setCompletedTasks([])
      localStorage.removeItem("completedTasks")
    }, timeUntilMidnight)

    return () => clearTimeout(resetTimer)
  }, [])

  useEffect(() => {
    // Save completed tasks to localStorage
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks))
  }, [completedTasks])

  useEffect(() => {
    // Save completed tasks by date to localStorage
    localStorage.setItem("completedTasksByDate", JSON.stringify(completedTasksByDate))
  }, [completedTasksByDate])

  const completeTask = (id: string) => {
    const today = getTodayString()

    if (completedTasks.includes(id)) {
      // Remove from today's completed tasks
      setCompletedTasks(completedTasks.filter((taskId) => taskId !== id))

      // Remove from completedTasksByDate
      const updatedTasksByDate = { ...completedTasksByDate }
      if (updatedTasksByDate[today]) {
        updatedTasksByDate[today] = updatedTasksByDate[today].filter((taskId) => taskId !== id)
        setCompletedTasksByDate(updatedTasksByDate)
      }
    } else {
      // Add to today's completed tasks
      setCompletedTasks([...completedTasks, id])

      // Add to completedTasksByDate
      const updatedTasksByDate = { ...completedTasksByDate }
      if (!updatedTasksByDate[today]) {
        updatedTasksByDate[today] = []
      }
      updatedTasksByDate[today] = [...updatedTasksByDate[today], id]
      setCompletedTasksByDate(updatedTasksByDate)
    }
  }

  const resetTasks = () => {
    // Only reset today's tasks, not the historical data
    setCompletedTasks([])
    localStorage.removeItem("completedTasks")

    // Remove today's entry from completedTasksByDate
    const today = getTodayString()
    const updatedTasksByDate = { ...completedTasksByDate }
    delete updatedTasksByDate[today]
    setCompletedTasksByDate(updatedTasksByDate)
    localStorage.setItem("completedTasksByDate", JSON.stringify(updatedTasksByDate))
  }

  const filterTasks = (category: string | null) => {
    setActiveFilter(category)
    if (category === null) {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter((task) => task.category === category))
    }
  }

  return (
    <RoutineContext.Provider
      value={{
        tasks,
        completedTasks,
        completeTask,
        resetTasks,
        filterTasks,
        filteredTasks,
        activeFilter,
        categories,
        completedTasksByDate,
        getTaskById,
      }}
    >
      {children}
    </RoutineContext.Provider>
  )
}

export function useRoutine() {
  const context = useContext(RoutineContext)
  if (context === undefined) {
    throw new Error("useRoutine must be used within a RoutineProvider")
  }
  return context
}
