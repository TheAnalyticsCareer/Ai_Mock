
// // import React, { useState } from 'react';
// // import { Button } from './ui/button';
// // import { Input } from './ui/input';
// // import { Label } from './ui/label';
// // import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// // import { signIn, signUp } from '../lib/auth';
// // import { useToast } from '../hooks/use-toast';

// // interface AuthFormProps {
// //   onSuccess: () => void;
// // }

// // const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
// //   const [isSignUp, setIsSignUp] = useState(false);
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { toast } = useToast();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!email || !password) {
// //       toast({
// //         title: "Error",
// //         description: "Please fill in all fields",
// //         variant: "destructive"
// //       });
// //       return;
// //     }

// //     if (password.length < 6) {
// //       toast({
// //         title: "Error",
// //         description: "Password must be at least 6 characters long",
// //         variant: "destructive"
// //       });
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with:`, email);
      
// //       if (isSignUp) {
// //         await signUp(email, password);
// //         toast({
// //           title: "Success",
// //           description: "Account created successfully!",
// //         });
// //       } else {
// //         await signIn(email, password);
// //         toast({
// //           title: "Success",
// //           description: "Signed in successfully!",
// //         });
// //       }
      
// //       console.log('Authentication successful, calling onSuccess');
// //       onSuccess();
// //     } catch (error: any) {
// //       console.error('Authentication error:', error);
// //       let errorMessage = "Authentication failed";
      
// //       if (error.code === 'auth/user-not-found') {
// //         errorMessage = "No account found with this email";
// //       } else if (error.code === 'auth/wrong-password') {
// //         errorMessage = "Incorrect password";
// //       } else if (error.code === 'auth/email-already-in-use') {
// //         errorMessage = "Email already in use";
// //       } else if (error.code === 'auth/weak-password') {
// //         errorMessage = "Password is too weak";
// //       } else if (error.code === 'auth/invalid-email') {
// //         errorMessage = "Invalid email address";
// //       } else if (error.code === 'auth/too-many-requests') {
// //         errorMessage = "Too many failed attempts. Please try again later";
// //       }
      
// //       toast({
// //         title: "Error",
// //         description: errorMessage,
// //         variant: "destructive"
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
// //       <Card className="w-full max-w-md">
// //         <CardHeader className="text-center">
// //           <CardTitle className="text-2xl font-bold text-gray-900">
// //             {isSignUp ? 'Create Account' : 'Welcome Back'}
// //           </CardTitle>
// //           <p className="text-gray-600 mt-2">
// //             {isSignUp 
// //               ? 'Start your interview preparation journey' 
// //               : 'Sign in to continue your practice'
// //             }
// //           </p>
// //         </CardHeader>
// //         <CardContent>
// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div>
// //               <Label htmlFor="email">Email</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="your@email.com"
// //                 required
// //                 disabled={loading}
// //               />
// //             </div>
// //             <div>
// //               <Label htmlFor="password">Password</Label>
// //               <Input
// //                 id="password"
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 placeholder="••••••••"
// //                 required
// //                 disabled={loading}
// //                 minLength={6}
// //               />
// //               {isSignUp && (
// //                 <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
// //               )}
// //             </div>
// //             <Button type="submit" className="w-full" disabled={loading}>
// //               {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
// //             </Button>
// //           </form>
          
// //           <div className="mt-4 text-center">
// //             <button
// //               type="button"
// //               onClick={() => setIsSignUp(!isSignUp)}
// //               className="text-blue-600 hover:text-blue-800 text-sm"
// //               disabled={loading}
// //             >
// //               {isSignUp 
// //                 ? 'Already have an account? Sign in' 
// //                 : "Don't have an account? Sign up"
// //               }
// //             </button>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default AuthForm;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../lib/firebase'; // adjust the import path
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { useToast } from '../hooks/use-toast';

// interface AuthFormProps {
//   onSuccess: () => void;
// }

// const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
//   const [isSignup, setIsSignup] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (isSignup) {
//         await createUserWithEmailAndPassword(auth, email, password);
//         toast({ title: 'Success', description: 'Account created and signed in!' });
//       } else {
//         await signInWithEmailAndPassword(auth, email, password);
//         toast({ title: 'Success', description: 'Signed in successfully!' });
//       }

//       onSuccess();         // call checkAuth in Index.tsx
//       navigate('/');       // force redirect to home

//     } catch (error: any) {
//       console.error('Auth error:', error.message);
//       toast({
//         title: 'Error',
//         description: error.message || 'Authentication failed.',
//         variant: 'destructive',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
//           {isSignup ? 'Sign Up' : 'Sign In'}
//         </h2>

//         <div className="space-y-4">
//           <Input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <Button
//           type="submit"
//           className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//           disabled={loading}
//         >
//           {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
//         </Button>

//         <div className="text-sm text-center text-gray-600 mt-4">
//           {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
//           <button
//             type="button"
//             onClick={() => setIsSignup(prev => !prev)}
//             className="text-blue-600 hover:underline font-medium"
//           >
//             {isSignup ? 'Sign In' : 'Sign Up'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AuthForm;
//working




//copy 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Account created and signed in!' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: 'Success', description: 'Signed in successfully!' });
      }

      onSuccess();
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Authentication failed.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-200 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md animate-fade-in"
      >
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          {isSignup ? 'Join Us!' : 'Welcome Back!'}
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {isSignup ? 'Create an account to get started' : 'Sign in to continue'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="pr-10 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transition duration-200"
        >
          {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Sign In'}
        </Button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="text-center text-sm text-gray-700">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignup(prev => !prev)}
            className="text-indigo-600 hover:underline font-medium"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
