import classNames from 'classnames';
import { PencilIcon } from './icons';

interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  onEdit?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onClick, onEdit }) => {
  const className = classNames(
    'p-4 border rounded-lg shadow-sm transition',
    {
      'hover:bg-gray-100 dark:hover:bg-nero-800 cursor-pointer': onClick,
    },
    'border-gray-300 dark:border-nero-700',
    'bg-white dark:bg-nero-900',
    'text-gray-800 dark:text-nero-200',
  );

  return (
    <div className={className} onClick={onClick}>
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
      {description && <p className="mt-2">{description}</p>}
    </div>
  );
};

export default Card;
