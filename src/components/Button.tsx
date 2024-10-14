import classNames from 'classnames';

enum ButtonColor {
  Primary = 'primary',
  Secondary = 'secondary',
  Error = 'error',
  Success = 'success',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  color = ButtonColor.Primary,
  fullWidth = false,
  disabled = false,
  ...props
}) => {
  const buttonClass = classNames(
    'flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    {
      'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600':
        color === ButtonColor.Primary && !disabled,
      'bg-gray-600 hover:bg-gray-500 focus-visible:outline-gray-600':
        color === ButtonColor.Secondary && !disabled,
      'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600':
        color === ButtonColor.Error && !disabled,
      'bg-green-600 hover:bg-green-500 focus-visible:outline-green-600':
        color === ButtonColor.Success && !disabled,
      'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-nero-600': disabled,
      'text-white': !disabled,
      'w-full': fullWidth,
    },
  );

  return (
    <button className={buttonClass} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export { ButtonColor };
export default Button;
