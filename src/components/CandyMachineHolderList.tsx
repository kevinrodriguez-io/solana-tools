import { useConnection } from '@solana/wallet-adapter-react';
import { useCandyMachineHolders } from 'hooks/useCandyMachineHolders';
import { Skeleton } from './Skeleton';

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
  const isLoading = !data && !error;
  const isError = error;
  const isEmpty = !data || data.length === 0;

  if (isLoading) {
    return (
      <>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </>
    );
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  if (isEmpty) {
    return <div>No Holders found</div>;
  }

  // Count unique holders
  const uniqueHolders = [
    ...new Set(data.map((holder) => holder.ownerWallet.toBase58())),
  ];

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
          <b>Unique Holders:</b> {uniqueHolders.length}
        </div>
      </div>
    </div>
  );
};