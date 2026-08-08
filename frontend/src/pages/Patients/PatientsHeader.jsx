import { Plus } from "lucide-react";
import Button from "../../components/common/Button";

function PatientsHeader({ onAddPatient }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Patients
        </h1>

        <p className="text-gray-500 mt-2">
          Manage all registered patients
        </p>
      </div>

      <Button
        onClick={onAddPatient}
        className="flex items-center gap-2"
      >
        <Plus size={20} />
        Add Patient
      </Button>
    </div>
  );
}

export default PatientsHeader;