import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { addDays, format, subDays } from "date-fns";
import type { ProgressEntry } from "@shared/schema";

interface ProgressChartProps {
  userId: number;
  title: string;
  dataKey: keyof ProgressEntry | string;
  filterOptions?: string[];
}

export default function ProgressChart({ 
  userId, 
  title, 
  dataKey = "weight",
  filterOptions = [],
}: ProgressChartProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const { data: progressEntries, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    staleTime: 60000, // 1 minute
  });

  const prepareChartData = () => {
    if (!progressEntries) return [];
    
    return progressEntries.map((entry: ProgressEntry) => {
      let value: any;
      
      if (dataKey === "weight" || dataKey === "bodyFat") {
        value = entry[dataKey as keyof ProgressEntry];
      } else if (dataKey.startsWith("measurements.") && entry.measurements) {
        const measurementKey = dataKey.split(".")[1];
        value = entry.measurements[measurementKey];
      } else {
        value = 0;
      }

      return {
        date: format(new Date(entry.date), "MMM d"),
        [dataKey]: value,
      };
    });
  };

  const chartData = prepareChartData();

  const getChartMin = () => {
    if (!chartData || chartData.length === 0) return 0;
    const values = chartData.map((d: any) => d[dataKey]);
    return Math.floor(Math.min(...values) * 0.95);
  };

  const getChartMax = () => {
    if (!chartData || chartData.length === 0) return 100;
    const values = chartData.map((d: any) => d[dataKey]);
    return Math.ceil(Math.max(...values) * 1.05);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <CardTitle className="text-lg leading-6 font-medium text-slate-900">{title}</CardTitle>
      </CardHeader>
      
      {filterOptions && filterOptions.length > 0 && (
        <div className="px-4 py-3 sm:px-6 border-b border-slate-200 bg-slate-50">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === null ? "default" : "outline"}
              className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md"
              onClick={() => setActiveFilter(null)}
            >
              All
            </Button>
            {filterOptions.map((filter) => (
              <Button
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <CardContent className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-slate-500">Loading chart data...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-red-500">Failed to load chart data</p>
          </div>
        ) : chartData && chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis domain={[getChartMin(), getChartMax()]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={dataKey}
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <span className="material-icons text-4xl text-slate-300 mb-2">show_chart</span>
              <p className="text-sm text-slate-500">No progress data available</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
