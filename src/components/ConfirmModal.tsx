"use client";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#FFF8F5] p-6 shadow-2xl border border-[#E9D9D1]">
        <h3 className="text-lg font-semibold text-[#2D1F25]">{title}</h3>
        <p className="mt-3 text-sm text-[#2D1F25]/80">{message}</p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#8B1E4D] bg-white px-5 py-2 text-sm font-medium text-[#8B1E4D] transition hover:bg-[#8B1E4D]/5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#8B1E4D] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#73153F]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

