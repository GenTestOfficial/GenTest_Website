import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface MotionCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
}

export default function MotionCard({ children, className = "", title, description }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-muted/50 h-full ${className}`}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle className="text-xl">{title}</CardTitle>}
            {description && <CardDescription className="text-base">{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
} 