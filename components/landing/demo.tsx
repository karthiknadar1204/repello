"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Demo() {
  const [isPlaying, setIsPlaying] = useState(false)

  const demoSteps = [
    "User asks: 'Compare the latest electric vehicle models and their safety features'",
    "AI searches multiple automotive sources and safety databases",
    "Analyzes Tesla Model S, BMW iX, Mercedes EQS specifications",
    "Compiles comprehensive comparison with NHTSA safety ratings",
    "Provides detailed answer with proper citations and source links",
  ]

  return (
    <section id="demo" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-black to-blue-950/10" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
              See It In Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Watch how our AI research agent works through a complex query step by step
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Demo Video Placeholder */}
          <div className="relative bg-gradient-to-br from-blue-950/30 to-blue-900/20 border border-blue-900/50 rounded-2xl p-8 mb-8">
            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-blue-700 transition-colors">
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" onClick={() => setIsPlaying(false)} />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" onClick={() => setIsPlaying(true)} />
                  )}
                </div>
                <p className="text-gray-400">Interactive Demo</p>
              </div>
            </div>

            {/* Demo Steps */}
            <div className="space-y-4">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-500 ${
                    isPlaying && index <= 2 ? "bg-blue-900/30 border border-blue-700/50" : "bg-gray-900/30"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isPlaying && index <= 2 ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <p className={`${isPlaying && index <= 2 ? "text-white" : "text-gray-400"}`}>{step}</p>
                </div>
              ))}
            </div>

            {/* Demo Controls */}
            <div className="flex justify-center space-x-4 mt-8">
              <Button onClick={() => setIsPlaying(!isPlaying)} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause Demo" : "Start Demo"}
              </Button>
              <Button
                onClick={() => setIsPlaying(false)}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Try It Yourself */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg"
            >
              Try It Yourself
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
