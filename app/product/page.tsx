"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { Terminal, Cpu, Braces, ArrowRight, CheckCircle, Code, GitBranch, Zap, Lock, Sparkles } from "lucide-react"
import Link from "next/link"

export default function ProductPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeCommand, setActiveCommand] = useState(0)
  const { scrollYProgress } = useScroll()
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.3, 0.3, 1])
  
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  const scaleSpring = useSpring(1, springConfig)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveCommand((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const commands = [
    {
      cmd: "gentest init",
      output: [
        { text: "🔍 Analyzing project structure...", color: "text-slate-400" },
        { text: "✓ Detected TypeScript project", color: "text-purple-400" },
        { text: "✓ Found Jest configuration", color: "text-purple-400" },
        { text: "✓ Initialized GenTest in current directory", color: "text-purple-400" }
      ]
    },
    {
      cmd: "gentest analyze src/utils/calculator.ts",
      output: [
        { text: "✓ Analyzing file...", color: "text-purple-400" },
        { text: "Found functions:", color: "text-slate-400" },
        { text: "- calculateTotal(items: CartItem[], taxRate: number): number", color: "text-yellow-300" },
        { text: "- applyDiscount(total: number, discountCode: string): number", color: "text-yellow-300" },
        { text: "- formatCurrency(amount: number, currency: string): string", color: "text-yellow-300" },
        { text: "✓ Analysis complete", color: "text-purple-400" }
      ]
    },
    {
      cmd: "gentest generate --coverage=high",
      output: [
        { text: "✓ Generating tests with high coverage...", color: "text-purple-400" },
        { text: "Creating test cases for:", color: "text-slate-400" },
        { text: "- calculateTotal: 5 test cases", color: "text-yellow-300" },
        { text: "- applyDiscount: 4 test cases", color: "text-yellow-300" },
        { text: "- formatCurrency: 3 test cases", color: "text-yellow-300" },
        { text: "✓ Tests written to tests/utils/calculator.test.ts", color: "text-purple-400" }
      ]
    },
    {
      cmd: "gentest run",
      output: [
        { text: "✓ Running tests...", color: "text-purple-400" },
        { text: "PASS tests/utils/calculator.test.ts", color: "text-green-400" },
        { text: "Test Suites: 1 passed, 1 total", color: "text-slate-400" },
        { text: "Tests: 12 passed, 12 total", color: "text-slate-400" },
        { text: "Coverage: 94%", color: "text-slate-400" },
        { text: "✓ Report generated at coverage/report.html", color: "text-purple-400" }
      ]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-teal-900/20 z-0"
          style={{ y: backgroundY, opacity }}
        />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <motion.div 
              className="inline-flex items-center bg-muted/50 rounded-full px-4 py-1.5 text-sm font-medium mb-4 border border-muted hover:scale-105 transition-transform cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Lock className="w-4 h-4 mr-2" />
              <span className="mr-2">Coming Soon</span>
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-6xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Most Advanced{" "}
              <motion.span 
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400"
                animate={{ 
                  backgroundPosition: ["0%", "100%"],
                  backgroundSize: ["100%", "200%"] 
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                AI Test Generator
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              A powerful CLI tool that leverages advanced AI to automatically generate comprehensive test suites for your codebase.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-lg px-8 py-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 relative overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-600/40 to-teal-500/40"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative">
                      Join Waitlist
                      <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
              </span>
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CLI Preview - Moved right after the hero section */}
      <section className="py-12 relative overflow-hidden">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 relative group w-full md:w-4/5 mx-auto">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="flex items-center bg-slate-800 px-4 py-2 border-b border-slate-700 relative">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-4 text-sm text-slate-400">terminal</div>
              </div>
              <div className="p-6 font-mono text-sm relative h-64 overflow-y-auto" style={{ minHeight: "256px" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCommand}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p>
                      <motion.span 
                        className="text-green-400"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        $
                      </motion.span>
                      <span className="ml-2">{commands[activeCommand].cmd}</span>
                    </p>
                    {commands[activeCommand].output.map((line, i) => (
                      <motion.p
                        key={i}
                        className={`${line.color} ${i === 0 ? "mt-2" : ""}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {line.text}
                      </motion.p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="py-24 pt-36 bg-muted/30 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-grid-white/5"
          style={{
            backgroundImage: "radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            y: backgroundY
          }}
        />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-12 md:mb-18"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Advanced Architecture</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Built with cutting-edge technology to deliver accurate and reliable test generation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Code Processing Engine",
                icon: <Code className="h-6 w-6 text-purple-500" />,
                description: "Multi-language support with advanced AST parsing and type inference",
                features: ["Language-agnostic parsing", "Type inference", "Context extraction"],
                gradient: "from-purple-500/20 to-purple-700/20"
              },
              {
                title: "AI Engine",
                icon: <Zap className="h-6 w-6 text-violet-500" />,
                description: "State-of-the-art AI models for understanding and generating tests",
                features: ["Smart context analysis", "Pattern recognition", "Optimized prompts"],
                gradient: "from-violet-500/20 to-violet-700/20"
              },
              {
                title: "Test Generation System",
                icon: <Terminal className="h-6 w-6 text-teal-500" />,
                description: "Framework-aware test generation with comprehensive coverage",
                features: ["Framework templates", "Mock generation", "Validation system"],
                gradient: "from-teal-500/20 to-teal-700/20"
              },
              {
                title: "Integration System",
                icon: <GitBranch className="h-6 w-6 text-cyan-500" />,
                description: "Seamless integration with your development workflow",
                features: ["CI/CD integration", "VCS support", "IDE plugins"],
                gradient: "from-cyan-500/20 to-cyan-700/20"
              }
            ].map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`bg-card rounded-xl p-4 md:p-6 shadow-lg border border-muted relative overflow-hidden group hover:shadow-2xl transition-all duration-300`}
              >
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${module.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                <div className="relative">
                  <motion.div 
                    className="rounded-full bg-muted/50 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {module.icon}
                  </motion.div>
                  <h3 className="text-lg md:text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base mb-4">{module.description}</p>
                  <ul className="space-y-2">
                    {module.features.map((feature, i) => (
                      <motion.li 
                        key={i} 
                        className="flex items-center text-xs md:text-sm"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
              </div>
        </div>
      </section>

      {/* Waitlist CTA */}
      <section className="py-24 bg-muted/30 relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/10 to-teal-500/5"
          style={{ y: backgroundY }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container relative"
        >
          <motion.div 
            className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/30 to-teal-900/30 rounded-3xl p-10 md:p-14 shadow-2xl backdrop-blur-sm border border-white/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center space-y-6">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Join the Waitlist
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Be among the first to experience the future of automated testing. Get early access and special launch pricing.
              </motion.p>
              <motion.div 
                className="pt-6 flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/contact">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-lg px-8 py-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-violet-600/40 to-teal-500/40"
                        initial={{ x: "100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative">
                        Join Waitlist
                        <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div 
                className="pt-8 flex flex-col md:flex-row justify-center gap-6 text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                {["Early access", "Priority support", "Special launch pricing"].map((benefit, index) => (
                  <motion.div 
                    key={benefit}
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {benefit}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

