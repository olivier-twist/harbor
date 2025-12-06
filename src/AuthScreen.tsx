import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  AuthError
} from 'firebase/auth';
import { auth } from './App'; // Use this if AuthScreen is in src/
// import { auth } from '../../App'; // Use this if AuthScreen is in src/components/

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!auth) {
      setError('Authentication service not initialized.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
      console.log('Harbor: Password reset email sent to:', email);
      
      // Auto-switch back to sign-in after 3 seconds
      setTimeout(() => {
        setIsForgotPassword(false);
        setSuccess('');
      }, 3000);
    } catch (err) {
      const authError = err as AuthError;
      console.error('Harbor: Password reset error:', authError);
      
      switch (authError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!auth) {
      setError('Authentication service not initialized.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Harbor: User signed up successfully.');
        
        // Send email verification
        await sendEmailVerification(userCredential.user);
        console.log('Harbor: Verification email sent to:', email);
        
        // Sign out the user immediately after signup
        // They must verify their email before they can sign in
        await auth.signOut();
        
        setSuccess('Account created! Please check your email (or terminal console for emulator) to verify your account before signing in.');
        
        // Switch to sign-in mode after 3 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setSuccess('');
        }, 5000);
        
      } else {
        // Sign In
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.');
          // Optionally sign them out
          await auth.signOut();
          setLoading(false);
          return;
        }
        
        console.log('Harbor: User signed in successfully.');
      }
      // No need to redirect - App.tsx will handle it via onAuthStateChanged
    } catch (err) {
      const authError = err as AuthError;
      console.error('Harbor: Authentication error:', authError);
      
      // User-friendly error messages
      switch (authError.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email. Please sign up.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle between Sign In and Sign Up
  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsForgotPassword(false);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  // Toggle forgot password mode
  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setIsSignUp(false);
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-indigo-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 mt-2">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link'
              : isSignUp 
                ? 'Sign up to start using Harbor' 
                : 'Sign in to continue to Harbor'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isForgotPassword ? handlePasswordReset : handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              disabled={loading}
              required
            />
          </div>

          {/* Password Input */}
          {!isForgotPassword && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && !isForgotPassword && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                disabled={loading}
                required
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Sign Up' : 'Sign In'
            )}
          </button>
        </form>

        {/* Forgot Password Link (Sign In only) */}
        {!isSignUp && !isForgotPassword && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={toggleForgotPassword}
              disabled={loading}
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline disabled:opacity-50"
            >
              Forgot your password?
            </button>
          </div>
        )}

        {/* Toggle Sign In/Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isForgotPassword ? (
              <>
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={toggleForgotPassword}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline disabled:opacity-50"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  disabled={loading}
                  className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline disabled:opacity-50"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </>
            )}
          </p>
        </div>

        {/* Helper Text */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            {isForgotPassword
              ? 'A password reset link will be sent to your email address.'
              : isSignUp 
                ? 'By signing up, you agree to our Terms of Service and Privacy Policy. A verification email will be sent to your inbox.' 
                : 'Having trouble signing in? Make sure your email is verified.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;