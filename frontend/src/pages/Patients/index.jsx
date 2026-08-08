import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Users,
  Mars,
  Venus,
  Droplets,
} from "lucide-react";
import { toast } from "react-toastify";

import PageLayout from "../../components/layout/PageLayout";
import StatCard from "../../components/common/StatCard";


import PatientSearch from "../../components/patients/PatientSearch";
import PatientTable from "../../components/patients/PatientTable";
import AddPatientModal from "../../components/patients/AddPatientModal";
import PatientForm from "../../components/patients/PatientForm";
import PatientDetailsModal from "../../components/patients/PatientDetailsModal";

import {
  getPatients,
  createPatient,
} from "../../services/patientService";

function Patients() {

  const emptyForm = {
    first_name: "",
    last_name: "",
    date_of_birth: "",

    gender: "",
    blood_group: "",

    phone: "",
    email: "",

    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",

    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",

    height_cm: "",
    weight_kg: "",

    allergies: "",
    medical_conditions: "",
    current_medications: "",
  };

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [formData, setFormData] = useState(emptyForm);

  const loadPatients = async () => {

    try {

      const data = await getPatients();

      setPatients(data);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load patients.");

    }

  };

  useEffect(() => {

    async function init() {

      setLoading(true);

      await loadPatients();

      setLoading(false);

    }

    init();

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      await createPatient(formData);

      toast.success("Patient added successfully!");

      setIsModalOpen(false);

      setFormData(emptyForm);

      await loadPatients();

    } catch (error) {

      console.error(error);

      toast.error("Failed to add patient.");

    } finally {

      setSaving(false);

    }

  };

  const handleViewPatient = (patient) => {

    setSelectedPatient(patient);

    setIsDetailsOpen(true);

  };

  const filteredPatients = useMemo(() => {

    return patients.filter((patient) => {

      const fullName =
        `${patient.first_name} ${patient.last_name}`.toLowerCase();

      return (

        fullName.includes(search.toLowerCase()) ||

        patient.phone.includes(search) ||

        (patient.email || "")
          .toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  }, [patients, search]);

  const stats = useMemo(() => {

  const males =
    patients.filter(
      p => p.gender === "male"
    ).length;

  const females =
    patients.filter(
      p => p.gender === "female"
    ).length;

  const bloodGroups = {};

  patients.forEach((p) => {

    if (!p.blood_group) return;

    bloodGroups[p.blood_group] =
      (bloodGroups[p.blood_group] || 0) + 1;

  });

  const mostCommonBlood =
    Object.keys(bloodGroups).length
      ? Object.keys(bloodGroups).reduce((a, b) =>
          bloodGroups[a] > bloodGroups[b] ? a : b
        )
      : "-";

  return {

    total: patients.length,

    males,

    females,

    blood: mostCommonBlood,

  };

}, [patients]);

  return (

    <PageLayout>

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Patients
          </h1>

          <p className="text-gray-500 mt-2">
            Manage all registered patients
          </p>

        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >

          <Plus size={20} />

          Add Patient

        </button>

      </div>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

  <StatCard
    title="Total Patients"
    value={stats.total}
    icon={<Users size={28} />}
  />

  <StatCard
    title="Male"
    value={stats.males}
    icon={<Mars size={28} />}
    color="bg-blue-600"
  />

  <StatCard
    title="Female"
    value={stats.females}
    icon={<Venus size={28} />}
    color="bg-pink-600"
  />

  <StatCard
    title="Most Common Blood Group"
    value={stats.blood}
    icon={<Droplets size={28} />}
    color="bg-red-600"
  />

</div>
      {/* Search */}

      <div className="mb-6">

        <PatientSearch
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Table */}

      {

        loading ?

        (

          <div className="bg-white rounded-xl shadow p-10 text-center">

            Loading Patients...

          </div>

        )

        :

        (

          <PatientTable
            patients={filteredPatients}
            onView={handleViewPatient}
          />

        )

      }

      {/* Add Patient */}

      <AddPatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >

        <PatientForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={saving}
          submitText="Save Patient"
        />

      </AddPatientModal>

      {/* View Patient */}

      <PatientDetailsModal
        patient={selectedPatient}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

    </PageLayout>

  );

}

export default Patients;