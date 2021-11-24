import { useWallet } from '@solana/wallet-adapter-react';
import { CandyMachineHolderListForm } from 'components/CandyMachineHolderListForm';
import { Distributor } from 'components/Distributor';

import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { Skeleton } from 'components/Skeleton';
import { RandropperProvider, useRandropper } from 'context/RandropperContext';

export const HomeView = () => {
  const { connecting, disconnecting, connected } = useWallet();
  if (connecting || disconnecting)
    return (
      <Shell title="Connecting...">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Shell>
    );
  if (!connected) return <Shell title="Please connect first..." />;
  return (
    <RandropperProvider>
      <HomeViewContents />
    </RandropperProvider>
  );
};

const HomeViewContents = () => {
  const { loadedNFTS, loadedHolders } = useRandropper()[0];
  const readyForDistribution = loadedNFTS && loadedHolders;
  return (
    <Shell title="Randropper">
      <CandyMachineHolderListForm />
      <NFTCardList />
      {readyForDistribution ? <Distributor /> : null}
    </Shell>
  );
};
