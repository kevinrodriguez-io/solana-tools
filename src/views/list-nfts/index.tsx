import { useWallet } from '@solana/wallet-adapter-react';
import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { Skeleton } from 'components/Skeleton';
import { RandropperProvider } from 'context/RandropperContext';

export const ListNFTs = () => {
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
      <ListNFTsContent />
    </RandropperProvider>
  );
};

export const ListNFTsContent = () => {
  return (
    <Shell title="NFTs">
      <NFTCardList />
    </Shell>
  );
};
