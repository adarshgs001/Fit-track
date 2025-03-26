import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WaterTracker() {
  // Mock data for water intake
  const waterData = {
    current: 1.4, // liters
    goal: 2.5, // liters
    percentage: 56, // (1.4 / 2.5) * 100
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-blue-500 mr-2"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          Water Intake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pt-2">
          <div className="mb-6 flex justify-between text-sm">
            <div>
              <span className="text-3xl font-bold">{waterData.current}L</span>
              <div className="text-muted-foreground text-xs mt-1">of {waterData.goal}L goal</div>
            </div>
            <div className="text-right">
              <span className="text-xl font-semibold text-blue-500">{waterData.percentage}%</span>
              <div className="text-muted-foreground text-xs mt-1">completed</div>
            </div>
          </div>
          
          {/* Water visualization */}
          <div className="relative h-24 bg-blue-50 rounded-lg overflow-hidden">
            <div 
              className="absolute bottom-0 bg-blue-400/80 w-full rounded-b-lg transition-all duration-500 ease-in-out"
              style={{ height: `${waterData.percentage}%` }}
            >
              {/* Wave effect */}
              <div className="absolute inset-0 opacity-30">
                <svg 
                  viewBox="0 0 600 60" 
                  className="w-full absolute top-0 left-0"
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <path 
                    d="M0,30 C150,60 350,0 600,30 L600,60 L0,60 Z" 
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Water log buttons */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-1"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              +100ml
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="flex-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-1"
              >
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              +250ml
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}