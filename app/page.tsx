"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Code, Clock, Zap, ArrowRight, Terminal, Check, ChevronRight, Github, Play } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamic imports for heavy components
const MotionSection = dynamic(() => import('@/components/motion-section'), { ssr: false })
const MotionCard = dynamic(() => import('@/components/motion-card'), { ssr: false })

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [typingComplete, setTypingComplete] = useState([false, false, false])
  const [isRunning, setIsRunning] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsVisible(true)

    // Auto switch between tabs
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3)
      setTypingComplete([false, false, false])
      setIsRunning(false)
      setShowResult(false)
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate typing completion after animation
    const timer = setTimeout(() => {
      setTypingComplete((prev) => {
        const newState = [...prev]
        newState[activeTab] = true
        return newState
      })
    }, 2500)

    return () => clearTimeout(timer)
  }, [activeTab])

  useEffect(() => {
    // Show running animation after typing completes
    if (typingComplete[activeTab]) {
      const timer = setTimeout(() => {
        setIsRunning(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [typingComplete, activeTab])

  useEffect(() => {
    // Show result after running state
    if (isRunning) {
      const timer = setTimeout(() => {
        setShowResult(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isRunning])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const tabs = [
    {
      name: "Web Application",
      content: `import { render, screen, fireEvent } from '@testing-library/react';
import ShoppingCart from '../components/ShoppingCart';

test('should add item to cart correctly', () => {
  // Arrange
  render(<ShoppingCart />);
  const addButton = screen.getByRole('button', { name: /add to cart/i });
  
  // Act
  fireEvent.click(addButton);
  
  // Assert
  expect(screen.getByText(/items in cart: 1/i)).toBeInTheDocument();
});`,
      output: "✓ should add item to cart correctly (23ms)",
      language: "jsx",
      icon: <Code className="w-5 h-5" />,
    },
    {
      name: "API Testing",
      content: `import request from 'supertest';
import app from '../app';
import { mockUserData } from '../mocks/userData';

describe('User API', () => {
  it('should create a new user', async () => {
    // Arrange
    const userData = mockUserData();
    
    // Act
    const response = await request(app)
      .post('/api/users')
      .send(userData);
    
    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
});`,
      output: "✓ should create a new user (45ms)",
      language: "js",
      icon: <Terminal className="w-5 h-5" />,
    },
    {
      name: "Database",
      content: `const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { UserModel } = require('../models/user');

describe('User Database Operations', () => {
  let mongoServer;
  
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  
  it('should save user to database', async () => {
    // Arrange
    const userData = { name: 'John', email: 'john@example.com' };
    
    // Act
    const user = new UserModel(userData);
    await user.save();
    
    // Assert
    const foundUser = await UserModel.findOne({ email: 'john@example.com' });
    expect(foundUser.name).toBe('John');
  });
});`,
      output: "✓ should save user to database (67ms)",
      language: "js",
      icon: <Github className="w-5 h-5" />,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {isMounted && (
        <>
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-teal-900/20 z-0" />
            <div className="container relative z-10 py-12 md:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Hero Content */}
                <motion.div
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  variants={fadeIn}
                  transition={{ duration: 0.5 }}
                  className="space-y-4 md:space-y-6"
                >
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
                    Generate Tests with{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400">AI</span>
                  </h1>
                  <p className="text-base md:text-xl text-muted-foreground">
                    Automate unit and integration test writing with AI. Save time and improve code coverage.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/try">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 text-white shadow-xl hover:shadow-2xl transition-all duration-200 w-full sm:w-auto"
                        aria-label="Try GenTest for free"
                      >
                        Try GenTest Free
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </Link>
                  </div>

                  {/* Interactive Labels */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8"
                  >
                    <div className="bg-muted/40 rounded-lg p-2 md:p-3 border border-muted flex flex-col items-center justify-center">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" />
                        <span className="text-xs md:text-sm font-medium">AI Generated</span>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">No manual test writing</span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2 md:p-3 border border-muted flex flex-col items-center justify-center">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" />
                        <span className="text-xs md:text-sm font-medium">Multiple Frameworks</span>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">Jest, Cypress, Mocha & more</span>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-2 md:p-3 border border-muted flex flex-col items-center justify-center">
                      <div className="flex items-center mb-1">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" />
                        <span className="text-xs md:text-sm font-medium">Full Coverage</span>
                      </div>
                      <span className="text-[10px] md:text-xs text-muted-foreground">Edge cases tested</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Interactive Code Demo */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700"
                >
                  {/* Code Editor Tabs */}
                  <div className="flex items-center bg-slate-900 px-4 py-2 border-b border-slate-700">
                    <div className="flex space-x-2 absolute left-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex mx-auto space-x-1">
                      {tabs.map((tab, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setActiveTab(index)
                            setTypingComplete([false, false, false])
                            setIsRunning(false)
                            setShowResult(false)
                          }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                            activeTab === index
                              ? "bg-slate-800 text-white"
                              : "text-slate-400 hover:text-slate-200"
                          }`}
                          aria-label={`Switch to ${tab.name} tab`}
                        >
                          {tab.icon}
                          <span>{tab.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Code Area */}
                  <div className="bg-slate-950 p-0">
                    <div className="flex">
                      {/* Main code editor with fixed height */}
                      <div className="flex-1 p-6 font-mono text-sm md:text-base overflow-x-auto h-[350px] overflow-y-auto">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-full"
                        >
                          <pre className="text-slate-300 whitespace-pre-wrap h-full">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              className="relative h-full"
                            >
                              {tabs[activeTab].content.split('\n').map((line, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: i * 0.05, duration: 0.2 }}
                                  className="flex"
                                >
                                  <span className="text-slate-500 w-8 inline-block select-none text-right pr-2">
                                    {i + 1}
                                  </span>
                                  <span className="flex-1">
                                    {/* Apply syntax highlighting */}
                                    {line.includes('import ') ? (
                                      <span className="text-purple-400">{line}</span>
                                    ) : line.includes('const ') || line.includes('let ') ? (
                                      <span>
                                        <span className="text-blue-400">const </span>
                                        {line.replace('const ', '')}
                                      </span>
                                    ) : line.includes('function') || line.includes('=> {') || line.includes('test(') || line.includes('describe(') || line.includes('it(') ? (
                                      <span className="text-yellow-300">{line}</span>
                                    ) : line.includes('// ') ? (
                                      <span className="text-green-400">{line}</span>
                                    ) : line.includes('expect(') ? (
                                      <span className="text-orange-400">{line}</span>
                                    ) : line.includes('render(') || line.includes('fireEvent') ? (
                                      <span className="text-cyan-400">{line}</span>
                                    ) : line.includes("'") || line.includes('"') ? (
                                      <span>
                                        {line.replace(/'([^']+)'|"([^"]+)"/g, (match) => (
                                          `<span class="text-green-300">${match}</span>`
                                        ))}
                                      </span>
                                    ) : (
                                      line
                                    )}
                                  </span>
                                </motion.div>
                              ))}
                            </motion.div>
                          </pre>
                        </motion.div>
                      </div>
                    </div>

                    {/* Terminal section */}
                    <div className="border-t border-slate-700 p-4 text-sm font-mono">
                      <div className="flex items-center mb-2">
                        <Terminal className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-slate-400">Terminal</span>
                      </div>
                      
                      <div className="flex items-center text-slate-300">
                        <span className="text-green-400 mr-2">$</span>
                        {typingComplete[activeTab] ? (
                          <>
                            <span className="mr-2">npm test</span>
                            {isRunning && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center"
                              >
                                <motion.div
                                  animate={{ 
                                    opacity: [0.4, 1, 0.4],
                                    scale: [0.8, 1.2, 0.8]
                                  }}
                                  transition={{
                                    repeat: showResult ? 0 : Infinity,
                                    duration: 1
                                  }}
                                  className="text-purple-400 ml-2"
                                >
                                  <Play className="h-4 w-4" />
                                </motion.div>
                                <span className="ml-2 text-slate-400">Running tests...</span>
                              </motion.div>
                            )}
                            {showResult && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-2 text-green-400 flex items-center"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                <span>{tabs[activeTab].output}</span>
                              </motion.div>
                            )}
                          </>
                        ) : (
                          <motion.div
                            className="inline-flex"
                            initial={{ width: 0 }}
                            animate={{ width: "auto" }}
                            transition={{ duration: 2 }}
                          >
                            <motion.span className="overflow-hidden whitespace-nowrap">
                              npm test
                            </motion.span>
                            <motion.span
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ repeat: Infinity, duration: 1 }}
                              className="ml-1"
                            >
                              _
                            </motion.span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 md:py-24 bg-muted/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(transparent,white,transparent)]"></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="container relative"
            >
              <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">Real Results, Real Benefits</h2>
                <p className="text-sm md:text-base text-muted-foreground">See what developers are achieving with GenTest</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="text-center space-y-3 bg-gradient-to-br from-purple-500/5 to-transparent p-6 rounded-xl backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  >
                    <h3 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-700">85%</h3>
                  </motion.div>
                  <p className="text-lg text-muted-foreground">Reduction in testing time</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="text-center space-y-3 bg-gradient-to-br from-violet-600/5 to-transparent p-6 rounded-xl backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <h3 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-teal-500">93%</h3>
                  </motion.div>
                  <p className="text-lg text-muted-foreground">Test coverage achieved</p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="text-center space-y-3 bg-gradient-to-br from-teal-500/5 to-transparent p-6 rounded-xl backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  >
                    <h3 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-teal-700">10x</h3>
                  </motion.div>
                  <p className="text-lg text-muted-foreground">Faster bug detection</p>
                </motion.div>
              </div>
            </motion.div>
          </section>

          {/* Testimonials Section */}
          <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-muted/0 via-muted/20 to-muted/0"></div>
            <div className="container relative">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h2 className="text-3xl font-bold mb-4">Trusted by Developers</h2>
                <p className="text-muted-foreground">
                  See what teams are saying about GenTest
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    quote: "GenTest has changed how we approach testing. What used to take days now takes hours.",
                    author: "QA Lead",
                    role: "E-commerce Platform",
                    delay: 0
                  },
                  {
                    quote: "The edge case detection is incredible. Our QA team found 40% fewer bugs after implementing GenTest.",
                    author: "Senior Software Engineer",
                    role: "Healthcare Tech Startup",
                    delay: 0.1
                  },
                  {
                    quote: "I was skeptical about AI-generated tests, but GenTest produces better tests than our team wrote manually.",
                    author: "Engineering Manager",
                    role: "FinTech Company",
                    delay: 0.2
                  }
                ].map((testimonial, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: testimonial.delay }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-card rounded-xl p-6 shadow-lg border border-muted"
                  >
                    <div className="space-y-4">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-foreground italic">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]"></div>
            
            <div className="container relative">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-2xl mx-auto mb-16"
              >
                <h2 className="text-3xl font-bold mb-4">Automate Test Writing with AI</h2>
                <p className="text-muted-foreground">
                  GenTest uses advanced AI models to generate comprehensive test suites for your code.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/50 h-full">
                    <CardHeader>
                      <div className="rounded-full bg-purple-500/10 w-14 h-14 flex items-center justify-center mb-4">
                        <Clock className="h-7 w-7 text-purple-500" />
                      </div>
                      <CardTitle className="text-xl">Save Time</CardTitle>
                      <CardDescription className="text-base">Reduce the time spent writing boilerplate test code by up to 80%.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Automated test generation</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Focus on writing features, not tests</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Faster development cycles</span>
                        </motion.li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/50 h-full">
                    <CardHeader>
                      <div className="rounded-full bg-violet-500/10 w-14 h-14 flex items-center justify-center mb-4">
                        <Code className="h-7 w-7 text-violet-500" />
                      </div>
                      <CardTitle className="text-xl">Improve Coverage</CardTitle>
                      <CardDescription className="text-base">Generate comprehensive test suites that cover edge cases.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Higher code coverage</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Edge case detection</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Reduced bugs in production</span>
                        </motion.li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                >
                  <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/50 h-full">
                    <CardHeader>
                      <div className="rounded-full bg-teal-500/10 w-14 h-14 flex items-center justify-center mb-4">
                        <Zap className="h-7 w-7 text-teal-500" />
                      </div>
                      <CardTitle className="text-xl">Focus on Coding</CardTitle>
                      <CardDescription className="text-base">Spend more time building features, less time writing tests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Eliminate test writing fatigue</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Improve developer experience</span>
                        </motion.li>
                        <motion.li 
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6, duration: 0.3 }}
                          className="flex items-start"
                        >
                          <div className="rounded-full bg-green-500/10 p-1 mr-3 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <span>Accelerate feature delivery</span>
                        </motion.li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Feature Banner */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-20 max-w-6xl mx-auto"
              >
                <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-teal-500/10 rounded-2xl p-8 md:p-10 relative overflow-hidden shadow-lg border border-purple-500/10">
                  <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(white,transparent)]"></div>
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="md:max-w-xl">
                      <h3 className="text-2xl font-bold mb-2">Supports All Major Test Frameworks</h3>
                      <p className="text-muted-foreground mb-4">
                        GenTest works with the tools you already use. No need to change your workflow.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { name: "Jest", icon: "⚡", color: "from-yellow-500/20 to-yellow-600/20" },
                          { name: "React Testing Library", icon: "⚛️", color: "from-blue-500/20 to-blue-600/20" },
                          { name: "Cypress", icon: "🌲", color: "from-green-500/20 to-green-600/20" },
                          { name: "Mocha", icon: "☕", color: "from-orange-500/20 to-orange-600/20" },
                          { name: "Playwright", icon: "🎭", color: "from-purple-500/20 to-purple-600/20" },
                          { name: "Vitest", icon: "⚡", color: "from-red-500/20 to-red-600/20" }
                        ].map((item, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className={`bg-gradient-to-r ${item.color} backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-muted/50 flex items-center gap-2`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="hidden md:block relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
                      <div className="relative bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-muted/50">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">Live Preview</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <span className="text-purple-500">✓</span>
                            </div>
                            <span className="text-sm">Automatic test generation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                              <span className="text-teal-500">✓</span>
                            </div>
                            <span className="text-sm">Framework-specific syntax</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                              <span className="text-violet-500">✓</span>
                            </div>
                            <span className="text-sm">Best practices included</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-purple-500/10 to-teal-500/5"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="container relative"
            >
              <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/30 to-teal-900/30 rounded-3xl p-10 md:p-14 shadow-2xl backdrop-blur-sm border border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(white,transparent)]"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6 max-w-2xl mx-auto"
                  >
                    <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-teal-200">
                      Experience the future of testing
                    </h2>
                    <p className="text-lg text-white/80">
                      Join thousands of developers who are shipping better code faster with AI-powered testing.
                    </p>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="pt-6 flex flex-col sm:flex-row justify-center gap-4"
                    >
                      <Link href="/try">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <Button 
                            size="lg" 
                            className="bg-gradient-to-r from-violet-500 to-teal-400 hover:from-violet-600 hover:to-teal-500 text-lg px-8 py-6 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(167,139,250,0.5)] transition-all duration-200 w-full sm:w-auto"
                          >
                            Try GenTest Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </motion.div>
                      </Link>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <Link href="/pricing">
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="text-lg px-8 py-6 border-2 border-white/20 hover:bg-white/10 text-white w-full sm:w-auto"
                            aria-label="View pricing plans"
                          >
                            View Pricing
                          </Button>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center md:text-left"
                  >
                    <div className="text-white/70 text-sm">
                      No credit card required. Free plan available.
                    </div>
                    <div className="flex gap-6">
                      {["Secure", "Enterprise Ready", "24/7 Support"].map((item, i) => (
                        <div key={i} className="flex items-center text-sm text-white/70">
                          <CheckCircle className="h-4 w-4 text-teal-400 mr-1.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  )
}

