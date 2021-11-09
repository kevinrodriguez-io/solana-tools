import classNames from 'classnames';
import { FC } from 'react';

/* This example requires Tailwind CSS v2.0+ */
export const Button: FC<JSX.IntrinsicElements['button']> = ({
  children,
  className,
  type = 'button',
  ...props
}) => {
  return (
    // <button
    //   type="button"
    //   className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    // >
    //   Button text
    // </button>
    // <button
    //   type="button"
    //   className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    // >
    //   Button text
    // </button>
    // <button
    //   type="button"
    //   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    // >
    //   Button text
    // </button>
    <button
      type={type}
      className={classNames(
        'inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        className,
      )}
      {...props}
    >
      {children}
    </button>
    // <button
    //   type="button"
    //   className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    // >
    //   Button text
    // </button>
  );
};
