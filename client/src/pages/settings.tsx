import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  Lock,
  User,
  Shield,
  Smartphone,
  Globe,
  PieChart,
  Moon,
  ThumbsUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SettingsProps {
  setActiveTab: (tab: string) => void;
}

export default function Settings({ setActiveTab }: SettingsProps) {
  useEffect(() => {
    setActiveTab("settings");
  }, [setActiveTab]);

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/users/1'],
    staleTime: 60000, // 1 minute
  });

  // State for form fields
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    workoutReminders: true,
    weeklyReports: true,
    achievements: true
  });
  
  // Update form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your new password and confirmation match.",
        variant: "destructive"
      });
      return;
    }
    
    // Password change would be implemented here with actual API
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully."
    });
    
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleEmailChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Email change would be implemented here with actual API
    toast({
      title: "Email updated",
      description: "Your email has been changed successfully."
    });
  };

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved."
    });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading settings...</div>;
  }

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your account information and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue={user?.username} />
                </div>
              </div>
              
              <form onSubmit={handleEmailChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit">Update Email</Button>
              </form>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea 
                  id="bio" 
                  className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Fitness enthusiast focused on building strength and endurance. I love running and weightlifting."
                />
              </div>
              
              <Button>Save Profile</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-500">
                <Shield className="mr-2 h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanent actions that cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-destructive/20 p-4 bg-destructive/10">
                <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All your data will be permanently removed.
                </p>
                <Button variant="destructive" className="mt-4">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Password
              </CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">Update Password</Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="mr-2 h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account with 2FA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                When 2FA is enabled, you'll be required to enter a code from your authenticator app each time you sign in.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Active Sessions
              </CardTitle>
              <CardDescription>
                Manage your active sessions across devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Chrome on Windows</p>
                    <p className="text-sm text-muted-foreground">Current device • Last active just now</p>
                  </div>
                  <Button variant="outline" size="sm">Current</Button>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Safari on iPhone</p>
                    <p className="text-sm text-muted-foreground">Last active yesterday</p>
                  </div>
                  <Button variant="outline" size="sm">Sign Out</Button>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">Sign Out All Devices</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when we contact you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-lg font-medium">Notification Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="emailNotifications" 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('email', checked as boolean)
                      } 
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">{user?.email}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pushNotifications" 
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        handleNotificationChange('push', checked as boolean)
                      }
                    />
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">Browser</span>
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Notification Types</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="workoutReminders" 
                    checked={notifications.workoutReminders}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('workoutReminders', checked as boolean)
                    }
                  />
                  <Label htmlFor="workoutReminders">Workout Reminders</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="weeklyReports" 
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('weeklyReports', checked as boolean)
                    }
                  />
                  <Label htmlFor="weeklyReports">Weekly Progress Reports</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="achievements" 
                    checked={notifications.achievements}
                    onCheckedChange={(checked) => 
                      handleNotificationChange('achievements', checked as boolean)
                    }
                  />
                  <Label htmlFor="achievements">Achievement Notifications</Label>
                </div>
              </div>
              
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Preferences Settings */}
        <TabsContent value="preferences" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Moon className="mr-2 h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how FitTrack looks for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="darkMode" 
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
                <Label htmlFor="darkMode">Dark Mode</Label>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className={!darkMode ? "ring-2 ring-primary" : ""}>
                  Light
                </Button>
                <Button variant="outline" className={darkMode ? "ring-2 ring-primary" : ""}>
                  Dark
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="mr-2 h-5 w-5" />
                Units & Measurements
              </CardTitle>
              <CardDescription>
                Set your preferred measurement units.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weightUnit">Weight Units</Label>
                <select 
                  id="weightUnit" 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="kg"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="heightUnit">Height Units</Label>
                <select 
                  id="heightUnit" 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="cm"
                >
                  <option value="cm">Centimeters (cm)</option>
                  <option value="ft">Feet/Inches (ft)</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="distanceUnit">Distance Units</Label>
                <select 
                  id="distanceUnit" 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  defaultValue="km"
                >
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                </select>
              </div>
              
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ThumbsUp className="mr-2 h-5 w-5" />
                Feedback
              </CardTitle>
              <CardDescription>
                Help us improve FitTrack by sharing your thoughts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedback">Your Feedback</Label>
                <textarea 
                  id="feedback" 
                  className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Share your suggestions or report issues..."
                />
              </div>
              <Button>Submit Feedback</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}