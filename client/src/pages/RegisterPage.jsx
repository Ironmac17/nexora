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
      const data = await verifyOtp({ email, otp, fullName, password, profileImageUrl });
      localStorage.setItem("nexoraToken", data.token);
      navigate("/home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
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
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h1>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
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
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Profile Image URL (optional)"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={profileImageUrl}
              onChange={(e) => setProfileImageUrl(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-md bg-background border border-surface/70 focus:ring-1 focus:ring-accent"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-accent text-background rounded-md hover:opacity-90 font-semibold flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify & Register"}
            </button>
          </form>
        )}

        {message && <p className="text-center mt-4 text-sm text-accent">{message}</p>}
      </div>
    </motion.div>
  );
}
