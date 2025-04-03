
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import WalletCards from '@/components/dashboard/WalletCards';

const Dashboard = () => {
  const { wallets, updateWallet, transferToSavings, useSavings } = useExpense();

  const handleUpdateWallet = (id: string, updates: any) => {
    updateWallet(id, updates);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="card-container space-y-6">
        <WalletCards 
          wallets={wallets}
          onUpdateWallet={handleUpdateWallet}
          onTransferToSavings={transferToSavings}
          onUseSavings={useSavings}
        />
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Expense Summary</h2>
          <DashboardSummary />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <ExpenseChart />
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
