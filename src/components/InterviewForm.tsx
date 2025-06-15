
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ROLES, TECH_STACKS } from '../constants';

interface InterviewFormProps {
  onSubmit: (data: {
    role: string;
    level: 'junior' | 'mid' | 'senior';
    techStack: string[];
    numberOfQuestions: number;
  }) => void;
  onCancel: () => void;
}

const InterviewForm: React.FC<InterviewFormProps> = ({ onSubmit, onCancel }) => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState<'junior' | 'mid' | 'senior'>('mid');
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);

  const availableTechStacks = role ? TECH_STACKS[role as keyof typeof TECH_STACKS] || [] : [];

  const handleTechStackChange = (tech: string, checked: boolean) => {
    if (checked) {
      setSelectedTechStack([...selectedTechStack, tech]);
    } else {
      setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || selectedTechStack.length === 0) {
      return;
    }
    onSubmit({
      role,
      level,
      techStack: selectedTechStack,
      numberOfQuestions
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Start New Interview</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Experience Level</Label>
              <Select value={level} onValueChange={(value: 'junior' | 'mid' | 'senior') => setLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                  <SelectItem value="mid">Mid-level (2-5 years)</SelectItem>
                  <SelectItem value="senior">Senior (5+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="questions">Number of Questions</Label>
              <Input
                id="questions"
                type="number"
                min="3"
                max="15"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
              />
            </div>

            {availableTechStacks.length > 0 && (
              <div>
                <Label>Tech Stack (select at least one)</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableTechStacks.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <Checkbox
                        id={tech}
                        checked={selectedTechStack.includes(tech)}
                        onCheckedChange={(checked) => handleTechStackChange(tech, checked as boolean)}
                      />
                      <Label htmlFor={tech} className="text-sm">
                        {tech}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={!role || selectedTechStack.length === 0}
              >
                Start Interview
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewForm;
