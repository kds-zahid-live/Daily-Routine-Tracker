import { RoutineView } from "@/components/routine-view"
import { ClockNav } from "@/components/clock-nav"
import { MotivationalQuote } from "@/components/motivational-quote"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-6">প্রতিদিনের রুটিন</h1>
          <ClockNav />
          <RoutineView />
        </div>
        <div className="space-y-6">
          <MotivationalQuote />
          <div className="p-6 bg-card rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
            <div className="grid gap-3">
              <a
                href="/timer"
                className="flex items-center p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Pomodoro Timer</h3>
                  <p className="text-sm text-muted-foreground">Focus and break timer</p>
                </div>
              </a>

              <a
                href="/progress"
                className="flex items-center p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M3 3v18h18"></path>
                    <path d="M18 9l-6-6-6 6"></path>
                    <path d="M6 9v4"></path>
                    <path d="M12 3v10"></path>
                    <path d="M18 9v7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Daily Progress</h3>
                  <p className="text-sm text-muted-foreground">Track your achievements</p>
                </div>
              </a>

              <a
                href="/music"
                className="flex items-center p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Background Music</h3>
                  <p className="text-sm text-muted-foreground">Focus enhancing sounds</p>
                </div>
              </a>

              <a href="/data" className="flex items-center p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                <div className="mr-3 p-2 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Task History</h3>
                  <p className="text-sm text-muted-foreground">View completed tasks</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
