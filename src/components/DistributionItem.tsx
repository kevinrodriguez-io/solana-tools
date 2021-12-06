import axios from 'axios';
import { TokenMetadataType } from 'lib/metaplex-sdk/tokenMetadataType';
import { trimString } from 'lib/string/trimString';
import { FC } from 'react';
import useSWR from 'swr';
import {
  PairInformation,
  Pairs,
  PairsSetter,
  PairTransactionState,
  sendPairItem,
} from './Distributor';
import { Skeleton } from './Skeleton';
import { Colors } from '@kevinrodriguez-io/pigment-core';
import { RefreshIcon } from '@heroicons/react/solid';
import { RoundButton } from './RoundButton';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Subject } from 'rxjs';
import { Metadata } from '@metaplex/js/lib/programs/metadata';

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
    case 'weird':
      return Colors.flatYellow.light;
  }
};

type DistributionItemProps = {
  pair: PairInformation;
  nftMetadata?: Metadata;
  pairs: Pairs;
  setPairs: PairsSetter;
  logger: Subject<string>;
};

export const DistributionItem: FC<DistributionItemProps> = ({
  pair,
  nftMetadata,
  setPairs,
  logger,
}) => {
  const { id, mint, state, txId, winnerWallet } = pair;
  const { data, error } = useSWR(
    nftMetadata?.data?.data?.uri ?? 'NOT_FOUND',
    (uri: string) => {
      if (uri === 'NOT_FOUND') throw new Error('NOT_FOUND');
      return axios.get<TokenMetadataType>(uri).then((res) => res.data);
    },
  );
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const handleRetryItem = async () => {
    try {
      setPairs((pairs) => ({
        ...pairs,
        [pair.id]: {
          ...pair,
          state: 'processing',
        },
      }));
      const result = await sendPairItem(
        pair,
        setPairs,
        { connection, sendTransaction, walletPublicKey: publicKey! },
        logger,
      );
      setPairs((pairs) => ({ ...pairs, [result.id]: result }));
    } catch (error: any) {
      if (
        (error.message as string)
          .toLowerCase()
          ?.includes('it is unknown if it succeeded or failed')
      ) {
        setPairs((pairs) => ({
          ...pairs,
          [pair.id]: {
            ...pair,
            state: 'weird',
            txId: error.message,
          },
        }));
        logger.next(
          `CHECK TXID: ${error}, pair: ${JSON.stringify(pair, null, 2)}`,
        );
      } else {
        setPairs((pairs) => ({
          ...pairs,
          [pair.id]: {
            ...pair,
            state: 'error',
          },
        }));
        logger.next(`Error: ${error}, pair: ${JSON.stringify(pair, null, 2)}`);
      }
    }
  };

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
          src={data?.image}
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
          <span className="inline-block">
            {nftMetadata?.data?.data?.name ?? 'ALREADY_SENT'}
          </span>
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
          // disabled={state === 'processing'}
          className={true ? '' : 'animate-spin'}
          onClick={handleRetryItem}
        >
          <RefreshIcon className="h-5 w-5 rotate-180" aria-hidden="true" />
        </RoundButton>
      </div>
    </div>
  );
};
