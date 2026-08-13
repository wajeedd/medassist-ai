  import {
    Eye,
    Pencil,
    Trash2,
    CalendarDays,
    Activity,
  } from "lucide-react";

  import { motion } from "framer-motion";

  function MedicalRecordRow({
    record,
    onView,
    onEdit,
    onDelete,
  }) {
    const getRiskStyle = (score) => {
      if (score === null || score === undefined) {
        return "bg-gray-100 text-gray-600";
      }

      if (score >= 70) {
        return "bg-red-100 text-red-700";
      }

      if (score >= 40) {
        return "bg-orange-100 text-orange-700";
      }

      return "bg-green-100 text-green-700";
    };

    return (
      <motion.tr
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.2 }}
        className="border-b hover:bg-slate-50"
      >
        {/* Patient */}

        <td className="px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-800">
              Patient
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {record.patient_id}
            </p>
          </div>
        </td>

        {/* Visit */}

        <td className="px-6 py-5">
          <div className="flex items-center gap-2">
            <Activity
              size={16}
              className="text-blue-500"
            />

            <div>
              <p className="font-medium text-slate-700">
                {record.visit_type}
              </p>

              <p className="text-sm text-gray-500">
                {record.chief_complaint}
              </p>
            </div>
          </div>
        </td>

        {/* Diagnosis */}

        <td className="px-6 py-5 max-w-xs">
          <p className="text-slate-700 truncate">
            {record.diagnosis || "Not diagnosed"}
          </p>
        </td>

        {/* Date */}

        <td className="px-6 py-5">
          <div className="flex items-center gap-2">
            <CalendarDays
              size={16}
              className="text-gray-500"
            />

            <span>
              {record.visit_date}
            </span>
          </div>
        </td>

        {/* Risk */}

        <td className="px-6 py-5 text-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskStyle(
              record.ai_risk_score
            )}`}
          >
            {record.ai_risk_score !== null &&
            record.ai_risk_score !== undefined
              ? `${record.ai_risk_score}%`
              : "N/A"}
          </span>
        </td>

        {/* Actions */}

<td className="px-6 py-5">
  <div className="flex justify-center gap-2">

    {/* View */}
    <button
      type="button"
      onClick={() => onView(record)}
      className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 transition"
      title="View Record"
    >
      <Eye
        size={18}
        className="text-blue-700"
      />
    </button>

    {/* Edit */}
    <button
      type="button"
      onClick={() => onEdit(record)}
      className="p-2 rounded-xl bg-yellow-100 hover:bg-yellow-200 transition"
      title="Edit Record"
    >
      <Pencil
        size={18}
        className="text-yellow-700"
      />
    </button>

    {/* Delete */}
    <button
      type="button"
      onClick={() => onDelete(record)}
      className="p-2 rounded-xl bg-red-100 hover:bg-red-200 transition"
      title="Delete Record"
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

  export default MedicalRecordRow;