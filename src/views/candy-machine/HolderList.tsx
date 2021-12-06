import { CandyMachineHolderListForm } from 'components/CandyMachineHolderListForm';
import { Shell } from 'components/layouts/Shell';
import { RandropperProvider } from 'context/RandropperContext';
import { FC } from 'react';

export const HolderList: FC = () => {
  return (
    <RandropperProvider>
      <Shell title="Candy Machine Holder List">
        <CandyMachineHolderListForm />
      </Shell>
    </RandropperProvider>
  );
};
