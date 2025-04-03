
import { useExpense } from '@/contexts/ExpenseContext';
import { ExpenseCategory } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ExpenseChart = () => {
  const { getExpensesByCategory, getCategoryColor } = useExpense();
  
  const categoryData = getExpensesByCategory();
  
  const chartData = Object.entries(categoryData)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: category,
      value: Math.round(value * 100) / 100,
      color: getCategoryColor(category as ExpenseCategory)
    }));

  return (
    <Card className="col-span-1 md:col-span-2 h-[400px]">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Amount']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
