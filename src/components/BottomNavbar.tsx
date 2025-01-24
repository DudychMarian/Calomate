"use client";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Utensils, Apple } from "lucide-react"
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs';

export const BottomNavbar = () => {
  const { signOut } = useClerk();

  return (
    <nav className="border-t border-green-700 bg-green-600 text-white fixed bottom-0 w-full md:hidden">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between flex-col gap-4 md:flex-row md:gap-0">
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