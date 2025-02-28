import { useState } from "react";
import { User, Lock, Mail, Key } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

export default function SlidingAuth() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const response = await apiRequest("http://localhost:3000/api/auth/signup", "POST", {
          name: email,
          email,
          password,
        });

        if (response.token) {
          localStorage.setItem("token", response.token);
          navigate("/main");
        }
      } else {
        // Login logic
        const response = await apiRequest("http://localhost:3000/api/auth/signin", "POST", {
          email,
          password,
        });

        if (response.token) {
          localStorage.setItem("token", response.token);
          navigate("/main");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="relative w-full max-w-4xl h-auto rounded-3xl overflow-hidden shadow-2xl flex">
        {/* Form Section */}
        <motion.div 
          initial={{ x: isSignup ? "100%" : "0%" }}
          animate={{ x: isSignup ? "0%" : "100%" }}
          transition={{ duration: 0.5 }}
          className="w-1/2 bg-gray-900 flex flex-col items-center justify-center p-10"
        >
          <h2 className="text-3xl font-bold text-white mb-8">{isSignup ? "Create Account" : "Login"}</h2>
          <div className="w-full space-y-5">
            <div className="relative w-full">
              <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
              />
            </div>
            <div className="relative w-full">
              <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
              />
            </div>
            {isSignup && (
              <div className="relative w-full">
                <Key className="absolute left-4 top-4 text-gray-400" size={20} />
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 p-4 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none" 
                />
              </div>
            )}
          </div>
          <button 
            onClick={handleAuth} 
            className="w-full py-2 mt-6 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </motion.div>
        {/* Sliding Panel */}
        <motion.div 
          initial={{ x: isSignup ? "-100%" : "0%" }}
          animate={{ x: isSignup ? "0%" : "-100%" }}
          transition={{ duration: 0.5 }}
          className="w-1/2 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-800 text-white p-10"
        >
          {!isSignup ? (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">New Here?</h2>
              <p className="text-gray-200 mb-8 max-w-xs">Sign up and discover a great amount of new opportunities!</p>
              <button onClick={() => setIsSignup(true)} className="py-3 px-10 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-indigo-800 transform hover:scale-105 transition-all">Sign Up</button>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
              <p className="text-gray-200 mb-8 max-w-xs">To keep connected with us please login with your personal info</p>
              <button onClick={() => setIsSignup(false)} className="py-3 px-10 rounded-xl border-2 border-white text-white font-bold hover:bg-white hover:text-indigo-800 transform hover:scale-105 transition-all">Sign In</button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}