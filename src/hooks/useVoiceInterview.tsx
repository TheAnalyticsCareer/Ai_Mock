
import { useState, useEffect, useCallback, useRef } from 'react';
import { vapiService } from '../lib/vapi';
import { geminiService } from '../lib/gemini';
import { Interview, Transcript } from '../types';

interface UseVoiceInterviewProps {
  interview: Interview;
  onTranscriptUpdate: (transcript: Transcript[]) => void;
  onInterviewEnd: () => void;
}

export const useVoiceInterview = ({
  interview,
  onTranscriptUpdate,
  onInterviewEnd
}: UseVoiceInterviewProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const processedMessageIds = useRef(new Set<string>());

  // Generate initial questions when component mounts
  useEffect(() => {
    generateInitialQuestions();
  }, [interview]);

  const generateInitialQuestions = async () => {
    try {
      const generatedQuestions = await geminiService.generateInterviewQuestions(
        interview.role,
        interview.level,
        interview.techStack,
        interview.numberOfQuestions
      );
      setQuestions(generatedQuestions);
      if (generatedQuestions.length > 0) {
        setCurrentQuestion(generatedQuestions[0]);
      }
    } catch (error) {
      console.error('Failed to generate questions:', error);
    }
  };

  const startVoiceInterview = async () => {
    try {
      const systemPrompt = await geminiService.generateSystemPrompt(
        interview.role,
        interview.level,
        interview.techStack
      );

      await vapiService.startCall(systemPrompt);
      setIsCallActive(true);

      // Setup message listener for real-time transcript
      const vapi = vapiService.getVapi();
      vapi.on('message', handleVapiMessage);
      
    } catch (error) {
      console.error('Failed to start voice interview:', error);
      throw error;
    }
  };

  const endVoiceInterview = async () => {
    try {
      await vapiService.endCall();
      setIsCallActive(false);
      // Clear processed message IDs when ending interview
      processedMessageIds.current.clear();
      onInterviewEnd();
    } catch (error) {
      console.error('Failed to end voice interview:', error);
    }
  };

  const handleVapiMessage = useCallback((message: any) => {
    console.log('Vapi message:', message);
    
    // Create a unique message ID to prevent duplicates
    const messageId = `${message.type}-${message.timestamp || Date.now()}-${message.transcript?.substring(0, 20) || ''}`;
    
    // Skip if we've already processed this message
    if (processedMessageIds.current.has(messageId)) {
      console.log('Skipping duplicate message:', messageId);
      return;
    }
    
    // Handle different message types from Vapi
    if (message.type === 'transcript' && message.transcript && message.transcript.trim()) {
      processedMessageIds.current.add(messageId);
      
      const newTranscriptEntry: Transcript = {
        id: messageId,
        speaker: message.role === 'assistant' ? 'interviewer' : 'candidate',
        text: message.transcript.trim(),
        timestamp: new Date()
      };

      setTranscript(prev => {
        // Double-check for duplicates in the transcript array
        const isDuplicate = prev.some(entry => 
          entry.text === newTranscriptEntry.text && 
          entry.speaker === newTranscriptEntry.speaker &&
          Math.abs(entry.timestamp.getTime() - newTranscriptEntry.timestamp.getTime()) < 2000
        );
        
        if (isDuplicate) {
          console.log('Preventing duplicate transcript entry');
          return prev;
        }
        
        const updated = [...prev, newTranscriptEntry];
        onTranscriptUpdate(updated);
        return updated;
      });

      // If it's a candidate response, consider generating follow-up question
      if (message.role === 'user' && message.transcript.trim()) {
        handleCandidateResponse(message.transcript.trim());
      }
    }
  }, [onTranscriptUpdate]);

  const handleCandidateResponse = async (response: string) => {
    if (isGeneratingQuestion) return;

    setIsGeneratingQuestion(true);
    try {
      // Generate follow-up question based on response
      const followUp = await geminiService.generateFollowUpQuestion(
        interview.role,
        interview.level,
        interview.techStack,
        currentQuestion,
        response
      );

      // Decide whether to ask follow-up or move to next question
      // For now, we'll move to next question after each response
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
      }
    } catch (error) {
      console.error('Error handling candidate response:', error);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return {
    isCallActive,
    currentQuestion,
    transcript,
    questions,
    currentQuestionIndex,
    isGeneratingQuestion,
    startVoiceInterview,
    endVoiceInterview
  };
};
