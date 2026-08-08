import { AlertTriangle } from "lucide-react";
import AnimatedModal from "./AnimatedModal";
import Button from "./Button";

function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) {
  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center">

        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertTriangle
            size={42}
            className="text-red-600"
          />
        </div>

        <p className="text-gray-600 text-lg mb-8">
          {message}
        </p>

        <div className="flex gap-4 w-full">

          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </Button>

        </div>

      </div>
    </AnimatedModal>
  );
}

export default ConfirmDialog;