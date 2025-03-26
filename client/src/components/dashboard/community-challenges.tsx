import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CommunityChallenges() {
  // Mock data for community challenges
  const challenges = [
    {
      id: 1,
      title: "April 10k Run Challenge",
      participants: 1247,
      joined: true,
      progress: 80,
      duration: "April 1-30",
      status: "in-progress"
    },
    {
      id: 2,
      title: "30 Days of Yoga",
      participants: 857,
      joined: false,
      duration: "May 1-30",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Clean Eating Week",
      participants: 712,
      joined: false,
      duration: "April 15-22",
      status: "upcoming"
    }
  ];

  // Function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "upcoming":
        return <Badge className="bg-amber-100 text-amber-800">Upcoming</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800">{status}</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-amber-500 mr-2"
            >
              <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
              <path d="M7 7h.01" />
            </svg>
            Community Challenges
          </div>
          <Button variant="outline" size="sm" className="text-xs">
            Find More
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="flex items-start gap-3 border-b border-slate-100 pb-3 last:border-0">
              <div className="flex-shrink-0 bg-gradient-to-br from-amber-200 to-amber-400 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {challenge.id}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <h3 className="font-medium text-sm">{challenge.title}</h3>
                  {getStatusBadge(challenge.status)}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <span>{challenge.duration}</span>
                  <span className="mx-2">•</span>
                  <span>{challenge.participants.toLocaleString()} participants</span>
                </div>
                
                {challenge.joined && challenge.status === "in-progress" && (
                  <div className="mt-2 bg-blue-50 rounded p-2 text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-blue-800 font-medium">Your progress</span>
                      <span className="text-blue-800 font-medium">{challenge.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-blue-100 rounded overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded" 
                        style={{ width: `${challenge.progress}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {!challenge.joined && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 h-7 text-xs w-full"
                  >
                    Join Challenge
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}