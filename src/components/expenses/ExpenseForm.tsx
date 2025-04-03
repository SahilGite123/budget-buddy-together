
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Expense, ExpenseCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface ExpenseFormProps {
  onSubmit: () => void;
  existingExpense?: Expense;
}

const CATEGORIES: ExpenseCategory[] = [
  'Food', 'Transportation', 'Housing', 'Utilities', 
  'Entertainment', 'Shopping', 'Healthcare', 'Travel', 
  'Education', 'Personal', 'Gifts', 'Other'
];

const ExpenseForm = ({ onSubmit, existingExpense }: ExpenseFormProps) => {
  const { addExpense, updateExpense, groups } = useExpense();
  
  const [title, setTitle] = useState(existingExpense?.title || '');
  const [amount, setAmount] = useState(existingExpense?.amount.toString() || '');
  const [category, setCategory] = useState<ExpenseCategory>(existingExpense?.category || 'Other');
  const [description, setDescription] = useState(existingExpense?.description || '');
  const [date, setDate] = useState<Date>(existingExpense?.date || new Date());
  const [isGroup, setIsGroup] = useState(existingExpense?.isGroup || false);
  const [groupId, setGroupId] = useState(existingExpense?.groupId || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      description,
      date,
      isGroup,
      ...(isGroup && groupId ? { groupId } : {})
    };
    
    if (existingExpense) {
      updateExpense(existingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter expense title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="pl-7"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ExpenseCategory)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this expense"
          rows={3}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          checked={isGroup}
          onCheckedChange={setIsGroup}
          id="group-expense"
        />
        <Label htmlFor="group-expense">This is a group expense</Label>
      </div>
      
      {isGroup && (
        <div className="space-y-2">
          <Label htmlFor="group">Group</Label>
          <Select
            value={groupId}
            onValueChange={setGroupId}
            disabled={groups.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              You need to create a group first
            </p>
          )}
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSubmit}>
          Cancel
        </Button>
        <Button type="submit">
          {existingExpense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
