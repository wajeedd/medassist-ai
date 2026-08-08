import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white",

  secondary:
    "bg-slate-200 hover:bg-slate-300 text-slate-800",

  success:
    "bg-green-600 hover:bg-green-700 text-white",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  warning:
    "bg-yellow-500 hover:bg-yellow-600 text-white",
};

function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
  onClick,
}) {
  return (
    <motion.button
      whileHover={
        disabled
          ? {}
          : { scale: 1.03, y: -1 }
      }
      whileTap={
        disabled
          ? {}
          : { scale: 0.97 }
      }
      transition={{ duration: 0.15 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        px-5
        py-3
        rounded-xl
        font-semibold
        transition-all
        shadow-sm
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}

export default Button;