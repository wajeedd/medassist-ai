import {
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
} from "lucide-react";

import { motion } from "framer-motion";
import Avatar from "../common/Avatar";

function PatientRow({
    patient,
    onView,
    onEdit,
    onDelete,
}) {
  return (
    <motion.tr
      whileHover={{
        scale: 1.01,
      }}
      transition={{
        duration: 0.2,
      }}
      className="border-b hover:bg-slate-50"
    >
      {/* Patient */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-4">

          <Avatar
            firstName={patient.first_name}
            lastName={patient.last_name}
          />

          <div>

            <h3 className="font-semibold text-slate-800">

              {patient.first_name} {patient.last_name}

            </h3>

            <p className="text-sm text-gray-500">

              {patient.city}, {patient.state}

            </p>

          </div>

        </div>

      </td>

      {/* Gender */}

      <td className="px-6 py-5">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            patient.gender === "male"
              ? "bg-blue-100 text-blue-700"
              : patient.gender === "female"
              ? "bg-pink-100 text-pink-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {patient.gender}
        </span>

      </td>

      {/* Phone */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <Phone
            size={16}
            className="text-blue-500"
          />

          {patient.phone}

        </div>

      </td>

      {/* Email */}

      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <Mail
            size={16}
            className="text-green-500"
          />

          {patient.email || "-"}

        </div>

      </td>

      {/* Actions */}

      <td className="px-6 py-5">

        <div className="flex justify-center gap-2">

          <button
            onClick={() => onView(patient)}
            className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition"
          >
            <Eye
              size={18}
              className="text-blue-700"
            />
          </button>

          <button
            onClick={() => onEdit(patient)}
            className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition"
          >
            <Pencil
              size={18}
              className="text-yellow-700"
            />
          </button>

          <button
            onClick={() => onDelete(patient)}
            className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
          >
            <Trash2
              size={18}
              className="text-red-700"
            />
          </button>

        </div>

      </td>

    </motion.tr>
  );
}

export default PatientRow;