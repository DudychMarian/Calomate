"use client";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart2, User, Timer, Settings, LogOut, Utensils, Apple } from "lucide-react"
import DateSwitch from './DateSwitch'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs';

export const Navbar = () => {
  const { signOut } = useClerk();

  return (
    <nav className="border-b border-green-700 bg-green-600 text-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/dashboard" className='flex items-center space-x-2'>
          <Apple className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Calomate</h1>
        </Link>
        <DateSwitch />
        <div className="flex items-center space-x-4">
          <Link href="/recipes">
            <Button variant="ghost" size="sm" className='transition-colors duration-200 hover:bg-green-700 hover:text-white'>
              <Utensils className="w-5 h-5 mr-2" />
              Recipes
            </Button></Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='transition-colors duration-200 hover:bg-green-700 hover:text-white'>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/settings">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="focus:bg-red-100 focus:text-red-600 transition-colors duration-200" onClick={() => signOut()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}