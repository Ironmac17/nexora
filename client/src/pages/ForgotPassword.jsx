import { useState } from "react";
import { motion } from "framer-motion";
import { forgotPassword, resetPassword } from "../services/authService";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      setMessage("Password reset successfully. You can log in now.");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resetting password");
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
            Reset Password
          </h1>
          <p className="text-gray-400">
            We'll help you get back into your account
          </p>
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
                "Send Reset Code"
              )}
            </motion.button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                New Password
              </label>
              <input
                type="password"
                className="input-field w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Reset Code
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
                "Reset Password"
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

        {step === 3 && (
          <div className="text-center space-y-4">
            <motion.div
              className="text-green-400 text-sm bg-green-500/10 rounded-lg p-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {message}
            </motion.div>

            <motion.a
              href="/login"
              className="btn-primary inline-block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Go to Login
            </motion.a>
          </div>
        )}

        {message && step !== 3 && (
          <motion.p
            className={`text-sm text-center rounded-lg p-2 mt-4 ${
              message.includes("sent") || message.includes("successfully")
                ? "text-green-400 bg-green-500/10"
                : "text-red-400 bg-red-500/10"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {message}
          </motion.p>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Remember your password?{" "}
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
