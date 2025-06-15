<<<<<<< HEAD
import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env';

const genAI = new GoogleGenerativeAI(env.VITE_GEMINI_API_KEY);

export const generateFeedback = async (transcript: string, role: string, candidateName: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Clean and validate transcript
  const cleanTranscript = transcript?.trim() || 'Interview completed successfully';
  
  console.log('Generating feedback with:', { 
    transcriptLength: cleanTranscript.length, 
    role, 
    candidateName 
  });
  
  // Enhanced prompt: include candidate background and personal details for richer feedback
  const prompt = `
    You are an expert interviewer and hiring analyst. 

    Interview Details:
    - Position: ${role}
    - Candidate Name: ${candidateName}
    - (Below you will find the live interview transcript, which includes the candidate's answers about their name, work experience, education, and all other details you asked for in the beginning, as well as all technical and behavioral interview questions and answers.)

    Interview Transcript:
    ${cleanTranscript}

    TASK: 
    1. Summarize the candidate's background (education, years of experience, and any relevant details stated in the beginning).
    2. Evaluate and comment on their communication skills and how they described themselves.
    3. Provide a detailed, personalized interview evaluation based on both personal background and technical answers.

    Please return feedback as pure JSON with the following fields:

    {
      "overallRating": "Score between 1 and 10",
      "summary": "A comprehensive summary that incorporates both the technical and personal details provided, including your impression of the candidate.",
      "strengths": [ "Biggest strengths/best parts you noticed" ],
      "weaknesses": [ "Areas to improve based on BOTH background and answers" ],
      "improvements": [ "Concrete, personalized suggestions" ],
      "technicalSkills": "Technical skills evaluation, including relevant background info",
      "communicationSkills": "Assessment of their communication and how they described themselves",
      "recommendations": "Clear development plan and next steps, based on ALL info provided",
      "backgroundSummary": "Short summary of their education, experience, and background you collected in the interview",
      "interviewInsights": "Notable impressions or personality traits revealed",
      "nextSteps": "What the candidate should do next for best results"
    }

    Return valid JSON only, no text outside JSON.
  `;

  try {
    console.log('Sending request to Gemini API...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Raw Gemini response received:', text);

    // Extract and parse JSON
    let jsonText = text.trim();

    // Remove markdown formatting if present
    if (jsonText.includes('```json')) {
      const match = jsonText.match(/```json\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonText = match[1].trim();
      }
    } else if (jsonText.includes('```')) {
      const match = jsonText.match(/```\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonText = match[1].trim();
      }
    }

    // Find JSON boundaries
    const startIndex = jsonText.indexOf('{');
    const endIndex = jsonText.lastIndexOf('}');

    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      jsonText = jsonText.substring(startIndex, endIndex + 1);
    }

    let feedbackData;
    try {
      feedbackData = JSON.parse(jsonText);
      console.log('Successfully parsed feedback:', feedbackData);
    } catch (parseError) {
      console.error('JSON parsing failed. Raw response:', jsonText);
      
      // Fallback: return default feedback structure
      feedbackData = {
        overallRating: "7",
        summary: "The interview was completed successfully. The candidate demonstrated engagement and responded to questions appropriately.",
        strengths: [
          "Showed up prepared for the interview",
          "Engaged actively in the conversation",
          "Demonstrated willingness to learn"
        ],
        weaknesses: [
          "Could improve technical depth in responses",
          "May benefit from more structured answers"
        ],
        improvements: [
          "Practice technical interview questions",
          "Work on providing more detailed examples"
        ],
        technicalSkills: "The candidate showed basic technical understanding with room for growth in specific areas.",
        communicationSkills: "Good communication skills with clear articulation of thoughts and ideas.",
        recommendations: "Continue practicing interview skills and focus on technical preparation for future opportunities.",
        interviewInsights: "The candidate demonstrated good interview presence and professionalism.",
        nextSteps: "Focus on technical skill development and practice more interview scenarios."
      };
    }

    // Validate and ensure all required fields
    const requiredFields = [
      "overallRating", "summary", "strengths", "weaknesses", 
      "improvements", "technicalSkills", "communicationSkills", "recommendations"
    ];

    const missingFields = requiredFields.filter(field => !feedbackData[field]);
    
    if (missingFields.length > 0) {
      console.warn('Some fields missing, using defaults for:', missingFields);
      
      // Fill in missing fields with defaults
      if (!feedbackData.overallRating) feedbackData.overallRating = "7";
      if (!feedbackData.summary) feedbackData.summary = "Interview completed with satisfactory performance.";
      if (!feedbackData.strengths) feedbackData.strengths = ["Demonstrated engagement", "Showed professionalism"];
      if (!feedbackData.weaknesses) feedbackData.weaknesses = ["Room for improvement in technical depth"];
      if (!feedbackData.improvements) feedbackData.improvements = ["Continue practicing interview skills"];
      if (!feedbackData.technicalSkills) feedbackData.technicalSkills = "Basic technical understanding demonstrated.";
      if (!feedbackData.communicationSkills) feedbackData.communicationSkills = "Clear communication throughout the interview.";
      if (!feedbackData.recommendations) feedbackData.recommendations = "Focus on continued learning and skill development.";
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(feedbackData.strengths)) {
      feedbackData.strengths = [feedbackData.strengths || "Professional demeanor"];
    }
    if (!Array.isArray(feedbackData.weaknesses)) {
      feedbackData.weaknesses = [feedbackData.weaknesses || "Areas for growth identified"];
    }
    if (!Array.isArray(feedbackData.improvements)) {
      feedbackData.improvements = [feedbackData.improvements || "Continue skill development"];
    }

    // Add optional fields if missing
    if (!feedbackData.interviewInsights) {
      feedbackData.interviewInsights = "The candidate showed good interview preparation and engagement.";
    }
    if (!feedbackData.nextSteps) {
      feedbackData.nextSteps = "Focus on areas identified for improvement and continue professional development.";
    }

    console.log('Feedback validation completed successfully');
    return feedbackData;

  } catch (error: any) {
    console.error('Error generating feedback:', error);
    
    // Return a fallback response instead of throwing
    return {
      overallRating: "6",
      summary: "Interview session completed. Due to technical limitations, this is a standard feedback response. The candidate participated in the interview process.",
      strengths: [
        "Participated actively in the interview",
        "Demonstrated professionalism",
        "Engaged with the interview process"
      ],
      weaknesses: [
        "Unable to assess specific areas due to technical issues",
        "Recommend scheduling a follow-up for detailed feedback"
      ],
      improvements: [
        "Continue practicing interview skills",
        "Prepare for technical questions in your field"
      ],
      technicalSkills: "Technical assessment was not fully completed due to system limitations.",
      communicationSkills: "Basic communication assessment completed during the interview session.",
      recommendations: "Continue developing both technical and soft skills. Consider scheduling additional practice sessions.",
      interviewInsights: "Interview process completed with standard engagement level.",
      nextSteps: "Review common interview questions and practice responses for future opportunities."
    };
  }
};
=======

import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'AIzaSyCSdkqQf3a2mWqf5OeebMSdEvJqW0kzu78';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateInterviewQuestions(
    role: string,
    level: string,
    techStack: string[],
    numberOfQuestions: number,
    previousResponses?: string[]
  ): Promise<string[]> {
    const techStackStr = techStack.join(', ');
    const contextualInfo = previousResponses 
      ? `Based on the candidate's previous responses: ${previousResponses.join('. ')}`
      : '';

    const prompt = `
      Generate ${numberOfQuestions} technical interview questions for a ${level} level ${role} position.
      Tech stack focus: ${techStackStr}
      
      ${contextualInfo}
      
      Requirements:
      - Questions should be appropriate for ${level} level (junior: basic concepts, mid: practical application, senior: architecture and leadership)
      - Focus on ${techStackStr} technologies
      - Include a mix of technical knowledge, problem-solving, and practical scenarios
      - Make questions conversational and suitable for voice interaction
      - Each question should be clear and not too long for voice delivery
      
      Return ONLY the questions, one per line, numbered 1-${numberOfQuestions}.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the response to extract questions
      const questions = text
        .split('\n')
        .filter(line => line.trim().match(/^\d+\./))
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .slice(0, numberOfQuestions);

      return questions.length > 0 ? questions : this.getDefaultQuestions(role, level);
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      return this.getDefaultQuestions(role, level);
    }
  }

  async generateFollowUpQuestion(
    role: string,
    level: string,
    techStack: string[],
    currentQuestion: string,
    candidateResponse: string
  ): Promise<string> {
    const prompt = `
      Based on this interview context:
      - Role: ${role} (${level} level)
      - Tech Stack: ${techStack.join(', ')}
      - Current Question: ${currentQuestion}
      - Candidate's Response: ${candidateResponse}
      
      Generate ONE relevant follow-up question that:
      - Builds on their response naturally
      - Probes deeper into their understanding
      - Is appropriate for voice conversation
      - Tests practical application if they gave theoretical answers
      
      Return ONLY the follow-up question, nothing else.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Error generating follow-up question:', error);
      return "Can you elaborate on that with a specific example?";
    }
  }

  private getDefaultQuestions(role: string, level: string): string[] {
    const baseQuestions = [
      "Tell me about your experience with the technologies mentioned in this role.",
      "Walk me through how you would approach solving a complex technical problem.",
      "Describe a challenging project you've worked on recently and how you overcame obstacles.",
      "How do you stay updated with new technologies and best practices?",
      "What's your experience with code reviews and maintaining code quality?"
    ];

    return baseQuestions;
  }

  async generateSystemPrompt(role: string, level: string, techStack: string[]): Promise<string> {
    return `
      You are conducting a technical interview for a ${level} level ${role} position.
      
      Key responsibilities:
      - Ask questions about: ${techStack.join(', ')}
      - Listen to candidate responses carefully
      - Ask relevant follow-up questions based on their answers
      - Maintain a professional but friendly tone
      - Keep questions focused on technical skills and problem-solving
      - Adapt difficulty based on ${level} level expectations
      
      Interview flow:
      1. Start with a brief introduction
      2. Ask technical questions one at a time
      3. Allow candidate to finish their response completely
      4. Ask follow-up questions when appropriate
      5. Move to next question naturally
      
      Keep responses concise and professional. Ask clear, specific questions.
    `;
  }
}

export const geminiService = new GeminiService();
>>>>>>> acceb899a0bb91372a4fba9e6a0b6162831f78a2
