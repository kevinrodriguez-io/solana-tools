import axios from 'axios';
import { TokenMetadataType } from 'lib/metaplex-sdk/tokenMetadataType';
import { Metadata } from 'lib/metaplex-sdk/types';
import { trimString } from 'lib/string/trimString';
import { FC } from 'react';
import useSWR from 'swr';
import { PairInformation } from './Distributor';
import { Skeleton } from './Skeleton';

export const DistributionItem: FC<
  PairInformation & {
    nftMetadata: Metadata;
  }
> = ({ mint, state, nftMetadata, txId, winnerWallet }) => {
  const { data, error } = useSWR(nftMetadata.data.uri, (uri: string) =>
    axios.get<TokenMetadataType>(uri).then((res) => res.data),
  );
  const isLoading = !error && !data;
  if (isLoading) {
    return <Skeleton />;
  }
  return (
    <div
      key={mint}
      className="my-4 p-4 rounded-xl shadow-xl flex flex-row bg-gray-50"
    >
      <div className="flex flex-col justify-center">
        <img
          className="w-36 h-36 rounded-full shadow-md object-contain"
          src={data!.image}
          alt="moonbox-logo"
        />
      </div>
      <div className="flex flex-col flex-1 ml-4">
        <p className="block text-black text-sm font-bold mb-2">
          Mint: {trimString(mint, 8)} ({nftMetadata.data.name})
          <p style={{ fontSize: '8px' }} className="text-gray-600">
            {mint}
          </p>
        </p>
        <p className="block text-black text-sm font-bold mb-2">
          Winner Wallet: {trimString(winnerWallet, 8)}
          <p style={{ fontSize: '8px' }} className="text-gray-600">
            {winnerWallet}
          </p>
        </p>
        <p className="block text-black text-sm font-bold mb-2">
          Transaction ID: {txId || 'pending'}
        </p>
        <p className="block text-black text-sm font-bold mb-2">
          State: {state}
        </p>
      </div>
    </div>
  );
};
