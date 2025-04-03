
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useExpense } from "@/contexts/ExpenseContext";
import DashboardSummary from "@/components/dashboard/DashboardSummary";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpenseForm from "@/components/expenses/ExpenseForm";

const Dashboard = () => {
  const { getGroupExpenseSummaries } = useExpense();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const groupSummaries = getGroupExpenseSummaries();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setIsExpenseDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <DashboardSummary />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ExpenseChart />
        <RecentTransactions />
      </div>

      {groupSummaries.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Group Balances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupSummaries.map((summary) => (
              <div key={summary.groupId} className="bg-white p-6 rounded-lg shadow-sm border border-border">
                <h3 className="font-medium mb-2">{summary.groupName}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total expenses:</span>
                    <span className="font-medium">{formatCurrency(summary.total)}</span>
                  </div>
                  {summary.youOwe > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You owe:</span>
                      <span className="font-medium text-expense-red">{formatCurrency(summary.youOwe)}</span>
                    </div>
                  )}
                  {summary.youAreOwed > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">You are owed:</span>
                      <span className="font-medium text-expense-green">{formatCurrency(summary.youAreOwed)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm onSubmit={() => setIsExpenseDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
