import React, { useEffect, useState } from "react";
import ExerciseFilters from "@/components/exercise/exercise-filters";
import ExerciseCard from "@/components/exercise/exercise-card";
import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface ExercisesProps {
  setActiveTab: (tab: string) => void;
}

export default function Exercises({ setActiveTab }: ExercisesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 9;

  useEffect(() => {
    setActiveTab("exercises");
  }, [setActiveTab]);

  const { data: exercises, isLoading, refetch } = useQuery({
    queryKey: ['/api/exercises', searchQuery, selectedCategoryId],
    staleTime: 60000, // 1 minute
    queryFn: async () => {
      const baseUrl = '/api/exercises';
      let url = baseUrl;

      // Build the query params
      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (selectedCategoryId !== null) params.append('categoryId', selectedCategoryId.toString());
      
      // Add params to URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url = `${baseUrl}?${queryString}`;
      }

      // Use the apiRequest utility to fetch the data
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    // Refetch with the new search query
    refetch();
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    // Refetch with the new category
    refetch();
  };

  const totalPages = exercises ? Math.ceil(exercises.length / exercisesPerPage) : 0;

  const paginatedExercises = exercises 
    ? exercises.slice(
        (currentPage - 1) * exercisesPerPage,
        currentPage * exercisesPerPage
      )
    : [];

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
        selectedCategoryId={selectedCategoryId}
      />

      {/* Exercise grid */}
      {isLoading ? (
        <div className="text-center py-8">Loading exercises...</div>
      ) : paginatedExercises && paginatedExercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedExercises.map((exercise: Exercise) => (
            <ExerciseCard 
              key={exercise.id} 
              exercise={exercise} 
              onAddToWorkout={(id) => console.log("Add exercise to workout:", id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          No exercises found. Try adjusting your search or filters.
        </div>
      )}
      
      {/* Pagination */}
      {exercises && exercises.length > 0 && (
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
                Showing <span className="font-medium">{(currentPage - 1) * exercisesPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * exercisesPerPage, exercises.length)}
                </span>{" "}
                of <span className="font-medium">{exercises.length}</span> results
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
                
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, idx) => (
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
                ))}
                
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
