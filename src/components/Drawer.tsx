import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Drawer = ({ isOpen, onClose, title, children }: DrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t-2 border-gray-700 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-sm transition-all outline-none focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
            aria-label="Close drawer"
          >
            <FiX size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
