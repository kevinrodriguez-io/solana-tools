import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useNFTs } from 'hooks/useNFTs';
import { trimString } from 'lib/string/trimString';
import { FC } from 'react';
import { NFTCard } from './NFTCard';
import { Skeleton } from './Skeleton';

export const NFTCardList: FC = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { data, error } = useNFTs(publicKey!, connection);
  const isLoading = !data && !error;
  const isError = error;
  const isEmpty = !data || data.length === 0;

  if (isLoading) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  if (isEmpty) {
    return <div>No NFTs found</div>;
  }

  const nfts = data.map((i) => i.attachedMetadata);

  return (
    <div className="bg-white mt-4 shadow-2xl rounded-2xl">
      <div className="mx-auto py-4 px-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          NFTs Held in Wallet {trimString(publicKey!.toString(), 8)}
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {nfts.map((nft) => (
            <NFTCard key={nft.mint.toString()} nftData={nft.data} />
          ))}
        </div>
      </div>
    </div>
  );
};
