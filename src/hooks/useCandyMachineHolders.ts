import * as SPLToken from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { METAPLEX_PROGRAM_ID } from 'lib/metaplex-sdk';
import useSWR from 'swr/immutable';
import { decodeMetadata } from './useNFTs';
import pLimit from 'p-limit';

const limit = pLimit(10);

const MAX_NAME_LENGTH = 32;
const MAX_URI_LENGTH = 200;
const MAX_SYMBOL_LENGTH = 10;

type TokenHolder = {
  ownerWallet: PublicKey;
  associatedTokenAddress: PublicKey;
  mintAccount: PublicKey;
  metadataAccount: PublicKey;
};

const getCandyMachineCreatorAccounts = async (
  connection: Connection,
  candyMachineId: PublicKey,
) => {
  const accounts = await connection.getProgramAccounts(
    new PublicKey(METAPLEX_PROGRAM_ID),
    {
      filters: [
        {
          memcmp: {
            offset:
              1 + // key
              32 + // update auth
              32 + // mint
              4 + // name string length
              MAX_NAME_LENGTH + // name
              4 + // uri string length
              MAX_URI_LENGTH + // uri*
              4 + // symbol string length
              MAX_SYMBOL_LENGTH + // symbol
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
  return accounts;
};

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

const buildFetcher =
  (candyMachineId: PublicKey, connection: Connection) => async () => {
    // Benchmark
    const start = Date.now();
    const accounts = await getCandyMachineCreatorAccounts(
      connection,
      candyMachineId,
    );
    const mintAccounts = accounts.map(({ account, pubkey }) => ({
      pubkey,
      meta: decodeMetadata(account.data),
    }));
    const promises: Promise<TokenHolder>[] = mintAccounts.map((mintAccount) =>
      limit(
        () =>
          new Promise<TokenHolder>(async (resolve, reject) => {
            try {
              const tokenAccounts = await getMintHolderTokenAccounts(
                new PublicKey(mintAccount.meta.mint),
                connection,
              );
              for (const tokenAccount of tokenAccounts) {
                const decodedTokenAccount = SPLToken.AccountLayout.decode(
                  tokenAccount.account.data,
                );
                if (decodedTokenAccount.amount[0] === 1) {
                  resolve({
                    associatedTokenAddress: tokenAccount.pubkey,
                    metadataAccount: mintAccount.pubkey,
                    mintAccount: new PublicKey(mintAccount.meta.mint),
                    ownerWallet: new PublicKey(decodedTokenAccount.owner),
                  });
                  break;
                }
              }
            } catch (error) {
              reject(error);
            }
          }),
      ),
    );
    const holders = await Promise.all(promises);
    // Benchmark
    const end = Date.now();
    console.log(
      `Fetched ${holders.length} candy machine holders in ${end - start}ms`,
    );
    return holders;
  };

export const useCandyMachineHolders = (
  candyMachineId: string,
  connection: Connection,
) =>
  useSWR(
    `candyMachineId-${candyMachineId}`,
    buildFetcher(new PublicKey(candyMachineId), connection),
  );
