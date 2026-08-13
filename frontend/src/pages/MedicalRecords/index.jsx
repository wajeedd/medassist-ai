import { useState } from "react";
import DeleteMedicalRecordModal from "../../components/medical-records/DeleteMedicalRecordModal";
import PageLayout from "../../components/layout/PageLayout";
import EditMedicalRecordModal from "../../components/medical-records/EditMedicalRecordModal";
import MedicalRecordDetailsModal from "../../components/medical-records/MedicalRecordDetailsModal";
import MedicalRecordsHeader from "../../components/medical-records/MedicalRecordsHeader";
import MedicalRecordsStats from "../../components/medical-records/MedicalRecordsStats";
import MedicalRecordsToolbar from "../../components/medical-records/MedicalRecordsToolbar";
import MedicalRecordTable from "../../components/medical-records/MedicalRecordTable";
import AddMedicalRecordModal from "../../components/medical-records/AddMedicalRecordModal";
import MedicalRecordForm from "../../components/medical-records/MedicalRecordForm";

import useMedicalRecords from "../../hooks/useMedicalRecords";

function MedicalRecords() {
  const {
  filteredRecords,
  loading,
  saving,
  stats,

  search,
  setSearch,

  formData,
  setFormData,

  emptyForm,

  addRecord,
  editRecord,
  removeRecord,

  patients,
} = useMedicalRecords();

  // --------------------------------
  // Modal States
  // --------------------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  // --------------------------------
  // Selected Patient
  // --------------------------------

  const selectedPatient = patients.find(
    (patient) => patient.id === selectedRecord?.patient_id
  );

  // --------------------------------
  // Form Change
  // --------------------------------

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --------------------------------
  // Add Record
  // --------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await addRecord();

    if (success) {
      setIsModalOpen(false);
      setFormData(emptyForm);
    }
  };

  // --------------------------------
  // View Record
  // --------------------------------

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  // --------------------------------
  // Edit Record
  // --------------------------------

  const handleEditRecord = (record) => {

  setEditingRecord(record);

  setFormData({
    patient_id: record.patient_id ?? "",
    visit_date: record.visit_date ?? "",
    visit_type: record.visit_type ?? "",
    chief_complaint: record.chief_complaint ?? "",
    symptoms: record.symptoms ?? "",
    diagnosis: record.diagnosis ?? "",
    treatment_plan: record.treatment_plan ?? "",
    doctor_notes: record.doctor_notes ?? "",

    temperature: record.temperature ?? "",
    blood_pressure: record.blood_pressure ?? "",
    heart_rate: record.heart_rate ?? "",
    respiratory_rate: record.respiratory_rate ?? "",
    oxygen_saturation: record.oxygen_saturation ?? "",

    prescription: record.prescription ?? "",
    follow_up_date: record.follow_up_date ?? "",
  });

  setIsEditOpen(true);
};
    const handleEditSubmit = async (e) => {
  e.preventDefault();

  if (!editingRecord) return;

  const success = await editRecord(editingRecord.id);

  if (success) {
    setIsEditOpen(false);
    setEditingRecord(null);
    setFormData(emptyForm);
  }
};

  // --------------------------------
// Delete Record
// --------------------------------

const handleDeleteRecord = (record) => {
  setDeletingRecord(record);
};

const confirmDelete = async () => {
  if (!deletingRecord) return;

  const success = await removeRecord(deletingRecord.id);

  if (success) {
    setDeletingRecord(null);
  }
};

  // --------------------------------
  // Open Add Modal
  // --------------------------------

  const openAddModal = () => {
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  return (
    <PageLayout>

      {/* ============================= */}
      {/* Header */}
      {/* ============================= */}

      <MedicalRecordsHeader
        onAddRecord={openAddModal}
      />

      {/* ============================= */}
      {/* Statistics */}
      {/* ============================= */}

      <MedicalRecordsStats
        stats={stats}
      />

      {/* ============================= */}
      {/* Search */}
      {/* ============================= */}

      <div className="mb-6">
        <MedicalRecordsToolbar
          search={search}
          setSearch={setSearch}
        />
      </div>

      {/* ============================= */}
      {/* Medical Records Table */}
      {/* ============================= */}

      {loading ? (

        <div className="bg-white rounded-xl shadow p-10 text-center">
          Loading Medical Records...
        </div>

      ) : (

        <MedicalRecordTable
          records={filteredRecords}
          onView={handleViewRecord}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />

      )}

      {/* ============================= */}
      {/* Add Medical Record */}
      {/* ============================= */}

      <AddMedicalRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData(emptyForm);
        }}
      >

        <MedicalRecordForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={saving}
          submitText="Save Medical Record"
          patients={patients}
        />

      </AddMedicalRecordModal>

      {/* ============================= */}
{/* Edit Medical Record */}
{/* ============================= */}

<EditMedicalRecordModal
  isOpen={isEditOpen}
  onClose={() => {
    setIsEditOpen(false);
    setEditingRecord(null);
    setFormData(emptyForm);
  }}
>
  <MedicalRecordForm
    formData={formData}
    handleChange={handleChange}
    handleSubmit={handleEditSubmit}
    loading={saving}
    submitText="Save Changes"
    patients={patients}
  />
</EditMedicalRecordModal>

{/* ============================= */}
{/* Delete Medical Record */}
{/* ============================= */}

<DeleteMedicalRecordModal
  record={deletingRecord}
  isOpen={!!deletingRecord}
  onClose={() => setDeletingRecord(null)}
  onConfirm={confirmDelete}
  loading={saving}
/>

      {/* ============================= */}
      {/* View Medical Record */}
      {/* ============================= */}

      <MedicalRecordDetailsModal
        record={selectedRecord}
        patient={selectedPatient}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

    </PageLayout>
  );
}

export default MedicalRecords;