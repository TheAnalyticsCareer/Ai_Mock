import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { ArrowLeft, Calendar, Clock, Star, User, MessageSquare, Download, Share, RefreshCw } from 'lucide-react';
import { getInterviewById, createInterview } from '../lib/interviews';
import { getCurrentUser } from '../lib/auth';
import { Interview } from '../types';
import { generateInterviewPDF, shareInterviewFeedback } from '../utils/pdfGenerator';
import { useToast } from '../hooks/use-toast';

const InterviewDetails = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [retaking, setRetaking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (interviewId) {
      loadInterview(interviewId);
    }
  }, [interviewId]);

  const loadInterview = async (id: string) => {
    try {
      const data = await getInterviewById(id);
      setInterview(data);
    } catch (error) {
      console.error('Failed to load interview:', error);
      toast({
        title: "Error",
        description: "Failed to load interview",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartLiveInterview = () => {
    navigate(`/interview/${interviewId}/live`);
  };

  const handleRetakeInterview = async () => {
    if (!interview) return;
    
    setRetaking(true);
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        toast({
          title: "Error",
          description: "Please sign in to retake interview",
          variant: "destructive"
        });
        return;
      }

      // Create a new interview with the same parameters
      const newInterviewId = await createInterview(
        currentUser.uid,
        interview.role,
        interview.level,
        interview.techStack,
        interview.numberOfQuestions
      );

      toast({
        title: "Success",
        description: "New interview created! Redirecting...",
      });

      // Navigate to the new interview
      navigate(`/interview/${newInterviewId}`);
    } catch (error) {
      console.error('Failed to create retake interview:', error);
      toast({
        title: "Error",
        description: "Failed to create new interview",
        variant: "destructive"
      });
    } finally {
      setRetaking(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!interview || !interview.feedback) return;
    
    setDownloadingPDF(true);
    try {
      const pdfBlob = await generateInterviewPDF(interview);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${interview.role}-interview-feedback.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Feedback PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive"
      });
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleShare = async () => {
    if (!interview) return;
    
    setSharing(true);
    try {
      const message = await shareInterviewFeedback(interview);
      if (message) {
        toast({
          title: "Success",
          description: message,
        });
      } else {
        toast({
          title: "Success",
          description: "Shared successfully!",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share feedback",
        variant: "destructive"
      });
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview not found</h1>
          <Button onClick={() => navigate('/')}>Go back to dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              {interview.feedback && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleRetakeInterview}
                    disabled={retaking}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retaking ? 'Creating...' : 'Retake Interview'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShare}
                    disabled={sharing}
                  >
                    <Share className="w-4 h-4 mr-2" />
                    {sharing ? 'Sharing...' : 'Share'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                  </Button>
                </>
              )}
              {!interview.finalized && interview.status === 'pending' && (
                <Button onClick={handleStartLiveInterview}>
                  Start Interview
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Interview Header */}
        <div className="mb-8">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
            <img
              src={`https://images.unsplash.com/${interview.coverImage}?w=800&h=400&fit=crop`}
              alt={`${interview.role} interview`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl font-bold mb-2">{interview.role}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {interview.createdAt.toDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {interview.level} level
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {interview.numberOfQuestions} questions
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'}>
              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1).replace('-', ' ')}
            </Badge>
            {interview.score && (
              <div className="flex items-center gap-1 text-lg font-semibold text-blue-600">
                <Star className="w-5 h-5" />
                {interview.score}/100
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {interview.techStack.map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Section */}
            {interview.feedback && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Feedback</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {interview.feedback.overallScore}/100
                    </div>
                    <p className="text-gray-600">Overall Score</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Category Breakdown</h4>
                    {Object.entries(interview.feedback.categories).map(([category, score]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-gray-600">{score}/100</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Summary</h4>
                    <p className="text-gray-700">{interview.feedback.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-green-600">Strengths</h4>
                      <ul className="space-y-2">
                        {interview.feedback.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-600">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {interview.feedback.improvements.map((improvement, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-orange-500 mr-2">•</span>
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transcript Section */}
            {interview.transcript && interview.transcript.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Interview Transcript</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {interview.transcript.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`flex ${entry.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            entry.speaker === 'candidate'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="text-xs opacity-75 mb-1">
                            {entry.speaker === 'candidate' ? 'You' : 'Interviewer'} • {' '}
                            {entry.timestamp.toLocaleTimeString()}
                          </div>
                          <div>{entry.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="font-semibold">{interview.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Level</label>
                  <p className="font-semibold capitalize">{interview.level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Questions</label>
                  <p className="font-semibold">{interview.numberOfQuestions}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created</label>
                  <p className="font-semibold">{interview.createdAt.toDateString()}</p>
                </div>
                {interview.completedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Completed</label>
                    <p className="font-semibold">{interview.completedAt.toDateString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {interview.feedback && (
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button onClick={handleRetakeInterview} className="w-full" disabled={retaking}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {retaking ? 'Creating...' : 'Retake Interview'}
                  </Button>
                  <Button onClick={handleDownloadPDF} className="w-full" disabled={downloadingPDF}>
                    <Download className="w-4 h-4 mr-2" />
                    {downloadingPDF ? 'Downloading...' : 'Download PDF'}
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="w-full" disabled={sharing}>
                    <Share className="w-4 h-4 mr-2" />
                    {sharing ? 'Sharing...' : 'Share Feedback'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {!interview.finalized && interview.status === 'pending' && (
              <Card>
                <CardContent className="pt-6">
                  <Button onClick={handleStartLiveInterview} className="w-full">
                    Start Interview
                  </Button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Click to begin your live interview session
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewDetails;
