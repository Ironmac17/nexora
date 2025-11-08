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
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-textMain px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-md border border-surface/50">
        <h1 className="text-2xl font-bold mb-6 text-center text-accent">Welcome Back</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-textSub">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:outline-none focus:ring-1 focus:ring-accent text-textMain"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-textSub">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:outline-none focus:ring-1 focus:ring-accent text-textMain"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-error text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-3 bg-accent text-background font-semibold rounded-md hover:opacity-90 flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-textSub">
          <Link to="/forgot-password" className="hover:text-accent">Forgot password?</Link>
          <br />
          Don’t have an account?{" "}
          <Link to="/register" className="text-accent hover:underline">Sign Up</Link>
        </div>
      </div>
    </motion.div>
  );
}
