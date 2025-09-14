import { useRef, useState } from "react";
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

  async function handleSignUp() {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/routes/signUp",
        { username, email, password }
      );

      console.log("SignUp successful:", response.data);

      // Redirect to journal form after successful signup
      navigate("/signin");
    } catch (err: any) {
      setError(err.response?.data?.message || "SignUp failed! Try again.");
    }
  }

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#0f172a] via-[#134e4a] to-[#0f172a] p-4">
      <div className="bg-gradient-to-tr from-slate-900/80 via-teal-900/60 to-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="font-extrabold text-3xl text-teal-400 tracking-wide animate-pulse">
            Sign Up
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400 text-sm font-medium text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="mb-5">
          <InputBox
            size="h-12 w-full"
            type="text"
            colour="bg-teal-200/30 placeholder-teal-100 text-white"
            placeHolder="Username"
            inputRef={usernameRef}
          />
        </div>

        <div className="mb-5">
          <InputBox
            size="h-12 w-full"
            type="email"
            colour="bg-teal-200/30 placeholder-teal-100 text-white"
            placeHolder="Email"
            inputRef={emailRef}
          />
        </div>

        <div className="mb-6">
          <InputBox
            size="h-12 w-full"
            type="password"
            colour="bg-teal-200/30 placeholder-teal-100 text-white"
            placeHolder="Password"
            inputRef={passwordRef}
          />
        </div>

        {/* Button */}
        <div className="flex justify-center mb-4">
          <Button
            size="h-12 w-full font-semibold"
            colour="bg-teal-600 hover:bg-teal-500 active:bg-teal-700 transition-colors duration-300"
            text="Sign Up"
            onClick={handleSignUp}
          />
        </div>

        {/* Already have an account */}
        <div className="text-center text-teal-200">
          Already have an account?{" "}
          <Link to="/signin" className="font-bold underline hover:text-teal-400">
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
