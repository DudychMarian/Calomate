import { motion } from 'framer-motion'

export type CalorieChartProps = { limit: number, current: number }

export function CalorieChart({ limit, current }: CalorieChartProps) {
  const percentage = (current / limit) * 100

  return (
    <div className="relative w-64 h-64 mx-auto">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-muted-foreground"
          strokeWidth="10"
          stroke="#F0F0F1"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <motion.circle
          className="text-primary"
          strokeWidth="10"
          stroke="#16A349"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          initial={{ strokeDasharray: "0 283" }}
          animate={{ strokeDasharray: `${percentage * 2.83} 283` }}
          transition={{ duration: 0.5 }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          key={current}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {current}
        </motion.span>
        <span className="text-sm text-muted-foreground">/ {limit} kcal</span>
      </div>
    </div>
  )
}