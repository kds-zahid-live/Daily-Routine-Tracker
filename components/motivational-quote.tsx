"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

const quotes = [
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi",
  },
  {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    text: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle",
  },
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
  },
]

export function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0])
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    // Get a random quote on initial load
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])

    // Change quote every day
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const timeUntilMidnight = tomorrow.getTime() - today.getTime()

    const timer = setTimeout(() => {
      setFadeIn(false)
      setTimeout(() => {
        const newIndex = Math.floor(Math.random() * quotes.length)
        setQuote(quotes[newIndex])
        setFadeIn(true)
      }, 500)
    }, timeUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeIn ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <blockquote className="italic text-lg mb-2">"{quote.text}"</blockquote>
          <cite className="text-sm text-muted-foreground">— {quote.author}</cite>
        </motion.div>
      </CardContent>
    </Card>
  )
}
