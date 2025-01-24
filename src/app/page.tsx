"use client"

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Apple, Barcode, Droplet, Utensils, Scale, Database, Clock, Dumbbell } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      id: "track",
      title: "Track Your Progress",
      items: [
        { icon: Utensils, color: "text-green-600", title: "Calorie Intake", description: "Monitor your daily calorie consumption" },
        { icon: Droplet, color: "text-blue-600", title: "Water Intake", description: "Stay hydrated with water tracking" },
        { icon: Scale, color: "text-purple-600", title: "Body Metrics", description: "Track weight, BMI, BMR, and more" },
        { icon: Clock, color: "text-orange-600", title: "Fasting Tracker", description: "Monitor your fasting periods" },
      ]
    },
    {
      id: "analyze",
      title: "Analyze Your Data",
      items: [
        { icon: Dumbbell, color: "text-red-600", title: "Macro Breakdown", description: "Visualize your protein, fat, and carb intake" },
        { icon: Scale, color: "text-indigo-600", title: "Body Composition", description: "Analyze muscle mass, body water, and more" },
      ]
    },
    {
      id: "customize",
      title: "Customize Your Experience",
      items: [
        { icon: Utensils, color: "text-yellow-600", title: "Create Recipes", description: "Store and track your favorite meals" },
        { icon: Clock, color: "text-teal-600", title: "Custom Fasting Plans", description: "Design your own fasting schedules" },
      ]
    },
    {
      id: "discover",
      title: "Discover New Foods",
      items: [
        { icon: Database, color: "text-cyan-600", title: "Extensive Food Database", description: "Access over 3.5 million products worldwide" },
        { icon: Barcode, color: "text-pink-600", title: "Barcode Scanner", description: "Quickly add foods with our scanner" },
      ]
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Apple className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-600">Calomate</span>
        </Link>
        <nav>
          <Link href="/sign-in">
            <Button variant="default">Dashboard</Button>
          </Link>
        </nav>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.h1
            className="text-5xl font-bold mb-6 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Personal Nutrition Guide
          </motion.h1>
          <motion.p
            className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            CaloMate: Make informed choices, gain intuitive insights, and live a vibrant life. Join us on the path to a balanced, energized you!
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link href="/dashboard">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Get Started - It's Free!
              </Button>
            </Link>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Powerful Features for Your Health Journey</h2>
          {features.map((feature) => (
            <Card key={feature.id} className="mb-8 bg-transparent">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {feature.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <item.icon className={`h-10 w-10 ${item.color}`} />
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is Calomate really free?</AccordionTrigger>
              <AccordionContent>
                Yes, Calomate is completely free to use. We believe that everyone should have access to tools that help them lead healthier lives.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How accurate is the food database?</AccordionTrigger>
              <AccordionContent>
                Our food database contains over 3.5 million products worldwide and is regularly updated. While we strive for accuracy, we always recommend double-checking the information with the product packaging.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I sync Calomate with other fitness apps?</AccordionTrigger>
              <AccordionContent>
                Currently, Calomate operates as a standalone app. However, we're working on integrations with popular fitness trackers and apps. Stay tuned for updates!
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How does the fasting tracker work?</AccordionTrigger>
              <AccordionContent>
                Our fasting tracker allows you to select from a variety of preset fasting schedules or create your own custom plan. You can easily log your fasting periods and track your progress over time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my data safe with Calomate?</AccordionTrigger>
              <AccordionContent>
                We take data privacy very seriously. All your personal information and health data is encrypted and securely stored. We never share your data with third parties without your explicit consent.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Join Calomate Today</h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Start your journey to a healthier you with Calomate. It's completely free!
          </p>
          <div className="flex justify-center space-x-4">
            <Input className="max-w-xs bg-white" placeholder="Enter your email" type="email" />
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Get Started
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Calomate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
