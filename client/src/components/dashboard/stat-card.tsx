import React from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  iconBgColor: string;
}

export default function StatCard({ icon, title, value, change, iconBgColor }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-slate-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="material-icons text-xs">{change.isPositive ? 'arrow_upward' : 'arrow_downward'}</span>
                    <span className="sr-only">{change.isPositive ? 'Increased by' : 'Decreased by'}</span>
                    {change.value}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
}
