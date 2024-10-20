import { ValidationError } from '@tanstack/react-form';

const Input = ({
  label,
  errors,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
  errors?: ValidationError[];
}) => {
  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-medium leading-6">
          {label}
        </label>
      )}
      <input
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm hover:border-slate-300 focus:border-slate-50 focus:shadow focus:outline-none dark:border-gray-600 dark:bg-nero-800 dark:text-gray-100"
        {...props}
      />
      {errors?.map((error, key) => (
        <em key={`${error}-${key}`} role="alert">
          {error}
        </em>
      ))}
    </div>
  );
};

export default Input;
