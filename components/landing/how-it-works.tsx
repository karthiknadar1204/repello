import { MessageSquare, Search, Brain, FileText } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Ask Your Question",
    description: "Type any complex research question or topic you want to explore",
    step: "01",
  },
  {
    icon: Search,
    title: "AI Searches the Web",
    description: "Our AI performs multiple targeted searches across reliable sources",
    step: "02",
  },
  {
    icon: Brain,
    title: "Intelligent Analysis",
    description: "Advanced reasoning synthesizes information from multiple sources",
    step: "03",
  },
  {
    icon: FileText,
    title: "Comprehensive Answer",
    description: "Receive a well-structured response with proper citations and sources",
    step: "04",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-black to-blue-950/10" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">How It Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our AI research process is designed to be simple, fast, and incredibly thorough
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 transform translate-x-4" />
                )}

                <div className="text-center group">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <step.icon className="h-12 w-12 text-blue-400 mx-auto group-hover:text-blue-300 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
