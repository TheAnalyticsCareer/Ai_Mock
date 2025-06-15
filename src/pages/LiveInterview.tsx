
// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Button } from '../components/ui/button';
// // import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// // import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
// // import { useVoiceInterview } from '../hooks/useVoiceInterview';
// // import { getInterviewById, updateInterviewTranscript, finalizeInterview, generateFeedback } from '../lib/interviews';
// // import { Interview, Transcript } from '../types';
// // import { useToast } from '../hooks/use-toast';

// // const LiveInterview = () => {
// //   const { interviewId } = useParams<{ interviewId: string }>();
// //   const navigate = useNavigate();
// //   const [interview, setInterview] = useState<Interview | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const { toast } = useToast();

// //   useEffect(() => {
// //     if (interviewId) {
// //       loadInterview(interviewId);
// //     }
// //   }, [interviewId]);

// //   const loadInterview = async (id: string) => {
// //     try {
// //       const data = await getInterviewById(id);
// //       setInterview(data);
// //     } catch (error) {
// //       console.error('Failed to load interview:', error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to load interview",
// //         variant: "destructive"
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleTranscriptUpdate = async (transcript: Transcript[]) => {
// //     if (interviewId && transcript.length > 0) {
// //       try {
// //         await updateInterviewTranscript(interviewId, transcript);
// //         console.log('Transcript updated in database');
// //       } catch (error) {
// //         console.error('Failed to update transcript:', error);
// //       }
// //     }
// //   };

// //   const handleInterviewEnd = async () => {
// //     if (!interviewId || !interview) return;

// //     try {
// //       // Get the latest interview data to ensure we have the transcript
// //       const latestInterview = await getInterviewById(interviewId);
      
// //       if (latestInterview?.transcript && latestInterview.transcript.length > 0) {
// //         // Generate feedback based on transcript
// //         const feedback = generateFeedback(latestInterview.transcript);
        
// //         // Finalize the interview with feedback
// //         await finalizeInterview(interviewId, feedback, feedback.overallScore);
        
// //         toast({
// //           title: "Success",
// //           description: "Interview completed and feedback generated!",
// //         });
// //       } else {
// //         // Just update status if no transcript available
// //         await updateInterviewTranscript(interviewId, []);
// //         toast({
// //           title: "Interview Ended",
// //           description: "Interview session completed",
// //         });
// //       }

// //       // Navigate back to interview details
// //       navigate(`/interview/${interviewId}`);
// //     } catch (error) {
// //       console.error('Failed to finalize interview:', error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to save interview results",
// //         variant: "destructive"
// //       });
// //     }
// //   };

// //   const {
// //     isCallActive,
// //     currentQuestion,
// //     transcript,
// //     questions,
// //     currentQuestionIndex,
// //     isGeneratingQuestion,
// //     startVoiceInterview,
// //     endVoiceInterview
// //   } = useVoiceInterview({
// //     interview: interview!,
// //     onTranscriptUpdate: handleTranscriptUpdate,
// //     onInterviewEnd: handleInterviewEnd
// //   });

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   if (!interview) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="text-center">
// //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview not found</h1>
// //           <Button onClick={() => navigate('/')}>Go back to dashboard</Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4">
// //       <div className="max-w-4xl mx-auto">
// //         {/* Header */}
// //         <Card className="mb-6">
// //           <CardHeader>
// //             <CardTitle className="flex items-center justify-between">
// //               <span>{interview.role} - Live Interview</span>
// //               <div className="flex items-center gap-2">
// //                 {isCallActive && (
// //                   <div className="flex items-center gap-2 text-green-600">
// //                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
// //                     Live
// //                   </div>
// //                 )}
// //               </div>
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="flex items-center justify-center gap-4">
// //               {!isCallActive ? (
// //                 <Button
// //                   onClick={startVoiceInterview}
// //                   className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
// //                 >
// //                   <Mic className="w-6 h-6 mr-2" />
// //                   Start Interview
// //                 </Button>
// //               ) : (
// //                 <Button
// //                   onClick={endVoiceInterview}
// //                   variant="destructive"
// //                   className="px-8 py-4 text-lg"
// //                 >
// //                   <PhoneOff className="w-6 h-6 mr-2" />
// //                   End Interview
// //                 </Button>
// //               )}
// //             </div>
// //           </CardContent>
// //         </Card>

// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Current Question */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>
// //                 Current Question ({currentQuestionIndex + 1}/{questions.length})
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-4">
// //                 <p className="text-lg font-medium">{currentQuestion}</p>
// //                 {isGeneratingQuestion && (
// //                   <div className="text-sm text-gray-600">
// //                     Generating follow-up question...
// //                   </div>
// //                 )}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Interview Progress */}
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Interview Details</CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-2">
// //               <div><strong>Role:</strong> {interview.role}</div>
// //               <div><strong>Level:</strong> {interview.level}</div>
// //               <div><strong>Tech Stack:</strong> {interview.techStack.join(', ')}</div>
// //               <div><strong>Status:</strong> {isCallActive ? 'In Progress' : 'Ready to Start'}</div>
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Live Transcript */}
// //         {transcript.length > 0 && (
// //           <Card className="mt-6">
// //             <CardHeader>
// //               <CardTitle>Live Transcript</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-3 max-h-96 overflow-y-auto">
// //                 {transcript.map((entry) => (
// //                   <div
// //                     key={entry.id}
// //                     className={`flex ${entry.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}
// //                   >
// //                     <div
// //                       className={`max-w-[80%] rounded-lg p-3 ${
// //                         entry.speaker === 'candidate'
// //                           ? 'bg-blue-600 text-white'
// //                           : 'bg-gray-100 text-gray-900'
// //                       }`}
// //                     >
// //                       <div className="text-xs opacity-75 mb-1">
// //                         {entry.speaker === 'candidate' ? 'You' : 'Interviewer'} • {' '}
// //                         {entry.timestamp.toLocaleTimeString()}
// //                       </div>
// //                       <div>{entry.text}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </CardContent>
// //           </Card>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default LiveInterview;
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button } from '../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
// import { Mic, MicOff, PhoneOff, Video, VideoOff } from 'lucide-react';
// import { useVoiceInterview } from '../hooks/useVoiceInterview';
// import {
//   getInterviewById,
//   updateInterviewTranscript,
//   finalizeInterview,
//   generateFeedback,
// } from '../lib/interviews';
// import { Interview, Transcript } from '../types';
// import { useToast } from '../hooks/use-toast';

