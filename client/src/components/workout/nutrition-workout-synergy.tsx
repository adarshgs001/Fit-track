import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NutritionWorkoutSynergy() {
  // Mock data for nutrition recommendations
  const recommendations = [
    {
      id: 1,
      type: "pre_workout",
      title: "Pre-Workout Meal",
      timeFrame: "1-2 hours before",
      description: "Complex carbs and moderate protein to fuel your workout",
      items: [
        { name: "Oatmeal with banana", protein: 8, carbs: 45, fat: 5 },
        { name: "Greek yogurt with berries", protein: 15, carbs: 20, fat: 0 },
        { name: "Whole grain toast with eggs", protein: 12, carbs: 25, fat: 8 }
      ]
    },
    {
      id: 2,
      type: "post_workout",
      title: "Post-Workout Recovery",
      timeFrame: "30-60 minutes after",
      description: "Protein and fast-digesting carbs to repair muscles and replenish glycogen",
      items: [
        { name: "Protein shake with banana", protein: 25, carbs: 30, fat: 2 },
        { name: "Chicken and sweet potato", protein: 30, carbs: 40, fat: 5 },
        { name: "Salmon and quinoa bowl", protein: 28, carbs: 35, fat: 12 }
      ]
    },
    {
      id: 3,
      type: "hydration",
      title: "Workout Hydration",
      timeFrame: "During exercise",
      description: "Stay hydrated to maintain performance and prevent fatigue",
      items: [
        { name: "Water (16-20 oz/hour)", quantity: "16-20 oz/hour" },
        { name: "Electrolyte drink (for intense workouts)", quantity: "8-12 oz/hour" },
        { name: "Coconut water", quantity: "8-12 oz post-workout" }
      ]
    }
  ];

  // Function to determine badge color based on recommendation type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "pre_workout":
        return "bg-blue-100 text-blue-800";
      case "post_workout":
        return "bg-emerald-100 text-emerald-800";
      case "hydration":
        return "bg-cyan-100 text-cyan-800";
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
              className="h-5 w-5 text-green-500 mr-2"
            >
              <path d="m2.27 21.7 9.98-3.73c.49-.18 1.02-.19 1.5 0l7.98 2.99a.84.84 0 0 0 1.13-.83V4.67a.84.84 0 0 0-1.13-.83l-7.98 2.99c-.48.19-1.01.18-1.5 0L2.27 3.1a.84.84 0 0 0-1.13.83v16.95c0 .62.66 1.03 1.13.82Z" />
              <path d="M12 12v9" />
            </svg>
            Nutrition & Workout Synergy
          </div>
          <Badge className="bg-green-100 text-green-800">
            Today's Plan
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="border-b border-slate-100 p-3">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-sm">{rec.title}</h3>
                  <Badge className={getTypeColor(rec.type)}>
                    {rec.timeFrame}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{rec.description}</p>
              </div>
              
              <div className="p-3 bg-slate-50">
                <h4 className="text-xs font-medium text-slate-700 mb-2">Recommended Options:</h4>
                <div className="space-y-2">
                  {rec.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-2 rounded border border-slate-100 text-sm flex justify-between items-center"
                    >
                      <span>{item.name}</span>
                      
                      {item.protein !== undefined && (
                        <div className="flex gap-2 text-xs">
                          <span className="text-blue-700">{item.protein}g P</span>
                          <span className="text-amber-700">{item.carbs}g C</span>
                          <span className="text-red-700">{item.fat}g F</span>
                        </div>
                      )}
                      
                      {item.quantity && (
                        <span className="text-xs text-slate-500">{item.quantity}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 border-t border-slate-100 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs mr-2"
                >
                  See All Options
                </Button>
                <Button 
                  size="sm" 
                  className="text-xs"
                >
                  Add to Meal Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}