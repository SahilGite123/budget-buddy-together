
export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Housing'
  | 'Utilities'
  | 'Entertainment'
  | 'Shopping'
  | 'Healthcare'
  | 'Travel'
  | 'Education'
  | 'Personal'
  | 'Gifts'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ExpenseMember {
  userId: string;
  userName: string;
  amount: number;
  paid: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: ExpenseCategory;
  description?: string;
  isGroup: boolean;
  groupId?: string;
  paidBy?: string;
  members?: ExpenseMember[];
  receiptImage?: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
  description?: string;
  totalExpenses: number;
  createdAt: Date;
}

export interface ExpenseSummary {
  totalSpent: number;
  thisMonth: number;
  thisWeek: number;
  byCategory: Record<ExpenseCategory, number>;
}

export interface GroupExpenseSummary {
  groupId: string;
  groupName: string;
  total: number;
  youOwe: number;
  youAreOwed: number;
}

export interface Wallet {
  id: string;
  type: 'spending' | 'savings';
  amount: number;
  monthlyLimit?: number;
  savingsGoal?: number;
  fixedExpenses?: number;
}

export interface DailyExpense {
  date: string;
  amount: number;
  category: ExpenseCategory;
}

export interface MonthlyExpenseTrend {
  month: string;
  amount: number;
}

export interface CategoryExpense {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
}
