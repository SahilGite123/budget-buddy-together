
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-primary">ExpenseSync</span>
            </h1>
          </div>
          
          <div className="mt-16">
            <Link 
              to="/dashboard" 
              className="inline-block bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Enter Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
