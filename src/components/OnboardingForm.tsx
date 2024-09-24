"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Apple, Scale, Dumbbell, HelpCircle, Smile, Utensils, Brain, Moon, Heart, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"

const steps = [
  { title: "What's your main goal?" },
  { title: "What's your sex?" },
  { title: "Is there anything else you want to achieve?" },
  { title: "Have you ever counted calories before?" },
  { title: "When is your birthday?" },
  { title: "How tall are you?" },
  { title: "How active are you?" },
  { title: "What's your current weight?" },
  { title: "Let's set your goal you're going to crush!" },
  { title: "Do you follow a specific diet?" },
]

function toPascalCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    mainGoal: "",
    sex: "",
    additionalGoals: [],
    countedCalories: "",
    birthday: "",
    height: "",
    heightUnit: "cm",
    activityLevel: "",
    currentWeight: "",
    weightUnit: "kg",
    goalWeight: "",
    diet: "",
  })
  const router = useRouter()

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleFinish = async () => {
    try {
      const formattedFormData = {
        ...formData,
        mainGoal: toPascalCase(formData.mainGoal),
        birthday: new Date(formData.birthday).toISOString(),
        activityLevel: toPascalCase(formData.activityLevel),
      };
  
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedFormData),
      });
  
      const result = await response.json();
  
      if (result.success) {
        console.log("Form data successfully saved:", result.user);
        router.push("/");
      } else {
        console.error("Error saving form data:", result.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Apple, text: "Lose weight" },
                { icon: Scale, text: "Maintain weight" },
                { icon: ChevronRight, text: "Gain weight" },
                { icon: Dumbbell, text: "Build muscle" },
                { icon: HelpCircle, text: "Something else" },
              ].map((item) => (
                <Button
                  key={item.text}
                  variant="outline"
                  className={`flex items-center justify-start space-x-2 h-16 ${
                    formData.mainGoal === item.text ? "border-primary" : ""
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, mainGoal: item.text }))
                    handleNext()
                  }}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">
              Since the formula for an accurate calorie calculation differs based on sex, we need this information to calculate your daily calorie goal.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Smile, text: "Male" },
                { icon: Smile, text: "Female" },
              ].map((item) => (
                <Button
                  key={item.text}
                  variant="outline"
                  className={`flex-1 h-16 ${
                    formData.sex === item.text ? "border-primary" : ""
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, sex: item.text }))
                    handleNext()
                  }}
                >
                  <item.icon className="h-6 w-6 mr-2" />
                  {item.text}
                </Button>
              ))}
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div className="space-y-2">
              {[
                { icon: Utensils, text: "Improve my relationship with food" },
                { icon: Utensils, text: "Learn how to cook healthily" },
                { icon: Brain, text: "Strengthen my immune system" },
                { icon: Moon, text: "Sleep better and have more energy" },
                { icon: Heart, text: "Feel comfortable in my own skin" },
                { icon: X, text: "None of the above" },
              ].map((item) => (
                <div key={item.text} className="flex items-center space-x-2">
                  <Checkbox
                    id={item.text}
                    // @ts-ignore
                    checked={formData.additionalGoals.includes(item.text)}
                    onCheckedChange={(checked) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        additionalGoals: checked
                          ? [...prev.additionalGoals, item.text]
                          : prev.additionalGoals.filter((goal: any) => goal !== item.text),
                      }))
                    }}
                  />
                  <Label htmlFor={item.text} className="flex items-center space-x-2">
                    <item.icon className="h-5 w-5" />
                    <span>{item.text}</span>
                  </Label>
                </div>
              ))}
            </div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div className="flex space-x-4">
              {["Yes", "No"].map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className={`flex-1 h-16 ${
                    formData.countedCalories === option ? "border-primary" : ""
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, countedCalories: option }))
                    handleNext()
                  }}
                >
                  {option === "Yes" ? <Check className="h-6 w-6 mr-2" /> : <X className="h-6 w-6 mr-2" />}
                  {option}
                </Button>
              ))}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div>
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                type="date"
                id="birthday"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
              />
            </div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-4">
              {["cm", "ft/in"].map((unit) => (
                <Button
                  key={unit}
                  variant="outline"
                  className={`flex-1 ${formData.heightUnit === unit ? "border-primary" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, heightUnit: unit }))}
                >
                  {unit}
                </Button>
              ))}
            </div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">
              Knowing your daily activity level helps us calculate your calorie needs more accurately.
            </p>
            <div className="space-y-2">
              {[
                { title: "Light active", description: "mostly sitting, eg. office worker" },
                { title: "Moderately active", description: "mostly standing, eg. teacher" },
                { title: "Active", description: "mostly walking, eg. salesperson" },
                { title: "Very active", description: "physically demanding, eg. builder" },
              ].map((item) => (
                <Button
                  key={item.title}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto py-3 ${
                    formData.activityLevel === item.title ? "border-primary" : ""
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, activityLevel: item.title }))
                    handleNext()
                  }}
                >
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">
              It's okay to guess. You can always adjust your starting weight later.
            </p>
            <div>
              <Label htmlFor="currentWeight">Current Weight</Label>
              <Input
                type="number"
                id="currentWeight"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-4">
              {["kg", "lb"].map((unit) => (
                <Button
                  key={unit}
                  variant="outline"
                  className={`flex-1 ${formData.weightUnit === unit ? "border-primary" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, weightUnit: unit }))}
                >
                  {unit}
                </Button>
              ))}
            </div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )
      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <div>
              <Label htmlFor="goalWeight">Goal Weight</Label>
              <Input
                type="number"
                id="goalWeight"
                name="goalWeight"
                value={formData.goalWeight}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex space-x-4">
              {["kg", "lb"].map((unit) => (
                <Button
                  key={unit}
                  variant="outline"
                  className={`flex-1 ${formData.weightUnit === unit ? "border-primary" : ""}`}
                  onClick={() => setFormData((prev) => ({ ...prev, weightUnit: unit }))}
                >
                  {unit}
                </Button>
              ))}
            </div>
            <Button onClick={handleNext}>Next</Button>
          </div>
        )
      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground">
              We'll adapt our recommendations to your preferences
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: Utensils, text: "Classic" },
                { icon: Utensils, text: "Pescatarian" },
                { icon: Utensils, text: "Vegetarian" },
                { icon: Utensils, text: "Vegan" },
              ].map((item) => (
                <Button
                  key={item.text}
                  variant="outline"
                  className={`flex items-center justify-start space-x-2 h-16 ${
                    formData.diet === item.text ? "border-primary" : ""
                  }`}
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, diet: item.text }))
                    handleFinish()
                  }}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-card rounded-xl shadow-lg">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="mb-8" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="mt-8 flex justify-between">
            <Button onClick={handlePrevious} variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}