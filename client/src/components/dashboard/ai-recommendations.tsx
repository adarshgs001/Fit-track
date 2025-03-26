import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AIRecommendations() {
  // Mock data for AI recommendations
  const recommendations = [
    {
      id: 1,
      type: "workout",
      title: "Try HIIT Training",
      description: "Your fitness level suggests you're ready for high-intensity interval training. Try adding 2 HIIT sessions per week.",
      tags: ["cardio", "advanced"]
    },
    {
      id: 2,
      type: "nutrition",
      title: "Increase Protein Intake",
      description: "Based on your goals, consider increasing your protein intake by 15g daily to support muscle growth.",
      tags: ["protein", "muscle-gain"]
    },
    {
      id: 3,
      type: "recovery",
      title: "Add Active Recovery",
      description: "Your training intensity is high. Add light activity on rest days to improve recovery.",
      tags: ["recovery", "mobility"]
    }
  ];

  // Determine badge color based on recommendation type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "workout":
        return "bg-indigo-100 text-indigo-800";
      case "nutrition":
        return "bg-emerald-100 text-emerald-800";
      case "recovery":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-800";
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
              className="h-5 w-5 text-purple-500 mr-2"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            AI Recommendations
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            New
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border border-slate-100 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{rec.title}</h3>
                <Badge className={getBadgeColor(rec.type)}>
                  {rec.type}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
              <div className="flex gap-1">
                {rec.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-slate-100 text-slate-600 text-xs py-0.5 px-2 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          <Button size="sm" className="w-full mt-2 text-sm">
            Get More Recommendations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}