// const LiveInterview = () => {
//   const { interviewId } = useParams<{ interviewId: string }>();
//   const navigate = useNavigate();
//   const [interview, setInterview] = useState<Interview | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   // Camera and mic states
//   const [cameraEnabled, setCameraEnabled] = useState(true);
//   const [micEnabled, setMicEnabled] = useState(true);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const mediaStreamRef = useRef<MediaStream | null>(null);

//   useEffect(() => {
//     if (cameraEnabled || micEnabled) {
//       startMediaStream();
//     } else {
//       stopMediaStream();
//     }

//     return () => {
//       stopMediaStream();
//     };
//   }, [cameraEnabled, micEnabled]);

//   const startMediaStream = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: cameraEnabled,
//         audio: micEnabled,
//       });
//       mediaStreamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (err) {
//       console.error('Failed to access camera or mic:', err);
//       toast({
//         title: 'Error',
//         description: 'Failed to access camera or microphone.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const stopMediaStream = () => {
//     mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
//     mediaStreamRef.current = null;
//   };

//   const toggleCamera = () => setCameraEnabled((prev) => !prev);
//   const toggleMic = () => setMicEnabled((prev) => !prev);

//   useEffect(() => {
//     if (interviewId) {
//       loadInterview(interviewId);
//     }
//   }, [interviewId]);

