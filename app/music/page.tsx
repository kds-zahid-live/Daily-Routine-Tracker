import { MusicPlayer } from "@/components/music-player"

export default function MusicPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Music Page</h1>
      <div className="max-w-md mx-auto">
        <MusicPlayer />
      </div>
    </main>
  )
}
