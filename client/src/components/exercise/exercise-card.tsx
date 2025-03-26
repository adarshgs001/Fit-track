import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, StarIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Exercise, ExerciseCategory } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface ExerciseCardProps {
  exercise: Exercise;
  onAddToWorkout?: (exerciseId: number) => void;
}

export default function ExerciseCard({ exercise, onAddToWorkout }: ExerciseCardProps) {
  const { data: categories } = useQuery({
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

  const rating = getRating();

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video bg-slate-100">
        <img 
          src={exercise.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"} 
          alt={exercise.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent flex items-end p-4">
          <span className="text-white font-medium">{exercise.name}</span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center text-xs text-slate-500 mb-2">
          <Badge variant="secondary" className="bg-indigo-100 text-primary px-2 py-0.5 rounded mr-2">
            {getCategoryName(exercise.categoryId)}
          </Badge>
          <Badge variant="outline" className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded mr-2">
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
        <p className="text-sm text-slate-600 line-clamp-2">{exercise.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <Link href={`/exercises/${exercise.id}`}>
            <Button variant="link" className="text-primary text-sm font-medium hover:text-indigo-700 px-0">
              View Details
            </Button>
          </Link>
          {onAddToWorkout && (
            <Button 
              onClick={() => onAddToWorkout(exercise.id)} 
              size="sm" 
              className="rounded-full p-1 w-8 h-8"
            >
              <PlusIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
