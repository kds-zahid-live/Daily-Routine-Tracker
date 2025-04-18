import { DailyProgress } from "@/components/daily-progress"

export default function ProgressPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Progress Page</h1>
      <div className="max-w-md mx-auto">
        <DailyProgress />
      </div>
    </main>
  )
}
