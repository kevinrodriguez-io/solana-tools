import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useCandyMachineHolders } from 'hooks/useCandyMachineHolders';
import { useNFTs } from 'hooks/useNFTs';
import { Skeleton } from './Skeleton';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './Button';
import { PublicKey } from '@solana/web3.js';
import { DistributionItem } from './DistributionItem';
import { Subject } from 'rxjs';
import { Terminal } from './Terminal';
import { useLocalStorage } from 'hooks/useLocalStorage';
import { PairInformation, sendPairItem } from 'lib/randropper/distributor';

export type Pairs = Record<string, PairInformation>;
export type PairsSetter = (value: Pairs | ((val: Pairs) => Pairs)) => void;

export class TransactionError extends Error {
  public pair: PairInformation;
  constructor(msg: string, pair: PairInformation) {
    super(msg);
    this.pair = pair;
    Object.setPrototypeOf(this, TransactionError.prototype);
  }
  // TS Magic
  static isTransactionError = (error: any): error is TransactionError =>
    typeof error?.pair?.id === 'number' &&
    typeof error?.pair?.mint === 'string' &&
    typeof error?.pair?.winnerWallet === 'string';
}

export const Distributor = () => {
  const { candyMachinePrimaryKey } = useRandropper()[0];
  const [pairs, setPairs] = useLocalStorage<Record<string, PairInformation>>(
    `pairs-for-cm-${candyMachinePrimaryKey}`,
    {},
  );

  //#region Logger
  const logger = useMemo(() => new Subject<string>(), []);
  const logBox = useRef<HTMLPreElement>(null!);
  const [journal, setJournal] = useState('Transaction history will go here.');
  useEffect(() => {
    const subscription = logger.subscribe((newLine) => {
      setJournal((journal) => `${journal}${newLine}\n`);
    });
    logBox.current.scrollTop = logBox.current.scrollHeight;
    return () => {
      subscription.unsubscribe();
    };
  }, [logger]);
  //#endregion

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [randropper] = useRandropper();
  const cmHoldersSwr = useCandyMachineHolders(
    randropper.candyMachinePrimaryKey.trim(),
    connection,
  );
  const nftsSwr = useNFTs(publicKey!, connection);
  const isLoadingCMHolders = !cmHoldersSwr.data && !cmHoldersSwr.error;
  const isLoadingNFTs = !nftsSwr.data && !nftsSwr.error;
  const isLoading = isLoadingCMHolders || isLoadingNFTs;

  const handleMakeNewPairs = async () => {
    logger.next(`\nShuffling ${1_000_000} times.`);
    try {
      const localPairs = await new Promise<PairInformation[]>(
        (resolve, reject) => {
          const shufflerWorker = new Worker('./shuffler.worker.js', {
            type: 'module',
          });
          shufflerWorker.postMessage({
            nftMints: nftsSwr.data!.map((nft) =>
              new PublicKey(nft.attachedMetadata.data.mint).toBase58(),
            ),
            holderWallets: cmHoldersSwr.data!.map((cmHolder) =>
              cmHolder.ownerWallet.toBase58(),
            ),
          });
          shufflerWorker.onmessage = (event) => {
            if (event.data.type === 'ERROR') {
              reject(event.data.error);
            } else {
              resolve(event.data.pairs);
            }
            console.log({ data: event.data });
            shufflerWorker.terminate();
          };
        },
      );
      setPairs(
        localPairs.reduce(
          (acc, pair) => ({
            ...acc,
            [pair.id]: pair,
          }),
          {},
        ),
      );
    } catch (error) {
      logger.next(`Error: ${error}`);
    }
    logger.next('Shuffling done.');
  };

  const handleStartSendingItems = async () => {
    logger.next(`\nSending ${(Object.values(pairs) ?? []).length} pairs.`);
    if (!pairs || Object.keys(pairs).length === 0) {
      logger.next('No pairs to send.');
      return;
    }
    for (const pair of Object.values(pairs)) {
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
          logger.next(
            `Error: ${error}, pair: ${JSON.stringify(pair, null, 2)}`,
          );
        }
      }
    }

    logger.next('Sending done.');
  };

  if (isLoading) {
    return <Skeleton />;
  }

  const pairsJSON = JSON.stringify(pairs ?? [], null, 2);
  const blob = new Blob([pairsJSON], { type: 'application/json' });
  const pairsProofUrl = URL.createObjectURL(blob);

  return (
    <div className="mt-4 py-4 px-4 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
        Pair Maker
      </h2>
      <div className="flex flex-col mt-2">
        <div className="flex flex-row items-center, justify-center">
          <Button
            className="flex-1 flex items-center justify-center"
            onClick={handleMakeNewPairs}
          >
            Make pairs (Shuffle)
          </Button>
          <div className="m-1" />
          {Object.values(pairs).length ? (
            <>
              <a
                href={pairsProofUrl}
                download="proof.json"
                className="flex-1 justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download JSON Proof
              </a>
              <div className="m-1" />
              <Button
                onClick={handleStartSendingItems}
                className="flex-1 flex items-center justify-center"
              >
                Start sending items
              </Button>
            </>
          ) : null}
        </div>
        <Terminal commandName="" ref={logBox}>
          {journal}
        </Terminal>
        <div className="flex flex-row flex-wrap">
          {(pairs ? Object.values(pairs) : []).map(
            (
              pair,
              _,
              __,
              matchingNFTItem = nftsSwr.data!.find(
                (i) =>
                  new PublicKey(i.attachedMetadata.data.mint).toBase58() ===
                  pair.mint,
              ),
            ) => (
              <DistributionItem
                key={pair.id}
                pair={pair}
                setPairs={setPairs}
                nftMetadata={matchingNFTItem?.attachedMetadata}
                pairs={pairs}
                logger={logger}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};
