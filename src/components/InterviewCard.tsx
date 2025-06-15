
import React from 'react';
import { Calendar, Clock, Star, Eye } from 'lucide-react';
import { Interview, InterviewTemplate } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface InterviewCardProps {
  interview?: Interview;
  template?: InterviewTemplate;
  onViewClick?: () => void;
  onStartClick?: () => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  template,
  onViewClick,
  onStartClick
}) => {
  const isTemplate = !!template;
  const data = interview || template;
  
  if (!data) return null;

  const getStatusBadge = (status?: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    };
    
    return status ? (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    ) : null;
  };

  const getScoreColor = (score?: number) => {
    if (!score) return '';
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={`https://images.unsplash.com/${data.coverImage}?w=400&h=200&fit=crop`}
          alt={`${data.role} interview`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-2 left-2 text-white">
          <h3 className="font-semibold text-lg">{data.role}</h3>
          {interview && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              {interview.createdAt.toDateString()}
            </div>
          )}
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {interview && getStatusBadge(interview.status)}
            {template && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {template.level}
              </span>
            )}
          </div>
          {interview?.score && (
            <div className={`flex items-center gap-1 font-semibold ${getScoreColor(interview.score)}`}>
              <Star className="w-4 h-4" />
              {interview.score}/100
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {data.techStack.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {template && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{template.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {template.estimatedDuration}
            </div>
          </div>
        )}
        
        {interview && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {interview.numberOfQuestions} questions • {interview.level} level
            </p>
            {interview.completedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                Completed {interview.completedAt.toDateString()}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={isTemplate ? onStartClick : onViewClick}
          className="w-full"
          variant={isTemplate ? "default" : "outline"}
        >
          {isTemplate ? 'Start Interview' : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InterviewCard;
