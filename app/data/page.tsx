import { CompletedTasksHistory } from "@/components/completed-tasks-history"

export default function DataPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Task Completion Data</h1>
      <CompletedTasksHistory />
    </main>
  )
}
