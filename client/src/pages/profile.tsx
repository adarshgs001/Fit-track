import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Settings, Edit, Camera } from "lucide-react";
import ProgressChart from "@/components/progress/progress-chart";

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export default function Profile({ setActiveTab }: ProfileProps) {
  useEffect(() => {
    setActiveTab("profile");
  }, [setActiveTab]);

  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['/api/users/1'],
    staleTime: 60000, // 1 minute
  });

  // Fetch user stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['/api/users/1/stats'],
    staleTime: 60000, // 1 minute
  });

  if (isLoadingUser || isLoadingStats) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Profile info */}
        <div className="col-span-1">
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="absolute bottom-0 right-0 h-8 w-8 rounded-full p-0">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="mt-4">{user?.name}</CardTitle>
                <CardDescription>@{user?.username}</CardDescription>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="outline">Fitness Enthusiast</Badge>
                  <Badge variant="outline">Runner</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p>{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Member since</h3>
                  <p>March 2025</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    Fitness enthusiast focused on building strength and endurance. 
                    I love running and weightlifting. Looking to improve my overall fitness and health.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Stats Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Workouts completed</span>
                  <span className="font-bold">{stats?.workoutsCompleted || 24}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Current streak</span>
                  <span className="font-bold">{stats?.currentStreak || 5} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Longest streak</span>
                  <span className="font-bold">{stats?.longestStreak || 14} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total calories burned</span>
                  <span className="font-bold">{stats?.totalCaloriesBurned || 12500} kcal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Detailed information */}
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weight Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ProgressChart 
                      userId={1} 
                      title="Weight Progress" 
                      dataKey="weight" 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Body Fat Percentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ProgressChart 
                      userId={1} 
                      title="Body Fat" 
                      dataKey="bodyFat" 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Track your fitness milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="m12 15 2 2 4-4"></path><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2Z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">First Week Complete</h3>
                        <p className="text-sm text-gray-500">Completed your first week of workouts</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M8.21 13.89 7 23l-2-7-7-2 9.11-1.21a1 1 0 0 1 1.1 1.1Z"></path><path d="M14.7 13.8 17 23l2-7 7-2-9.41-1.29a1 1 0 0 0-1.09 1.09Z"></path><path d="M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">5K Run Completed</h3>
                        <p className="text-sm text-gray-500">Finished your first 5K run</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><circle cx="12" cy="12" r="10"></circle><path d="m9 12 2 2 4-4"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium">100 lb Bench Press</h3>
                        <p className="text-sm text-gray-500">Reached 100 lb bench press milestone</p>
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 flex items-center space-x-4 bg-gray-50">
                      <div className="bg-gray-200 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M10.7 13.7a49.4 49.4 0 0 0-3.4-3.4 5.5 5.5 0 0 1 7.8-7.8 49.4 49.4 0 0 0-3.4-3.4 1 1 0 0 0-1.4 0L7.5 2a1 1 0 0 0 0 1.4l3.2 3.2Z"></path><path d="m2 19.5 9.9-9.9"></path><path d="M9.1 8.1 16 15"></path><path d="m15 16 7 7"></path></svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">10-Day Streak</h3>
                        <p className="text-sm text-gray-500">Complete workouts for 10 days in a row</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={user?.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue={user?.username} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue="Fitness enthusiast focused on building strength and endurance. I love running and weightlifting. Looking to improve my overall fitness and health."
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" type="number" defaultValue="178" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" type="number" defaultValue="75" />
                    </div>
                  </div>
                  <Button className="w-full">Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}