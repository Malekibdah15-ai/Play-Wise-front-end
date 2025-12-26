import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Gamepad2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Auth = ({ initialMode, onViewChange }) => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsLogin(initialMode === "login");
  }, [initialMode]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError({ username: "", email: "", password: "" });
    onViewChange?.(!isLogin ? "login" : "register");
  };

  // affter submtion validation
  const validate = () => {
    const newErrors = {};
    if (!isLogin) {
      if (!userName.trim()) {
        newErrors.username = "Username is required";
      } else if (userName.trim().length < 5) {
        newErrors.username = "Username must be at least 5 characters";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Please enter The email";
    }
    else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //   real live validateion 
  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "username":
        if (!value.trim()) message = "Username is required";
        else if (value.trim().length < 5) message = "Username must be at least 5 characters";
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) message = "Please enter a valid email address";
        break;
      case "password":
        if (value.length < 8) message = "Password must be at least 8 characters";
        break;
      default:
        break;
    }
    setError(prev => ({ ...prev, [field]: message }));
  };

  //   dont be scared this is just a ternary operator
  const buildPayload = () => (isLogin ? { email, password } : { userName, email, password });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    // prevent submission if any errors exist
    if (!isLogin) {
      if (error.username || error.password || error.password) return;
    }
    if (isLogin) {
      if (error.email || error.password) return;
    }
    setLoading(true);
    const payload = buildPayload();
    const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

    try {
      const { data } = await axios.post(`http://localhost:8000${endpoint}`, payload);
      console.log("SUCCESS:", data);
      navigate("/home")
    } catch (err) {
      console.log(err.response.data.errors);
      setError(prev => ({ ...prev, password: err.response.data.errors }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative">
      <motion.div
        className="w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-3xl p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
            <Gamepad2 />
          </div>
          <h2 className="text-3xl font-bold text-white">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isLogin ? "Sign in to your account" : "Join the gaming community"}
          </p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <InputGroup
                  icon={<User size={18} />}
                  type="text"
                  placeholder="Username"
                  value={userName}
                  onChange={e => { setUsername(e.target.value); validateField("username", e.target.value); }}
                  error={error.username}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <InputGroup
            icon={<Mail size={18} />}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); validateField("email", e.target.value); }}
            error={error.email}
          />

          <InputGroup
            icon={<Lock size={18} />}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            isPassword
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
            value={password}
            onChange={e => { setPassword(e.target.value); validateField("password", e.target.value); }}
            error={error.password}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            <ArrowRight size={18} />
          </motion.button>
        </form>

        {/* FOOTER */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            {isLogin ? "No account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="text-purple-400 ml-2 hover:text-purple-300"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ icon, type, placeholder, value, onChange, isPassword, showPassword, error, togglePassword }) => (
  <div className="relative mb-6">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 ${error ? 'border-red-500' : ''}`}
    />
    {isPassword && (
      <button
        type="button"
        onClick={togglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )}

    {/* Error message (absolute so it doesn't push layout) */}
    <motion.p
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: error ? 1 : 0, height: error ? "auto" : 0 }}
      className="absolute text-red-500 text-sm mt-1 left-0"
      style={{ bottom: "-1.25rem" }} // slightly below the input
    >
      {error}
    </motion.p>
  </div>
);



export default Auth;
