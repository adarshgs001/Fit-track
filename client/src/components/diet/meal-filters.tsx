import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon, 
  FilterIcon,
  CalendarIcon,
  FoodIcon,
  FireIcon,
  ProteinIcon,
  CarbsIcon,
  FatIcon
} from "@/components/ui/icons";
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
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface MealFiltersProps {
  onSearch: (query: string) => void;
  onMealTypeChange: (mealType: string | null) => void;
  onDateChange: (date: Date | null) => void;
  onCaloriesChange: (range: [number, number]) => void;
  onNutrientFilterChange: (type: string, range: [number, number]) => void;
  selectedMealType: string | null;
  selectedDate: Date | null;
  caloriesRange: [number, number];
  proteinRange: [number, number];
  carbsRange: [number, number];
  fatRange: [number, number];
}

const MEAL_TYPES = [
  "Breakfast", 
  "Lunch", 
  "Dinner", 
  "Snack", 
  "Pre-Workout", 
  "Post-Workout",
  "High Protein",
  "Low Carb",
  "Vegetarian",
  "Vegan"
];

export default function MealFilters({
  onSearch,
  onMealTypeChange,
  onDateChange,
  onCaloriesChange,
  onNutrientFilterChange,
  selectedMealType,
  selectedDate,
  caloriesRange,
  proteinRange,
  carbsRange,
  fatRange
}: MealFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllMealTypes, setShowAllMealTypes] = useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleMealTypeClick = (mealType: string | null) => {
    onMealTypeChange(mealType === selectedMealType ? null : mealType);
  };

  const handleClearAllFilters = () => {
    onSearch("");
    setSearchQuery("");
    onMealTypeChange(null);
    onDateChange(null);
    onCaloriesChange([0, 1000]);
    onNutrientFilterChange("protein", [0, 100]);
    onNutrientFilterChange("carbs", [0, 100]);
    onNutrientFilterChange("fat", [0, 100]);
  };

  const activeFilterCount = 
    (searchQuery ? 1 : 0) + 
    (selectedMealType ? 1 : 0) + 
    (selectedDate ? 1 : 0) +
    (caloriesRange[0] > 0 || caloriesRange[1] < 1000 ? 1 : 0) +
    (proteinRange[0] > 0 || proteinRange[1] < 100 ? 1 : 0) +
    (carbsRange[0] > 0 || carbsRange[1] < 100 ? 1 : 0) +
    (fatRange[0] > 0 || fatRange[1] < 100 ? 1 : 0);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Determine which meal types to display
  const displayedMealTypes = showAllMealTypes 
    ? MEAL_TYPES 
    : MEAL_TYPES.slice(0, 5);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h1 className="text-2xl font-semibold mb-4 sm:mb-0">Meal Planning</h1>
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
              placeholder="Search meals..."
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
            <DropdownMenuContent className="w-72">
              <DropdownMenuLabel>Filter Meals</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Calories slider */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500 flex items-center">
                  <FireIcon className="h-3 w-3 mr-1 text-rose-500" />
                  Calories ({caloriesRange[0]} - {caloriesRange[1]})
                </DropdownMenuLabel>
                <div className="px-3 py-2">
                  <Slider 
                    defaultValue={caloriesRange}
                    min={0}
                    max={1000}
                    step={50}
                    onValueChange={(value) => onCaloriesChange(value as [number, number])}
                  />
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Protein slider */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500 flex items-center">
                  <ProteinIcon className="h-3 w-3 mr-1 text-red-500" />
                  Protein ({proteinRange[0]} - {proteinRange[1]}g)
                </DropdownMenuLabel>
                <div className="px-3 py-2">
                  <Slider 
                    defaultValue={proteinRange}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => onNutrientFilterChange("protein", value as [number, number])}
                  />
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Carbs slider */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500 flex items-center">
                  <CarbsIcon className="h-3 w-3 mr-1 text-blue-500" />
                  Carbs ({carbsRange[0]} - {carbsRange[1]}g)
                </DropdownMenuLabel>
                <div className="px-3 py-2">
                  <Slider 
                    defaultValue={carbsRange}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => onNutrientFilterChange("carbs", value as [number, number])}
                  />
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Fat slider */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500 flex items-center">
                  <FatIcon className="h-3 w-3 mr-1 text-yellow-500" />
                  Fat ({fatRange[0]} - {fatRange[1]}g)
                </DropdownMenuLabel>
                <div className="px-3 py-2">
                  <Slider 
                    defaultValue={fatRange}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => onNutrientFilterChange("fat", value as [number, number])}
                  />
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              {/* Date picker */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-slate-500 flex items-center">
                  <CalendarIcon className="h-3 w-3 mr-1 text-indigo-500" />
                  Date Filter
                </DropdownMenuLabel>
                <div className="px-3 py-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? formatDate(selectedDate) : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => onDateChange(date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-red-500 cursor-pointer" 
                onClick={handleClearAllFilters}
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
          {selectedMealType && (
            <Badge variant="outline" className="flex items-center gap-1">
              Meal Type: {selectedMealType}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onMealTypeChange(null)}
              >
                ✕
              </button>
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              Date: {formatDate(selectedDate)}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onDateChange(null)}
              >
                ✕
              </button>
            </Badge>
          )}
          {(caloriesRange[0] > 0 || caloriesRange[1] < 1000) && (
            <Badge variant="outline" className="flex items-center gap-1">
              Calories: {caloriesRange[0]}-{caloriesRange[1]}
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onCaloriesChange([0, 1000])}
              >
                ✕
              </button>
            </Badge>
          )}
          {(proteinRange[0] > 0 || proteinRange[1] < 100) && (
            <Badge variant="outline" className="flex items-center gap-1">
              Protein: {proteinRange[0]}-{proteinRange[1]}g
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => onNutrientFilterChange("protein", [0, 100])}
              >
                ✕
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button 
                className="ml-1 text-xs text-slate-500 hover:text-slate-700" 
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
              >
                ✕
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Meal type pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedMealType === null ? "default" : "outline"}
          className={`px-3 py-1.5 ${
            selectedMealType === null
              ? "border-primary text-primary bg-white hover:bg-indigo-50"
              : "border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
          onClick={() => handleMealTypeClick(null)}
        >
          All
        </Button>
        
        {displayedMealTypes.map((mealType) => (
          <Button
            key={mealType}
            variant={selectedMealType === mealType ? "default" : "outline"}
            className={`px-3 py-1.5 ${
              selectedMealType === mealType
                ? "border-primary text-primary bg-white hover:bg-indigo-50"
                : "border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
            onClick={() => handleMealTypeClick(mealType)}
          >
            {mealType}
          </Button>
        ))}
        
        {MEAL_TYPES.length > 5 && (
          <Button
            variant="outline"
            className="text-primary px-3 py-1.5 border-slate-300"
            onClick={() => setShowAllMealTypes(!showAllMealTypes)}
          >
            {showAllMealTypes ? "Show Less" : `+${MEAL_TYPES.length - 5} More`}
          </Button>
        )}
      </div>
    </div>
  );
}