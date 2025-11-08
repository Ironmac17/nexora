import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  loading = false,
  disabled = false,
  variant = "primary",
  type = "button",
  icon: Icon,
  className = "",
}) {
  const base =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none";

  const variants = {
    primary:
      "bg-accent text-background hover:opacity-90 active:scale-[0.97] disabled:opacity-60",
    secondary:
      "bg-surface text-textMain border border-surface hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-textSub hover:text-accent",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </motion.button>
  );
}
