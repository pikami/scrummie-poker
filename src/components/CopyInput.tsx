import { useState } from 'react';
import Input from './Input';
import Button from './Button';

interface CopyInputProps {
  value: string;
}

const CopyInput: React.FC<CopyInputProps> = ({ value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input type="text" value={value} readOnly />
      <Button onClick={handleCopy}>{copied ? 'Copied!' : 'Copy'}</Button>
    </div>
  );
};

export default CopyInput;
