import * as SPLToken from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import useSWR from 'swr/immutable';
import pLimit from 'p-limit';
import * as Metaplex from '@metaplex/js';

const MetadataProgram = Metaplex.programs.metadata;

const limit = pLimit(10);

const getCandyMachineCreatorAccounts = async (
  connection: Connection,
  candyMachineId: PublicKey,
) =>
  connection.getProgramAccounts(
    new PublicKey(Metaplex.programs.metadata.MetadataProgram.PUBKEY),
    {
      filters: [
        {
          // This is some of that metaplex black magic query things.
          memcmp: {
            offset:
              1 + // key
              32 + // update auth
              32 + // mint
              4 + // name string length
              MetadataProgram.MAX_NAME_LENGTH + // name
              4 + // uri string length
              MetadataProgram.MAX_URI_LENGTH + // uri*
              4 + // symbol string length
              MetadataProgram.MAX_SYMBOL_LENGTH + // symbol
              2 + // seller fee basis points
              1 + // whether or not there is a creators vec
              4, // creators
            bytes: candyMachineId.toBase58(),
          },
        },
      ],
      encoding: 'base64',
      commitment: 'confirmed',
    },
  );

const getMintHolderTokenAccounts = (
  mintAccount: PublicKey,
  connection: Connection,
) =>
  connection.getProgramAccounts(SPLToken.TOKEN_PROGRAM_ID, {
    filters: [
      {
        memcmp: {
          offset: 0,
          bytes: mintAccount.toBase58(),
        },
      },
      {
        dataSize: 165,
      },
    ],
    encoding: 'base64',
    commitment: 'confirmed',
  });

type TokenHolder = {
  associatedTokenAddress: PublicKey;
  metadataAccount: PublicKey;
  mintAccount: PublicKey;
  ownerWallet: PublicKey;
};

const buildFetcher =
  (candyMachineId: PublicKey, connection: Connection) => async () => {
    const accounts = await getCandyMachineCreatorAccounts(
      connection,
      candyMachineId,
    );
    const mintAccounts = accounts.map(({ account, pubkey }) => ({
      pubkey,
      meta: new MetadataProgram.Metadata(pubkey, account),
    }));
    const promises = mintAccounts.map((mintAccount) =>
      limit(async () => {
        const tokenAccounts = await getMintHolderTokenAccounts(
          new PublicKey(mintAccount.meta.data.mint),
          connection,
        );
        for (const tokenAccount of tokenAccounts) {
          const decodedTokenAccount = SPLToken.AccountLayout.decode(
            tokenAccount.account.data,
          );
          if (decodedTokenAccount.amount[0] === 1) {
            return {
              associatedTokenAddress: tokenAccount.pubkey,
              metadataAccount: mintAccount.pubkey,
              mintAccount: new PublicKey(mintAccount.meta.data.mint),
              ownerWallet: new PublicKey(decodedTokenAccount.owner),
            };
          }
        }
      }),
    );
    return (await Promise.all(promises)).filter(Boolean) as TokenHolder[];
  };

export const useCandyMachineHolders = (
  candyMachineId: string,
  connection: Connection,
) =>
  useSWR(
    `candyMachineId-${candyMachineId}`,
    buildFetcher(new PublicKey(candyMachineId), connection),
  );
