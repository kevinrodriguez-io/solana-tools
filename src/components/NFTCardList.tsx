import { useWallet } from '@solana/wallet-adapter-react';
import { Metadata } from 'lib/metaplex-sdk/types';
import { FC } from 'react';
import { NFTCard } from './NFTCard';

// Create a function that trims a large string and adds ... in the middle
const trimString = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }
  const trimmedString =
    str.substr(0, maxLength / 2) +
    '...' +
    str.substr(str.length - maxLength / 2);
  return trimmedString;
};

type NFTCardListProps = {
  nfts: Metadata[];
};

export const NFTCardList: FC<NFTCardListProps> = ({ nfts }) => {
  const { publicKey } = useWallet();
  return (
    <div className="bg-white mt-4">
      <div className="max-w-2xl mx-auto py-4 px-4 sm:py-4 sm:px-2 lg:max-w-7xl lg:px-8">
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
