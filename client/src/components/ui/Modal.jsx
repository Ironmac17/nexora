import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface rounded-xl shadow-xl w-full max-w-md p-6 border border-surface"
          >
            {title && (
              <h2 className="text-lg font-semibold text-accent mb-4">
                {title}
              </h2>
            )}
            <div className="text-textMain">{children}</div>
            <button
              onClick={onClose}
              className="mt-6 w-full py-2 bg-accent text-background rounded-md hover:opacity-90"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
