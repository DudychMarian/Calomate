import { ReactNode } from 'react'
import { Apple } from 'lucide-react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Branding and information */}
      <div className="bg-green-600 text-white p-8 md:w-1/2 flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <Link href="/" className="flex items-center mb-8">
            <Apple className="h-12 w-12 mr-4" />
            <h1 className="text-4xl font-bold">Calomate</h1>
          </Link>
          <h2 className="text-2xl font-semibold mb-4">Your Personal Nutrition Guide</h2>
          <p className="mb-6">
            Join Calomate to start your journey towards a healthier lifestyle. Track your calories,
            monitor your macros, and achieve your fitness goals with ease.
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Track calories and macronutrients
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Access a database of over 3.5 million foods
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create custom recipes and meal plans
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Monitor your progress with detailed insights
            </li>
          </ul>
        </div>
      </div>

      {/* Right side - Auth component */}
      <div className="bg-white md:w-1/2 flex items-center justify-center m-auto mt-8 mb-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}