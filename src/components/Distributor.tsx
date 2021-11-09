import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useCandyMachineHolders } from 'hooks/useCandyMachineHolders';
import { useNFTs } from 'hooks/useNFTs';
import { Skeleton } from './Skeleton';
import { shuffle as secureShuffle } from 'lib/randropper/randropper';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { PublicKey } from '@solana/web3.js';
import { DistributionItem } from './DistributionItem';

export type PairTransactionState = 'pending' | 'success' | 'error';

export type PairInformation = {
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

  const handleMakeNewPairs = () => {
    const nftMints = secureShuffle(
      (nftsSwr.data || []).map((nft) => nft.attachedMetadata.mint),
    );
    const holderWallets = secureShuffle(
      (cmHoldersSwr.data ?? []).map((i) => ({
        wallet: i.ownerWallet,
        hasAssignedMint: false,
      })),
    );

    const pairs: PairInformation[] = [];
    for (const mint of nftMints) {
      const holder = holderWallets.find((i) => !i.hasAssignedMint);
      if (holder) {
        console.log({ mint, holder });
        pairs.push({
          mint: new PublicKey(mint).toBase58(),
          winnerWallet: holder.wallet.toBase58(),
          state: 'pending',
          txId: null,
        });
        holder.hasAssignedMint = true;
      }
    }
    setPairs(pairs);
  };

  if (isLoading) {
    return <Skeleton />;
  }

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
              <Button className="flex-1 flex items-center justify-center">
                Download JSON Proof
              </Button>
              <div className="m-1" />
              <Button className="flex-1 flex items-center justify-center">
                Start sending items
              </Button>
            </>
          ) : null}
        </div>
        {pairs?.map(
          (
            { mint, winnerWallet, txId, state },
            _,
            __,
            matchingNFTItem = nftsSwr.data!.find(
              (i) => new PublicKey(i.attachedMetadata.mint).toBase58() === mint,
            ),
          ) => (
            <DistributionItem
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
  );
};
