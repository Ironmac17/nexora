import { motion } from "framer-motion";

export default function Card({ title, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-surface/50 border border-surface rounded-xl shadow-md p-6 ${className}`}
    >
      {title && (
        <h3 className="text-lg font-semibold text-accent mb-3">{title}</h3>
      )}
      <div className="text-textMain">{children}</div>
    </motion.div>
  );
}
