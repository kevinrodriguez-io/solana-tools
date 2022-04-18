import { CandyMachineHolderListForm } from '../../components/CandyMachineHolderListForm';
import { Shell } from '../../components/layout/Shell';
import { FC } from 'react';

export const HolderList: FC = () => {
  return (
    <Shell title="Candy Machine Holder List">
      <CandyMachineHolderListForm />
    </Shell>
  );
};
