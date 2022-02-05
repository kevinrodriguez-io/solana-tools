import { useConnection } from '@solana/wallet-adapter-react';
import { useRandropper } from 'context/RandropperContext';
import { useNFTs } from 'hooks/useNFTs';
import { trimString } from 'lib/string/trimString';
import { FC, useEffect, useState } from 'react';
import { NFTCard } from './NFTCard';
import { Skeleton } from './Skeleton';
import cx from 'classnames';
import { PublicKey } from '@solana/web3.js';

type NFTCardListProps = {
  limitHeight?: boolean;
  publicKey: PublicKey | null;
};

export const NFTCardList: FC<NFTCardListProps> = ({
  limitHeight = false,
  publicKey,
}) => {
  const { connection } = useConnection();
  const { data, error } = useNFTs(publicKey!, connection);
  const [randropper, setRandropper] = useRandropper();
  const [didSetRandropperValue, setDidSetRandropperValue] = useState(false);
  const isLoading = !data && !error;
  const isError = error;
  const isEmpty = !data || data.length === 0;

  useEffect(() => {
    if (isLoading || isError || isEmpty) {
      return;
    }
    if (data?.length && !didSetRandropperValue) {
      console.log('LOADED');
      setRandropper({
        ...randropper,
        loadedNFTS: true,
      });
      setDidSetRandropperValue(true);
    }
  }, [
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
    return (
      <div className="bg-white mt-4 shadow-2xl rounded-2xl">
        <div className="mx-auto py-4 px-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            There are no NFTs Held in Wallet{' '}
            {trimString(publicKey!.toString(), 8)}
          </h2>
        </div>
      </div>
    );
  }

  const nfts = data.map((i) => i.attachedMetadata);

  return (
    <div className="bg-white mt-4 shadow-2xl rounded-2xl">
      <div
        className={cx('mx-auto py-4 px-4 overflow-auto', {
          'max-h-96': limitHeight,
        })}
      >
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          NFTs Held in Wallet {trimString(publicKey!.toString(), 8)} (
          {data.length})
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {nfts.map((nft) => (
            <NFTCard key={nft.data.mint.toString()} nftData={nft.data.data} />
          ))}
        </div>
        <div className="flex flex-row mt-4">
          <div className="">
            <b>Total:</b> {data.length} NFTs&nbsp;|&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};
