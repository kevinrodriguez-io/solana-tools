import * as SPLToken from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { Shell } from 'components/layouts/Shell';
import { getMetadataPDA } from 'lib/metaplex-sdk';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

export const HomeView = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const date = useRef(new Date());
  const { data, error, mutate } = useSWR(
    [`getNFTs`, date.current.toISOString()],
    async () => {
      if (!publicKey) return null;
      const { value } = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: SPLToken.TOKEN_PROGRAM_ID,
        },
      );
      const nftTokens = value.filter(({ account }) => {
        const tokenAmount = account.data.parsed.info.tokenAmount;
        return (
          parseFloat(tokenAmount.amount) > 0 &&
          parseInt(tokenAmount.decimals) === 0
        );
      });
      for (const nftToken of nftTokens) {
        const pda = await getMetadataPDA(
          nftToken.account.data.parsed.info.mint,
        );
        const tokenMetadataAccountInfo = await connection.getAccountInfo(pda);
        // TODO: Convert tokenMetadataAccountInfo to a JSON object using BORSH.
      }
    },
  );
  useEffect(
    () => () => {
      mutate();
    },
    [mutate],
  );

  return (
    <Shell title="Random Drop">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Shell>
  );
};
