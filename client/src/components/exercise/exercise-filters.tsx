import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, 
  FilterIcon,
} from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";
import type { ExerciseCategory } from "@shared/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface ExerciseFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
  onDifficultyChange?: (difficulty: string | null) => void;
  onMuscleGroupChange?: (muscleGroup: string | null) => void;
  selectedDifficulty?: string | null;
  selectedMuscleGroup?: string | null;
}

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];
const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core", "Full Body"];

export default function ExerciseFilters({ 
  onSearch, 
  onCategoryChange, 
  selectedCategoryId,
  onDifficultyChange = () => {},
  onMuscleGroupChange = () => {},
  selectedDifficulty = null,
  selectedMuscleGroup = null
}: ExerciseFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  const { data: categories, isLoading } = useQuery<ExerciseCategory[]>({
    queryKey: ['/api/exercise-categories'],
    staleTime: 3600000, // 1 hour
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    onCategoryChange(categoryId === selectedCategoryId ? null : categoryId);
  };

  const handleDifficultySelect = (difficulty: string) => {
    onDifficultyChange(difficulty === selectedDifficulty ? null : difficulty);
  };

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    onMuscleGroupChange(muscleGroup === selectedMuscleGroup ? null : muscleGroup);
  };

  const clearAllFilters = () => {
    onCategoryChange(null);
    onDifficultyChange(null);
    onMuscleGroupChange(null);
    onSearch("");
    setSearchQuery("");
  };

  const activeFilterCount = 
    (selectedCategoryId ? 1 : 0) + 
    (selectedDifficulty ? 1 : 0) + 
    (selectedMuscleGroup ? 1 : 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Exercise Database</h1>
        <div className="flex space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative rounded-md shadow-sm flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-slate-500 sm:text-sm h-4 w-4" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 sm:text-sm border-slate-300 rounded-md"
              placeholder="Search exercises..."
            />
            <button type="submit" className="hidden">Search</button>
          </form>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative">
                <FilterIcon className="h-4 w-4 mr-1" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs h-5 min-w-5 px-1 absolute -top-2 -right-2">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Exercises</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500">Difficulty</DropdownMenuLabel>
                {DIFFICULTIES.map((difficulty) => (
                  <DropdownMenuItem 
                    key={difficulty} 
                    className={`${selectedDifficulty === difficulty ? 'bg-slate-100' : ''} cursor-pointer`}
                    onClick={() => handleDifficultySelect(difficulty)}
                  >
                    {difficulty}
                    {selectedDifficulty === difficulty && (
                      <span className="ml-auto text-xs text-slate-500">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500">Muscle Group</DropdownMenuLabel>
                {MUSCLE_GROUPS.map((muscleGroup) => (
                  <DropdownMenuItem 
                    key={muscleGroup} 
                    className={`${selectedMuscleGroup === muscleGroup ? 'bg-slate-100' : ''} cursor-pointer`}
                    onClick={() => handleMuscleGroupSelect(muscleGroup)}
                  >
                    {muscleGroup}
                    {selectedMuscleGroup === muscleGroup && (
                      <span className="ml-auto text-xs text-slate-500">✓</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-500 cursor-pointer" 
                onClick={clearAllFilters}
              >
                Clear all filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="text-sm text-slate-500">Active filters:</div>
          {selectedCategoryId && categories && (
            <Badge variant="outline" className="flex items-center gap-1">
              Category: {categories.find((c: ExerciseCategory) => c.id === selectedCategoryId)?.name}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onCategoryChange(null)}
              >
                ✕
              </button>
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="outline" className="flex items-center gap-1">
              Difficulty: {selectedDifficulty}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onDifficultyChange(null)}
              >
                ✕
              </button>
            </Badge>
          )}
          {selectedMuscleGroup && (
            <Badge variant="outline" className="flex items-center gap-1">
              Muscle Group: {selectedMuscleGroup}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onMuscleGroupChange(null)}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedCategoryId === null ? "default" : "outline"}
          className={`px-3 py-1.5 ${
            selectedCategoryId === null
              ? "border-primary text-primary bg-white hover:bg-indigo-50"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </Button>
        
        {isLoading ? (
          <div className="text-slate-500">Loading categories...</div>
        ) : (
          categories && categories.map((category: ExerciseCategory) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              className={`px-3 py-1.5 ${
                selectedCategoryId === category.id
                  ? "border-primary text-primary bg-white hover:bg-indigo-50"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
