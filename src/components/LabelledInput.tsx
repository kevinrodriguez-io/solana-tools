import { FC, HTMLInputTypeAttribute } from 'react';

type LabelledInputProps = JSX.IntrinsicElements['input'] & {
  name: string;
  label: string;
  placeHolder: string;
  type: HTMLInputTypeAttribute;
};

export const LabelledInput: FC<LabelledInputProps> = ({
  name,
  label,
  placeHolder,
  type = 'text',
  ...props
}) => {
  return (
    <div className="flex-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeHolder}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          {...props}
        />
      </div>
    </div>
  );
};
