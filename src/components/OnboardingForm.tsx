"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Apple, Scale, Dumbbell, HelpCircle, Smile, Utensils, Brain, Moon, Heart, Check, X, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const steps = [
  { title: "What's your main goal?", description: "Let's start by understanding what you want to achieve." },
  { title: "What's your sex?", description: "This helps us calculate your calorie needs more accurately." },
  { title: "Have you counted calories before?", description: "This helps us tailor our approach to your experience level." },
  { title: "When is your birthday?", description: "Your age is a factor in determining your nutritional needs." },
  { title: "How tall are you?", description: "Height is an important factor in calculating your ideal calorie intake." },
  { title: "How active are you?", description: "Your activity level affects how many calories you need daily." },
  { title: "What's your current weight?", description: "This helps us establish your starting point." },
  { title: "What's your goal weight?", description: "Let's set a target for you to work towards." },
  { title: "Do you follow a specific diet?", description: "We'll customize our recommendations based on your dietary preferences." },
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        router.push("/dashboard");
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
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Apple, text: "Lose weight", description: "Shed those extra pounds and feel great" },
                  { icon: Scale, text: "Maintain weight", description: "Keep your current weight and improve health" },
                  { icon: ChevronRight, text: "Gain weight", description: "Add healthy weight to your frame" },
                  { icon: Dumbbell, text: "Build muscle", description: "Increase strength and muscle mass" },
                  { icon: HelpCircle, text: "Something else", description: "Tell us more about your specific goal" },
                ].map((item) => (
                  <TooltipProvider key={item.text}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={`flex items-center justify-start space-x-4 h-16 ${formData.mainGoal === item.text ? "border-green-600 bg-green-50" : ""
                            }`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, mainGoal: item.text }))
                            handleNext()
                          }}
                        >
                          <item.icon className="h-8 w-8 text-green-600" />
                          <span className="font-semibold">{item.text}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 1:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="flex space-x-4">
                {[
                  { icon: Smile, text: "Male" },
                  { icon: Smile, text: "Female" },
                ].map((item) => (
                  <Button
                    key={item.text}
                    variant="outline"
                    className={`flex-1 h-20 ${formData.sex === item.text ? "border-green-600 bg-green-50" : ""
                      }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, sex: item.text }))
                      handleNext()
                    }}
                  >
                    <item.icon className="h-8 w-8 mr-2 text-green-600" />
                    <span className="font-semibold">{item.text}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 2:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="flex space-x-4">
                {["Yes", "No"].map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    className={`flex-1 h-20 ${formData.countedCalories === option ? "border-green-600 bg-green-50" : ""
                      }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, countedCalories: option }))
                      handleNext()
                    }}
                  >
                    {option === "Yes" ? <Check className="h-8 w-8 mr-2 text-green-600" /> : <X className="h-8 w-8 mr-2 text-green-600" />}
                    <span className="font-semibold">{option}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="space-y-4">
                <Label htmlFor="birthday" className="text-lg font-semibold">Birthday</Label>
                <Input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="border-green-600 focus:ring-green-600"
                />
              </div>
              <Button onClick={handleNext} className="mt-6 bg-green-600 hover:bg-green-700">Next</Button>
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="space-y-4">
                <Label htmlFor="height" className="text-lg font-semibold">Height</Label>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleInputChange}
                    className="border-green-600 focus:ring-green-600"
                  />
                  <div className="flex space-x-2">
                    {["cm", "ft/in"].map((unit) => (
                      <Button
                        key={unit}
                        variant="outline"
                        className={`flex-1 ${formData.heightUnit === unit ? "border-green-600 bg-green-50" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, heightUnit: unit }))}
                      >
                        {unit}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="mt-6 bg-green-600 hover:bg-green-700">Next</Button>
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="space-y-4">
                {[
                  { title: "Light active", description: "Mostly sitting, e.g., office worker", icon: Zap },
                  { title: "Moderately active", description: "Mostly standing, e.g., teacher", icon: Zap },
                  { title: "Active", description: "Mostly walking, e.g., salesperson", icon: Zap },
                  { title: "Very active", description: "Physically demanding, e.g., builder", icon: Zap },
                ].map((item) => (
                  <Button
                    key={item.title}
                    variant="outline"
                    className={`w-full justify-start text-left h-auto py-4 ${formData.activityLevel === item.title ? "border-green-600 bg-green-50" : ""
                      }`}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, activityLevel: item.title }))
                      handleNext()
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <item.icon className="h-8 w-8 text-green-600" />

                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      case 6:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="space-y-4">
                <Label htmlFor="currentWeight" className="text-lg font-semibold">Current Weight</Label>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    id="currentWeight"
                    name="currentWeight"
                    value={formData.currentWeight}
                    onChange={handleInputChange}
                    className="border-green-600 focus:ring-green-600"
                  />
                  <div className="flex space-x-2">
                    {["kg", "lb"].map((unit) => (
                      <Button
                        key={unit}
                        variant="outline"
                        className={`flex-1 ${formData.weightUnit === unit ? "border-green-600 bg-green-50" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, weightUnit: unit }))}
                      >
                        {unit}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="mt-6 bg-green-600 hover:bg-green-700">Next</Button>
            </CardContent>
          </Card>
        )
      case 7:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="space-y-4">
                <Label htmlFor="goalWeight" className="text-lg font-semibold">Goal Weight</Label>
                <div className="flex space-x-4">
                  <Input
                    type="number"
                    id="goalWeight"
                    name="goalWeight"
                    value={formData.goalWeight}
                    onChange={handleInputChange}
                    className="border-green-600 focus:ring-green-600"
                  />
                  <div className="flex space-x-2">
                    {["kg", "lb"].map((unit) => (
                      <Button
                        key={unit}
                        variant="outline"
                        className={`flex-1 ${formData.weightUnit === unit ? "border-green-600 bg-green-50" : ""}`}
                        onClick={() => setFormData((prev) => ({ ...prev, weightUnit: unit }))}
                      >
                        {unit}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleNext} className="mt-6 bg-green-600 hover:bg-green-700">Next</Button>
            </CardContent>
          </Card>
        )
      case 8:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
              <p className="text-muted-foreground mb-6">{steps[currentStep].description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Utensils, text: "Classic", description: "No dietary restrictions" },
                  { icon: Utensils, text: "Pescatarian", description: "Fish, but no meat" },
                  { icon: Utensils, text: "Vegetarian", description: "No meat or fish" },
                  { icon: Utensils, text: "Vegan", description: "No animal products" },
                ].map((item) => (
                  <TooltipProvider key={item.text}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={`flex items-center justify-start space-x-4 h-20 ${formData.diet === item.text ? "border-green-600 bg-green-50" : ""
                            }`}
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, diet: item.text }))
                            handleFinish()
                          }}
                        >
                          <item.icon className="h-8 w-8 text-green-600" />
                          <span className="font-semibold">{item.text}</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="mb-8" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
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