import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 px-6">
      <motion.div
        className="glass p-8 rounded-2xl w-full max-w-md border border-white/10"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400">Sign in to your Nexora account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-gray-300 font-medium">
              Email
            </label>
            <input
              type="email"
              className="input-field w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-300 font-medium">
              Password
            </label>
            <input
              type="password"
              className="input-field w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.p
              className="text-red-400 text-sm text-center bg-red-500/10 rounded-lg p-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6 flex items-center justify-center disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link
            to="/forgot-password"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </Link>
          <br />
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
