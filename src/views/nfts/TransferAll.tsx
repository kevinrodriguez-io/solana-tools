import { SearchIcon } from '@heroicons/react/solid';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LabelledInput } from 'components/LabelledInput';
import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { RoundButton } from 'components/RoundButton';
import { Skeleton } from 'components/Skeleton';
import { Terminal } from 'components/Terminal';
import { RandropperProvider } from 'context/RandropperContext';
import { useNFTs } from 'hooks/useNFTs';
import { PairInformation, sendPairItem } from 'lib/randropper/distributor';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import pLimit from 'p-limit';

const limit = pLimit(10);

export const TransferAll = () => {
  const { connecting, disconnecting, connected } = useWallet();
  if (connecting || disconnecting)
    return (
      <Shell title="Connecting...">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Shell>
    );
  if (!connected) return <Shell title="Please connect first..." />;
  return (
    <RandropperProvider>
      <TransferAllContent />
    </RandropperProvider>
  );
};

const TransferAllContent = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [destinationWallet, setDestinationWallet] = useState('');
  const { data: nfts } = useNFTs(publicKey!, connection);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pairs: PairInformation[] = nfts!.map((nft, i) => ({
      id: i.toString(),
      winnerWallet: destinationWallet,
      error: null,
      mint: nft.attachedMetadata.data.mint,
      state: 'pending',
      txId: null,
    }));
    const promises = pairs.map((pair) =>
      limit(() =>
        sendPairItem(
          pair,
          {
            connection,
            sendTransaction,
            walletPublicKey: publicKey!,
          },
          logger,
        ),
      ),
    );
    const results = await Promise.allSettled(promises);
    // Update the state of the pairs
    const updatedPairs = pairs.map((pair, i) => {
      const result = results[i];
      if (result.status === 'fulfilled') {
        return {
          ...pair,
          state: 'success',
          txId: result.value.txId,
        };
      } else {
        return {
          ...pair,
          state: 'failure',
          error: result.reason.message,
        };
      }
    });
    setJournal(
      (journal) => `${journal}${JSON.stringify(updatedPairs, null, 2)}\n`,
    );
  };

  return (
    <Shell title="NFTs">
      <NFTCardList publicKey={publicKey} />
      <div className="mt-4 py-4 px-4 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Transfer All NFTs To Wallet Address
        </h2>
        <div className="text-gray-700 text-xs my-4">
          <ul>
            <li>
              - <b>Be careful! 🚨</b> This will transfer all NFTs to the wallet
              address.
            </li>
            <li>
              - I'm no responsible for any loss. The only reason I built this is
              to ease some of the pain of manually transferring a big number of
              NFTs.
            </li>
            <li>
              - Extremely fast. 🚀 It parallelizes the transfers at 10tx at the
              same time by default.
            </li>
            <li>
              - This is a beta feature. 🚧 I expect bugs. Some Txs fail, so be
              sure to refresh the page if you see a failure and try again.
            </li>
            <li>
              - Due to random conditions on the Solana blockchain, transactions
              may fail. Refer to the logs for more information.
            </li>
            <li>
              - Use this at your own risk. 💀, I am not responsible for any
              loss.
            </li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} method="post">
          <div className="flex flex-row items-end">
            <LabelledInput
              label="Destination Wallet"
              minLength={32}
              maxLength={44}
              required
              value={destinationWallet}
              onChange={(e) => setDestinationWallet(e.target.value)}
              placeHolder="DeirG7Kui7zw8srzShhrPv2TJgwAn61GU7m8xmaK9GnW"
              name="destinationWallet"
              type="text"
            />
            <div className="ml-2">
              <RoundButton type="submit">
                <SearchIcon className="h-5 w-5" aria-hidden="true" />
              </RoundButton>
            </div>
          </div>
        </form>
        <Terminal
          ref={logBox}
          commandName={`transfer-all -from ${
            publicKey?.toString() ?? ''
          } -to ${destinationWallet}`}
        >
          {journal}
        </Terminal>
      </div>
    </Shell>
  );
};
