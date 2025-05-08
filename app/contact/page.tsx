"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Mail, MessageSquare, Send, Github, Twitter, Linkedin, ArrowRight, CheckCircle2, LocateFixed, HelpCircle, Calendar, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("waitlist")
  const [activeFaq, setActiveFaq] = useState(0)
  const [demoDate, setDemoDate] = useState("")
  const [demoTime, setDemoTime] = useState("")
  const [isDemoScheduled, setIsDemoScheduled] = useState(false)
  const [isWaitlist, setIsWaitlist] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormState({
      ...formState,
      subject: value,
    })
    setIsWaitlist(value === "waitlist")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Enhanced validation
    if (!formState.name.trim()) {
      setError("Please enter your name.")
      setIsSubmitting(false)
      return
    }

    if (!formState.email.trim()) {
      setError("Please enter your email address.")
      setIsSubmitting(false)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      setError("Please enter a valid email address.")
      setIsSubmitting(false)
      return
    }

    if (!formState.message.trim()) {
      setError("Please enter your message.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'gentest.official@gmail.com',
          subject: `[${formState.subject.toUpperCase()}] New message from ${formState.name}`,
          text: `
Name: ${formState.name}
Email: ${formState.email}
Subject: ${formState.subject}

Message:
${formState.message}
          `,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormState({
        name: "",
        email: "",
        subject: "waitlist",
        message: "",
      })
    } catch (err) {
      setError("An error occurred while sending your message. Please try again later.")
      setIsSubmitting(false)
    }
  }

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    if (!formState.name.trim() || !formState.email.trim() || !demoDate || !demoTime) {
      setError("Please fill out all required fields.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'gentest.official@gmail.com',
          subject: `[DEMO REQUEST] New demo request from ${formState.name}`,
          text: `
Name: ${formState.name}
Email: ${formState.email}
Preferred Date: ${demoDate}
Preferred Time: ${demoTime}

Additional Notes:
${formState.message}
          `,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setIsSubmitting(false)
      setIsDemoScheduled(true)
      setFormState({
        name: "",
        email: "",
        subject: "waitlist",
        message: "",
      })
      setDemoDate("")
      setDemoTime("")
    } catch (err) {
      setError("An error occurred while scheduling your demo. Please try again later.")
      setIsSubmitting(false)
    }
  }

  const faqs = [
    {
      question: "When will the GenTest CLI be available to the public?",
      answer: "GenTest is currently in private beta. Join our waitlist to be notified when we launch to the public and to get a chance for early access."
    },
    {
      question: "Which test frameworks does GenTest support?",
      answer: "GenTest supports all major testing frameworks including Jest, Mocha, Pytest, JUnit, and more. Our tool automatically detects your project's setup and adapts accordingly."
    },
    {
      question: "How accurate are the generated tests?",
      answer: "Our AI models achieve over 90% accuracy in test generation for most codebases. The system continuously improves as it learns from more code patterns and user feedback."
    }
  ]

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-teal-900/5 z-0" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container py-8 relative z-10 max-w-6xl">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-violet-600">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">Have questions about GenTest? We're here to help you build better tests, faster.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.div 
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6 w-full max-w-md mx-auto">
                <TabsTrigger value="message" className="data-[state=active]:bg-purple-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </TabsTrigger>
                <TabsTrigger value="waitlist" className="data-[state=active]:bg-purple-600">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Join Waitlist
                </TabsTrigger>
                <TabsTrigger value="demo" className="data-[state=active]:bg-purple-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Demo
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="message">
                <Card className="border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-700/5 py-3">
                    <CardTitle className="text-lg">Send us a message</CardTitle>
                    <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
            </CardHeader>
                  <CardContent className="py-4">
                    <AnimatePresence mode="wait">
              {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                <Alert className="bg-green-600/10 text-green-600 border-green-600/20">
                            <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Thank you!</AlertTitle>
                  <AlertDescription>
                    Your message has been sent successfully. We'll get back to you soon.
                  </AlertDescription>
                </Alert>
                        </motion.div>
                      ) : (
                        <motion.form 
                          onSubmit={handleSubmit} 
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                      <Label htmlFor="name">Name *</Label>
                              <Input 
                                id="name" 
                                name="name" 
                                value={formState.name} 
                                onChange={handleChange} 
                                required 
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                              />
                    </div>
                            <div className="space-y-1">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                          <div className="space-y-1">
                    <Label htmlFor="subject">Subject</Label>
                            <Select value={formState.subject} onValueChange={handleSelectChange}>
                              <SelectTrigger className="focus:border-purple-500 focus:ring-purple-500/20">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="feedback">Product Feedback</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                          <div className="space-y-1">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                              rows={4}
                      value={formState.message}
                      onChange={handleChange}
                      required
                              className="focus:border-purple-500 focus:ring-purple-500/20"
                    />
                  </div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                              className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                    disabled={isSubmitting}
                    aria-label={isSubmitting ? "Sending message" : "Send message"}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                    <Send className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                          </motion.div>
                        </motion.form>
              )}
                    </AnimatePresence>
            </CardContent>
          </Card>
              </TabsContent>
              
              <TabsContent value="waitlist">
                <Card className="border border-purple-500/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-700/5 py-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 rounded-full bg-gradient-to-r from-violet-500/20 to-teal-500/20">
                        <Sparkles className="h-6 w-6 text-violet-500" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-teal-500">Join Our Waitlist</CardTitle>
                        <CardDescription className="text-lg mt-1">Be among the first to experience our platform</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <AnimatePresence mode="wait">
                      {isSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert className="bg-green-600/10 text-green-600 border-green-600/20">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Thank you!</AlertTitle>
                            <AlertDescription>
                              You've been added to our waitlist. We'll notify you when we launch.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ) : (
                        <motion.form 
                          onSubmit={handleSubmit} 
                          className="space-y-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="waitlist-name" className="text-base">Full Name *</Label>
                              <Input
                                id="waitlist-name"
                                name="name"
                                value={formState.name}
                                onChange={handleChange}
                                required
                                className="h-12 text-base focus:border-purple-500 focus:ring-purple-500/20"
                                placeholder="Enter your full name"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="waitlist-email" className="text-base">Email *</Label>
                              <Input
                                id="waitlist-email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                                className="h-12 text-base focus:border-purple-500 focus:ring-purple-500/20"
                                placeholder="Enter your email"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="waitlist-message" className="text-base">Why are you interested in joining? (Optional)</Label>
                            <Textarea
                              id="waitlist-message"
                              name="message"
                              value={formState.message}
                              onChange={handleChange}
                              rows={4}
                              className="text-base focus:border-purple-500 focus:ring-purple-500/20"
                              placeholder="Tell us why you're interested in joining our waitlist..."
                            />
                          </div>
                          <div className="space-y-4 p-6 rounded-xl bg-gradient-to-r from-violet-500/5 to-teal-500/5 border border-violet-500/10">
                            <h3 className="text-lg font-semibold text-foreground">Benefits of Joining</h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/10">
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                </div>
                                <span className="text-base">Get early access to new features</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/10">
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                </div>
                                <span className="text-base">Receive exclusive updates and offers</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-green-500/10">
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                </div>
                                <span className="text-base">Priority support when you join</span>
                              </div>
                            </div>
        </div>
                          <motion.div 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }}
                            className="pt-4"
                          >
                            <Button
                              type="submit"
                              className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-teal-600 hover:from-violet-700 hover:to-teal-700 text-white shadow-lg"
                              disabled={isSubmitting}
                              aria-label={isSubmitting ? "Joining waitlist" : "Join waitlist"}
                            >
                              {isSubmitting ? "Joining..." : "Join Waitlist"}
                              <Sparkles className="ml-2 h-5 w-5" aria-hidden="true" />
                            </Button>
                          </motion.div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="demo">
                <Card className="border border-purple-500/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-700/5 py-3">
                    <CardTitle className="text-lg">Request a Demo</CardTitle>
                    <CardDescription>See GenTest in action with a personalized demo.</CardDescription>
            </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h3 className="font-medium mb-2 text-sm">What to expect</h3>
                      <ul className="space-y-1 text-xs">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                          <span>Personalized walkthrough of GenTest features</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                          <span>Live test generation demonstration</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                          <span>Q&A with our product specialists</span>
                        </li>
                      </ul>
              </div>

                    <AnimatePresence mode="wait">
                      {isDemoScheduled ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert className="bg-green-600/10 text-green-600 border-green-600/20">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Demo Scheduled!</AlertTitle>
                            <AlertDescription>
                              Your demo has been scheduled successfully. We'll send you a confirmation email with the details.
                            </AlertDescription>
                          </Alert>
                        </motion.div>
                      ) : (
                        <motion.form 
                          onSubmit={handleDemoSubmit} 
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertTitle>Error</AlertTitle>
                              <AlertDescription>{error}</AlertDescription>
                            </Alert>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="demo-name">Name *</Label>
                              <Input 
                                id="demo-name" 
                                name="name" 
                                value={formState.name} 
                                onChange={handleChange} 
                                required 
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="demo-email">Email *</Label>
                              <Input
                                id="demo-email"
                                name="email"
                                type="email"
                                value={formState.email}
                                onChange={handleChange}
                                required
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label htmlFor="demo-date">Preferred Date *</Label>
                              <Input
                                id="demo-date"
                                type="date"
                                value={demoDate}
                                onChange={(e) => setDemoDate(e.target.value)}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor="demo-time">Preferred Time *</Label>
                              <Input
                                id="demo-time"
                                type="time"
                                value={demoTime}
                                onChange={(e) => setDemoTime(e.target.value)}
                                required
                                className="focus:border-purple-500 focus:ring-purple-500/20"
                              />
                </div>
              </div>
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
                              disabled={isSubmitting}
                              aria-label={isSubmitting ? "Scheduling demo" : "Schedule demo"}
                            >
                              {isSubmitting ? "Scheduling..." : "Schedule Demo"}
                              <Calendar className="ml-2 h-4 w-4" aria-hidden="true" />
                            </Button>
                          </motion.div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-6">
              <Card className="border border-purple-500/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-700/5 py-3">
                  <CardTitle className="text-lg">Connect With Us</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="flex items-center mb-6">
                    <a 
                      href="mailto:gentest.official@gmail.com" 
                      className="text-sm text-purple-500 hover:text-purple-600 transition-colors flex items-center hover:underline"
                    >
                      <Mail className="h-4 w-4 mr-2 text-purple-500" />
                      gentest.official@gmail.com
                    </a>
              </div>

                  <div className="grid grid-cols-4 gap-2">
                    <motion.a 
                      href=" " 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 text-foreground hover:text-purple-500 rounded-lg p-3 transition-all flex flex-col items-center justify-center hover:bg-purple-100/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="h-5 w-5 mb-1" />
                      <span className="text-xs">GitHub</span>
                    </motion.a>
                    <motion.a 
                      href="" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 text-foreground hover:text-purple-500 rounded-lg p-3 transition-all flex flex-col items-center justify-center hover:bg-purple-100/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Twitter className="h-5 w-5 mb-1" />
                      <span className="text-xs">Twitter</span>
                    </motion.a>
                    <motion.a 
                      href="" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 text-foreground hover:text-purple-500 rounded-lg p-3 transition-all flex flex-col items-center justify-center hover:bg-purple-100/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="h-5 w-5 mb-1" />
                      <span className="text-xs">LinkedIn</span>
                    </motion.a>
                    <motion.a 
                      href="" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted/50 text-foreground hover:text-purple-500 rounded-lg p-3 transition-all flex flex-col items-center justify-center hover:bg-purple-100/20"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-5 w-5 mb-1"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="7" cy="9.5" r="1" />
                        <circle cx="17" cy="9.5" r="1" />
                        <path d="M12 15.5 A3.5 3.5 0 0 0 8.5 12 A3.5 3.5 0 0 0 15.5 12 A3.5 3.5 0 0 0 12 15.5 Z" />
                        <path d="M17.5 7C18.328 7 19 6.328 19 5.5C19 4.672 18.328 4 17.5 4C16.672 4 16 4.672 16 5.5C16 6.328 16.672 7 17.5 7Z" />
                        <path d="M12 20v-5" />
                        <path d="M7.5 8L4 5" />
                        <path d="M16.5 8L20 5" />
                      </svg>
                      <span className="text-xs">Reddit</span>
                    </motion.a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-purple-500/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500/5 to-purple-700/5 py-3">
                  <CardTitle className="text-lg">FAQ</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {faqs.map((faq, index) => (
                      <div key={index} className="px-4 py-2">
                        <button 
                          onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                          className="flex justify-between items-start w-full text-left"
                        >
                          <h3 className="font-medium pr-4 text-sm">{faq.question}</h3>
                          <div className="bg-muted/50 rounded-full p-1 flex-shrink-0">
                            {activeFaq === index ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M5 12h14"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M12 5v14M5 12h14"/></svg>
                            )}
                          </div>
                        </button>
                        <AnimatePresence>
                          {activeFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <p className="mt-2 text-xs text-muted-foreground">{faq.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                </div>
                    ))}
              </div>
            </CardContent>
          </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

