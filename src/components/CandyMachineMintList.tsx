import { useConnection } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useCandyMachineMints } from 'hooks/useCandyMachineMints';
import { useEffect, useState } from 'react';
import { Terminal } from './Terminal';

type CandyMachineMintListProps = {
  candyMachinePrimaryKey: string;
};

export const CandyMachineMintList = ({
  candyMachinePrimaryKey,
}: CandyMachineMintListProps) => {
  const { connection } = useConnection();
  const [loadingTextAnimation, setLoadingTextAnimation] = useState('Loading');
  const { data, error } = useCandyMachineMints(
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
        to 1 minute depending on your RPC.
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

  const holdersDownloadString =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(data ?? []));

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
          Loaded!
          <br />
          {JSON.stringify(data ?? [], null, 2)}
        </Terminal>
      </div>
      <div className="flex flex-row mt-4">
        <div className="">
          <b>Total:</b> {(data ?? []).length} Tokens&nbsp;|&nbsp;
        </div>
        <div className="">
          <a
            className="text-pink-700 hover:text-pink-500 cursor-pointer"
            href={holdersDownloadString}
            rel="noopener noreferrer"
            download={`${candyMachinePrimaryKey}-mints.json`}
            target="_blank"
          >
            Download JSON Snapshot
          </a>
        </div>
      </div>
    </div>
  );
};
