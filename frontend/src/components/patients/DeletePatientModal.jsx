import ConfirmDialog from "../common/ConfirmDialog";

function DeletePatientModal({
  patient,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="Delete Patient"
      message={
        patient
          ? `Are you sure you want to delete ${patient.first_name} ${patient.last_name}? This action cannot be undone.`
          : "Are you sure you want to delete this patient?"
      }
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}

export default DeletePatientModal;  