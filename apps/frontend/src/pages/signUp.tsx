import { useRef, useState, useEffect } from "react";
import { Button } from "../components/Button";
import { InputBox } from "../components/input";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export function SignUp() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignUp() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/routes/signUp",
        { username, email, password }
      );

      console.log("SignUp successful:", response.data);

      setTimeout(() => {
        navigate("/signin");
      }, 500);
    } catch (err: any) {
      setError(err.response?.data?.message || "SignUp failed! Try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!mounted) return null;

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      <span>Creating your profile...</span>
    </div>
  );

  const ButtonContent = () => (
    <div className="flex items-center justify-center space-x-2">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
      <span>Begin Your Journey</span>
    </div>
  );

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-800 via-teal-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-600"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(20,184,166,0.1),transparent_50%)]"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 right-20 w-36 h-36 bg-teal-400 bg-opacity-10 rounded-full blur-xl animate-pulse"></div>
        <div 
          className="absolute bottom-24 left-12 w-44 h-44 bg-cyan-400 bg-opacity-10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div 
          className="absolute top-1/3 right-1/4 w-28 h-28 bg-teal-300 bg-opacity-10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 rounded-3xl blur-sm opacity-20 group-hover:opacity-30 transition-all duration-500 animate-pulse"></div>
          
          {/* Main Container */}
          <div className="relative bg-slate-800 bg-opacity-90 backdrop-blur-2xl border border-teal-400 border-opacity-20 rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 opacity-5 rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl mb-4 shadow-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white bg-opacity-20 transform rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <svg className="w-8 h-8 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>

                <h1 className="font-extrabold text-3xl sm:text-4xl bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-400 bg-clip-text text-transparent tracking-wide mb-2">
                  AI Journal Companion
                </h1>
                <p className="text-teal-200 text-sm sm:text-base opacity-80">
                  Create your personal reflection assistant
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-400 border-opacity-30 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-300 text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-5">
                {/* Username Field */}
                <div className="relative group">
                  <label className="block text-teal-200 text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-teal-300 opacity-60 group-focus-within:text-teal-200 group-focus-within:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <InputBox
                      size="h-12 w-full pl-12 pr-4"
                      type="text"
                      colour="bg-teal-800 bg-opacity-30 border border-teal-400 border-opacity-30 focus:border-teal-300 focus:border-opacity-60 focus:bg-teal-700 focus:bg-opacity-40 placeholder-teal-300 placeholder-opacity-60 text-teal-100 rounded-xl transition-all duration-300"
                      placeHolder="Choose your username"
                      inputRef={usernameRef}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative group">
                  <label className="block text-teal-200 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-teal-300 opacity-60 group-focus-within:text-teal-200 group-focus-within:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <InputBox
                      size="h-12 w-full pl-12 pr-4"
                      type="email"
                      colour="bg-teal-800 bg-opacity-30 border border-teal-400 border-opacity-30 focus:border-teal-300 focus:border-opacity-60 focus:bg-teal-700 focus:bg-opacity-40 placeholder-teal-300 placeholder-opacity-60 text-teal-100 rounded-xl transition-all duration-300"
                      placeHolder="Enter your email"
                      inputRef={emailRef}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative group">
                  <label className="block text-teal-200 text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-teal-300 opacity-60 group-focus-within:text-teal-200 group-focus-within:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <InputBox
                      size="h-12 w-full pl-12 pr-4"
                      type="password"
                      colour="bg-teal-800 bg-opacity-30 border border-teal-400 border-opacity-30 focus:border-teal-300 focus:border-opacity-60 focus:bg-teal-700 focus:bg-opacity-40 placeholder-teal-300 placeholder-opacity-60 text-teal-100 rounded-xl transition-all duration-300"
                      placeHolder="Create your password"
                      inputRef={passwordRef}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  size="h-12 w-full font-semibold"
                  colour="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl shadow-lg shadow-teal-500 shadow-opacity-25 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  text={isLoading ? <LoadingSpinner /> : <ButtonContent />}
                  onClick={handleSignUp}
                />
              </div>

              {/* Footer Link */}
              <div className="mt-8 text-center">
                <p className="text-teal-200 opacity-80 text-sm">
                  Already have an account?
                </p>
                <Link
                  to="/signin"
                  className="inline-block mt-2 text-teal-300 hover:text-teal-200 font-medium transition-all duration-300 relative group"
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-teal-300 to-cyan-300 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-teal-400 rounded-full opacity-60 animate-ping"></div>
        <div 
          className="absolute -bottom-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full opacity-60 animate-ping"
          style={{ animationDelay: '1s' }}
        ></div>
        <div 
          className="absolute top-1/2 -left-3 w-2 h-2 bg-teal-300 rounded-full opacity-60 animate-ping"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
    </section>
  );
}