"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Coffee } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PomodoroTimer() {
  const [mode, setMode] = useState<"focus" | "break">("focus")
  const [isActive, setIsActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!)
            setIsActive(false)

            // Switch modes and reset timer
            if (mode === "focus") {
              toast({
                title: "Focus time completed!",
                description: "Time for a break.",
                duration: 5000,
              })
              setMode("break")
              return breakTime * 60
            } else {
              toast({
                title: "Break time completed!",
                description: "Ready to focus again?",
                duration: 5000,
              })
              setMode("focus")
              return focusTime * 60
            }
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isActive, mode, breakTime, focusTime, toast])

  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === "focus" ? focusTime * 60 : breakTime * 60)
  }, [mode, focusTime, breakTime])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(mode === "focus" ? focusTime * 60 : breakTime * 60)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = mode === "focus" ? (1 - timeLeft / (focusTime * 60)) * 100 : (1 - timeLeft / (breakTime * 60)) * 100

  return (
    <Card id="pomodoro">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Pomodoro Timer</span>
          <Button variant="ghost" size="sm" onClick={() => setMode(mode === "focus" ? "break" : "focus")}>
            {mode === "focus" ? <Coffee className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {mode === "focus" ? "Switch to Break" : "Switch to Focus"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-muted stroke-current" strokeWidth="4" fill="transparent" r="42" cx="50" cy="50" />
              <motion.circle
                className={`${mode === "focus" ? "text-primary" : "text-green-500"} stroke-current`}
                strokeWidth="4"
                strokeLinecap="round"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                initial={{ strokeDasharray: 264, strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 - (progress * 264) / 100 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={timeLeft}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-4xl font-bold"
                >
                  {formatTime(timeLeft)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex space-x-2 mb-6">
            <Button onClick={toggleTimer} variant="default">
              {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button onClick={resetTimer} variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Focus Time: {focusTime} min</span>
              </div>
              <Slider
                value={[focusTime]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => {
                  setFocusTime(value[0])
                  if (mode === "focus" && !isActive) {
                    setTimeLeft(value[0] * 60)
                  }
                }}
                disabled={isActive}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Break Time: {breakTime} min</span>
              </div>
              <Slider
                value={[breakTime]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => {
                  setBreakTime(value[0])
                  if (mode === "break" && !isActive) {
                    setTimeLeft(value[0] * 60)
                  }
                }}
                disabled={isActive}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
