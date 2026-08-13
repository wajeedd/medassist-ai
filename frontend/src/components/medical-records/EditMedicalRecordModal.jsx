import AnimatedModal from "../common/AnimatedModal";

function EditMedicalRecordModal({
  isOpen,
  onClose,
  children,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Medical Record"
      maxWidth="max-w-5xl"
    >
      {children}
    </AnimatedModal>
  );
}

export default EditMedicalRecordModal;