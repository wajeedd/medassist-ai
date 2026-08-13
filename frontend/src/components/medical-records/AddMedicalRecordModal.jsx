import AnimatedModal from "../common/AnimatedModal";

function AddMedicalRecordModal({
  isOpen,
  onClose,
  children,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Medical Record"
    >
      {children}
    </AnimatedModal>
  );
}

export default AddMedicalRecordModal;