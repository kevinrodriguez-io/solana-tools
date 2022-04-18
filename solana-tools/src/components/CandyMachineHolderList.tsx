import { useEffect, useMemo, useState } from 'react';
import { useGetHolderSnapshotQuery } from '../lib/graphql/sdk';
import { Terminal } from './Terminal';

type SnapshotItem = {
  name: string;
  mint_account: string;
  owner: string | null;
  owner_twitter: string | null;
};

type CandyMachineHolderListProps = {
  candyMachinePrimaryKey: string;
};

export const CandyMachineHolderList = ({
  candyMachinePrimaryKey,
}: CandyMachineHolderListProps) => {
  const [loadingTextAnimation, setLoadingTextAnimation] = useState('Loading');
  const { loading, data, error } = useGetHolderSnapshotQuery({
    variables: { creator: candyMachinePrimaryKey },
  });

  const snapshot: SnapshotItem[] = useMemo(() => {
    if (!data) return [];
    return data.nfts.map(({ owner, name, mint_account }) => ({
      name,
      mint_account,
      owner: owner?.address ?? null,
      owner_twitter: owner?.twitterHandle ?? null,
    }));
  }, [data]);

  const snapshotReadableString = useMemo(
    () => JSON.stringify(snapshot, null, 2),
    [snapshot],
  );

  const uniqueHolders = useMemo(
    () => [...new Set(snapshot.map(({ owner }) => owner))],
    [snapshot],
  );

  const groupedHolders = useMemo(() => {
    const grouped: Record<string, { items: SnapshotItem[]; amount: number }> =
      {};
    uniqueHolders.forEach((holder) => {
      const items = snapshot.filter(({ owner }) => owner === holder);
      grouped[holder ?? 'unknown'] = {
        amount: items.length,
        items,
      };
    });
    return Object.fromEntries(
      Object.entries(grouped).sort(([_, a], [__, b]) => b.amount - a.amount),
    );
  }, [snapshot]);

  const groupedSnapshotReadableString = useMemo(
    () => JSON.stringify(groupedHolders, null, 2),
    [groupedHolders],
  );

  const holdersDownloadString = useMemo(
    () =>
      `data:text/json;charset=utf-8,${encodeURIComponent(
        snapshotReadableString,
      )}`,
    [snapshotReadableString],
  );

  const groupedHoldersDownloadString = useMemo(
    () =>
      `data:text/json;charset=utf-8,${encodeURIComponent(
        groupedSnapshotReadableString,
      )}`,
    [groupedSnapshotReadableString],
  );

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

  if (loading) {
    return (
      <Terminal commandName={`load-cm-mints ${candyMachinePrimaryKey}`}>
        Results will appear here once snapshot is taken. This process takes up
        to 10 minutes depending on your RPC.
        <br />
        {loadingTextAnimation}
      </Terminal>
    );
  }

  if (error) {
    return (
      <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
        <>
          Sorry, an error occurred. ${error}
          Please refresh and try again.
        </>
      </Terminal>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="w-full">
        <Terminal commandName={`load-cm-holders ${candyMachinePrimaryKey}`}>
          {snapshotReadableString}
        </Terminal>
      </div>
      <div className="w-full">
        <Terminal
          commandName={`load-cm-holders-grouped ${candyMachinePrimaryKey}`}
        >
          {groupedSnapshotReadableString}
        </Terminal>
      </div>
      <div className="flex flex-row mt-4">
        <div className="">
          <b>Total:</b> {snapshot.length} Tokens&nbsp;|&nbsp;
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
            Download JSON Snapshot&nbsp;|&nbsp;
          </a>
        </div>
        <div className="">
          <a
            className="text-pink-700 hover:text-pink-500 cursor-pointer"
            href={groupedHoldersDownloadString}
            rel="noopener noreferrer"
            download={`${candyMachinePrimaryKey}-grouped-holders.json`}
            target="_blank"
          >
            Download grouped JSON Snapshot
          </a>
        </div>
      </div>
    </div>
  );
};
