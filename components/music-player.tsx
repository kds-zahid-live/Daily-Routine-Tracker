"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

// Audio tracks with different tone patterns
const AUDIO_TRACKS = [
  {
    name: "Ambient Tones",
    color: "#4F46E5", // indigo
    notes: [261.63, 329.63, 392, 523.25], // C, E, G, C (C major chord)
    tempo: 2000, // ms between notes
  },
  {
    name: "Relaxing Melody",
    color: "#10B981", // emerald
    notes: [293.66, 349.23, 392, 440], // D, F, G, A
    tempo: 1500,
  },
  {
    name: "Meditation Sounds",
    color: "#0EA5E9", // sky blue
    notes: [261.63, 311.13, 392, 466.16], // C, D#, G, A#
    tempo: 2500,
  },
  {
    name: "Focus Tones",
    color: "#8B5CF6", // violet
    notes: [349.23, 440, 523.25, 587.33], // F, A, C, D
    tempo: 1800,
  },
]

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isMuted, setIsMuted] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [gainNode, setGainNode] = useState<GainNode | null>(null)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const noteIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentOscillator = useRef<OscillatorNode | null>(null)
  const currentNoteIndex = useRef(0)

  // Initialize Audio Context
  useEffect(() => {
    // Only create AudioContext on user interaction to comply with browser policies
    const initAudio = () => {
      if (!audioContext) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          setAudioContext(ctx)

          const gain = ctx.createGain()
          gain.gain.value = volume / 100
          gain.connect(ctx.destination)
          setGainNode(gain)
        } catch (e) {
          console.error("Web Audio API is not supported in this browser", e)
        }
      }
    }

    // Add event listener for user interaction
    document.addEventListener("click", initAudio, { once: true })

    return () => {
      document.removeEventListener("click", initAudio)
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [])

  // Update gain when volume changes
  useEffect(() => {
    if (gainNode) {
      gainNode.gain.value = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted, gainNode])

  // Play notes in sequence
  const playNote = () => {
    if (!audioContext || !gainNode) return

    // Stop current note if playing
    if (currentOscillator.current) {
      currentOscillator.current.stop()
      currentOscillator.current.disconnect()
      currentOscillator.current = null
    }

    const track = AUDIO_TRACKS[currentTrack]
    const note = track.notes[currentNoteIndex.current]

    // Create and configure oscillator
    const oscillator = audioContext.createOscillator()
    oscillator.type = "sine"
    oscillator.frequency.value = note
    oscillator.connect(gainNode)

    // Start oscillator
    oscillator.start()
    currentOscillator.current = oscillator

    // Schedule next note
    currentNoteIndex.current = (currentNoteIndex.current + 1) % track.notes.length

    // Add slight decay to each note
    const now = audioContext.currentTime
    gainNode.gain.setValueAtTime(isMuted ? 0 : volume / 100, now)
    gainNode.gain.exponentialRampToValueAtTime((isMuted ? 0 : volume / 100) * 0.3, now + (track.tempo / 1000) * 0.9)
  }

  // Handle play/pause
  useEffect(() => {
    if (isPlaying && audioContext) {
      // Start playing notes
      playNote()
      noteIntervalRef.current = setInterval(() => {
        playNote()
      }, AUDIO_TRACKS[currentTrack].tempo)

      // Track elapsed time
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          // Simulate a 3-minute track
          if (prev >= 180) {
            // Auto-advance to next track
            setCurrentTrack((current) => (current + 1) % AUDIO_TRACKS.length)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      // Stop playing
      if (currentOscillator.current) {
        currentOscillator.current.stop()
        currentOscillator.current.disconnect()
        currentOscillator.current = null
      }

      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current)
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (noteIntervalRef.current) clearInterval(noteIntervalRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (currentOscillator.current) {
        currentOscillator.current.stop()
        currentOscillator.current.disconnect()
        currentOscillator.current = null
      }
    }
  }, [isPlaying, currentTrack, audioContext])

  // Reset when changing tracks
  useEffect(() => {
    setElapsedTime(0)
    currentNoteIndex.current = 0

    if (isPlaying) {
      if (noteIntervalRef.current) {
        clearInterval(noteIntervalRef.current)
      }

      if (currentOscillator.current) {
        currentOscillator.current.stop()
        currentOscillator.current.disconnect()
        currentOscillator.current = null
      }

      // Small delay to ensure clean transition
      setTimeout(() => {
        if (isPlaying) {
          playNote()
          noteIntervalRef.current = setInterval(() => {
            playNote()
          }, AUDIO_TRACKS[currentTrack].tempo)
        }
      }, 50)
    }
  }, [currentTrack])

  const togglePlay = () => {
    // Initialize audio context if needed (for browsers that require user gesture)
    if (!audioContext && typeof window !== "undefined") {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(ctx)

      const gain = ctx.createGain()
      gain.gain.value = isMuted ? 0 : volume / 100
      gain.connect(ctx.destination)
      setGainNode(gain)
    }

    setIsPlaying(!isPlaying)
  }

  const changeTrack = (index: number) => {
    setCurrentTrack(index)
    if (!isPlaying) {
      setIsPlaying(true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (gainNode) {
      gainNode.gain.value = newVolume / 100
    }

    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)

    if (gainNode) {
      gainNode.gain.value = !isMuted ? 0 : volume / 100
    }
  }

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Calculate progress percentage
  const progress = (elapsedTime / 180) * 100

  return (
    <Card id="music">
      <CardHeader>
        <CardTitle>Background Music</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Visualizer */}
          <div className="h-16 bg-muted/30 rounded-md overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundColor: AUDIO_TRACKS[currentTrack].color }}
            ></div>

            {/* Progress bar */}
            <div
              className="h-1 bg-primary transition-all duration-1000 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: AUDIO_TRACKS[currentTrack].color,
              }}
            ></div>

            {/* Audio visualization bars */}
            <div className="flex items-end justify-center h-full gap-1 px-2 pb-2">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-t"
                  initial={{ height: 0 }}
                  animate={{
                    height: isPlaying
                      ? [Math.random() * 20 + 5, Math.random() * 40 + 5, Math.random() * 20 + 5]
                      : Math.random() * 10 + 2,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isPlaying ? Number.POSITIVE_INFINITY : 0,
                    repeatType: "reverse",
                    delay: i * 0.05,
                  }}
                  style={{
                    opacity: isPlaying ? (isMuted ? 0.3 : 0.7) : 0.3,
                    backgroundColor: isPlaying ? AUDIO_TRACKS[currentTrack].color : "var(--muted-foreground)",
                  }}
                />
              ))}
            </div>

            {/* Time indicator */}
            <div className="absolute bottom-1 right-2 text-xs text-muted-foreground">
              {formatTime(elapsedTime)} / 3:00
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={togglePlay} className="h-10 w-10">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="text-sm font-medium">{AUDIO_TRACKS[currentTrack].name}</div>

            <Button variant="outline" size="icon" onClick={toggleMute} className="h-10 w-10">
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Volume</span>
              <span>{isMuted ? 0 : volume}%</span>
            </div>
            <Slider value={[isMuted ? 0 : volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AUDIO_TRACKS.map((track, index) => (
              <Button
                key={index}
                variant={currentTrack === index ? "default" : "outline"}
                size="sm"
                onClick={() => changeTrack(index)}
                className="text-xs"
                style={{
                  backgroundColor: currentTrack === index ? track.color : "transparent",
                  borderColor: track.color,
                  color: currentTrack === index ? "white" : track.color,
                }}
              >
                {track.name}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
