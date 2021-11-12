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

export type PairTransactionState = 'pending' | 'success' | 'error';

export type PairInformation = {
  index: number;
  mint: string;
  winnerWallet: string;
  txId: null;
  state: PairTransactionState;
};

const tryGetLocalStoragePairs = () => {
  const pairs = localStorage.getItem('pairs');
  if (pairs) {
    return JSON.parse(pairs);
  }
  return [];
};

export const Distributor = () => {
  const [pairs, setPairs] = useState<PairInformation[] | null>(
    tryGetLocalStoragePairs(),
  );
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
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [randropper] = useRandropper();
  const cmHoldersSwr = useCandyMachineHolders(
    randropper.candyMachinePrimaryKey.trim(),
    connection,
  );
  const nftsSwr = useNFTs(publicKey!, connection);

  useEffect(() => {
    localStorage.setItem('pairs', JSON.stringify(pairs));
  }, [pairs]);

  const isLoadingCMHolders = !cmHoldersSwr.data && !cmHoldersSwr.error;
  const isLoadingNFTs = !nftsSwr.data && !nftsSwr.error;
  const isLoading = isLoadingCMHolders || isLoadingNFTs;

  const handleMakeNewPairs = async () => {
    logger.next(`\nShuffling ${1_000_000} times.`);
    try {
      const pairs = await new Promise<PairInformation[]>((resolve, reject) => {
        const shufflerWorker = new Worker('./shuffler.worker.js', {
          type: 'module',
        });
        shufflerWorker.postMessage({
          nftMints: nftsSwr.data!.map((nft) =>
            new PublicKey(nft.attachedMetadata.mint).toBase58(),
          ),
          holderWallets: cmHoldersSwr.data!.map((cmHolder) =>
            cmHolder.ownerWallet.toBase58(),
          ),
        });
        shufflerWorker.onmessage = (event) => {
          if (event.data.type === 'error') {
            reject(event.data.error);
          } else {
            resolve(event.data.pairs);
          }
          console.log({ data: event.data });
          shufflerWorker.terminate();
        };
      });
      setPairs(pairs);
    } catch (error) {
      logger.next(`Error: ${error}`);
    }
    logger.next('Shuffling done.');
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
          {pairs?.length ? (
            <>
              <a
                href={pairsProofUrl}
                download="proof.json"
                className="flex-1 justify-center inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Download JSON Proof
              </a>
              <div className="m-1" />
              <Button className="flex-1 flex items-center justify-center">
                Start sending items
              </Button>
            </>
          ) : null}
        </div>
        <Terminal commandName="" ref={logBox}>
          {journal}
        </Terminal>
        <div className="flex flex-row flex-wrap">
          {(pairs ?? []).map(
            (
              { mint, winnerWallet, txId, state, index },
              _,
              __,
              matchingNFTItem = nftsSwr.data!.find(
                (i) =>
                  new PublicKey(i.attachedMetadata.mint).toBase58() === mint,
              ),
            ) => (
              <DistributionItem
                index={index}
                key={mint}
                mint={mint}
                nftMetadata={matchingNFTItem!.attachedMetadata}
                state={state}
                txId={txId}
                winnerWallet={winnerWallet}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};
