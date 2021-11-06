import { useWallet } from '@solana/wallet-adapter-react';
import { CandyMachineHolderListForm } from 'components/CandyMachineHolderListForm';

import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { Skeleton } from 'components/Skeleton';

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
  return <HomeViewContents />;
};

const HomeViewContents = () => {
  return (
    <Shell title="Randropper">
      <CandyMachineHolderListForm />
      <NFTCardList />
    </Shell>
  );
};