//   const loadInterview = async (id: string) => {
//     try {
//       const data = await getInterviewById(id);
//       setInterview(data);
//     } catch (error) {
//       console.error('Failed to load interview:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to load interview details.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTranscriptUpdate = async (transcript: Transcript[]) => {
//     if (interviewId && transcript.length > 0) {
//       try {
//         await updateInterviewTranscript(interviewId, transcript);
//         console.log('Transcript updated in database');
//       } catch (error) {
//         console.error('Failed to update transcript:', error);
//       }
//     }
//   };

//   const handleInterviewEnd = async () => {
//     if (!interviewId || !interview) return;

//     try {
//       const latestInterview = await getInterviewById(interviewId);

//       if (latestInterview?.transcript && latestInterview.transcript.length > 0) {
//         const feedback = generateFeedback(latestInterview.transcript);
//         await finalizeInterview(interviewId, feedback, feedback.overallScore);

//         toast({
//           title: 'Success',
//           description: 'Interview completed and feedback generated!',
//         });
//       } else {
//         await updateInterviewTranscript(interviewId, []);
//         toast({
//           title: 'Interview Ended',
//           description: 'Interview session completed.',
//         });
//       }

//       navigate(`/interview/${interviewId}`);
//     } catch (error) {
//       console.error('Failed to finalize interview:', error);
//       toast({
//         title: 'Error',
//         description: 'Failed to save interview results.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const {
//     isCallActive,
//     currentQuestion,
//     transcript,
//     questions,
//     currentQuestionIndex,
//     isGeneratingQuestion,
//     startVoiceInterview,
//     endVoiceInterview,
//   } = useVoiceInterview({
//     interview: interview!,
//     onTranscriptUpdate: handleTranscriptUpdate,
//     onInterviewEnd: handleInterviewEnd,
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (!interview) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-200">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">Interview Not Found</h1>
//           <Button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md">
//             Go back to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <Card className="mb-8 bg-white shadow-md rounded-lg">
//           <CardHeader className="border-b p-6">
//             <CardTitle className="flex items-center justify-between text-xl font-semibold text-gray-800">
//               <span>{interview.role} - Live Interview</span>
//               <div className="flex items-center gap-3">
//                 {isCallActive && (
//                   <div className="flex items-center gap-2 text-green-600">
//                     <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                     Live
//                   </div>
//                 )}
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-center gap-6">
//               {!isCallActive ? (
//                 <Button
//                   onClick={startVoiceInterview}
//                   className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg flex items-center"
//                 >
//                   <Mic className="w-5 h-5 mr-2" />
//                   Start Interview
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={endVoiceInterview}
//                   variant="destructive"
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg text-lg flex items-center"
//                 >
//                   <PhoneOff className="w-5 h-5 mr-2" />
//                   End Interview
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Camera Section */}
//         <Card className="mb-8 bg-white shadow-md rounded-lg">
//           <CardHeader className="border-b p-6">
//             <CardTitle className="flex justify-between items-center text-lg font-medium text-gray-800">
//               Your Camera View
//               <div className="flex gap-3">
//                 <Button variant="outline" className="rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={toggleMic}>
//                   {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-red-500" />}
//                 </Button>
//                 <Button variant="outline" className="rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={toggleCamera}>
//                   {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5 text-red-500" />}
//                 </Button>
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex justify-center p-6">
//             <div className="rounded-xl overflow-hidden shadow-lg border">
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 muted
//                 className="w-full max-w-xl aspect-video object-cover"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Current Question */}
//           <Card className="bg-white shadow-md rounded-lg">
//             <CardHeader className="border-b p-6">
//               <CardTitle className="text-lg font-medium text-gray-800">
//                 Current Question ({currentQuestionIndex + 1}/{questions.length})
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="space-y-4">
//                 <p className="text-lg text-gray-900">{currentQuestion}</p>
//                 {isGeneratingQuestion && (
//                   <div className="text-sm text-gray-600 italic">
//                     Generating follow-up question...
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Interview Info */}
//           <Card className="bg-white shadow-md rounded-lg">
//             <CardHeader className="border-b p-6">
//               <CardTitle className="text-lg font-medium text-gray-800">Interview Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 p-6">
//               <div>
//                 <strong className="text-gray-700">Role:</strong> <span className="text-gray-900">{interview.role}</span>
//               </div>
//               <div>
//                 <strong className="text-gray-700">Level:</strong> <span className="text-gray-900">{interview.level}</span>
//               </div>
//               <div>
//                 <strong className="text-gray-700">Tech Stack:</strong> <span className="text-gray-900">{interview.techStack.join(', ')}</span>
//               </div>
//               <div>
//                 <strong className="text-gray-700">Status:</strong>{' '}
//                 <span className={isCallActive ? 'text-green-600 font-semibold' : 'text-gray-900'}>
//                   {isCallActive ? 'In Progress' : 'Ready to Start'}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Live Transcript */}
//         {transcript.length > 0 && (
//           <Card className="mt-8 bg-white shadow-md rounded-lg">
//             <CardHeader className="border-b p-6">
//               <CardTitle className="text-lg font-medium text-gray-800">Live Transcript</CardTitle>
//             </CardHeader>
//             <CardContent className="p-6">
//               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4">
//                 {transcript.map((entry) => (
//                   <div
//                     key={entry.id}
//                     className={`flex flex-col ${entry.speaker === 'candidate' ? 'items-end' : 'items-start'}`}
//                   >
//                     <div
//                       className={`max-w-full sm:max-w-[80%] rounded-lg py-3 px-4 ${
//                         entry.speaker === 'candidate'
//                           ? 'bg-blue-500 text-white'
//                           : 'bg-gray-200 text-gray-900'
//                       }`}
//                     >
//                       <div className="text-xs opacity-75 mb-1">
//                         {entry.speaker === 'candidate' ? 'You' : 'Interviewer'} •{' '}
//                         {entry.timestamp.toLocaleTimeString()}
//                       </div>
//                       <div>{entry.text}</div>
//                     </div>
//                   </div>
//                 ))}
//                 {/* Add a subtle scrollbar styling */}
//                 <style jsx>{`
//                   .overflow-y-auto::-webkit-scrollbar {
//                     width: 8px;
//                   }
//                   .overflow-y-auto::-webkit-scrollbar-track {
//                     background: #f1f1f1;
//                     border-radius: 4px;
//                   }
//                   .overflow-y-auto::-webkit-scrollbar-thumb {
//                     background: #888;
//                     border-radius: 4px;
//                   }
//                   .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//                     background: #555;
//                   }
//                 `}</style>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LiveInterview;

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';
import { useVoiceInterview } from '../hooks/useVoiceInterview';
import { getInterviewById, updateInterviewTranscript, finalizeInterview, generateFeedback } from '../lib/interviews';
import { Interview, Transcript } from '../types';
import { useToast } from '../hooks/use-toast';
import Webcam from 'react-webcam';

