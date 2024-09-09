import { motion } from "framer-motion"

export type MacrosBarsProps = { protein: number, fat: number, carbs: number }
export type MacroBarProps = { label: string, value: number, color: string, target: number }

export function MacrosBars({ protein, fat, carbs }: MacrosBarsProps) {
  const macros = [
    { label: "Protein", value: protein, color: "bg-blue-500", target: 150 },
    { label: "Fat", value: fat, color: "bg-yellow-500", target: 67 },
    { label: "Carbs", value: carbs, color: "bg-green-500", target: 250 },
  ]

  return (
    <div className="flex justify-between gap-4">
      {macros.map((macro) => (
        <MacroBar key={macro.label} {...macro} />
      ))}
    </div>
  )
}

function MacroBar({ label, value, color, target }: MacroBarProps) {
  const consumedPercentage = (value / target) * 100

  return (
    <div className="flex-1 space-y-2">
      <div className="flex justify-center text-sm text-muted-foreground">
        <span>{label}</span>
      </div>
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
        <motion.div
          className={`h-4 ${color}`}
          style={{ width: `${consumedPercentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${consumedPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className={`flex justify-center text-sm font-medium ${value > target && "text-red-600"}`}>
        <span>{value} / {target}g</span>
      </div>
    </div>
  )
}