import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface NutritionProgressChartProps {
  userId: number;
}

export default function NutritionProgressChart({ userId }: NutritionProgressChartProps) {
  const [timeRange, setTimeRange] = useState<string>("7days");
  const [chartType, setChartType] = useState<string>("daily");
  
  // Calculate date range based on selected time range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate;
    
    switch (timeRange) {
      case "7days":
        startDate = subDays(endDate, 6);
        break;
      case "14days":
        startDate = subDays(endDate, 13);
        break;
      case "30days":
        startDate = subDays(endDate, 29);
        break;
      default:
        startDate = subDays(endDate, 6);
    }
    
    return { startDate, endDate };
  };
  
  const { startDate, endDate } = getDateRange();
  
  // Fetch user's meals for the date range
  const { data: meals, isLoading } = useQuery({
    queryKey: [
      `/api/users/${userId}/meals-by-date-range`, 
      { startDate: format(startDate, 'yyyy-MM-dd'), endDate: format(endDate, 'yyyy-MM-dd') }
    ],
    staleTime: 60000, // 1 minute
  });
  
  // Generate all dates in the range for the X-axis
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Process the meal data for the charts
  const processDataForCharts = () => {
    if (!meals || !Array.isArray(meals)) return [];
    
    // Initialize data for all dates in range
    const processedData = dateRange.map(date => {
      return {
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM d'),
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        completedMeals: 0,
        totalMeals: 0
      };
    });
    
    // Fill in data from meals
    meals.forEach((meal: any) => {
      const mealDate = format(new Date(meal.date), 'yyyy-MM-dd');
      const dataIndex = processedData.findIndex(item => item.date === mealDate);
      
      if (dataIndex >= 0) {
        processedData[dataIndex].calories += meal.calories;
        processedData[dataIndex].protein += meal.protein;
        processedData[dataIndex].carbs += meal.carbs;
        processedData[dataIndex].fat += meal.fat;
        processedData[dataIndex].totalMeals += 1;
        
        if (meal.completed) {
          processedData[dataIndex].completedMeals += 1;
        }
      }
    });
    
    return processedData;
  };
  
  const chartData = processDataForCharts();
  
  // Calculate averages for the selected time period
  const calculateAverages = () => {
    if (chartData.length === 0) return { calories: 0, protein: 0, carbs: 0, fat: 0, adherence: 0 };
    
    const totals = chartData.reduce((acc, day) => {
      return {
        calories: acc.calories + day.calories,
        protein: acc.protein + day.protein,
        carbs: acc.carbs + day.carbs,
        fat: acc.fat + day.fat,
        adherence: acc.adherence + (day.totalMeals > 0 ? (day.completedMeals / day.totalMeals) * 100 : 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, adherence: 0 });
    
    return {
      calories: Math.round(totals.calories / chartData.length),
      protein: Math.round(totals.protein / chartData.length),
      carbs: Math.round(totals.carbs / chartData.length),
      fat: Math.round(totals.fat / chartData.length),
      adherence: Math.round(totals.adherence / chartData.length)
    };
  };
  
  const averages = calculateAverages();
  
  // Data for the macronutrient breakdown
  const macroData = [
    { name: "Protein", value: averages.protein, fill: "#ef4444" },
    { name: "Carbs", value: averages.carbs, fill: "#3b82f6" },
    { name: "Fat", value: averages.fat, fill: "#eab308" }
  ];
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nutrition Progress</CardTitle>
        </CardHeader>
        <CardContent className="h-96 flex items-center justify-center">
          <div className="text-slate-500">Loading nutrition data...</div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Nutrition Progress</CardTitle>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="14days">Last 14 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calories" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="adherence">Meal Adherence</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calories" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kcal`, 'Calories']} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="calories" 
                    name="Calories" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center">
              <div className="text-center px-4 py-2 bg-indigo-50 rounded-full">
                <span className="text-sm text-slate-500">Daily Average:</span>
                <span className="ml-2 font-bold text-indigo-700">{averages.calories} kcal</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="macros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="protein" name="Protein" stackId="a" fill="#ef4444" />
                    <Bar dataKey="carbs" name="Carbs" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="fat" name="Fat" stackId="a" fill="#eab308" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-[300px] flex flex-col justify-between">
                <h3 className="text-md font-medium text-center mb-2">Average Daily Macros</h3>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-red-700">Protein</div>
                    <div className="text-xl font-bold text-red-800">{averages.protein}g</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-blue-700">Carbs</div>
                    <div className="text-xl font-bold text-blue-800">{averages.carbs}g</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <div className="text-sm text-yellow-700">Fat</div>
                    <div className="text-xl font-bold text-yellow-800">{averages.fat}g</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height="60%">
                  <BarChart
                    data={macroData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" name="Grams" fill="#8884d8" />
                    {/* Use the colors defined in the data for the bars */}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="adherence" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="displayDate" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "completedMeals") return [`${value} meals`, "Completed"];
                      if (name === "totalMeals") return [`${value} meals`, "Planned"];
                      return [value, name];
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="completedMeals" name="Completed" fill="#10b981" />
                  <Bar dataKey="totalMeals" name="Planned" fill="#d1d5db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center">
              <div className="text-center px-4 py-2 bg-green-50 rounded-full">
                <span className="text-sm text-slate-500">Average Adherence:</span>
                <span className="ml-2 font-bold text-green-700">{averages.adherence}%</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}