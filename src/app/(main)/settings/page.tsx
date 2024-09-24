"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

//@ts-ignore
const iconList = Object.keys(Icons).filter(key => typeof Icons[key] === 'function' && key !== 'default')

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [userData, setUserData] = useState({
    mainGoal: "Lose weight",
    sex: "Female",
    additionalGoals: ["Improve my relationship with food", "Sleep better and have more energy"],
    countedCalories: "Yes",
    birthday: "1990-01-01",
    height: "170",
    heightUnit: "cm",
    activityLevel: "Moderately active",
    currentWeight: "70",
    weightUnit: "kg",
    goalWeight: "65",
    diet: "Classic",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatar: {
      icon: "User",
      color: "#3498db"
    },
    notifications: {
      email: true,
      push: false
    },
    privacySettings: {
      profileVisibility: "friends",
      activitySharing: true
    },
    language: "English",
    timezone: "UTC+0",
    measurementSystem: "Metric"
  })

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (field: any, value: any) => {
    setUserData(prev => ({
      ...prev,
      avatar: { ...prev.avatar, [field]: value }
    }))
  }

  const handleNotificationChange = (field: any, value: any) => {
    setUserData(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [field]: value }
    }))
  }

  const handlePrivacyChange = (field: any, value: any) => {
    setUserData(prev => ({
      ...prev,
      privacySettings: { ...prev.privacySettings, [field]: value }
    }))
  }

  const handleSave = () => {
    // Here you would typically send the userData to your backend
    console.log("Saving user data:", userData)
  }

  const handlePasswordChange = () => {
    // Implement password change logic here
    console.log("Changing password")
  }

  const handleReportDownload = (days: any) => {
    // Implement report download logic here
    console.log(`Downloading report for last ${days} days`)
  }

  // @ts-ignore
  const SelectedIcon = Icons[userData.avatar.icon]

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="${userData.avatar.color}"/><text x="50" y="50" font-family="Arial" font-size="50" fill="white" text-anchor="middle" dy=".3em">${userData.name.charAt(0)}</text></svg>`} />
                  <AvatarFallback><SelectedIcon className="h-10 w-10" /></AvatarFallback>
                </Avatar>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Customize Avatar</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="avatarIcon">Icon</Label>
                          <Select
                            value={userData.avatar.icon}
                            onValueChange={(value) => handleAvatarChange('icon', value)}
                          >
                            <SelectTrigger id="avatarIcon">
                              <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-72">
                                {iconList.map((icon) => (
                                  <SelectItem key={icon} value={icon}>
                                    {icon}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="avatarColor">Color</Label>
                          <Input
                            id="avatarColor"
                            type="color"
                            value={userData.avatar.color}
                            onChange={(e) => handleAvatarChange('color', e.target.value)}
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="mainGoal">Main Goal</Label>
                <Select name="mainGoal" value={userData.mainGoal} onValueChange={(value) => setUserData(prev => ({ ...prev, mainGoal: value }))}>
                  <SelectTrigger id="mainGoal">
                    <SelectValue placeholder="Select your main goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lose weight">Lose weight</SelectItem>
                    <SelectItem value="Maintain weight">Maintain weight</SelectItem>
                    <SelectItem value="Gain weight">Gain weight</SelectItem>
                    <SelectItem value="Build muscle">Build muscle</SelectItem>
                    <SelectItem value="Something else">Something else</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sex">Sex</Label>
                <RadioGroup id="sex" name="sex" value={userData.sex} onValueChange={(value) => setUserData(prev => ({ ...prev, sex: value }))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="birthday">Birthday</Label>
                <Input type="date" id="birthday" name="birthday" value={userData.birthday} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="height">Height ({userData.heightUnit})</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" id="height" name="height" value={userData.height} onChange={handleInputChange} />
                  <Select name="heightUnit" value={userData.heightUnit} onValueChange={(value) => setUserData(prev => ({ ...prev, heightUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="ft">ft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="currentWeight">Current Weight ({userData.weightUnit})</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" id="currentWeight" name="currentWeight" value={userData.currentWeight} onChange={handleInputChange} />
                  <Select name="weightUnit" value={userData.weightUnit} onValueChange={(value) => setUserData(prev => ({ ...prev, weightUnit: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="lb">lb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="goalWeight">Goal Weight ({userData.weightUnit})</Label>
                <Input type="number" id="goalWeight" name="goalWeight" value={userData.goalWeight} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select name="activityLevel" value={userData.activityLevel} onValueChange={(value) => setUserData(prev => ({ ...prev, activityLevel: value }))}>
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Light active">Light active</SelectItem>
                    <SelectItem value="Moderately active">Moderately active</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Very active">Very active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="diet">Diet</Label>
                <Select name="diet" value={userData.diet} onValueChange={(value) => setUserData(prev => ({ ...prev, diet: value }))}>
                  <SelectTrigger id="diet">
                    <SelectValue placeholder="Select your diet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Classic">Classic</SelectItem>
                    <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div>
                <Label>Download Calorie Report</Label>
                <div className="flex space-x-2 mt-2">
                  {[7, 30, 90, 180, 365].map(days => (
                    <Button key={days} variant="outline" onClick={() => handleReportDownload(days)}>
                      Last {days} days
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Close Account</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  To close your account, please send an email to dudych@proton.me
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePasswordChange}>Change Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your app experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select name="language" value={userData.language} onValueChange={(value) => setUserData(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Select name="timezone" value={userData.timezone} onValueChange={(value) => setUserData(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+0">UTC+0</SelectItem>
                    <SelectItem value="UTC-5">UTC-5 (Eastern Time)</SelectItem>
                    <SelectItem value="UTC-8">UTC-8 (Pacific Time)</SelectItem>
                    <SelectItem value="UTC+1">UTC+1 (Central European Time)</SelectItem>
                    <SelectItem value="UTC+8">UTC+8 (China Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="measurementSystem">Measurement System</Label>
                <Select name="measurementSystem" value={userData.measurementSystem} onValueChange={(value) => setUserData(prev => ({ ...prev, measurementSystem: value }))}>
                  <SelectTrigger id="measurementSystem">
                    <SelectValue placeholder="Select measurement system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Metric">Metric</SelectItem>
                    <SelectItem value="Imperial">Imperial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={userData.notifications.email}
                  onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <Switch
                  id="pushNotifications"
                  checked={userData.notifications.push}
                  onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy</CardTitle>
              <CardDescription>Manage your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  name="profileVisibility"
                  value={userData.privacySettings.profileVisibility}
                  onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                >
                  <SelectTrigger id="profileVisibility">
                    <SelectValue placeholder="Select profile visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends Only</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="activitySharing">Activity Sharing</Label>
                <Switch
                  id="activitySharing"
                  checked={userData.privacySettings.activitySharing}
                  onCheckedChange={(checked) => handlePrivacyChange('activitySharing', checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}