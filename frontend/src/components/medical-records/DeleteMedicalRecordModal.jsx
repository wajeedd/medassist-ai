import ConfirmDialog from "../common/ConfirmDialog";

function DeleteMedicalRecordModal({
  record,
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
      title="Delete Medical Record"
      message={
        record
          ? `Are you sure you want to delete this medical record from ${record.visit_date}? This action cannot be undone.`
          : "Are you sure you want to delete this medical record?"
      }
      confirmText="Delete"
      cancelText="Cancel"
    />
  );
}

export default DeleteMedicalRecordModal;