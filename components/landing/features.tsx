import { Search, Brain, Shield, Zap, Globe, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Real-time Web Search",
    description: "Access the latest information from across the web with our advanced search capabilities.",
    color: "text-blue-400",
  },
  {
    icon: Brain,
    title: "Multi-step Reasoning",
    description: "Watch as our AI breaks down complex questions into research steps for comprehensive answers.",
    color: "text-blue-500",
  },
  {
    icon: Shield,
    title: "Content Moderation",
    description: "Built-in safety measures ensure all content is appropriate and free from harmful material.",
    color: "text-blue-300",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get detailed research results in seconds, not hours of manual searching.",
    color: "text-blue-600",
  },
  {
    icon: Globe,
    title: "Global Sources",
    description: "Access information from trusted sources worldwide for comprehensive coverage.",
    color: "text-blue-400",
  },
  {
    icon: CheckCircle,
    title: "Verified Citations",
    description: "Every answer includes proper citations and source links for credibility.",
    color: "text-blue-500",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for comprehensive research, powered by cutting-edge AI technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-blue-950/20 to-blue-900/10 border border-blue-900/30 rounded-2xl hover:border-blue-700/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="mb-6">
                <feature.icon
                  className={`h-12 w-12 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
