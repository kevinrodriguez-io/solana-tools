import axios from 'axios';
import { TokenMetadataType } from 'lib/metaplex-sdk/tokenMetadataType';
import { Data } from 'lib/metaplex-sdk/types';
import useSWR from 'swr';
import { Skeleton } from './Skeleton';

export type NFTCardProps = {
  nftData: Data;
};

export const NFTCard = ({ nftData }: NFTCardProps) => {
  const { data, error } = useSWR(nftData.uri, (uri: string) =>
    axios.get<TokenMetadataType>(uri).then((res) => res.data),
  );
  const isLoading = !error && !data;
  if (isLoading) return <Skeleton />;
  return (
    <div className="group relative">
      <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
        <img
          src={data!.image}
          alt={data!.image}
          className="w-full h-full object-center object-cover lg:w-full lg:h-full"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <span aria-hidden="true" className="absolute inset-0" />
            {data!.name.toString()}
          </h3>
        </div>
      </div>
    </div>
  );
};
