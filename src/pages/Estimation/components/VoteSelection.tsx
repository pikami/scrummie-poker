import classNames from 'classnames';
import { Button } from 'src/components';

interface VoteSelectionProps {
  className: string;
  value?: string;
  options: string[];
  onSelect: (vote: string) => void;
}

const VoteSelection: React.FC<VoteSelectionProps> = ({
  className,
  value,
  options,
  onSelect,
}) => {
  const getItemClassName = (option: string) =>
    classNames('rounded-md px-4 py-2 text-white transition-colors', {
      'bg-indigo-800': value === option,
      'bg-indigo-600 hover:bg-indigo-500': value !== option,
    });

  return (
    <div className={className}>
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => onSelect(option)}
          className={getItemClassName(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
};

export default VoteSelection;
