import React, { useEffect } from 'react';
import classNames from 'classnames';
import Button, { ButtonColor } from './Button';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={classNames(
          'dark:bg-nero-900 relative h-full w-80 transform space-y-6 bg-white p-6 shadow-lg transition-transform',
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen,
          },
        )}
      >
        {children}

        <Button onClick={onClose} color={ButtonColor.Secondary}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Drawer;
