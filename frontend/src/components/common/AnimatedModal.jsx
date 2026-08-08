import { motion, AnimatePresence } from "framer-motion";

function AnimatedModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-4xl",
}) {
  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{
              duration: 0.25,
            }}
            className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden`}
          >

            {/* Header */}

            <div className="flex items-center justify-between border-b px-8 py-6">

              <h2 className="text-2xl font-bold text-slate-800">

                {title}

              </h2>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-red-100 transition flex items-center justify-center text-xl"
              >
                ✕
              </button>

            </div>

            {/* Body */}

            <div className="overflow-y-auto max-h-[75vh] p-8">

              {children}

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}

export default AnimatedModal;