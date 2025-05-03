import { motion } from "framer-motion"
import { ReactNode } from "react"

interface MotionSectionProps {
  children: ReactNode
  className?: string
}

export default function MotionSection({ children, className = "" }: MotionSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  )
} 