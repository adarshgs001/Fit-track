import React, { useEffect, useState } from "react";
import ExerciseFilters from "@/components/exercise/exercise-filters";
import ExerciseCard from "@/components/exercise/exercise-card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import { useExercise } from "@/contexts/ExerciseContext";
import { useWorkout } from "@/contexts/WorkoutContext";
import { useToast } from "@/hooks/use-toast";

interface ExercisesProps {
  setActiveTab: (tab: string) => void;
}

export default function Exercises({ setActiveTab }: ExercisesProps) {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  // Use the ExerciseContext instead of direct queries
  const { 
    filters, 
    filteredExercises, 
    setFilters, 
    resetFilters,
    isLoading 
  } = useExercise();

  // Get addExerciseToWorkout from WorkoutContext
  const { addExerciseToWorkout, activeWorkout } = useWorkout();

  useEffect(() => {
    setActiveTab("exercises");
  }, [setActiveTab]);

  // Handle adding exercise to workout
  const handleAddToWorkout = (exerciseId: number) => {
    if (!activeWorkout) {
      toast({
        title: "No active workout",
        description: "Please select or create a workout first.",
        variant: "destructive"
      });
      return;
    }

    // Add the exercise to the active workout
    addExerciseToWorkout(activeWorkout.id, exerciseId);
    toast({
      title: "Exercise added",
      description: "The exercise has been added to your workout."
    });
  };

  // Handle search change
  const handleSearch = (query: string) => {
    setFilters({ query });
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (categoryId: number | null) => {
    setFilters({ categoryId: categoryId || undefined });
    setCurrentPage(1);
  };
  
  // Handle difficulty change
  const handleDifficultyChange = (difficulty: string | null) => {
    setFilters({ difficulty: difficulty || undefined });
    setCurrentPage(1);
  };
  
  // Handle muscle group change
  const handleMuscleGroupChange = (muscleGroup: string | null) => {
    setFilters({ muscleGroup: muscleGroup || undefined });
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = filteredExercises.length > 0 
    ? Math.ceil(filteredExercises.length / exercisesPerPage) 
    : 0;

  // Get current page exercises
  const paginatedExercises = filteredExercises.slice(
    (currentPage - 1) * exercisesPerPage,
    currentPage * exercisesPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <ExerciseFilters
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategoryId={filters.categoryId || null}
        onDifficultyChange={handleDifficultyChange}
        onMuscleGroupChange={handleMuscleGroupChange}
        selectedDifficulty={filters.difficulty || null}
        selectedMuscleGroup={filters.muscleGroup || null}
      />

      {/* Exercise grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading exercises...</div>
      ) : paginatedExercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedExercises.map(exercise => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onAddToWorkout={handleAddToWorkout}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p>No exercises found. Try adjusting your search or filters.</p>
          {(filters.difficulty || filters.muscleGroup || filters.categoryId) && (
            <Button
              variant="link"
              className="mt-2 text-primary"
              onClick={() => {
                resetFilters();
                setCurrentPage(1);
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {filteredExercises.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button 
              variant="outline" 
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              disabled={currentPage === totalPages}
              onClick={handleNextPage}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700">
                Showing <span className="font-medium">{filteredExercises.length > 0 ? (currentPage - 1) * exercisesPerPage + 1 : 0}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * exercisesPerPage, filteredExercises.length)}
                </span>{" "}
                of <span className="font-medium">{filteredExercises.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button 
                  variant="outline" 
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
                
                {/* Page numbers - limit to 5 pages for better UI */}
                {totalPages <= 5 ? (
                  // If 5 or fewer pages, show all
                  [...Array(totalPages)].map((_, idx) => (
                    <Button 
                      key={idx}
                      variant={currentPage === idx + 1 ? "default" : "outline"}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                        ${currentPage === idx + 1 
                          ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" 
                          : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                        }`}
                      onClick={() => setCurrentPage(idx + 1)}
                    >
                      {idx + 1}
                    </Button>
                  ))
                ) : (
                  // If more than 5 pages, show current, 2 before and 2 after if possible
                  [...Array(totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    // Only show first, last, current and neighbors
                    const showPage = 
                      pageNumber === 1 || 
                      pageNumber === totalPages || 
                      Math.abs(pageNumber - currentPage) <= 1;
                    
                    if (!showPage) {
                      // Show ellipsis for skipped pages
                      if (pageNumber === 2 || pageNumber === totalPages - 1) {
                        return (
                          <span 
                            key={idx}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <Button 
                        key={idx}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold 
                          ${currentPage === pageNumber
                            ? "z-10 bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" 
                            : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                          }`}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })
                )}
                
                <Button 
                  variant="outline" 
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
