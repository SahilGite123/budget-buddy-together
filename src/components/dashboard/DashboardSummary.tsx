
import { useExpense } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, DollarSign, Calendar } from 'lucide-react';

const DashboardSummary = () => {
  const { getExpenseSummary } = useExpense();
  const summary = getExpenseSummary();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dashboard-summary-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalSpent)}</div>
          <p className="text-xs text-muted-foreground">Lifetime total expenses</p>
        </CardContent>
      </Card>
      
      <Card className="dashboard-summary-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.thisMonth)}</div>
          <p className="text-xs text-muted-foreground">Monthly expenses so far</p>
        </CardContent>
      </Card>
      
      <Card className="dashboard-summary-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Week</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.thisWeek)}</div>
          <p className="text-xs text-muted-foreground">Weekly expenses so far</p>
        </CardContent>
      </Card>
      
      <Card className="dashboard-summary-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Balance Overview</CardTitle>
          <div className="flex space-x-1">
            <ArrowUp className="h-4 w-4 text-expense-green" />
            <ArrowDown className="h-4 w-4 text-expense-red" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground">You're owed</p>
              <p className="text-lg font-semibold text-expense-green">+$48.00</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">You owe</p>
              <p className="text-lg font-semibold text-expense-red">-$12.50</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSummary;
