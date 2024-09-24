"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { DateRange } from "react-day-picker"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Download, Info } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

// Mock data - replace with real data from your backend
const mockData = [
  { date: "2024-01-01", weight: 80, bmi: 25, bmr: 1800, bodyFat: 20, bodyWater: 60, protein: 18, visceralFat: 10, muscleMass: 60 },
  { date: "2024-02-01", weight: 79, bmi: 24.8, bmr: 1790, bodyFat: 19, bodyWater: 61, protein: 18.5, visceralFat: 9, muscleMass: 61 },
  { date: "2024-03-01", weight: 78, bmi: 24.5, bmr: 1780, bodyFat: 18, bodyWater: 62, protein: 19, visceralFat: 8, muscleMass: 62 },
  { date: "2024-09-08", weight: 77, bmi: 24.2, bmr: 1770, bodyFat: 17, bodyWater: 63, protein: 19.5, visceralFat: 7, muscleMass: 63 },
  { date: "2024-09-10", weight: 76, bmi: 23.9, bmr: 1760, bodyFat: 16, bodyWater: 64, protein: 20, visceralFat: 6, muscleMass: 64 },
]

const bodyCompositionData = [
  { name: "Water", value: 60 },
  { name: "Protein", value: 20 },
  { name: "Fat", value: 15 },
  { name: "Bone Mineral", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const bodyMeasurements = {
  neck: 38,
  chest: 100,
  leftArm: 35,
  rightArm: 35,
  waist: 80,
  hips: 95,
  leftThigh: 60,
  rightThigh: 60,
  leftCalf: 38,
  rightCalf: 38,
}

const chartInfo = {
  weight: {
    description: "Track your weight changes over time.",
    tip: "Aim for a steady, gradual weight loss of 0.5-1 kg per week for sustainable results.",
    icon: "⚖️",
  },
  bmi: {
    description: "Body Mass Index (BMI) is a measure of body fat based on height and weight.",
    tip: "A healthy BMI range is typically between 18.5 and 24.9.",
    icon: "📊",
  },
  bmr: {
    description: "Basal Metabolic Rate (BMR) is the number of calories your body burns at rest.",
    tip: "Knowing your BMR can help you set more accurate calorie goals for weight management.",
    icon: "🔥",
  },
  bodyFat: {
    description: "Body fat percentage is the amount of body fat as a proportion of your body weight.",
    tip: "For men, 10-20% body fat is considered healthy. For women, it's 18-28%.",
    icon: "🏋️",
  },
  bodyWater: {
    description: "Body water percentage is the amount of water in your body as a proportion of your total weight.",
    tip: "Stay hydrated! Aim to drink at least 8 glasses of water per day.",
    icon: "💧",
  },
  protein: {
    description: "Protein percentage represents the amount of protein in your body composition.",
    tip: "Consume 1.6 to 2.2 grams of protein per kilogram of body weight to maintain muscle mass.",
    icon: "🥩",
  },
  visceralFat: {
    description: "Visceral fat is the fat that surrounds your organs in your abdominal area.",
    tip: "Keep visceral fat levels low through regular exercise and a balanced diet.",
    icon: "🫀",
  },
  muscleMass: {
    description: "Muscle mass is the amount of muscle in your body, including skeletal muscles, smooth muscles, and water contained in these muscles.",
    tip: "Incorporate strength training into your routine to maintain and build muscle mass.",
    icon: "💪",
  },
}

export default function AnalyticsPage() {
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false)
  const [isAddBodyRecordOpen, setIsAddBodyRecordOpen] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | any>({ from: new Date(2023, 0, 1), to: new Date() })
  const [newRecord, setNewRecord] = useState({
    weight: "",
    bmi: "",
    bmr: "",
    bodyFat: "",
    bodyWater: "",
    protein: "",
    visceralFat: "",
    muscleMass: "",
  })
  const [newBodyRecord, setNewBodyRecord] = useState({ ...bodyMeasurements })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setNewRecord(prev => ({ ...prev, [name]: value }))
  }

  const handleBodyRecordInputChange = (e: any) => {
    const { name, value } = e.target
    setNewBodyRecord(prev => ({ ...prev, [name]: value }))
  }

  const handleAddRecord = () => {
    // Here you would typically send the newRecord to your backend
    console.log("Adding new record:", newRecord)
    setIsAddRecordOpen(false)
    // Reset the form
    setNewRecord({
      weight: "",
      bmi: "",
      bmr: "",
      bodyFat: "",
      bodyWater: "",
      protein: "",
      visceralFat: "",
      muscleMass: "",
    })
  }

  const handleAddBodyRecord = () => {
    // Here you would typically send the newBodyRecord to your backend
    console.log("Adding new body record:", newBodyRecord)
    setIsAddBodyRecordOpen(false)
    // Reset the form to current values
    setNewBodyRecord({ ...bodyMeasurements })
  }

  const filteredData = mockData.filter(
    (item) => new Date(item.date) >= dateRange.from && new Date(item.date) <= dateRange.to
  )

  const renderLineChart = (dataKey: string, color: string, yAxisLabel: any) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={dataKey} stroke={color} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )

  const downloadPDF = () => {
    const input = document.getElementById('analytics-page')
    input && html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 30
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('analytics.pdf')
    })
  }

  return (
    <div id="analytics-page" className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Button onClick={downloadPDF}>
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
      <div className="mb-6">
        {/* <DatePickerWithRange date={dateRange} setDate={setDateRange} /> */}
        <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
          />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {Object.entries(chartInfo).map(([key, info]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="mr-2">{info.icon}</span>
                {key.charAt(0).toUpperCase() + key.slice(1)} Changes
              </CardTitle>
              <CardDescription>{info.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {renderLineChart(key, COLORS[Math.floor(Math.random() * COLORS.length)], `${key.charAt(0).toUpperCase() + key.slice(1)}`)}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                <Info className="inline mr-1" size={16} />
                Tip: {info.tip}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Body Composition</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bodyCompositionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {bodyCompositionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Body Water Percentage Visualization</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <svg width="200" height="400" viewBox="0 0 200 400">
            <defs>
              <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#87CEFA" />
                <stop offset="100%" stopColor="#1E90FF" />
              </linearGradient>
            </defs>
            <path d="M100 0 L200 100 L200 400 L0 400 L0 100 Z" fill="#f0f0f0" stroke="#000" strokeWidth="2" />
            <rect x="0" y={400 - 400 * (bodyCompositionData[0].value / 100)} width="200" height={400 * (bodyCompositionData[0].value / 100)} fill="url(#waterGradient)" />
            <text x="100" y="380" textAnchor="middle" fill="#000" fontSize="24">{`${bodyCompositionData[0].value}%`}</text>
          </svg>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weight Target Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Current Weight: 80 kg</p>
          <p>Target Weight: 70 kg</p>
          <p>Projected Time to Reach Goal: 20 weeks (at 0.5 kg/week)</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Body Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(bodyMeasurements).map(([part, measurement]) => (
              <div key={part} className="text-center">
                <p className="font-semibold">{part.charAt(0).toUpperCase() + part.slice(1)}</p>
                <p>{measurement} cm</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4 mb-6">
        <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
          <DialogTrigger asChild>
            <Button>Add New Record</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add New Record</DialogTitle>
              <DialogDescription>
                Enter your latest measurements to update your progress.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(newRecord).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddRecord}>Add Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isAddBodyRecordOpen} onOpenChange={setIsAddBodyRecordOpen}>
          <DialogTrigger asChild>
            <Button>Add Body Record</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white">
            <DialogHeader>
              <DialogTitle>Add Body Record</DialogTitle>
              <DialogDescription>
                Enter your latest body measurements.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(newBodyRecord).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Label>
                  <Input
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleBodyRecordInputChange}
                    className="col-span-3"
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddBodyRecord}>Add Body Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}