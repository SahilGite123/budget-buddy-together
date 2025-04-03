
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, Users, ChartPieIcon, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Manage Your Expenses <span className="text-primary">Simply and Efficiently</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Track personal expenses, split group bills, and stay on top of your finances with our 
            powerful expense tracking application.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8">
              <Link to="/expenses">
                View Expenses
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personal Expenses</h3>
            <p className="text-muted-foreground mb-4">
              Easily track your daily expenses and categorize them to understand your spending patterns.
            </p>
            <Link to="/expenses" className="text-primary font-semibold inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Group Expenses</h3>
            <p className="text-muted-foreground mb-4">
              Split bills with friends, roommates, or family. Track who owes what and settle up easily.
            </p>
            <Link to="/groups" className="text-primary font-semibold inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ChartPieIcon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visual Reports</h3>
            <p className="text-muted-foreground mb-4">
              View helpful charts and reports to visualize your spending habits and gain financial insights.
            </p>
            <Link to="/dashboard" className="text-primary font-semibold inline-flex items-center">
              Learn more <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
