import { Plus, ClipboardList } from "lucide-react";

function MedicalRecordsHeader({ onAddRecord }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100">
            <ClipboardList
              size={28}
              className="text-blue-600"
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Medical Records
            </h1>

            <p className="text-gray-500 mt-1">
              Manage patient medical history and clinical records
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={onAddRecord}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
      >
        <Plus size={20} />
        Add Medical Record
      </button>
    </div>
  );
}

export default MedicalRecordsHeader;