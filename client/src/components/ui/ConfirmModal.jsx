import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: 'rgba(63, 58, 53, 0.4)', zIndex: 1050 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
        >
          <motion.div
            className="card border-0 p-4 mx-3"
            style={{ maxWidth: '420px', width: '100%' }}
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-2">{title}</h5>
            {message && <p className="text-secondary-custom mb-4">{message}</p>}
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                {cancelLabel}
              </Button>
              <Button
                variant={variant === 'danger' ? 'primary' : variant}
                className={variant === 'danger' ? 'bg-danger border-danger' : ''}
                onClick={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
