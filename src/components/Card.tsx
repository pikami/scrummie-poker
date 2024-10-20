import classNames from 'classnames';
import { PencilIcon } from './icons';

interface CardProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
  transparent?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  className,
  transparent = false,
  onClick,
  onEdit,
  children,
}) => {
  const containerClassName = classNames(
    className,
    'p-4 border rounded-lg shadow-sm transition',
    {
      'hover:bg-gray-100 dark:hover:bg-nero-800 cursor-pointer': onClick,
      'bg-white dark:bg-nero-900': !transparent,
    },
    'border-gray-300 dark:border-nero-700',
    'text-gray-800 dark:text-nero-200',
  );

  return (
    <div className={containerClassName} onClick={onClick} title={title}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        {onEdit && (
          <button
            className="ml-2 p-1 text-gray-600 hover:text-gray-900 dark:text-nero-400 dark:hover:text-nero-200"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Edit card"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        )}
      </div>
      {children}
      {description && <p className="mt-2">{description}</p>}
    </div>
  );
};

export default Card;
