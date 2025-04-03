
import { useState } from 'react';
import { useExpense } from '@/contexts/ExpenseContext';
import { Group, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Users } from 'lucide-react';

interface GroupFormProps {
  onSubmit: () => void;
  existingGroup?: Group;
}

const GroupForm = ({ onSubmit, existingGroup }: GroupFormProps) => {
  const { addGroup, updateGroup } = useExpense();
  
  const [name, setName] = useState(existingGroup?.name || '');
  const [description, setDescription] = useState(existingGroup?.description || '');
  const [members, setMembers] = useState<User[]>(
    existingGroup?.members || [{ id: 'user-1', name: 'You', email: 'you@example.com' }]
  );
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const handleAddMember = () => {
    if (newMemberName && newMemberEmail) {
      setMembers([
        ...members, 
        { 
          id: `user-${Date.now()}`, 
          name: newMemberName, 
          email: newMemberEmail 
        }
      ]);
      setNewMemberName('');
      setNewMemberEmail('');
    }
  };
  
  const handleRemoveMember = (id: string) => {
    if (id === 'user-1') return; // Prevent removing yourself
    setMembers(members.filter(member => member.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const groupData = {
      name,
      description,
      members
    };
    
    if (existingGroup) {
      updateGroup(existingGroup.id, groupData);
    } else {
      addGroup(groupData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Group Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add notes about this group"
          rows={3}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <Label className="font-medium">Group Members</Label>
          <div className="ml-2 bg-muted rounded-full px-2 py-0.5 text-xs">
            {members.length}
          </div>
        </div>
        
        <div className="border rounded-md divide-y">
          {members.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3">
              <div>
                <p className="font-medium">
                  {member.name} {member.id === 'user-1' && '(You)'}
                </p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveMember(member.id)}
                disabled={member.id === 'user-1'} // Can't remove yourself
                className={member.id === 'user-1' ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="border rounded-md p-4 bg-muted/50">
          <h4 className="font-medium mb-2 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Add New Member
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="new-member-name" className="sr-only">Name</Label>
              <Input
                id="new-member-name"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div>
              <Label htmlFor="new-member-email" className="sr-only">Email</Label>
              <Input
                id="new-member-email"
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={handleAddMember}
            disabled={!newMemberName || !newMemberEmail}
            size="sm"
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSubmit}>
          Cancel
        </Button>
        <Button type="submit">
          {existingGroup ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default GroupForm;
