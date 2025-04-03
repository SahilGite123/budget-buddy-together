
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Expense } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { MoreVertical, Edit, Trash2, Users, User } from 'lucide-react';

interface ExpenseListProps {
  onEdit: (expense: Expense) => void;
}

const ExpenseList = ({ onEdit }: ExpenseListProps) => {
  const { expenses, deleteExpense, getCategoryColor } = useExpense();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'personal' | 'group'>('all');
  
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'personal') return matchesSearch && !expense.isGroup;
    if (filter === 'group') return matchesSearch && expense.isGroup;
    
    return matchesSearch;
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-64"
        />
        
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={(value) => setFilter(value as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="group">Group</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No expenses found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map(expense => (
            <Card key={expense.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {expense.category.substring(0, 2)}
                    </div>
                    
                    <div>
                      <h3 className="font-medium">{expense.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span>{format(expense.date, 'MMM d, yyyy')}</span>
                        <span className="mx-2">•</span>
                        <Badge variant="outline" className="font-normal">
                          {expense.category}
                        </Badge>
                        {expense.isGroup && (
                          <>
                            <span className="mx-2">•</span>
                            <div className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              <span>Group</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 md:mt-0">
                    <span className="text-lg font-medium">
                      {formatCurrency(expense.amount)}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(expense)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => deleteExpense(expense.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {expense.description && (
                  <div className="px-4 pb-4 pt-0 border-t">
                    <p className="text-sm text-muted-foreground mt-2">{expense.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
