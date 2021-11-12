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
> = ({ id, mint, state, nftMetadata, txId, winnerWallet }) => {
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
      className="m-4 p-4 rounded-xl shadow-xl flex flex-row bg-gray-50"
    >
      <div className="flex flex-col justify-center relative">
        <img
          className="w-14 h-14 rounded-full shadow-md object-cover"
          src={data!.image}
          alt="moonbox-logo"
        />
        <div className="flex flex-col justify-center items-center absolute top-1/2 right-0">
          <span className="flex flex-col rounded-full items-center justify-center text-center text-white text-xs bg-black p-3 w-4 h-4">
            {id + 1}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-1 ml-4">
        <p className="block text-black text-sm font-bold mb-2">
          Mint: {trimString(mint, 8)} ({nftMetadata.data.name})
          <span style={{ fontSize: '8px' }} className="text-gray-600 block">
            {mint}
          </span>
        </p>
        <p className="block text-black text-sm font-bold mb-2">
          Winner Wallet: {trimString(winnerWallet, 8)}
          <span style={{ fontSize: '8px' }} className="text-gray-600 block">
            {winnerWallet}
          </span>
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
