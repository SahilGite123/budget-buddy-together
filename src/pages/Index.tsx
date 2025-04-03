
import { Link } from "react-router-dom";
import { Wallet, UserRound, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
          {/* Logo and Header */}
          <div className="flex items-center justify-center mb-12 animate-fade-in">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mr-5">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="text-primary">ExpenseSync</span>
            </h1>
          </div>
          
          {/* Main Card */}
          <Card className="w-full border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-3">Track and manage your expenses with ease</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  ExpenseSync helps you monitor personal spending, collaborate on group expenses, and get valuable insights through detailed analytics.
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3 mt-10">
                {/* Personal Button Card */}
                <div className="group">
                  <Link to="/dashboard">
                    <Card className="h-full border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden group-hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                          <UserRound className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-medium">Personal</h3>
                        <p className="text-sm text-muted-foreground">
                          Track your individual expenses and manage your personal budget
                        </p>
                        <Button className="mt-4 w-full" variant="outline">
                          Enter Dashboard
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                
                {/* Group Button Card */}
                <div className="group">
                  <Link to="/groups">
                    <Card className="h-full border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden group-hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                          <Users className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-medium">Group</h3>
                        <p className="text-sm text-muted-foreground">
                          Split expenses with friends, family, or roommates easily
                        </p>
                        <Button className="mt-4 w-full" variant="outline">
                          Manage Groups
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
                
                {/* Analytics Button Card */}
                <div className="group">
                  <Link to="/analytics">
                    <Card className="h-full border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden group-hover:shadow-md">
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                          <BarChart3 className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-medium">Analytics</h3>
                        <p className="text-sm text-muted-foreground">
                          Visualize your spending patterns with interactive charts
                        </p>
                        <Button className="mt-4 w-full" variant="outline">
                          View Analytics
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
