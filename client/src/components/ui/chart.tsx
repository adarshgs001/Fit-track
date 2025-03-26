import * as React from "react";
import { 
  BarChart as RechartsBarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  TooltipProps
} from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
}

const THEMES = {
  primary: "#3b82f6", // blue-500
  secondary: "#10b981", // emerald-500
  accent: "#f59e0b", // amber-500
  destructive: "#ef4444", // red-500
  muted: "#94a3b8", // slate-400
};

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  config?: ChartConfig;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  config,
  className,
}: BarChartProps) {
  return (
    <ChartContext.Provider value={{ config: config || {} }}>
      <div className={cn("w-full h-full", className)}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted-foreground/20" />
            <XAxis
              dataKey={index}
              axisLine={false}
              tickLine={false}
              className="text-xs font-medium text-muted-foreground"
              tick={{ transform: 'translate(0, 6)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-xs font-medium text-muted-foreground"
              tick={{ transform: 'translate(-3, 0)' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                    <div className="font-medium">{label}</div>
                    <div className="grid grid-flow-col gap-2 mt-1">
                      {payload.map((data) => (
                        <div key={data.name} className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor: data.color,
                              }}
                            />
                            <span>{data.name}</span>
                          </div>
                          <div className="font-medium">
                            {valueFormatter ? valueFormatter(data.value) : data.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }}
            />
            {categories.map((category, i) => (
              <Bar
                key={category}
                dataKey={category}
                fill={colors?.[i] || THEMES.primary}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors,
  valueFormatter,
  className,
}: LineChartProps) {
  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted-foreground/20" />
          <XAxis
            dataKey={index}
            axisLine={false}
            tickLine={false}
            className="text-xs font-medium text-muted-foreground"
            tick={{ transform: 'translate(0, 6)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            className="text-xs font-medium text-muted-foreground"
            tick={{ transform: 'translate(-3, 0)' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm text-xs">
                  <div className="font-medium">{label}</div>
                  <div className="grid grid-flow-col gap-2 mt-1">
                    {payload.map((data) => (
                      <div key={data.name} className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: data.color,
                            }}
                          />
                          <span>{data.name}</span>
                        </div>
                        <div className="font-medium">
                          {valueFormatter ? valueFormatter(data.value) : data.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }}
          />
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors?.[i] || THEMES.primary}
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}