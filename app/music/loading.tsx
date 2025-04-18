import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function MusicLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-md" />

              <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
