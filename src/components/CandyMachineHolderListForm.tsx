import { LabelledInput } from './LabelledInput';
import { RoundButton } from './RoundButton';
import { SearchIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { CandyMachineHolderList } from './CandyMachineHolderList';
import { Terminal } from './Terminal';

export const CandyMachineHolderListForm = () => {
  const [candyMachinePrimaryKey, setCandyMachinePrimaryKey] = useState('');
  const [candyMachinePrimaryKeyReadOnly, setCandyMachinePrimaryKeyReadOnly] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const candyMachinePrimaryKey = e.currentTarget.elements.namedItem(
      'candyMachinePrimaryKey',
    );
    setCandyMachinePrimaryKey(
      `${(candyMachinePrimaryKey! as HTMLInputElement).value}`,
    );
  };

  return (
    <div className="py-4 px-4 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Candy Machine Holder List
      </h2>
      <form onSubmit={handleSubmit} method="post">
        <div className="flex flex-row items-end">
          <LabelledInput
            label="Candy Machine Id"
            placeHolder="6ujZ8B0FXpcByNbQdxBNxbydxUhz5hVavpapvrEUc2Dz"
            name="candyMachinePrimaryKey"
            type="text"
            onChange={(e) => {
              setCandyMachinePrimaryKeyReadOnly(
                `${(e.target as HTMLInputElement).value}`,
              );
            }}
          />
          <div className="ml-2">
            <RoundButton type="submit">
              <SearchIcon className="h-5 w-5" aria-hidden="true" />
            </RoundButton>
          </div>
        </div>
      </form>
      {candyMachinePrimaryKey ? (
        <CandyMachineHolderList
          candyMachinePrimaryKey={candyMachinePrimaryKey}
        />
      ) : (
        <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKeyReadOnly}`} />
      )}
    </div>
  );
};
