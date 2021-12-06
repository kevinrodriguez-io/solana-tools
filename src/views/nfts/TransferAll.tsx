import { SearchIcon } from '@heroicons/react/solid';
import { useWallet } from '@solana/wallet-adapter-react';
import { LabelledInput } from 'components/LabelledInput';
import { Shell } from 'components/layouts/Shell';
import { NFTCardList } from 'components/NFTCardList';
import { RoundButton } from 'components/RoundButton';
import { Skeleton } from 'components/Skeleton';
import { Terminal } from 'components/Terminal';
import { RandropperProvider } from 'context/RandropperContext';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Subject } from 'rxjs';

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
  const { publicKey } = useWallet();
  const [destinationWallet, setDestinationWallet] = useState('');
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

  const handleSubmit = () => {};

  return (
    <Shell title="NFTs">
      <NFTCardList publicKey={publicKey} />
      <div className="mt-4 py-4 px-4 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Transfer All NFTs To Wallet Address
        </h2>
        <div className="text-gray-700 text-xs my-4">
          🚨 Be careful! This will transfer all NFTs to the wallet address. I'm
          no responsible for any loss.
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
