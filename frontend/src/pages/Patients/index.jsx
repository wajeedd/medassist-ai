import { useState } from "react";
import EditPatientModal from "../../components/patients/EditPatientModal";
import PageLayout from "../../components/layout/PageLayout";

import PatientsHeader from "./PatientsHeader";
import PatientsStats from "./PatientsStats";
import PatientsToolbar from "./PatientsToolbar";
import DeletePatientModal from "../../components/patients/DeletePatientModal";
import PatientTable from "../../components/patients/PatientTable";
import AddPatientModal from "../../components/patients/AddPatientModal";
import PatientDetailsModal from "../../components/patients/PatientDetailsModal";
import PatientForm from "../../components/patients/PatientForm";

import usePatients from "../../hooks/usePatients";

function Patients() {
  const {
  filteredPatients,
  loading,
  saving,
  stats,

  search,
  setSearch,

  formData,
  setFormData,

  emptyForm,

  addPatient,
  editPatient,
  removePatient,
} = usePatients();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const success = await addPatient();

  if (success) {
    setIsModalOpen(false);
    setFormData(emptyForm);
  }
};
   const handleEditSubmit = async (e) => {

  e.preventDefault();

  const success = await editPatient(editingPatient.id);

  if (success) {

    setIsEditOpen(false);

    setEditingPatient(null);

    setFormData(emptyForm);

  }

};
  const confirmDelete = async () => {

  const success =
    await removePatient(deletingPatient.id);

  if (success) {

    setIsDeleteOpen(false);

    setDeletingPatient(null);

  }

};

  const handleViewPatient = (patient) => {

    setSelectedPatient(patient);

    setIsDetailsOpen(true);

  };

  const handleEditPatient = (patient) => {

  setEditingPatient(patient);

  setFormData({
    ...patient,
    date_of_birth: patient.date_of_birth ?? "",
    blood_group: patient.blood_group ?? "",
    email: patient.email ?? "",
    allergies: patient.allergies ?? "",
    medical_conditions: patient.medical_conditions ?? "",
    current_medications: patient.current_medications ?? "",
    height_cm: patient.height_cm ?? "",
    weight_kg: patient.weight_kg ?? "",
  });

  setIsEditOpen(true);

};
  const handleDeletePatient = (patient) => {

  setDeletingPatient(patient);

  setIsDeleteOpen(true);

};


  

  return (

    <PageLayout>

      {/* Header */}

      <PatientsHeader
  onAddPatient={() => setIsModalOpen(true)}
/>
<PatientsStats
  stats={stats}
/>
      {/* Search */}

      <div className="mb-6">

        <PatientsToolbar
  search={search}
  setSearch={setSearch}
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
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
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

{/* Edit Patient */}

<EditPatientModal
  isOpen={isEditOpen}
  onClose={() => {
    setIsEditOpen(false);
    setEditingPatient(null);
    setFormData(emptyForm);
  }}
>
  
  <PatientForm
    formData={formData}
    handleChange={handleChange}
    handleSubmit={handleEditSubmit}
    loading={saving}
    submitText="Save Changes"
  />
</EditPatientModal>
  
  {/* Delete Patient */}

<DeletePatientModal
  patient={deletingPatient}
  isOpen={isDeleteOpen}
  onClose={() => {
    setIsDeleteOpen(false);
    setDeletingPatient(null);
  }}
  onConfirm={confirmDelete}
  loading={saving}
/>
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