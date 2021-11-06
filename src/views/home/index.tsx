import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { Skeleton } from 'components/Skeleton';
import { useNFTs } from 'hooks/useNFTs';

export const HomeView = () => {
  const { connecting, disconnecting, connected } = useWallet();
  if (connecting || disconnecting)
    return (
      <Shell title="Loading...">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Shell>
    );
  if (!connected) return <Shell title="Please connect first..." />;
  return <HomeViewContents />;
};

const HomeViewContents = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { data, error } = useNFTs(publicKey!, connection);
  const isLoading = !data && !error;
  if (isLoading) {
    return (
      <Shell title="Loading NFTs">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Shell>
    );
  }
  // NFTCard
  return (
    <Shell title="Randropper">
      <NFTCardList nfts={data!.map((i) => i.attachedMetadata)} />
    </Shell>
  );
};
