import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, StarIcon, FireIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Exercise, ExerciseCategory } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define a type for recommendedWeightRanges
interface WeightRanges {
  beginner?: string;
  intermediate?: string;
  advanced?: string;
  [key: string]: string | undefined;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onAddToWorkout?: (exerciseId: number) => void;
}

export default function ExerciseCard({ exercise, onAddToWorkout }: ExerciseCardProps) {
  const { data: categories } = useQuery<ExerciseCategory[]>({
    queryKey: ['/api/exercise-categories'],
    staleTime: 3600000, // 1 hour
  });

  const getCategoryName = (categoryId: number) => {
    if (!categories) return "";
    const category = categories.find((cat: ExerciseCategory) => cat.id === categoryId);
    return category ? category.name : "";
  };

  // Calculate a mock rating based on exercise id to simulate visual design
  const getRating = () => {
    const baseRating = 4;
    const decimal = (exercise.id % 10) / 10;
    return Math.min(5, baseRating + decimal);
  };
  
  // Get difficulty color
  const getDifficultyColor = () => {
    const difficulty = exercise.difficulty.toLowerCase();
    switch(difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-amber-100 text-amber-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };
  
  // Get estimated calories burned per 30 min session
  const getEstimatedCalories = () => {
    if (exercise.caloriesBurnedPerMinute) {
      return exercise.caloriesBurnedPerMinute * 30;
    }
    
    // If not provided, estimate based on difficulty
    const difficulty = exercise.difficulty.toLowerCase();
    switch(difficulty) {
      case 'beginner':
        return 100 + (exercise.id % 50);
      case 'intermediate':
        return 150 + (exercise.id % 100);
      case 'advanced':
        return 200 + (exercise.id % 150);
      default:
        return 100;
    }
  };

  const rating = getRating();
  const difficultyClass = getDifficultyColor();
  const estimatedCalories = getEstimatedCalories();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer group">
      <Link href={`/exercises/${exercise.id}`}>
        <div className="relative aspect-video bg-slate-100 overflow-hidden">
          <img 
            src={exercise.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"} 
            alt={exercise.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
            <span className="text-white font-medium">{exercise.name}</span>
          </div>
          
          {exercise.videoUrl && (
            <div className="absolute top-3 right-3 bg-white/80 rounded-full p-1.5 shadow-sm">
              <svg 
                className="w-4 h-4 text-red-600" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
              </svg>
            </div>
          )}
          
          {/* Calories badge */}
          <div className="absolute bottom-3 right-3 flex items-center bg-black/60 text-white px-2 py-0.5 rounded-full text-xs">
            <FireIcon className="h-3 w-3 text-red-400 mr-1" />
            <span>{estimatedCalories} cal/30min</span>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex items-center text-xs text-slate-500 mb-2">
          <Badge variant="secondary" className="bg-indigo-100 text-primary px-2 py-0.5 rounded mr-2">
            {getCategoryName(exercise.categoryId)}
          </Badge>
          <Badge variant="outline" className={`${difficultyClass} px-2 py-0.5 rounded mr-2`}>
            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
          </Badge>
          <span className="flex items-center ml-auto">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon 
                key={star} 
                className={`${star <= Math.floor(rating) ? "text-amber-400" : "text-slate-300"} text-xs h-3 w-3`} 
              />
            ))}
          </span>
        </div>
        
        <Link href={`/exercises/${exercise.id}`}>
          <p className="text-sm text-slate-600 line-clamp-2 hover:text-slate-900 transition-colors">{exercise.description}</p>
        </Link>
        
        {exercise.equipment && (
          <div className="mt-2 text-xs text-slate-500">
            <span className="font-medium">Equipment:</span> {exercise.equipment}
          </div>
        )}
        
        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {exercise.muscleGroups.map((muscle, idx) => (
              <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                {muscle}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <Link href={`/exercises/${exercise.id}`}>
            <Button variant="link" className="text-primary text-sm font-medium hover:text-indigo-700 px-0 group-hover:underline">
              View Details
            </Button>
          </Link>
          {onAddToWorkout ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToWorkout(exercise.id);
                    }} 
                    size="sm" 
                    className="rounded-full p-1 w-8 h-8"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to workout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Badge variant="outline" className="text-xs">
              {exercise.recommendedWeightRanges && typeof exercise.recommendedWeightRanges === 'object' ? 
                `${(exercise.recommendedWeightRanges as WeightRanges)[exercise.difficulty.toLowerCase()] || 'Custom weight'}` : 
                (exercise.difficulty === "beginner" ? "Light weight" : 
                 exercise.difficulty === "intermediate" ? "Moderate weight" : 
                 "Heavy weight")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
