import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color = "bg-blue-600",
}) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.2,
      }}
      className="bg-white rounded-2xl shadow-lg p-6"
    >

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500">

            {title}

          </p>

          <h2 className="text-3xl font-bold mt-2">

            {value}

          </h2>

        </div>

        <div
          className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white`}
        >

          {icon}

        </div>

      </div>

    </motion.div>
  );
}

export default StatCard;