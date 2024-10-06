const Input = ({
  label,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  label?: string;
}) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium leading-6">{label}</label>
      )}
      <div className="mt-2">
        <input
          className="w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm hover:border-slate-300 focus:border-slate-50 focus:shadow focus:outline-none"
          {...props}
        />
      </div>
    </div>
  );
};

export default Input;
