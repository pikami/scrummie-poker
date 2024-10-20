import React, { useEffect } from 'react';
import classNames from 'classnames';
import Button, { ButtonColor } from './Button';

export enum DrawerSize {
  Small,
  Medium,
  Big,
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: DrawerSize;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  size = DrawerSize.Medium,
}) => {
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

  const containerClassName = classNames(
    'relative h-full transform space-y-6 overflow-auto bg-white p-6 shadow-lg transition-transform dark:bg-nero-900',
    {
      'translate-x-0': isOpen,
      'translate-x-full': !isOpen,

      'w-1/4': size === DrawerSize.Small,
      'w-3/6': size === DrawerSize.Medium,
      'w-4/6': size === DrawerSize.Big,
    },
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={containerClassName}>
        {children}

        <Button onClick={onClose} color={ButtonColor.Secondary} fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Drawer;
