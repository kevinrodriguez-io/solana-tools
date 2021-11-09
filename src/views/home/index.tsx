import { useWallet } from '@solana/wallet-adapter-react';
import { CandyMachineHolderListForm } from 'components/CandyMachineHolderListForm';

import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { Skeleton } from 'components/Skeleton';
import { RandropperProvider } from 'context/RandropperContext';

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
  return (
    <Shell title="Randropper">
      <CandyMachineHolderListForm />
      <NFTCardList />
    </Shell>
  );
};
