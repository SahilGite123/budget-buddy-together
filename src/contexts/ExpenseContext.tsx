
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, Group, ExpenseSummary, GroupExpenseSummary, ExpenseCategory } from '@/types';

// Sample data for demo purposes
const SAMPLE_EXPENSES: Expense[] = [
  {
    id: '1',
    title: 'Groceries',
    amount: 78.50,
    date: new Date('2025-04-01'),
    category: 'Food',
    description: 'Weekly grocery shopping',
    isGroup: false
  },
  {
    id: '2',
    title: 'Movie Night',
    amount: 42.00,
    date: new Date('2025-04-02'),
    category: 'Entertainment',
    description: 'Cinema tickets and snacks',
    isGroup: true,
    groupId: '1',
    paidBy: 'user-1',
    members: [
      { userId: 'user-1', userName: 'You', amount: 14.00, paid: true },
      { userId: 'user-2', userName: 'John', amount: 14.00, paid: false },
      { userId: 'user-3', userName: 'Sarah', amount: 14.00, paid: false }
    ]
  },
  {
    id: '3',
    title: 'Rent',
    amount: 950.00,
    date: new Date('2025-04-01'),
    category: 'Housing',
    description: 'Monthly rent payment',
    isGroup: false
  },
  {
    id: '4',
    title: 'Team Lunch',
    amount: 132.75,
    date: new Date('2025-04-03'),
    category: 'Food',
    isGroup: true,
    groupId: '2',
    paidBy: 'user-1',
    members: [
      { userId: 'user-1', userName: 'You', amount: 33.19, paid: true },
      { userId: 'user-4', userName: 'Mike', amount: 33.19, paid: false },
      { userId: 'user-5', userName: 'Lisa', amount: 33.19, paid: false },
      { userId: 'user-6', userName: 'David', amount: 33.19, paid: false }
    ]
  },
  {
    id: '5',
    title: 'Electricity Bill',
    amount: 85.20,
    date: new Date('2025-04-02'),
    category: 'Utilities',
    description: 'Monthly electricity payment',
    isGroup: false
  }
];

const SAMPLE_GROUPS: Group[] = [
  {
    id: '1',
    name: 'Movie Buddies',
    description: 'For movie outings and related expenses',
    members: [
      { id: 'user-1', name: 'You', email: 'you@example.com' },
      { id: 'user-2', name: 'John', email: 'john@example.com' },
      { id: 'user-3', name: 'Sarah', email: 'sarah@example.com' }
    ],
    totalExpenses: 42.00,
    createdAt: new Date('2025-03-15')
  },
  {
    id: '2',
    name: 'Work Team',
    description: 'For work-related expenses and team outings',
    members: [
      { id: 'user-1', name: 'You', email: 'you@example.com' },
      { id: 'user-4', name: 'Mike', email: 'mike@example.com' },
      { id: 'user-5', name: 'Lisa', email: 'lisa@example.com' },
      { id: 'user-6', name: 'David', email: 'david@example.com' }
    ],
    totalExpenses: 132.75,
    createdAt: new Date('2025-03-01')
  }
];

