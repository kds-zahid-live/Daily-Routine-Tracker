import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DataLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-64 mb-6" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>

        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-5 w-20" />
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-4 border-t">
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, k) => (
                  <Skeleton key={k} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
