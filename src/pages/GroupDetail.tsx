
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Users, Divide } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useExpense } from "@/contexts/ExpenseContext";
import { DataTable } from "@/components/ui/DataTable";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { Expense } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { groups, getGroupExpenses, deleteExpense } = useExpense();
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | undefined>(undefined);

  if (!id) return <div>Group ID is required</div>;

  const group = groups.find(g => g.id === id);
  if (!group) return <div>Group not found</div>;

  const expenses = getGroupExpenses(id);

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

  const handleAddExpense = () => {
    setSelectedExpense(undefined);
    setIsExpenseDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsExpenseDialogOpen(true);
  };

  const columns = [
    {
      header: "Expense",
      accessorKey: "title",
      cell: (expense: Expense) => (
        <div>
          <div className="font-medium">{expense.title}</div>
          <div className="text-sm text-muted-foreground">
            {format(expense.date, 'MMM d, yyyy')}
          </div>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: (expense: Expense) => (
        <div className="font-medium">{formatCurrency(expense.amount)}</div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      cell: (expense: Expense) => (
        <Badge variant="outline">{expense.category}</Badge>
      ),
    },
    {
      header: "Paid By",
      accessorKey: "paidBy",
      cell: (expense: Expense) => (
        <div>
          {expense.paidBy === "user-1" ? "You" : 
            group.members.find(m => m.id === expense.paidBy)?.name || "Unknown"}
        </div>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (expense: Expense) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => handleEditExpense(expense)}>
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-destructive" 
            onClick={() => deleteExpense(expense.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Calculate balances
  const balances = group.members.map(member => {
    let paid = 0;
    let owed = 0;

    expenses.forEach(expense => {
      if (expense.paidBy === member.id) {
        paid += expense.amount;
      }
      
      const memberShare = expense.members?.find(m => m.userId === member.id)?.amount || 0;
      owed += memberShare;
    });

    return {
      id: member.id,
      name: member.name,
      paid,
      owed,
      balance: paid - owed
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link to="/groups">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
        </div>
        <Button onClick={handleAddExpense}>
          <Plus className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {group.members.map(member => (
                <div key={member.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {member.name} {member.id === 'user-1' && '(You)'}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Divide className="h-5 w-5 mr-2" />
              Group Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {balances.map(balance => (
                <div key={balance.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(balance.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {balance.name} {balance.id === 'user-1' && '(You)'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Paid {formatCurrency(balance.paid)} • Owed {formatCurrency(balance.owed)}
                    </div>
                    <div className={`font-medium ${balance.balance > 0 ? 'text-expense-green' : balance.balance < 0 ? 'text-expense-red' : ''}`}>
                      {balance.balance > 0 ? 'Gets back ' : balance.balance < 0 ? 'Owes ' : 'Settled up '}
                      {balance.balance !== 0 && formatCurrency(Math.abs(balance.balance))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="pt-4">
          <DataTable 
            columns={columns} 
            data={expenses}
            emptyMessage="No expenses yet. Add one to get started!"
          />
        </TabsContent>
        
        <TabsContent value="activity" className="pt-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Activity timeline coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? 'Edit Expense' : 'Add New Expense to Group'}
            </DialogTitle>
          </DialogHeader>
          <ExpenseForm 
            onSubmit={() => setIsExpenseDialogOpen(false)} 
            existingExpense={selectedExpense || {
              id: '',
              title: '',
              amount: 0,
              date: new Date(),
              category: 'Other',
              isGroup: true,
              groupId: id
            } as any}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupDetail;
