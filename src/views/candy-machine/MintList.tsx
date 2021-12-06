import { CandyMachineMintListForm } from 'components/CandyMachineMintListForm';
import { Shell } from 'components/layouts/Shell';
import { RandropperProvider } from 'context/RandropperContext';
import { FC } from 'react';

export const MintList: FC = () => {
  return (
    <RandropperProvider>
      <Shell title="Candy Machine Mint List">
        <CandyMachineMintListForm />
      </Shell>
    </RandropperProvider>
  );
};
