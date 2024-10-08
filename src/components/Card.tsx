import classNames from 'classnames';

interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, onClick }) => {
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
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2">{description}</p>
    </div>
  );
};

export default Card;
