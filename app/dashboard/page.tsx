"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  CreditCard, 
  Zap, 
  Clock, 
  ArrowUpRight, 
  CheckCircle, 
  AlertCircle,
  History,
  Settings
} from "lucide-react"
import { toast } from "sonner"

interface SubscriptionData {
  tier: "free" | "pro"
  usage: number
  limit: number
  nextBillingDate?: string
  status: "active" | "inactive" | "trial" | "cancelled"
  cancelAtPeriodEnd?: boolean
  currentPeriodEnd?: string
  billingHistory?: {
    date: string
    amount: number
    status: "success" | "failed" | "pending"
    description: string
  }[]
}

const DashboardPage = () => {
  const { isLoaded, isSignedIn, user } = useUser()
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return
    }

    try {
      setIsCancelling(true)
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to cancel subscription')
      }

      const data = await response.json()
      
      // Update local state
      setSubscription(prev => prev ? {
        ...prev,
        status: 'cancelled',
        cancelAtPeriodEnd: true,
        currentPeriodEnd: data.currentPeriodEnd ? new Date(data.currentPeriodEnd).toISOString() : undefined
      } : null)

      toast.success('Subscription cancelled successfully. You will have access until the end of your billing period.')
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      toast.error('Failed to cancel subscription. Please try again later.')
    } finally {
      setIsCancelling(false)
    }
  }

  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      router.push('/')
      return
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-data")
        if (response.ok) {
          const data = await response.json()
          setSubscription({
            tier: data.tier,
            usage: data.token_usage,
            limit: data.token_limit,
            status: 'active',
            billingHistory: data.subscription?.billingHistory || []
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-teal-900/10 z-0" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container py-8 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Dashboard
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Manage your subscription and track your usage
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="border border-purple-500/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-purple-500" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your current subscription details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Plan</span>
                <Badge variant={subscription?.tier === "pro" ? "default" : "secondary"}>
                  {subscription?.tier === "pro" ? "Pro" : "Free"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={
                  subscription?.status === "active" ? "default" : 
                  subscription?.status === "cancelled" ? "destructive" : 
                  "secondary"
                }>
                  {subscription?.status === "active" ? "Active" : 
                   subscription?.status === "cancelled" ? "Cancelled" : 
                   "Inactive"}
                </Badge>
              </div>
              {subscription?.nextBillingDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Next Billing Date</span>
                  <span className="text-sm">{subscription.nextBillingDate}</span>
                </div>
              )}
              {subscription?.cancelAtPeriodEnd && subscription?.currentPeriodEnd && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Access Until</span>
                  <span className="text-sm text-red-500">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                  onClick={() => router.push('/pricing')}
                >
                  {subscription?.tier === "free" ? "Upgrade to Pro" : "Manage Subscription"}
                </Button>
                {subscription?.tier === "pro" && subscription?.status === "active" && !subscription?.cancelAtPeriodEnd && (
                  <Button 
                    variant="outline"
                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2 text-purple-500" />
                Usage
              </CardTitle>
              <CardDescription>
                Your current usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Token Usage</span>
                  <span>{subscription?.usage || 0}/{subscription?.limit || 5000} tokens</span>
                </div>
                <Progress 
                  value={((subscription?.usage || 0) / (subscription?.limit || 5000)) * 100} 
                  className="h-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Limit</span>
                <span className="text-sm">{subscription?.limit || 5000} tokens</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Reset Date</span>
                <span className="text-sm">End of month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-500/20 shadow-lg md:col-span-2">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2 text-purple-500" />
                Billing History
              </CardTitle>
              <CardDescription>
                Your recent billing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscription?.tier === "free" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No billing history available for free plan</p>
                    <Button 
                      className="mt-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                      onClick={() => router.push('/pricing')}
                    >
                      Upgrade to Pro
                    </Button>
                  </div>
                ) : subscription?.billingHistory?.length ? (
                  <div className="space-y-4">
                    {subscription.billingHistory.map((item, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            item.status === 'success' ? 'bg-green-500/10' : 
                            item.status === 'failed' ? 'bg-red-500/10' : 
                            'bg-yellow-500/10'
                          }`}>
                            {item.status === 'success' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : item.status === 'failed' ? (
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.description}</p>
                            <p className="text-sm text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${item.amount.toFixed(2)}</p>
                          <p className={`text-sm ${
                            item.status === 'success' ? 'text-green-500' : 
                            item.status === 'failed' ? 'text-red-500' : 
                            'text-yellow-500'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No billing history available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage