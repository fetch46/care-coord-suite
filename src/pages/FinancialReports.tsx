import { useState, useEffect } from "react";
import { Calendar, Download, TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppHeader } from "@/components/ui/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface PatientRevenue {
  patient_name: string;
  total_revenue: number;
  total_invoices: number;
  outstanding_amount: number;
}

export default function FinancialReports() {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [patientRevenue, setPatientRevenue] = useState<PatientRevenue[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    outstandingBalance: 0,
  });

  useEffect(() => {
    // Set default date range to current year
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    setStartDate(yearStart.toISOString().split("T")[0]);
    setEndDate(now.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [reportType, dateRange, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      if (reportType === "revenue") {
        await fetchRevenueReport();
      } else if (reportType === "patient") {
        await fetchPatientReport();
      }
      await fetchTotalStats();
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueReport = async () => {
    try {
      // Fetch invoices for revenue data
      const { data: invoices } = await supabase
        .from("invoices")
        .select("invoice_date, total_amount, status")
        .gte("invoice_date", startDate)
        .lte("invoice_date", endDate);

      // Fetch expenses (using financial_transactions)
      const { data: expenses } = await supabase
        .from("financial_transactions")
        .select("transaction_date, amount")
        .eq("transaction_type", "expense")
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);

      // Process data by month
      const monthlyData: { [key: string]: RevenueData } = {};

      if (invoices) {
        invoices.forEach((invoice) => {
          const month = new Date(invoice.invoice_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });
          
          if (!monthlyData[month]) {
            monthlyData[month] = { month, revenue: 0, expenses: 0, profit: 0 };
          }
          
          if (invoice.status === "paid") {
            monthlyData[month].revenue += (typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount);
          }
        });
      }

      if (expenses) {
        expenses.forEach((expense) => {
          const month = new Date(expense.transaction_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });
          
          if (!monthlyData[month]) {
            monthlyData[month] = { month, revenue: 0, expenses: 0, profit: 0 };
          }
          
          monthlyData[month].expenses += (typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount);
        });
      }

      // Calculate profit and convert to array
      const processedData = Object.values(monthlyData).map(data => ({
        ...data,
        profit: data.revenue - data.expenses,
      }));

      setRevenueData(processedData);
    } catch (error) {
      console.error("Error fetching revenue report:", error);
    }
  };

  const fetchPatientReport = async () => {
    try {
      const { data: patientData } = await supabase
        .from("invoices")
        .select(`
          total_amount,
          status,
          patient:patients(first_name, last_name)
        `)
        .gte("invoice_date", startDate)
        .lte("invoice_date", endDate);

      if (patientData) {
        const patientStats: { [key: string]: PatientRevenue } = {};

        patientData.forEach((invoice) => {
          const patientName = `${invoice.patient.first_name} ${invoice.patient.last_name}`;
          
          if (!patientStats[patientName]) {
            patientStats[patientName] = {
              patient_name: patientName,
              total_revenue: 0,
              total_invoices: 0,
              outstanding_amount: 0,
            };
          }

          patientStats[patientName].total_invoices += 1;
          
          if (invoice.status === "paid") {
            patientStats[patientName].total_revenue += (typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount);
          } else if (invoice.status === "sent" || invoice.status === "overdue") {
            patientStats[patientName].outstanding_amount += (typeof invoice.total_amount === 'string' ? parseFloat(invoice.total_amount) : invoice.total_amount);
          }
        });

        setPatientRevenue(Object.values(patientStats));
      }
    } catch (error) {
      console.error("Error fetching patient report:", error);
    }
  };

  const fetchTotalStats = async () => {
    try {
      // Total revenue (paid invoices)
      const { data: paidInvoices } = await supabase
        .from("invoices")
        .select("total_amount")
        .eq("status", "paid")
        .gte("invoice_date", startDate)
        .lte("invoice_date", endDate);

      // Total expenses
      const { data: expenses } = await supabase
        .from("financial_transactions")
        .select("amount")
        .eq("transaction_type", "expense")
        .gte("transaction_date", startDate)
        .lte("transaction_date", endDate);

      // Outstanding balance
      const { data: outstandingInvoices } = await supabase
        .from("invoices")
        .select("total_amount")
        .in("status", ["sent", "overdue"])
        .gte("invoice_date", startDate)
        .lte("invoice_date", endDate);

      const totalRevenue = paidInvoices?.reduce((sum, inv) => sum + (typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount), 0) || 0;
      const totalExpenses = expenses?.reduce((sum, exp) => sum + (typeof exp.amount === 'string' ? parseFloat(exp.amount) : exp.amount), 0) || 0;
      const outstandingBalance = outstandingInvoices?.reduce((sum, inv) => sum + (typeof inv.total_amount === 'string' ? parseFloat(inv.total_amount) : inv.total_amount), 0) || 0;

      setTotalStats({
        totalRevenue,
        totalExpenses,
        netProfit: totalRevenue - totalExpenses,
        outstandingBalance,
      });
    } catch (error) {
      console.error("Error fetching total stats:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const exportReport = () => {
    // This would typically generate a CSV or PDF export
    console.log("Exporting report...");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen">
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 overflow-auto p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Financial Reports</h1>
                <Button onClick={exportReport}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Report Type</Label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">Revenue & Expenses</SelectItem>
                          <SelectItem value="patient">Patient Revenue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={fetchReportData} disabled={loading}>
                        {loading ? "Loading..." : "Generate Report"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalStats.totalRevenue)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(totalStats.totalExpenses)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${totalStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalStats.netProfit)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                    <FileText className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                      {formatCurrency(totalStats.outstandingBalance)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Report Data */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {reportType === "revenue" ? "Monthly Revenue & Expenses" : "Patient Revenue Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {reportType === "revenue" ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Revenue</TableHead>
                          <TableHead>Expenses</TableHead>
                          <TableHead>Net Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {revenueData.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell className="font-medium">{row.month}</TableCell>
                            <TableCell className="text-green-600">
                              {formatCurrency(row.revenue)}
                            </TableCell>
                            <TableCell className="text-red-600">
                              {formatCurrency(row.expenses)}
                            </TableCell>
                            <TableCell className={row.profit >= 0 ? "text-green-600" : "text-red-600"}>
                              {formatCurrency(row.profit)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {revenueData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              No data available for the selected period.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Patient</TableHead>
                          <TableHead>Total Revenue</TableHead>
                          <TableHead>Total Invoices</TableHead>
                          <TableHead>Outstanding</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientRevenue.map((row) => (
                          <TableRow key={row.patient_name}>
                            <TableCell className="font-medium">{row.patient_name}</TableCell>
                            <TableCell className="text-green-600">
                              {formatCurrency(row.total_revenue)}
                            </TableCell>
                            <TableCell>{row.total_invoices}</TableCell>
                            <TableCell className="text-yellow-600">
                              {formatCurrency(row.outstanding_amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                        {patientRevenue.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              No data available for the selected period.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}