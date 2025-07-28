import {
  FileText,
  ArrowDownRight,
  ArrowUpRight,
  Receipt,
  Wallet,
  CircleDollarSign,
  CreditCard,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCard = {
  title: string;
  icon: React.ReactNode;
  amount: string;
  trend: number;
  trendDirection: "up" | "down";
  color?: string;
};

export function FinanceStats() {
  const stats: StatCard[] = [
    {
      title: "Invoices This Month",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      amount: "KES 1,200,000",
      trend: 12,
      trendDirection: "up",
    },
    {
      title: "Expenses This Month",
      icon: <Wallet className="w-5 h-5 text-red-500" />,
      amount: "KES 890,000",
      trend: 8,
      trendDirection: "down",
    },
    {
      title: "Outstanding Invoices",
      icon: <Receipt className="w-5 h-5 text-amber-500" />,
      amount: "KES 300,000",
      trend: 5,
      trendDirection: "down",
    },
    {
      title: "Outstanding Bills",
      icon: <CreditCard className="w-5 h-5 text-rose-500" />,
      amount: "KES 210,000",
      trend: 3,
      trendDirection: "up",
    },
  ];

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CircleDollarSign className="w-5 h-5" />
          Finance Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className={cn(
              "border rounded-xl p-4 flex flex-col justify-between bg-muted/40",
              stat.color
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
              {stat.icon}
            </div>
            <div className="text-lg font-semibold">{stat.amount}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.trendDirection === "up" ? (
                <ArrowUpRight className="w-3 h-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600 mr-1" />
              )}
              {stat.trendDirection === "up" ? "+" : "-"}
              {stat.trend}%
              <span className="ml-1">this month</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
