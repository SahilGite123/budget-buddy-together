
import { useExpense } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const RecentTransactions = () => {
  const { expenses, getCategoryColor } = useExpense();
  
  // Sort expenses by date, most recent first
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentExpenses.map(expense => (
            <div key={expense.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback style={{ backgroundColor: getCategoryColor(expense.category) }} className="text-white">
                    {expense.category.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{expense.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(expense.date, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="mr-4 text-sm font-medium">
                  {formatCurrency(expense.amount)}
                </span>
                {expense.isGroup ? (
                  <Badge variant="outline" className="border-expense-blue text-expense-blue">
                    Group
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-expense-purple text-expense-purple">
                    Personal
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {recentExpenses.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No recent transactions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
