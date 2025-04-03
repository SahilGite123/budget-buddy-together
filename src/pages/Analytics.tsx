
import { useState, useCallback } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  TooltipProps 
} from 'recharts';
import { CategoryExpense, ExpenseCategory, DailyExpense, MonthlyExpenseTrend } from '@/types';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Analytics = () => {
  const { expenses, getCategoryColor } = useExpense();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Generate category data for pie chart
  const generateCategoryData = useCallback(() => {
    const categories: Record<ExpenseCategory, number> = {} as Record<ExpenseCategory, number>;
    
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    
    const totalSpent = Object.values(categories).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categories)
      .filter(([_, amount]) => amount > 0)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: totalSpent > 0 ? amount / totalSpent : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);
  
  // Generate daily expense data for selected category
  const generateDailyExpensesForCategory = useCallback((category: ExpenseCategory) => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const filteredExpenses = expenses
      .filter(expense => 
        expense.category === category && 
        expense.date >= thirtyDaysAgo && 
        expense.date <= now
      );
    
    // Group by day
    const expensesByDay: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      const dateStr = format(expense.date, 'MM-dd');
      if (!expensesByDay[dateStr]) {
        expensesByDay[dateStr] = 0;
      }
      expensesByDay[dateStr] += expense.amount;
    });
    
    // Create data array with all days in range
    const dailyData: DailyExpense[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = format(date, 'MM-dd');
      dailyData.unshift({
        date: dateStr,
        amount: expensesByDay[dateStr] || 0,
        category
      });
    }
    
    return dailyData;
  }, [expenses]);
  
  // Generate daily expense data for all categories
  const generateDailyExpenses = useCallback(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const filteredExpenses = expenses.filter(expense => 
      expense.date >= thirtyDaysAgo && expense.date <= now
    );
    
    // Group by day
    const expensesByDay: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      const dateStr = format(expense.date, 'MM-dd');
      if (!expensesByDay[dateStr]) {
        expensesByDay[dateStr] = 0;
      }
      expensesByDay[dateStr] += expense.amount;
    });
    
    // Create data array with all days in range
    const dailyData: DailyExpense[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateStr = format(date, 'MM-dd');
      dailyData.unshift({
        date: dateStr,
        amount: expensesByDay[dateStr] || 0,
        category: 'All' as ExpenseCategory
      });
    }
    
    return dailyData;
  }, [expenses]);
  
  // Generate monthly expense data
  const generateMonthlyExpenseTrends = useCallback(() => {
    const now = new Date();
    const monthlyData: MonthlyExpenseTrend[] = [];
    
    // Get data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = startOfMonth(monthDate);
      const monthEnd = endOfMonth(monthDate);
      
      const monthlyTotal = expenses
        .filter(expense => expense.date >= monthStart && expense.date <= monthEnd)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      monthlyData.push({
        month: format(monthDate, 'MMM'),
        amount: monthlyTotal
      });
    }
    
    return monthlyData;
  }, [expenses]);
  
  const categoryData = generateCategoryData();
  const dailyExpenses = selectedCategory 
    ? generateDailyExpensesForCategory(selectedCategory) 
    : generateDailyExpenses();
  const monthlyExpenseTrends = generateMonthlyExpenseTrends();
  
  // Get total spending, average, and top category
  const totalSpent = categoryData.reduce((sum, category) => sum + category.amount, 0);
  const topCategory = categoryData.length > 0 ? categoryData[0] : null;
  
  // Average monthly spending (from 6 months data)
  const averageMonthly = monthlyExpenseTrends.length > 0
    ? monthlyExpenseTrends.reduce((sum, month) => sum + month.amount, 0) / monthlyExpenseTrends.length
    : 0;
  
  const handlePieClick = (data: any) => {
    setSelectedCategory(data.category);
  };
  
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="font-medium">{`${payload[0].payload.date}`}</p>
          <p className="text-primary">{`Amount: ${formatCurrency(payload[0].value as number)}`}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground">
              Across {categoryData.length} categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Monthly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(averageMonthly)}</div>
            <p className="text-xs text-muted-foreground">
              Based on {monthlyExpenseTrends.length} months of data
            </p>
          </CardContent>
        </Card>
        
        {topCategory && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topCategory.category}</div>
              <div className="flex items-center justify-between">
                <p className="text-primary font-medium">{formatCurrency(topCategory.amount)}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(topCategory.percentage * 100)}% of total
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Pie Chart */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>
                  {selectedCategory ? `${selectedCategory} Expenses` : 'Spending by Category'}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px] flex flex-col">
                {selectedCategory ? (
                  <div className="mb-4">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className="text-sm text-primary font-medium hover:underline"
                    >
                      ← Back to all categories
                    </button>
                  </div>
                ) : null}
                
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    {!selectedCategory ? (
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="amount"
                          nameKey="category"
                          onClick={handlePieClick}
                          cursor="pointer"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={getCategoryColor(entry.category)} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [formatCurrency(value as number), 'Amount']}
                        />
                        <Legend 
                          formatter={(value) => <span className="text-sm">{value}</span>}
                        />
                      </PieChart>
                    ) : (
                      <LineChart
                        data={dailyExpenses}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis 
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="amount"
                          stroke={getCategoryColor(selectedCategory)}
                          activeDot={{ r: 8 }}
                          name={selectedCategory}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Daily Expenses Line Chart */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Daily Expenses</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={generateDailyExpenses()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Daily Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          {/* Monthly Trends Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Expense Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyExpenseTrends}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Amount']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="amount" 
                    fill="#8884d8" 
                    name="Monthly Total" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
