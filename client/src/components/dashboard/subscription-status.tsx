import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SubscriptionStatus() {
  // Mock data for subscription
  const subscription = {
    plan: "Premium Meal Plan",
    status: "active",
    nextDelivery: "March 28, 2025",
    nextBilling: "April 3, 2025",
    amount: "$89.99"
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center justify-between">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-emerald-500 mr-2"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            Subscription
          </div>
          <Badge className="bg-emerald-100 text-emerald-800 capitalize">
            {subscription.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <h3 className="font-medium">{subscription.plan}</h3>
          <p className="text-sm text-slate-500 mt-1">
            Next billing: {subscription.nextBilling} • {subscription.amount}/month
          </p>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Next Meal Delivery</h4>
            <div className="flex items-center bg-emerald-50 text-emerald-800 p-2 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 mr-2"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
              <span className="text-sm">{subscription.nextDelivery}</span>
            </div>
          </div>
          
          <div className="pt-2 flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 text-sm">
              Skip Next
            </Button>
            <Button variant="outline" size="sm" className="flex-1 text-sm">
              Manage Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}