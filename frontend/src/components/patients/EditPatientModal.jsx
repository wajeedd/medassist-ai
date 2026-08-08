import AnimatedModal from "../common/AnimatedModal";

function EditPatientModal({
  isOpen,
  onClose,
  children,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Patient"
    >
      {children}
    </AnimatedModal>
  );
}

export default EditPatientModal;