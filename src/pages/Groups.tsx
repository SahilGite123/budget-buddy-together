
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useExpense } from "@/contexts/ExpenseContext";
import GroupList from "@/components/groups/GroupList";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GroupForm from "@/components/groups/GroupForm";
import { Group } from "@/types";

const Groups = () => {
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>(undefined);

  const handleAddGroup = () => {
    setSelectedGroup(undefined);
    setIsGroupDialogOpen(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsGroupDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsGroupDialogOpen(false);
    setSelectedGroup(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
        <Button onClick={handleAddGroup}>
          <Plus className="mr-2 h-4 w-4" />
          Create Group
        </Button>
      </div>

      <p className="text-muted-foreground mb-6">
        Create and manage expense groups with friends, roommates, or colleagues. 
        Split bills fairly and keep track of balances.
      </p>

      <GroupList onEdit={handleEditGroup} />

      <Dialog open={isGroupDialogOpen} onOpenChange={setIsGroupDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGroup ? 'Edit Group' : 'Create New Group'}
            </DialogTitle>
          </DialogHeader>
          <GroupForm 
            onSubmit={handleCloseDialog} 
            existingGroup={selectedGroup}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Groups;
