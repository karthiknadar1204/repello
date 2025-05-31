import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CTA() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-blue-900/10" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-700/50 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-blue-300">Ready to Get Started?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Start Researching
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of researchers, students, and professionals who trust our AI to deliver accurate,
            comprehensive answers to their most complex questions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg group"
            >
              Start Free Research
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600/10 px-8 py-4 text-lg"
            >
              Schedule Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-12">
            <p className="text-sm text-gray-500 mb-6">Trusted by leading organizations</p>
            <div className="flex justify-center items-center space-x-8 opacity-50">
              <div className="text-2xl font-bold text-gray-600">RESEARCH</div>
              <div className="text-2xl font-bold text-gray-600">UNIVERSITY</div>
              <div className="text-2xl font-bold text-gray-600">INSTITUTE</div>
              <div className="text-2xl font-bold text-gray-600">LAB</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
