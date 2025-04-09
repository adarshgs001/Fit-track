import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowUpIcon, 
  CheckIcon, 
  ChevronLeftIcon, 
  FireIcon, 
  StarIcon,
  TimerIcon
} from "@/components/ui/icons";
import { Link } from "wouter";
import type { Exercise, ExerciseCategory } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define a type for recommendedWeightRanges
interface WeightRanges {
  beginner?: string;
  intermediate?: string;
  advanced?: string;
  [key: string]: string | undefined;
}

interface ExerciseDetailProps {
  setActiveTab: (tab: string) => void;
}

export default function ExerciseDetail({ setActiveTab }: ExerciseDetailProps) {
  const [, params] = useRoute("/exercises/:id");
  const exerciseId = params?.id ? parseInt(params.id) : 0;
  
  React.useEffect(() => {
    setActiveTab("exercises");
  }, [setActiveTab]);

  const { data: exercise, isLoading: isExerciseLoading } = useQuery<Exercise>({
    queryKey: [`/api/exercises/${exerciseId}`], 
    enabled: !!exerciseId
  });
  
  const { data: categories } = useQuery<ExerciseCategory[]>({
    queryKey: ['/api/exercise-categories'],
    staleTime: 3600000, // 1 hour
  });

  const getCategoryName = (categoryId: number) => {
    if (!categories) return "";
    const category = categories.find((cat: ExerciseCategory) => cat.id === categoryId);
    return category ? category.name : "";
  };

  // Calculate a mock rating based on exercise id
  const getRating = (id: number) => {
    const baseRating = 4;
    const decimal = (id % 10) / 10;
    return Math.min(5, baseRating + decimal);
  };

  if (isExerciseLoading) {
    return <div className="container py-6">Loading exercise details...</div>;
  }

  if (!exercise) {
    return (
      <div className="container py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Exercise not found</h2>
          <p className="text-slate-500 mb-6">The exercise you're looking for doesn't exist or has been removed.</p>
          <Link href="/exercises">
            <Button className="bg-primary text-white">Back to Exercises</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rating = getRating(exercise.id);
  const videoId = exercise.videoUrl ? new URL(exercise.videoUrl).searchParams.get('v') || 
                                     exercise.videoUrl.split('/').pop() : 
                                     null;

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <Link href="/exercises" className="inline-flex items-center text-primary font-medium">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Back to Exercises
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden bg-slate-100 aspect-video mb-4">
            <img 
              src={exercise.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"} 
              alt={exercise.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-indigo-100 text-primary">
              {getCategoryName(exercise.categoryId)}
            </Badge>
            <Badge variant="outline" className="bg-slate-100 text-slate-700">
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </Badge>
            {exercise.muscleGroups && exercise.muscleGroups.map((muscle, index) => (
              <Badge key={index} variant="outline" className="bg-slate-100 text-slate-700">
                {muscle}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">{exercise.name}</h1>
          
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <span className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon 
                  key={star} 
                  className={`${star <= Math.floor(rating) ? "text-amber-400" : "text-slate-300"} h-4 w-4`} 
                />
              ))}
              <span className="ml-2">{rating.toFixed(1)}</span>
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <FireIcon className="h-4 w-4 text-rose-500 mr-1" />
              {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
            </span>
          </div>
          
          <p className="text-slate-700 mb-6">{exercise.description}</p>
          
          <div className="mb-4">
            <h2 className="font-semibold mb-2">Target Muscle Groups</h2>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups && exercise.muscleGroups.map((muscle, index) => (
                <Badge key={index} className="bg-primary/10 text-primary">
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Calories Information */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <FireIcon className="h-4 w-4 text-rose-500 mr-2" />
                Calories Burned
              </div>
              <div className="text-xl font-bold text-slate-900">
                {exercise.caloriesBurnedPerMinute ? 
                  `${exercise.caloriesBurnedPerMinute * 30} cal/30min` : 
                  exercise.difficulty === "beginner" ? "100-150 cal/30min" :
                  exercise.difficulty === "intermediate" ? "150-250 cal/30min" :
                  "250-350 cal/30min"
                }
              </div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center text-sm font-medium text-slate-700 mb-1">
                <TimerIcon className="h-4 w-4 text-amber-500 mr-2" />
                Recommended Time
              </div>
              <div className="text-xl font-bold text-slate-900">
                {exercise.difficulty === "beginner" ? "20-30 min" :
                 exercise.difficulty === "intermediate" ? "30-45 min" :
                 "45-60 min"}
              </div>
            </div>
          </div>
          
          {/* Equipment and Weight Recommendations */}
          {exercise.equipment && (
            <div className="mb-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Equipment Needed</h3>
              <p className="text-slate-700">{exercise.equipment}</p>
            </div>
          )}
          
          {/* Weight Recommendation */}
          <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-800 mb-2">Recommended Weight</h3>
            {exercise.recommendedWeightRanges && typeof exercise.recommendedWeightRanges === 'object' ? (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-green-50 p-2 rounded border border-green-100 text-center">
                  <div className="text-green-700 font-medium">Beginner</div>
                  <div className="text-green-800 font-bold">
                    {(exercise.recommendedWeightRanges as WeightRanges).beginner || "Light"}
                  </div>
                </div>
                <div className="bg-amber-50 p-2 rounded border border-amber-100 text-center">
                  <div className="text-amber-700 font-medium">Intermediate</div>
                  <div className="text-amber-800 font-bold">
                    {(exercise.recommendedWeightRanges as WeightRanges).intermediate || "Medium"}
                  </div>
                </div>
                <div className="bg-red-50 p-2 rounded border border-red-100 text-center">
                  <div className="text-red-700 font-medium">Advanced</div>
                  <div className="text-red-800 font-bold">
                    {(exercise.recommendedWeightRanges as WeightRanges).advanced || "Heavy"}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-700">
                {exercise.difficulty === "beginner" 
                  ? "Start with lighter weights to focus on form and technique." 
                  : exercise.difficulty === "intermediate"
                  ? "Use moderate weights that allow you to complete 8-12 reps with good form."
                  : "Challenge yourself with heavier weights while maintaining proper form."}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="instructions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="video">Video Tutorial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="instructions" className="pt-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4">How to perform {exercise.name}</h2>
            <ol className="space-y-4 text-slate-700">
              {exercise.instructions.split('. ').filter(step => step.trim()).map((step, index) => (
                <li key={index} className="flex">
                  <span className="flex-shrink-0 flex items-center justify-center bg-primary text-white rounded-full w-6 h-6 mr-3 text-sm">
                    {index + 1}
                  </span>
                  <span>{step.trim()}{!step.endsWith('.') ? '.' : ''}</span>
                </li>
              ))}
            </ol>
            
            <div className="mt-6 bg-amber-50 p-4 rounded border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                <CheckIcon className="h-5 w-5 mr-2 text-amber-600" />
                Tips for Best Results
              </h3>
              <ul className="list-disc pl-5 text-amber-700 space-y-1">
                <li>Focus on maintaining proper form throughout the exercise</li>
                <li>Breathe out during the exertion phase</li>
                <li>Start with lighter weights to perfect your form</li>
                <li>If you feel pain (not muscle fatigue), stop immediately</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="video" className="pt-4">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4">Video Tutorial</h2>
            {videoId ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`${exercise.name} tutorial video`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-slate-100 rounded-lg">
                <p className="text-slate-500">No video tutorial available for this exercise</p>
              </div>
            )}
            <div className="mt-4 text-slate-600">
              <p className="text-sm">Video tutorials demonstrate proper form and technique to maximize effectiveness and prevent injury.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center my-8">
        <Button className="flex items-center bg-primary text-white">
          <ArrowUpIcon className="h-4 w-4 mr-2" />
          Add to Workout
        </Button>
      </div>
    </div>
  );
}