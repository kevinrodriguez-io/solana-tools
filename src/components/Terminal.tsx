import { forwardRef } from 'react';

type TerminalProps = {
  commandName: string;
  children?: React.ReactNode;
};

export const Terminal = forwardRef<HTMLPreElement, TerminalProps>(({ commandName, children }, ref) => (
  <div className="mt-4 coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased bg-gray-800 pb-6 rounded-lg leading-normal overflow-hidden">
    <div className="top mb-2 flex">
      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
      <div className="ml-2 h-3 w-3 bg-yellow-300 rounded-full"></div>
      <div className="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
    </div>
    <div className="mt-4 max-h-48 overflow-auto">
      <span className="text-green-400">randropper:~$</span>
      <span>&nbsp;{commandName}</span>
      <pre ref={ref} className="flex-1 typing items-center">{children}</pre>
    </div>
  </div>
));
