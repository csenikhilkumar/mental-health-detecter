import React, { useRef, useEffect, useState } from "react";
import { Send, Bot, User, Sparkles, List, ArrowLeft, LogOut } from "lucide-react";
import axios from "axios";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  mood?: string;
}

export function JournalForm() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Good evening! I'm here to listen and help you reflect on your thoughts and feelings. How are you feeling today?",
      timestamp: new Date(),
      mood: "happy",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/routes/Journal",
        { entry: inputValue },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      const data = response.data;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          data.data || "Thank you for sharing. I understand how you're feeling.",
        timestamp: new Date(),
        mood: data.mood as any,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Thank you for sharing "${inputValue}". I can sense various emotions in your words. Remember that it's completely normal to experience a range of feelings. Would you like to explore this further or talk about what might have triggered these feelings?`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleGoToJournalList = () => {
    window.location.href = '/listofJournal';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      // Optional: Make a logout API call if your backend requires it
      // await axios.post("http://localhost:3000/api/v1/auth/logout", {}, {
      //   headers: {
      //     token: localStorage.getItem("token"),
      //   },
      // });
      
      // Clear the token from localStorage
      localStorage.removeItem("token");
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem("token");
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-white truncate">
                AI Journal Companion
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">
                Your personal mood and reflection assistant
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-2">
            <button
              onClick={handleGoToJournalList}
              className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white hover:from-teal-600 hover:to-cyan-600 transition-all duration-200 text-sm"
              title="View all journal entries"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">My Journals</span>
              <span className="sm:hidden">Journals</span>
            </button>
            
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white hover:from-red-600 hover:to-pink-600 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
              <span className="sm:hidden">
                {isLoggingOut ? "..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 sm:space-x-3 ${
                message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
              }`}
            >
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === "user"
                    ? "bg-teal-400"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500"
                }`}
              >
                {message.type === "user" ? (
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                )}
              </div>

              <div
                className={`max-w-[85%] sm:max-w-3xl rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                  message.type === "user"
                    ? "bg-gray-400 text-white ml-auto"
                    : "bg-white/10 backdrop-blur-sm text-gray-100 border border-white/20"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {message.mood && (
                  <div className="mt-2 px-2 py-1 bg-white/20 rounded-full text-xs text-gray-200 inline-block">
                    Mood: {message.mood}
                  </div>
                )}
                <p
                  className={`text-xs mt-1 sm:mt-2 ${
                    message.type === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts, feelings, or what's on your mind today..."
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl px-3 py-2.5 pr-10 sm:px-4 sm:py-3 sm:pr-12 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[48px] sm:min-h-[60px] max-h-32 text-sm sm:text-base"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 bottom-2 sm:right-3 sm:bottom-3 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:from-teal-600 hover:to-cyan-600 transition-all duration-200"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </button>
          </div>

          <div className="mt-2 sm:mt-3 text-center">
            <p className="text-xs text-gray-400">
              <span className="hidden sm:inline">Press Enter to send, Shift+Enter for new line • </span>
              Your conversations are private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}