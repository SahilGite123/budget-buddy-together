
import { useExpense } from '@/contexts/ExpenseContext';
import { Group } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { MoreVertical, Edit, Trash2, CreditCard, Users } from 'lucide-react';

interface GroupListProps {
  onEdit: (group: Group) => void;
}

const GroupList = ({ onEdit }: GroupListProps) => {
  const { groups, deleteGroup } = useExpense();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.length === 0 ? (
        <div className="col-span-full text-center py-8">
          <p className="text-muted-foreground">No groups found</p>
        </div>
      ) : (
        groups.map(group => (
          <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center">
                  {group.name}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(group)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteGroup(group.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Created {format(group.createdAt, 'MMM d, yyyy')}
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              {group.description && (
                <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{group.members.length} Members</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{formatCurrency(group.totalExpenses)}</span>
                </div>
              </div>
              
              <div className="flex -space-x-2 overflow-hidden">
                {group.members.slice(0, 5).map(member => (
                  <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {group.members.length > 5 && (
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                    +{group.members.length - 5}
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button asChild className="w-full">
                <Link to={`/groups/${group.id}`}>
                  View Details
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default GroupList;
