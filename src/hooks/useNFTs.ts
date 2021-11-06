import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js';
import { getMetadataPDA } from 'lib/metaplex-sdk';
import * as SPLToken from '@solana/spl-token';
import useSWR from 'swr';
import { deserializeUnchecked } from 'borsh';
import { Metadata, METADATA_SCHEMA } from 'lib/metaplex-sdk/types';
import { useEffect, useRef } from 'react';

// eslint-disable-next-line no-control-regex
const METADATA_REPLACE = new RegExp('\u0000', 'g');

export const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer,
  ) as Metadata;
  metadata.data.name = metadata.data.name.replace(METADATA_REPLACE, '');
  metadata.data.uri = metadata.data.uri.replace(METADATA_REPLACE, '');
  metadata.data.symbol = metadata.data.symbol.replace(METADATA_REPLACE, '');
  return metadata;
};

const fetcher = (publicKey: PublicKey, connection: Connection) => async () => {
  if (!publicKey) return null;
  // Step #1. Get all token accounts for the given public key (Wallet).
  const { value } = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: SPLToken.TOKEN_PROGRAM_ID,
  });
  // Step #2. Remove all token accounts that are not NFTs or that we don't carry any token amount.
  const nftTokens = value.filter(
    (item, _, __, tokenAmount = item.account.data.parsed.info.tokenAmount) =>
      parseFloat(tokenAmount.amount) > 0 &&
      parseInt(tokenAmount.decimals) === 0,
  );
  const nfts: {
    nftToken: {
      pubkey: PublicKey;
      account: AccountInfo<ParsedAccountData>;
    };
    attachedMetadata: Metadata;
  }[] = [];
  for (const nftToken of nftTokens) {
    // Step #3. Get the metadata for each NFT token.
    try {
      const pda = await getMetadataPDA(
        new PublicKey(nftToken.account.data.parsed.info.mint),
      );
      const tokenMetadataAccountInfo = await connection.getAccountInfo(pda);
      const attachedMetadata = decodeMetadata(tokenMetadataAccountInfo!.data);
      nfts.push({ nftToken, attachedMetadata });
    } catch (error) {
      console.log(
        `MINT: ${nftToken.account.data.parsed.info.mint} IS NOT AN NFT`,
      );
    }
  }
  return nfts;
};

export const useNFTs = (publicKey: PublicKey, connection: Connection) => {
  const date = useRef(new Date());
  const swr = useSWR(
    ['NFTs', date.current.toISOString()],
    fetcher(publicKey, connection),
  );
  const mutate = swr.mutate;
  useEffect(
    () => () => {
      mutate();
    },
    [mutate],
  );
  return swr;
};
