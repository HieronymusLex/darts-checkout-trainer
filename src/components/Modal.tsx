import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-gray-700 rounded shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
        {footer && (
          <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