const LiveInterview = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const { toast } = useToast();
  const webcamRef = useRef<Webcam>(null);

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

  const handleTranscriptUpdate = async (transcript: Transcript[]) => {
    if (interviewId && transcript.length > 0) {
      try {
        await updateInterviewTranscript(interviewId, transcript);
      } catch (error) {
        console.error('Failed to update transcript:', error);
      }
    }
  };

  const handleInterviewEnd = async () => {
    if (!interviewId || !interview) return;

    try {
      const latestInterview = await getInterviewById(interviewId);

      if (latestInterview?.transcript && latestInterview.transcript.length > 0) {
        const feedback = generateFeedback(latestInterview.transcript);
        await finalizeInterview(interviewId, feedback, feedback.overallScore);

        toast({
          title: "Success",
          description: "Interview completed and feedback generated!",
        });
      } else {
        await updateInterviewTranscript(interviewId, []);
        toast({
          title: "Interview Ended",
          description: "Interview session completed",
        });
      }

      navigate(`/interview/${interviewId}`);
    } catch (error) {
      console.error('Failed to finalize interview:', error);
      toast({
        title: "Error",
        description: "Failed to save interview results",
        variant: "destructive"
      });
    }
  };

  const {
    isCallActive,
    currentQuestion,
    transcript,
    questions,
    currentQuestionIndex,
    isGeneratingQuestion,
    startVoiceInterview,
    endVoiceInterview
  } = useVoiceInterview({
    interview: interview!,
    onTranscriptUpdate: handleTranscriptUpdate,
    onInterviewEnd: handleInterviewEnd
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Interview not found</h1>
          <Button onClick={() => navigate('/')}>Go back to dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-8xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{interview.role} Interview</h1>
            {isCallActive && (
              <div className="ml-4 flex items-center text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>Live</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            {!isCallActive ? (
              <Button
                onClick={startVoiceInterview}
                className="bg-green-600 hover:bg-green-700 flex items-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                Start Interview
              </Button>
            ) : (
              <Button
                onClick={endVoiceInterview}
                variant="destructive"
                className="flex items-center"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                End Interview
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 ">
          {/* Left Column - Transcript */}
          <div className="lg:col-span-4 flex flex-col">
            <Card className="bg-gray-800 border-gray-700 flex-grow flex flex-col text-gray-100">
              <CardHeader>
                <CardTitle className="text-lg">Live Transcript</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow overflow-y-auto max-h-[78vh]">
                {transcript.length > 0 ? (
                  <div className="space-y-3">
                    {transcript
                      .filter((entry, index, self) =>
                        index === 0 || entry.text !== self[index - 1].text || entry.speaker !== self[index - 1].speaker)
                      .map((entry) => (
                        <div
                          key={entry.id}
                          className={`flex ${entry.speaker === 'candidate' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-xl p-3 text-white ${
                              entry.speaker === 'candidate'
                                ? 'bg-blue-700 rounded-br-none'
                                : 'bg-gray-700 rounded-bl-none'
                            }`}
                          >
                            <div className="text-xs text-gray-300 mb-1">
                              {entry.speaker === 'candidate' ? 'You' : 'Interviewer'} •{' '}
                              {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-base leading-relaxed">{entry.text}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <p>Transcript will appear here once the interview starts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Camera Feed */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-black rounded-xl overflow-hidden flex-grow relative">
              {cameraEnabled ? (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  mirrored={true}
                  className="w-full h-full "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <div className="text-center">
                    <VideoOff className="w-12 h-12 mx-auto text-gray-600" />
                    <p className="mt-2 text-gray-400">Camera is off</p>
                  </div>
                </div>
              )}

              {/* Camera overlay controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-3">
                  <Button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`rounded-full w-12 h-12 p-0 ${micEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </Button>
                  <Button
                    onClick={() => setCameraEnabled(!cameraEnabled)}
                    className={`rounded-full w-12 h-12 p-0 ${cameraEnabled ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                  >
                    {cameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Question */}
            {/* <Card className="bg-gray-800 border-gray-700 mt-4 text-gray-100">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Current Question</span>
                  <span className="text-sm font-normal text-gray-400">
                    {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg">{currentQuestion || "Question will appear here..."}</p>
                  {isGeneratingQuestion && (
                    <div className="text-sm text-blue-400 flex items-center">
                      <div className="animate-pulse mr-2">●</div>
                      Generating next question...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Right Column - Interview Details */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="bg-gray-800 border-gray-700 text-gray-100">
              <CardHeader>
                <CardTitle>Interview Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Role</h3>
                  <p className="text-lg">{interview.role}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Level</h3>
                  <p className="text-lg capitalize">{interview.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {interview.techStack.map((tech) => (
                      <span key={tech} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Status</h3>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${isCallActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <span>{isCallActive ? 'In Progress' : 'Ready to Start'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-blue-900/20 border-blue-700/30 mt-4 text-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-300">Interview Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start"><span className="mr-2">•</span><span>Speak clearly and at a moderate pace</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Think before answering technical questions</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Ask for clarification if needed</span></li>
                  <li className="flex items-start"><span className="mr-2">•</span><span>Be honest about your experience level</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveInterview;
