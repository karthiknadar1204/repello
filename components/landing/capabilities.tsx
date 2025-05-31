import { Lightbulb, TrendingUp, BookOpen, Users, Microscope, Gavel } from "lucide-react"

const capabilities = [
  {
    icon: Lightbulb,
    title: "Technology Research",
    description: "Latest developments in AI, blockchain, quantum computing, and emerging technologies",
    examples: ["AI model comparisons", "Tech trend analysis", "Innovation reports"],
  },
  {
    icon: TrendingUp,
    title: "Market Analysis",
    description: "Comprehensive market research, competitor analysis, and industry insights",
    examples: ["Market size studies", "Competitor benchmarking", "Industry forecasts"],
  },
  {
    icon: BookOpen,
    title: "Academic Research",
    description: "Scholarly articles, research papers, and academic publications analysis",
    examples: ["Literature reviews", "Research summaries", "Citation analysis"],
  },
  {
    icon: Users,
    title: "Social Trends",
    description: "Current social movements, demographic changes, and cultural shifts",
    examples: ["Social media trends", "Demographic studies", "Cultural analysis"],
  },
  {
    icon: Microscope,
    title: "Scientific Studies",
    description: "Latest scientific discoveries, medical research, and breakthrough studies",
    examples: ["Medical breakthroughs", "Climate research", "Space discoveries"],
  },
  {
    icon: Gavel,
    title: "Policy & Legal",
    description: "Government policies, legal developments, and regulatory changes",
    examples: ["Policy analysis", "Legal precedents", "Regulatory updates"],
  },
]

export function Capabilities() {
  return (
    <section id="capabilities" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/5 to-black" />

      <div className="relative container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              Research Capabilities
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            From cutting-edge technology to social trends, our AI can research virtually any topic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group p-8 bg-gradient-to-br from-blue-950/20 to-blue-900/10 border border-blue-900/30 rounded-2xl hover:border-blue-700/50 transition-all duration-300"
            >
              <div className="mb-6">
                <capability.icon className="h-12 w-12 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-blue-300 transition-colors">
                {capability.title}
              </h3>

              <p className="text-gray-400 mb-6 leading-relaxed">{capability.description}</p>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-blue-300">Examples:</h4>
                <ul className="space-y-1">
                  {capability.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="text-sm text-gray-500 flex items-center">
                      <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
