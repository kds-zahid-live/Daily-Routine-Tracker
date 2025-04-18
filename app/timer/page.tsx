import { PomodoroTimer } from "@/components/pomodoro-timer"

export default function TimerPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Timer Page</h1>
      <div className="max-w-md mx-auto">
        <PomodoroTimer />
      </div>
    </main>
  )
}
