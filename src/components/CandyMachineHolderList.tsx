import { useConnection } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useCandyMachineHolders } from 'hooks/useCandyMachineHolders';
import { useEffect } from 'react';

type CandyMachineHolderListProps = {
  candyMachinePrimaryKey: string;
};

export const CandyMachineHolderList = ({
  candyMachinePrimaryKey,
}: CandyMachineHolderListProps) => {
  const { connection } = useConnection();
  const { data, error } = useCandyMachineHolders(
    candyMachinePrimaryKey.trim(),
    connection,
  );
  const [, setRandropper] = useRandropper()
  const isLoading = !data && !error;
  const isError = error;
  const isEmpty = !data || data.length === 0;

  useEffect(() => {
    if (isLoading || isError || isEmpty) {
      return;
    }
    if (data && data.length) {
    }
  }, [isEmpty, isError, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <pre className="flex bg-gray-800 text-white max-h-96 overflow-scroll mt-4 p-4 shadow-md rounded-md">
          {JSON.stringify(
            {
              candyMachinePK: candyMachinePrimaryKey,
              loading: true,
              note: 'Results will appear here once snapshot is taken. This process takes up to 10 minutes depending on your RPC.',
            },
            null,
            2,
          )}
        </pre>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col">
        <pre className="flex bg-gray-800 text-white max-h-96 overflow-scroll mt-4 p-4 shadow-md rounded-md">
          {JSON.stringify({ error }, null, 2)}
        </pre>
      </div>
    );
  }

  if (isEmpty) {
    return <div>No Holders found</div>;
  }

  // Count unique holders
  const uniqueHolders = [
    ...new Set(data.map((holder) => holder.ownerWallet.toBase58())),
  ];

  const holdersDownloadString =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(
      JSON.stringify(
        data.map(
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
      <pre className="flex bg-gray-800 text-white max-h-96 overflow-scroll mt-4 p-4 shadow-md rounded-md">
        {JSON.stringify(
          data.map(
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
      </pre>
      <div className="flex flex-row mt-4">
        <div className="">
          <b>Total:</b> {data.length} Tokens&nbsp;|&nbsp;
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
