import { LockLogo } from "../../images/lockLogo";
import MainLogo from "../../images/mainLogo"
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function HomePage(){
  const Navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return(
    <>
      {/* Header with responsive navigation */}
      <div className="w-full shadow-sm text-slate-600">
        <header className="flex justify-between items-center px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center">
            <MainLogo />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between gap-8 lg:gap-16">
            <div><a href="#home" className="hover:text-teal-500 transition-colors">Home</a></div>
            <div><a href="#features" className="hover:text-teal-500 transition-colors">Features</a></div>
            <div><a href="#ai" className="hover:text-teal-500 transition-colors">AI Insights</a></div>
            <div><a href="#privacy" className="hover:text-teal-500 transition-colors">Privacy</a></div>
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            <div><a href="/signup" className="hover:text-teal-500 transition-colors">Sign Up</a></div>
            <button 
              onClick={() => Navigate("/signin")} 
              className="bg-teal-500 rounded-md px-4 py-2 text-white font-bold hover:bg-teal-600 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4 px-4">
              <a href="#home" className="hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#features" className="hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#ai" className="hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>AI Insights</a>
              <a href="#privacy" className="hover:text-teal-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Privacy</a>
              <hr className="my-2" />
              <a href="/signup" className="hover:text-teal-500 transition-colors">Sign Up</a>
              <button 
                onClick={() => {Navigate("/signin"); setIsMenuOpen(false);}} 
                className="bg-teal-500 rounded-md px-4 py-2 text-white font-bold hover:bg-teal-600 transition-colors w-full"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>

      <main>
        {/* Hero Section - Responsive */}
        <section id="home" className="text-center px-4 py-12 sm:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            Go Beyond Journaling.
            <br />
            <span className="text-teal-500">Discover Your Inner Patterns.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
            Serenity is your private wellness companion. Use our secure journal
            and powerful AI tools to understand your thoughts and uncover
            valuable insights into your mental well-being.
          </p>
          <button className="bg-teal-500 text-white rounded-md w-full max-w-xs sm:w-52 h-12 sm:h-16 font-bold hover:bg-teal-600 transition-transform hover:scale-105 mb-4">
            <Link to="/signUp">Start For Free</Link>
          </button>
          <p className="text-sm sm:text-base text-slate-500 px-4">
            Confidential, secure, and powered by intelligent insights.
          </p>
        </section>

        {/* Features Section - Responsive Grid */}
        <section id="features" className="py-12 sm:py-16 lg:py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-slate-900 mb-8 sm:mb-12">
              Core Features for Your Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Secure Journaling</h3>
                <p className="text-slate-600">
                  A private, encrypted space to write, reflect, and process your
                  thoughts. Your data is yours alone.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-slate-600">
                  Get intelligent insights into your emotional patterns and mental
                  well-being through advanced AI analysis.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-semibold mb-3">Personal Growth</h3>
                <p className="text-slate-600">
                  Track your progress and discover patterns that help you grow
                  and understand yourself better.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insights Section - Responsive */}
        <section id="ai" className="py-12 sm:py-16 lg:py-20 text-center px-4">
          <div className="container mx-auto max-w-6xl">
            <p className="font-semibold text-teal-500 mb-2">Powered by Gemini AI</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Unlock Deeper Insights
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 mb-8 sm:mb-12 max-w-3xl mx-auto">
              Our intelligent features help you connect the dots in your
              wellness journey.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
              <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4">AI-Powered Summaries</h3>
                <p className="text-slate-600">
                  Feeling overwhelmed? Let our AI analyze your recent entries
                  and provide a clear summary of recurring themes and emotions,
                  helping you see the bigger picture.
                </p>
              </div>
              <div className="bg-slate-100 p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Intelligent Prompts</h3>
                <p className="text-slate-600">
                  Stuck on what to write? Get personalized and thoughtful
                  journal prompts based on your past entries to help you explore
                  your thoughts more deeply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Section - Responsive */}
        <section className="py-12 sm:py-16 lg:py-20 bg-slate-50">
          <div id="privacy" className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <LockLogo />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-4">
                    Your Privacy is Sacred
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                    We believe a safe space is a private one. All your journal
                    entries are encrypted and accessible only to you. We will never 
                    share or sell your data. Your journey is yours alone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Responsive */}
        <section id="signup" className="py-16 sm:py-20 bg-teal-500">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-teal-100 max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg">
              Create your free, confidential account today and take the first
              step towards a more mindful and understood you.
            </p>
            <a
              href="#"
              className="bg-white text-teal-600 font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 transform shadow-2xl inline-block mb-4 sm:mb-6"
            >
              Sign Up Now
            </a>
            <p className="text-teal-100 text-sm sm:text-base">
              Already have an account?{" "}
              <a href="#" className="font-bold underline hover:text-white">
                Sign In
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer - Responsive */}
      <footer className="bg-slate-800 text-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm sm:text-base">&copy; 2025 Serenity App. All Rights Reserved.</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm sm:text-base">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm sm:text-base">
              Terms of Service
            </a>
            <a href="#" className="text-slate-400 hover:text-white text-sm sm:text-base">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}