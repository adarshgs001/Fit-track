import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, FilterIcon } from "@/components/ui/icons";
import { useQuery } from "@tanstack/react-query";
import type { ExerciseCategory } from "@shared/schema";

interface ExerciseFiltersProps {
  onSearch: (query: string) => void;
  onCategoryChange: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

export default function ExerciseFilters({ 
  onSearch, 
  onCategoryChange, 
  selectedCategoryId 
}: ExerciseFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categories, isLoading } = useQuery({
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
          <Button 
            variant="outline" 
            className="inline-flex justify-center w-full rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <FilterIcon className="h-4 w-4 mr-1" />
            Filter
          </Button>
        </div>
      </div>

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
