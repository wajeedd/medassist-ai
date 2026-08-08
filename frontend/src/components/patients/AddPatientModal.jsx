import AnimatedModal from "../common/AnimatedModal";

function AddPatientModal({
  isOpen,
  onClose,
  children,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="👤 Add New Patient"
      maxWidth="max-w-5xl"
    >
      {children}
    </AnimatedModal>
  );
}

export default AddPatientModal;