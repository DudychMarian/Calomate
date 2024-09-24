"use client";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart2, User, Timer, Settings, LogOut } from "lucide-react"
import DateSwitch from './DateSwitch'
import Link from 'next/link'
import { useClerk } from '@clerk/nextjs';

export const Navbar = () => {
  const { signOut } = useClerk();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/">
          <h1 className="text-2xl font-bold">Calomate</h1>
        </Link>
        <DateSwitch />
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
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