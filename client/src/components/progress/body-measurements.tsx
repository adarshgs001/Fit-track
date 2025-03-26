import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "@/components/ui/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import type { ProgressEntry } from "@shared/schema";

interface BodyMeasurementsProps {
  userId: number;
}

export default function BodyMeasurements({ userId }: BodyMeasurementsProps) {
  const { data: progressEntries, isLoading, error } = useQuery({
    queryKey: [`/api/users/${userId}/progress`],
    staleTime: 60000, // 1 minute
  });

  const { data: latestEntry } = useQuery({
    queryKey: [`/api/users/${userId}/latest-progress`],
    staleTime: 60000, // 1 minute
  });

  const prepareChartData = (dataKey: string) => {
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

  const weightData = prepareChartData("weight");
  const bodyFatData = prepareChartData("bodyFat");

  const getChange = (current: number, previous: number) => {
    if (!previous) return { value: 0, isPositive: true };
    const diff = current - previous;
    return {
      value: Math.abs(diff).toFixed(1),
      isPositive: diff >= 0
    };
  };

  const getWeightChange = () => {
    if (!progressEntries || progressEntries.length < 2) return { value: "0", isPositive: true };
    const latest = progressEntries[0].weight || 0;
    const previous = progressEntries[1].weight || 0;
    return getChange(latest, previous);
  };

  const getBodyFatChange = () => {
    if (!progressEntries || progressEntries.length < 2) return { value: "0", isPositive: true };
    const latest = progressEntries[0].bodyFat || 0;
    const previous = progressEntries[1].bodyFat || 0;
    return getChange(latest, previous);
  };
  
  const getMeasurementChange = (key: string) => {
    if (!progressEntries || progressEntries.length < 2) return { value: "0", isPositive: true };
    const latest = progressEntries[0].measurements?.[key] || 0;
    const previous = progressEntries[1].measurements?.[key] || 0;
    return getChange(latest, previous);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading body measurements...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Failed to load body measurements</div>;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-slate-200">
        <CardTitle className="text-lg leading-6 font-medium text-slate-900">Body Measurements</CardTitle>
        <p className="mt-1 text-sm text-slate-500">Track changes in your body composition.</p>
      </CardHeader>
      <CardContent className="divide-y divide-slate-200">
        <div className="px-4 py-5 sm:p-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-900">Weight</h4>
              <div className="flex items-center">
                <span className="text-sm font-medium text-slate-900">
                  {latestEntry?.weight || 0} lbs
                </span>
                <span className={`ml-2 flex items-baseline text-sm font-semibold ${
                  getWeightChange().isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="material-icons text-xs">
                    {getWeightChange().isPositive ? 'arrow_upward' : 'arrow_downward'}
                  </span>
                  <span className="sr-only">
                    {getWeightChange().isPositive ? 'Increased by' : 'Decreased by'}
                  </span>
                  {getWeightChange().value}
                </span>
              </div>
            </div>
            <div className="h-32 bg-slate-50 rounded-lg">
              {weightData && weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={weightData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-slate-500">No weight data available</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-900">Body Fat %</h4>
              <div className="flex items-center">
                <span className="text-sm font-medium text-slate-900">
                  {latestEntry?.bodyFat || 0}%
                </span>
                <span className={`ml-2 flex items-baseline text-sm font-semibold ${
                  !getBodyFatChange().isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span className="material-icons text-xs">
                    {!getBodyFatChange().isPositive ? 'arrow_downward' : 'arrow_upward'}
                  </span>
                  <span className="sr-only">
                    {!getBodyFatChange().isPositive ? 'Decreased by' : 'Increased by'}
                  </span>
                  {getBodyFatChange().value}%
                </span>
              </div>
            </div>
            <div className="h-32 bg-slate-50 rounded-lg">
              {bodyFatData && bodyFatData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={bodyFatData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="bodyFat"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-slate-500">No body fat data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-sm font-medium text-slate-900 mb-4">Other Measurements</h4>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Chest</div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-medium text-slate-900">
                  {latestEntry?.measurements?.chest || 0}"
                </span>
                <span className={`ml-2 text-xs font-medium ${
                  getMeasurementChange('chest').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getMeasurementChange('chest').isPositive ? '+' : '-'}
                  {getMeasurementChange('chest').value}"
                </span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Waist</div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-medium text-slate-900">
                  {latestEntry?.measurements?.waist || 0}"
                </span>
                <span className={`ml-2 text-xs font-medium ${
                  !getMeasurementChange('waist').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getMeasurementChange('waist').isPositive ? '+' : '-'}
                  {getMeasurementChange('waist').value}"
                </span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Arms</div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-medium text-slate-900">
                  {latestEntry?.measurements?.arms || 0}"
                </span>
                <span className={`ml-2 text-xs font-medium ${
                  getMeasurementChange('arms').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getMeasurementChange('arms').isPositive ? '+' : '-'}
                  {getMeasurementChange('arms').value}"
                </span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500">Thighs</div>
              <div className="flex items-baseline mt-1">
                <span className="text-lg font-medium text-slate-900">
                  {latestEntry?.measurements?.thighs || 0}"
                </span>
                <span className={`ml-2 text-xs font-medium ${
                  getMeasurementChange('thighs').isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {getMeasurementChange('thighs').isPositive ? '+' : '-'}
                  {getMeasurementChange('thighs').value}"
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" className="text-sm">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add New Measurement
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
