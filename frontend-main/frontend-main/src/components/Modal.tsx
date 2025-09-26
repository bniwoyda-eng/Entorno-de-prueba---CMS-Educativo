import React, { useRef } from "react";
import ReactDOM from "react-dom";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<{ children: React.ReactNode }>;
  Body: React.FC<{ children: React.ReactNode }>;
  Footer: React.FC<{ children: React.ReactNode }>;
} = ({ isOpen, onClose, children, size = "md" }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalRoot = document.getElementById("modal-root");

  if (!isOpen || !modalRoot) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 pointer-events-auto px-3"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={clsx(
          "bg-white rounded-xl shadow-xl w-full max-w-3xl relative flex flex-col",
          "animate-fade-in",
          size === "xs" && "max-w-xs",
          size === "sm" && "max-w-sm",
          size === "md" && "max-w-md",
          size === "lg" && "max-w-lg",
          size === "xl" && "max-w-xl",
          size === "2xl" && "max-w-2xl",
          size === "3xl" && "max-w-3xl",
          size === "4xl" && "max-w-4xl",
          size === "5xl" && "max-w-5xl"
        )}
        style={{ maxHeight: "750px" }}
      >
        <div className="flex flex-col h-full p-5 gap-2 overflow-hidden">
          {children}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

// Subcomponentes declarativos
Modal.Header = ({ children }) => (
  <div className="text-xl font-medium border-b pb-2 shrink-0">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="overflow-y-auto grow">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="border-t pt-2 flex justify-end gap-2 shrink-0">
    {children}
  </div>
);
