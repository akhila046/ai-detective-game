import React, { useState, useEffect } from 'react'

export default function TypewriterText({ text, speed = 30, className = '', onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    setDisplayed('')
    setIndex(0)
  }, [text])

  useEffect(() => {
    if (index >= text.length) {
      onDone && onDone()
      return
    }
    const timer = setTimeout(() => {
      setDisplayed((prev) => prev + text[index])
      setIndex((i) => i + 1)
    }, speed)
    return () => clearTimeout(timer)
  }, [index, text, speed, onDone])

  return (
    <span className={className}>
      {displayed}
      {index < text.length && (
        <span className="animate-pulse text-terminal-green">█</span>
      )}
    </span>
  )
}
