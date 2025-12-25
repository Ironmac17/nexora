import { useState } from "react";
import { motion } from "framer-motion";
import { requestOtp, verifyOtp } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestOtp(email);
      setMessage("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await verifyOtp({
        email,
        otp,
        fullName,
        password,
        profileImageUrl,
      });
      localStorage.setItem("nexoraToken", data.token);
      navigate("/home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
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
            Join Nexora
          </h1>
          <p className="text-gray-400">Create your virtual campus account</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Email Address
              </label>
              <input
                type="email"
                className="input-field w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@university.edu"
                required
              />
            </div>

            {message && (
              <motion.p
                className="text-green-400 text-sm text-center bg-green-500/10 rounded-lg p-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {message}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                "Send OTP"
              )}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Full Name
              </label>
              <input
                type="text"
                className="input-field w-full"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
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
                placeholder="Create a strong password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Profile Image URL (Optional)
              </label>
              <input
                type="url"
                className="input-field w-full"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                OTP Code
              </label>
              <input
                type="text"
                className="input-field w-full text-center font-mono"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength="6"
                required
              />
            </div>

            {message && (
              <motion.p
                className={`text-sm text-center rounded-lg p-2 ${
                  message.includes("sent")
                    ? "text-green-400 bg-green-500/10"
                    : "text-red-400 bg-red-500/10"
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {message}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={18} />
              ) : (
                "Create Account"
              )}
            </motion.button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              ← Back to email
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
          >
            Sign In
          </a>
        </div>
      </motion.div>
    </div>
  );
}
