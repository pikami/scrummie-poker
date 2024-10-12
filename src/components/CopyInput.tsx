import { useState } from 'react';

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
      <input
        type="text"
        value={value}
        readOnly
        className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 dark:border-gray-600 dark:bg-nero-800 dark:text-gray-100"
      />

      <button
        onClick={handleCopy}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default CopyInput;
