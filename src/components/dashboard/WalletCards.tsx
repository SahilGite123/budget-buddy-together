
import { useState } from 'react';
import { Wallet as WalletIcon, PiggyBank, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wallet } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface WalletCardsProps {
  wallets: Wallet[];
  onUpdateWallet: (id: string, data: Partial<Wallet>) => void;
  onTransferToSavings: (amount: number) => void;
  onUseSavings: (amount: number) => void;
}

const WalletCards = ({ wallets, onUpdateWallet, onTransferToSavings, onUseSavings }: WalletCardsProps) => {
  const { toast } = useToast();
  const [transferAmount, setTransferAmount] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newSavingsGoal, setNewSavingsGoal] = useState('');
  
  const spendingWallet = wallets.find(w => w.type === 'spending');
  const savingsWallet = wallets.find(w => w.type === 'savings');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to transfer",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > (spendingWallet?.amount || 0)) {
      toast({
        title: "Insufficient funds",
        description: "Your spending wallet doesn't have enough funds",
        variant: "destructive"
      });
      return;
    }
    
    onTransferToSavings(amount);
    setTransferAmount('');
    toast({
      title: "Transfer complete",
      description: `Transferred ${formatCurrency(amount)} to savings wallet`
    });
  };

  const handleUseSavings = () => {
    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to use",
        variant: "destructive"
      });
      return;
    }
    
    if (amount > (savingsWallet?.amount || 0)) {
      toast({
        title: "Insufficient funds",
        description: "Your savings wallet doesn't have enough funds",
        variant: "destructive"
      });
      return;
    }
    
    onUseSavings(amount);
    setSavingsAmount('');
    toast({
      title: "Transfer complete",
      description: `Used ${formatCurrency(amount)} from savings wallet`
    });
  };

  const handleUpdateLimit = () => {
    if (!spendingWallet) return;
    
    const limit = parseFloat(newLimit);
    if (isNaN(limit) || limit < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid monthly limit",
        variant: "destructive"
      });
      return;
    }
    
    onUpdateWallet(spendingWallet.id, { monthlyLimit: limit });
    setNewLimit('');
    toast({
      title: "Limit updated",
      description: `Monthly spending limit set to ${formatCurrency(limit)}`
    });
  };

  const handleUpdateSavingsGoal = () => {
    if (!savingsWallet) return;
    
    const goal = parseFloat(newSavingsGoal);
    if (isNaN(goal) || goal < 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid savings goal",
        variant: "destructive"
      });
      return;
    }
    
    onUpdateWallet(savingsWallet.id, { savingsGoal: goal });
    setNewSavingsGoal('');
    toast({
      title: "Goal updated",
      description: `Savings goal set to ${formatCurrency(goal)}`
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Wallets</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Spending Wallet */}
        <div className="border border-blue-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="bg-blue-50 p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <WalletIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-900">Spending Wallet</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Monthly spending limit</p>
          </div>
          
          <div className="p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatCurrency(spendingWallet?.monthlyLimit || 0)}
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Available: {formatCurrency(spendingWallet?.amount || 0)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hover:bg-blue-50">Update Limit</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Update Monthly Spending Limit</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="spending-limit">Monthly Spending Limit</Label>
                      <Input
                        id="spending-limit"
                        type="number"
                        placeholder="Enter amount"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                        className="focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateLimit}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                    <ArrowRightLeft className="h-4 w-4" />
                    Transfer to Savings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Transfer to Savings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="transfer-amount">Amount to Transfer</Label>
                      <Input
                        id="transfer-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        className="focus:ring-blue-500"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Available: {formatCurrency(spendingWallet?.amount || 0)}
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleTransfer}>Transfer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Savings Wallet */}
        <div className="border border-green-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="bg-green-50 p-4 border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <PiggyBank className="h-6 w-6 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Savings Wallet</h3>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Your savings goal</p>
          </div>
          
          <div className="p-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(savingsWallet?.savingsGoal || 0)}
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Current savings: {formatCurrency(savingsWallet?.amount || 0)}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="hover:bg-green-50">Set Savings Goal</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Set Savings Goal</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="savings-goal">Savings Goal</Label>
                      <Input
                        id="savings-goal"
                        type="number"
                        placeholder="Enter goal amount"
                        value={newSavingsGoal}
                        onChange={(e) => setNewSavingsGoal(e.target.value)}
                        className="focus:ring-green-500"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUpdateSavingsGoal} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600">
                    <ArrowRightLeft className="h-4 w-4" />
                    Use Savings
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Use Savings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="savings-amount">Amount to Use</Label>
                      <Input
                        id="savings-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(e.target.value)}
                        className="focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Available: {formatCurrency(savingsWallet?.amount || 0)}
                    </p>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleUseSavings} className="bg-amber-500 hover:bg-amber-600">Use Savings</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCards;
