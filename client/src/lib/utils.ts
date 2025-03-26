import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat().format(value);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function calculateBMI(weight: number, heightInCm: number): number {
  const heightInM = heightInCm / 100;
  return weight / (heightInM * heightInM);
}

export function calculateBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function calculateCaloriesBurned(
  weight: number,
  durationMinutes: number,
  exerciseIntensity: "low" | "medium" | "high"
): number {
  const intensityMultiplier = {
    low: 3,
    medium: 5,
    high: 8,
  };
  
  return Math.round(
    (weight * intensityMultiplier[exerciseIntensity] * durationMinutes) / 60
  );
}

export function calculateOneRepMax(weight: number, reps: number): number {
  // Brzycki formula: 1RM = weight × (36 / (37 - reps))
  return Math.round(weight * (36 / (37 - reps)));
}

export function getProgressTrend(
  current: number,
  previous: number
): "increasing" | "decreasing" | "stable" {
  const percentChange = ((current - previous) / previous) * 100;
  
  if (percentChange > 1) return "increasing";
  if (percentChange < -1) return "decreasing";
  return "stable";
}

export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

export function formatDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
