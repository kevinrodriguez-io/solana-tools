import axios from 'axios';
import { TokenMetadataType } from 'lib/metaplex-sdk/tokenMetadataType';
import { Metadata } from 'lib/metaplex-sdk/types';
import { trimString } from 'lib/string/trimString';
import { FC } from 'react';
import useSWR from 'swr';
import { PairInformation, PairTransactionState } from './Distributor';
import { Skeleton } from './Skeleton';
import { Colors } from '@kevinrodriguez-io/pigment-core';
import { RefreshIcon } from '@heroicons/react/solid';
import { RoundButton } from './RoundButton';

const getTxStateBgColor = (txState: PairTransactionState) => {
  switch (txState) {
    case 'pending':
      return Colors.flatWhite.light;
    case 'success':
      return Colors.flatGreen.light;
    case 'error':
      return Colors.flatWatermelon.light;
    case 'processing':
      return Colors.flatPurple.light;
  }
};

export const DistributionItem: FC<
  PairInformation & {
    nftMetadata: Metadata;
  }
> = ({ id, mint, state, nftMetadata, txId, winnerWallet }) => {
  const { data, error } = useSWR(nftMetadata.data.uri, (uri: string) =>
    axios.get<TokenMetadataType>(uri).then((res) => res.data),
  );

  const handleRetryItem = () => {};

  const isLoading = !error && !data;
  if (isLoading) {
    return <Skeleton />;
  }
  return (
    <div
      key={mint}
      className="m-4 p-4 rounded-xl shadow-xl flex flex-row bg-gray-50"
      style={{
        backgroundColor: getTxStateBgColor(state),
      }}
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
          <p>{nftMetadata.data.name}</p>
          Mint: {trimString(mint, 8)}
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
      <div className="flex flex-col justify-center ml-4">
        <RoundButton
          className={true ? '' : 'animate-spin'}
          onClick={handleRetryItem}
        >
          <RefreshIcon className="h-5 w-5 rotate-180" aria-hidden="true" />
        </RoundButton>
      </div>
    </div>
  );
};