type ExpenseContextType = {
  expenses: Expense[];
  groups: Group[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'totalExpenses'>) => void;
  updateGroup: (id: string, group: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  getExpenseSummary: () => ExpenseSummary;
  getGroupExpenseSummaries: () => GroupExpenseSummary[];
  getGroupExpenses: (groupId: string) => Expense[];
  getExpensesByCategory: () => Record<ExpenseCategory, number>;
  getCategoryColor: (category: ExpenseCategory) => string;
};

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [groups, setGroups] = useState<Group[]>(SAMPLE_GROUPS);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = {
      ...expense,
      id: `expense-${Date.now()}`
    };
    setExpenses([...expenses, newExpense]);
    
    // Update group total if it's a group expense
    if (expense.isGroup && expense.groupId) {
      setGroups(groups.map(group => 
        group.id === expense.groupId 
          ? { ...group, totalExpenses: group.totalExpenses + expense.amount } 
          : group
      ));
    }
  };

  const updateExpense = (id: string, updatedFields: Partial<Expense>) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, ...updatedFields } : expense
    ));
  };

  const deleteExpense = (id: string) => {
    const expenseToDelete = expenses.find(e => e.id === id);
    setExpenses(expenses.filter(expense => expense.id !== id));
    
    // Update group total if it's a group expense
    if (expenseToDelete?.isGroup && expenseToDelete.groupId) {
      setGroups(groups.map(group => 
        group.id === expenseToDelete.groupId 
          ? { ...group, totalExpenses: group.totalExpenses - expenseToDelete.amount } 
          : group
      ));
    }
  };

  const addGroup = (group: Omit<Group, 'id' | 'createdAt' | 'totalExpenses'>) => {
    const newGroup = {
      ...group,
      id: `group-${Date.now()}`,
      createdAt: new Date(),
      totalExpenses: 0
    };
    setGroups([...groups, newGroup]);
  };

  const updateGroup = (id: string, updatedFields: Partial<Group>) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, ...updatedFields } : group
    ));
  };

  const deleteGroup = (id: string) => {
    setGroups(groups.filter(group => group.id !== id));
    // Remove all expenses associated with this group
    setExpenses(expenses.filter(expense => expense.groupId !== id));
  };

  const getExpenseSummary = (): ExpenseSummary => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const now = new Date();
    const thisMonth = expenses.filter(expense => 
      expense.date.getMonth() === now.getMonth() && 
      expense.date.getFullYear() === now.getFullYear()
    ).reduce((sum, expense) => sum + expense.amount, 0);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const thisWeek = expenses.filter(expense => 
      expense.date >= startOfWeek
    ).reduce((sum, expense) => sum + expense.amount, 0);
    
    const byCategory = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
    
    return { totalSpent, thisMonth, thisWeek, byCategory };
  };

  const getGroupExpenseSummaries = (): GroupExpenseSummary[] => {
    return groups.map(group => {
      const groupExpenses = expenses.filter(expense => expense.groupId === group.id);
      
      let youOwe = 0;
      let youAreOwed = 0;
      
      groupExpenses.forEach(expense => {
        if (expense.paidBy === 'user-1') { // Assuming 'user-1' is the current user
          const owed = expense.members?.reduce((sum, member) => {
            if (member.userId !== 'user-1' && !member.paid) {
              return sum + member.amount;
            }
            return sum;
          }, 0) || 0;
          youAreOwed += owed;
        } else {
          const youOwePart = expense.members?.find(member => member.userId === 'user-1')?.amount || 0;
          if (!expense.members?.find(member => member.userId === 'user-1')?.paid) {
            youOwe += youOwePart;
          }
        }
      });
      
      return {
        groupId: group.id,
        groupName: group.name,
        total: group.totalExpenses,
        youOwe,
        youAreOwed
      };
    });
  };

  const getGroupExpenses = (groupId: string): Expense[] => {
    return expenses.filter(expense => expense.groupId === groupId);
  };

  const getExpensesByCategory = (): Record<ExpenseCategory, number> => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
  };

  const getCategoryColor = (category: ExpenseCategory): string => {
    const colors: Record<ExpenseCategory, string> = {
      Food: '#FF6B6B',
      Transportation: '#4CAF50',
      Housing: '#2196F3',
      Utilities: '#9C27B0',
      Entertainment: '#FF9800',
      Shopping: '#FFC107',
      Healthcare: '#00BCD4',
      Travel: '#3F51B5',
      Education: '#8BC34A',
      Personal: '#E91E63',
      Gifts: '#CDDC39',
      Other: '#607D8B'
    };
    
    return colors[category] || '#607D8B';
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      groups,
      addExpense,
      updateExpense,
      deleteExpense,
      addGroup,
      updateGroup,
      deleteGroup,
      getExpenseSummary,
      getGroupExpenseSummaries,
      getGroupExpenses,
      getExpensesByCategory,
      getCategoryColor
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
