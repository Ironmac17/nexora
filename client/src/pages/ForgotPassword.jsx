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
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-background text-textMain px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-surface p-8 rounded-2xl shadow-lg w-full max-w-md border border-surface/50">
        <h1 className="text-2xl font-bold mb-6 text-center text-accent">
          Forgot Password
        </h1>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent text-background rounded-md hover:opacity-90 font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent text-background rounded-md hover:opacity-90 font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}

        {message && <p className="text-center mt-4 text-sm text-accent">{message}</p>}
      </div>
    </motion.div>
  );
}
