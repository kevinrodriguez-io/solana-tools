import { useConnection } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useCandyMachineHolders } from 'hooks/useCandyMachineHolders';
import { useEffect, useState } from 'react';
import { Terminal } from './Terminal';

type CandyMachineHolderListProps = {
  candyMachinePrimaryKey: string;
};

export const CandyMachineHolderList = ({
  candyMachinePrimaryKey,
}: CandyMachineHolderListProps) => {
  const { connection } = useConnection();
  const [loadingTextAnimation, setLoadingTextAnimation] = useState('Loading');
  const { data, error } = useCandyMachineHolders(
    candyMachinePrimaryKey.trim(),
    connection,
  );
  const [randropper, setRandropper] = useRandropper();
  const [didSetRandropperValue, setDidSetRandropperValue] = useState(false);
  const isLoading = !data && !error;
  const isError = error;
  const isEmpty = !data || data.length === 0;

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadingTextAnimation.length < 10) {
        setLoadingTextAnimation(loadingTextAnimation + '.');
      } else {
        setLoadingTextAnimation('Loading');
      }
    }, 300);
    return () => clearInterval(interval);
  }, [loadingTextAnimation]);

  useEffect(() => {
    if (isLoading || isError || isEmpty) {
      return;
    }
    if (data?.length && !didSetRandropperValue) {
      console.log('LOADED');
      setRandropper({
        ...randropper,
        loadedHolders: true,
        candyMachinePrimaryKey: candyMachinePrimaryKey.trim(),
      });
      setDidSetRandropperValue(true);
    }
  }, [
    candyMachinePrimaryKey,
    data,
    didSetRandropperValue,
    isEmpty,
    isError,
    isLoading,
    randropper,
    setRandropper,
  ]);

  if (isLoading) {
    return (
      <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
        Results will appear here once snapshot is taken. This process takes up
        to 10 minutes depending on your RPC.
        <br />
        {loadingTextAnimation}
      </Terminal>
    );
  }

  if (isError) {
    return (
      <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
        Sorry, an error occurred. ${error}
        Please refresh and try again.
      </Terminal>
    );
  }

  if (isEmpty) {
    return (
      <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
        No candy machine holders found.
      </Terminal>
    );
  }

  const uniqueHolders = [
    ...new Set((data ?? []).map((holder) => holder.ownerWallet.toBase58())),
  ];

  const holdersDownloadString =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(
      JSON.stringify(
        (data ?? []).map(
          ({
            associatedTokenAddress,
            metadataAccount,
            mintAccount,
            ownerWallet,
          }) => ({
            associatedTokenAddress: associatedTokenAddress.toBase58(),
            metadataAccount: metadataAccount.toBase58(),
            mintAccount: mintAccount.toBase58(),
            ownerWallet: ownerWallet.toBase58(),
          }),
        ),
      ),
    );

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
          Loaded!
          <br />
          {JSON.stringify(
            (data ?? []).map(
              ({
                associatedTokenAddress,
                metadataAccount,
                mintAccount,
                ownerWallet,
              }) => ({
                associatedTokenAddress: associatedTokenAddress.toBase58(),
                metadataAccount: metadataAccount.toBase58(),
                mintAccount: mintAccount.toBase58(),
                ownerWallet: ownerWallet.toBase58(),
              }),
            ),
            null,
            2,
          )}
        </Terminal>
      </div>
      <div className="flex flex-row mt-4">
        <div className="">
          <b>Total:</b> {(data ?? []).length} Tokens&nbsp;|&nbsp;
        </div>
        <div className="">
          <b>Unique Holders:</b> {uniqueHolders.length}&nbsp;|&nbsp;
        </div>
        <div className="">
          <a
            className="text-pink-700 hover:text-pink-500 cursor-pointer"
            href={holdersDownloadString}
            rel="noopener noreferrer"
            download={`${candyMachinePrimaryKey}-holders.json`}
            target="_blank"
          >
            Download JSON Snapshot
          </a>
        </div>
      </div>
    </div>
  );
};
