/* This example requires Tailwind CSS v2.0+ */
import { PlusSmIcon as PlusSmIconSolid } from '@heroicons/react/solid';
import { FC } from 'react';
import cx from 'classnames';

export const RoundButton: FC<JSX.IntrinsicElements['button']> = ({
  children = <PlusSmIconSolid className="h-5 w-5" aria-hidden="true" />,
  className,
  ...props
}) => {
  return (
    <button
      className={cx(
        'inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
