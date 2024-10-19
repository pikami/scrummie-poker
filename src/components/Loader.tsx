import classNames from 'classnames';
import { LoaderIcon } from './icons';

export enum LoaderSize {
  Small,
  Medium,
  Big,
}

interface LoaderProps {
  className?: string;
  fullHeight?: boolean;
  center?: boolean;
  size?: LoaderSize;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  fullHeight = false,
  center = false,
  size = LoaderSize.Medium,
}) => {
  const containerClassName = classNames(
    {
      ['flex items-center justify-center']: center,
      ['h-full']: fullHeight,
    },
    className,
  );

  const loaderClassName = classNames(
    {
      ['h-4 w-4']: size === LoaderSize.Small,
      ['h-8 w-8']: size === LoaderSize.Medium,
      ['h-12 w-12']: size === LoaderSize.Big,
    },
    'inline animate-spin fill-blue-600 text-gray-200 dark:text-gray-600',
  );

  return (
    <div role="status" className={containerClassName}>
      <LoaderIcon className={loaderClassName} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
