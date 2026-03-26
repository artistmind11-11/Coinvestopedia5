import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../utils/helpers';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-3xl',
  full: 'max-w-4xl',
};

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnClickOutside = true,
  className,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        closeOnClickOutside &&
        modalRef.current &&
        e.target === modalRef.current
      ) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    modalRef.current?.addEventListener('click', handleClickOutside);

    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, closeOnClickOutside, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center animate-fade-in backdrop-blur-sm p-4"
    >
      <div
        className={cn(
          'bg-surface rounded-2xl shadow-2xl border border-border w-full animate-scale-in flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)]',
          sizeClasses[size],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            {title && (
              <h2
                id="modal-title"
                className="text-xl font-bold text-text"
              >
                {title}
              </h2>
            )}
            {!title && <div />}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 hover:bg-background rounded-lg transition-colors text-text-muted hover:text-text"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body
  );
};

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
}

export const Dialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  isLoading = false,
}: DialogProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-text-muted">{description}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              'px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50',
              isDangerous
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-primary text-white hover:bg-primary-dark'
            )}
          >
            {isLoading ? 'Loading...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default Modal;