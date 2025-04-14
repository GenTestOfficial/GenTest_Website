"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Zap, Users, Building2, Sparkles, Clock, Shield, Code2 } from "lucide-react"
import { motion, useAnimate, stagger } from "framer-motion"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth, useSignIn } from '@clerk/nextjs';

export default function PricingPage() {
  const [scope, animate] = useAnimate();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    animate(
      "li", 
      { opacity: [0, 1], y: [20, 0] },
      { delay: stagger(0.05), duration: 0.4 }
    );
  }, [animate]);

  const handleUpgrade = async (plan: string) => {
    try {
      if (!isSignedIn) {
        await signIn?.create({
          strategy: "oauth_google",
          redirectUrl: "/pricing",
        });
        return;
      }

      setIsLoading(true);
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start checkout process');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 to-teal-900/5 z-0" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          className="absolute h-56 w-56 rounded-full bg-purple-600/5 blur-3xl" 
          style={{ top: '20%', right: '10%' }}
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15,
            ease: "easeInOut" 
          }}
        />
        
        <motion.div 
          className="absolute h-64 w-64 rounded-full bg-indigo-600/5 blur-3xl" 
          style={{ bottom: '10%', left: '5%' }}
          animate={{ 
            x: [0, -20, 0], 
            y: [0, 40, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.div 
          className="absolute h-72 w-72 rounded-full bg-blue-600/5 blur-3xl" 
          style={{ top: '30%', left: '30%' }}
          animate={{ 
            x: [0, 40, 0], 
            y: [0, 40, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>
      
      <div className="max-w-3xl mx-auto text-center mb-16 relative z-10">
        <motion.span 
          className="inline-block text-purple-500 text-sm font-medium mb-3 px-3 py-1 bg-purple-500/10 rounded-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Transparent Pricing
        </motion.span>
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Simple monthly plans
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          From solo developers to large enterprises, choose the plan that's right for your test generation needs.
        </motion.p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        ref={scope}
      >
        {/* Free Tier */}
        <motion.div 
          whileHover={{ y: -5 }} 
          transition={{ type: "spring", stiffness: 300 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Code2 className="h-5 w-5 mr-2 text-blue-400" />
                <CardTitle>Free</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">For individual developers</CardDescription>
              <div className="mt-5 mb-1">
                <div className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <div className="text-sm text-muted-foreground mt-1">No credit card required</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">5,000 tokens</span> per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Support for <span className="font-medium">all programming languages</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">Test generation</span> with all major frameworks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Single file uploads</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500/70 mr-2 shrink-0" />
                  <span className="text-muted-foreground">No API access</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500/70 mr-2 shrink-0" />
                  <span className="text-muted-foreground">No advanced test patterns</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="h-5 w-5 text-red-500/70 mr-2 shrink-0" />
                  <span className="text-muted-foreground">Community support only</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/try" className="w-full">
                <Button className="w-full" variant="outline">
                  Start Free
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Pro Tier - Popular*/}
        <motion.div 
          whileHover={{ y: -5 }} 
          transition={{ type: "spring", stiffness: 300 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="border-purple-500 bg-purple-950/20 backdrop-blur-sm relative h-full">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Badge variant="default" className="bg-purple-600 hover:bg-purple-600">Most Popular</Badge>
              </motion.div>
            </div>
            <CardHeader>
              <div className="flex items-center mb-2">
                <Zap className="h-5 w-5 mr-2 text-purple-400" />
                <CardTitle>Pro</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Perfect for professional developers</CardDescription>
              <div className="mt-5 mb-1">
                <div className="text-4xl font-bold">$25<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <div className="text-sm text-muted-foreground mt-1">per user</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">100,000 tokens</span> per month</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Support for <span className="font-medium">all programming languages</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">Test generation</span> with all major frameworks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Multiple file uploads (up to 10 files)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Advanced test patterns and edge cases</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Detailed test documentation</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0"
                onClick={() => handleUpgrade('PRO')}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Upgrade to Pro'}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Enterprise Tier */}
        <motion.div 
          whileHover={{ y: -5 }} 
          transition={{ type: "spring", stiffness: 300 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm h-full">
            <CardHeader>
              <div className="flex items-center mb-2">
                <Building2 className="h-5 w-5 mr-2 text-indigo-400" />
                <CardTitle>Enterprise</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">For large organizations</CardDescription>
              <div className="mt-5 mb-1">
                <div className="text-4xl font-bold">Custom<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <div className="text-sm text-muted-foreground mt-1">Contact us for pricing</div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">Unlimited tokens</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Support for <span className="font-medium">all programming languages</span></span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span><span className="font-medium">Custom test frameworks</span> and patterns</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Bulk file processing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Dedicated support team</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>On-premise deployment</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Link href="/contact" className="w-full">
                <Button className="w-full" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* Comparison Table */}
      <motion.div 
        className="mt-32 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-4xl font-semibold text-center mb-3">Detailed Comparison</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
          See exactly what features are included in each plan to help you make the right choice for your needs.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-800 shadow-xl bg-slate-900/60 backdrop-blur-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4 px-6 bg-slate-900/80">Feature</th>
                <th className="text-center py-4 px-6 bg-slate-900/80">Free</th>
                <th className="text-center py-4 px-6 bg-purple-900/30">Pro</th>
                <th className="text-center py-4 px-6 bg-slate-900/80">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Monthly Tokens</td>
                <td className="text-center py-4 px-6">5,000</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">100,000</td>
                <td className="text-center py-4 px-6">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 font-medium">Languages Supported</td>
                <td className="text-center py-4 px-6">JavaScript, Python</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">JS, TS, Python, Java, C#</td>
                <td className="text-center py-4 px-6">All + Custom</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Test Frameworks</td>
                <td className="text-center py-4 px-6">Jest, PyTest</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">All Major Frameworks</td>
                <td className="text-center py-4 px-6">All + Custom</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 font-medium">File Uploads</td>
                <td className="text-center py-4 px-6">1 file (max 500 lines)</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">10 files</td>
                <td className="text-center py-4 px-6">Unlimited</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">API Access</td>
                <td className="text-center py-4 px-6">
                  <XCircle className="h-5 w-5 text-red-500/70 mx-auto" />
                </td>
                <td className="text-center py-4 px-6 bg-purple-900/10">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 font-medium">Test Coverage</td>
                <td className="text-center py-4 px-6">Basic (60-75%)</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">Advanced (75-90%)</td>
                <td className="text-center py-4 px-6">Maximum (90%+)</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Edge Case Detection</td>
                <td className="text-center py-4 px-6">
                  <XCircle className="h-5 w-5 text-red-500/70 mx-auto" />
                </td>
                <td className="text-center py-4 px-6 bg-purple-900/10">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 font-medium">AI Models</td>
                <td className="text-center py-4 px-6">Standard</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">Advanced</td>
                <td className="text-center py-4 px-6">Premium</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Version Control Integration</td>
                <td className="text-center py-4 px-6">
                  <XCircle className="h-5 w-5 text-red-500/70 mx-auto" />
                </td>
                <td className="text-center py-4 px-6 bg-purple-900/10">GitHub, GitLab</td>
                <td className="text-center py-4 px-6">All + Self-hosted</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-4 px-6 font-medium">Support</td>
                <td className="text-center py-4 px-6">Community</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">Priority Email (24h)</td>
                <td className="text-center py-4 px-6">Dedicated + SLA</td>
              </tr>
              <tr className="border-b border-slate-800 bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Security Features</td>
                <td className="text-center py-4 px-6">Standard</td>
                <td className="text-center py-4 px-6 bg-purple-900/10">Enhanced</td>
                <td className="text-center py-4 px-6">Enterprise-grade</td>
              </tr>
              <tr className="bg-slate-900/20">
                <td className="py-4 px-6 font-medium">Custom Integrations</td>
                <td className="text-center py-4 px-6">
                  <XCircle className="h-5 w-5 text-red-500/70 mx-auto" />
                </td>
                <td className="text-center py-4 px-6 bg-purple-900/10">
                  <XCircle className="h-5 w-5 text-red-500/70 mx-auto" />
                </td>
                <td className="text-center py-4 px-6">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <motion.div 
        className="mt-24 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-col items-center text-center p-6"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="h-14 w-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-4"
              whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.3)" }}
            >
              <Sparkles className="h-7 w-7 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">AI-Powered Testing</h3>
            <p className="text-muted-foreground">
              Our advanced AI models understand your code's intent and generate comprehensive tests with high coverage.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center text-center p-6"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="h-14 w-14 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4"
              whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.3)" }}
            >
              <Clock className="h-7 w-7 text-indigo-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Save Development Time</h3>
            <p className="text-muted-foreground">
              Reduce testing time by up to 70% while maintaining high-quality test suites for your applications.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center text-center p-6"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div 
              className="h-14 w-14 rounded-full bg-blue-500/20 flex items-center justify-center mb-4"
              whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.3)" }}
            >
              <Shield className="h-7 w-7 text-blue-400" />
            </motion.div>
            <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
            <p className="text-muted-foreground">
              Your code stays secure with our SOC 2 compliant infrastructure and optional private deployments.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div 
        className="mt-24 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-2xl font-semibold text-center mb-3">Frequently Asked Questions</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-xl mx-auto">
          Get answers to common questions about GenTest plans and features.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">How do tokens work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Tokens measure the processing needed for your code. Each file's size and complexity affects token usage. Typically, a 100-line file uses about 1,000-2,000 tokens to generate comprehensive tests. Unused tokens don't roll over to the next month.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">What languages are supported?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We support all major programming languages. Our AI can understand and generate tests for any codebase, regardless of the programming language used.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">How does billing work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our Pro plan is billed monthly at $25 per user. You can cancel anytime. Enterprise plans are custom-priced based on your needs.
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">What's the difference between Free and Pro?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Free users get 5,000 tokens per month and can upload one file at a time. Pro users get 100,000 tokens per month and can upload up to 10 files simultaneously, along with priority support.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
      
      {/* CTA Section */}
      <motion.div 
        className="mt-24 mb-10 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="max-w-4xl mx-auto rounded-2xl overflow-hidden border border-purple-500/20 bg-gradient-to-br from-slate-900 to-purple-950/30 backdrop-blur-sm"
          whileHover={{ boxShadow: "0 0 30px rgba(168, 85, 247, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Ready to revolutionize your testing?</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Start generating comprehensive tests in minutes and see the difference AI-powered testing can make.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/try">
                      <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-0 shadow-md text-white">
                        Try GenTest Free
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="border-slate-700">
                        Schedule Demo
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
              <div className="hidden md:block">
                <motion.div 
                  className="bg-slate-800/50 rounded-xl p-6 rotate-2 transform hover:rotate-0 transition-transform"
                  whileHover={{ rotate: 0, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-sm text-muted-foreground mb-3">What developers are saying:</div>
                  <div className="text-lg font-medium italic mb-4">
                    "GenTest cut our testing time in half and increased our code coverage by 35%. It's a game-changer for our team."
                  </div>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center mr-3">
                      <span className="font-semibold text-purple-300">JS</span>
                    </div>
                    <div>
                      <div className="font-medium">Jamie Smith</div>
                      <div className="text-sm text-muted-foreground">Lead Developer, TechCorp</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

