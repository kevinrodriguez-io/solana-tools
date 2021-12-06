import { Connection, PublicKey } from '@solana/web3.js';
import * as SPLToken from '@solana/spl-token';
import useSWR from 'swr/immutable';
import pLimit from 'p-limit';
import * as Metaplex from '@metaplex/js';

const limit = pLimit(10);

const MetadataProgram = Metaplex.programs.metadata;

const buildFetcher =
  (publicKey: PublicKey, connection: Connection) => async () => {
    if (!publicKey) return null;
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      { programId: SPLToken.TOKEN_PROGRAM_ID },
    );
    const nftTokens = tokenAccounts.value.filter(
      (item, _, __, tokenAmount = item.account.data.parsed.info.tokenAmount) =>
        parseFloat(tokenAmount.amount) === 1 &&
        parseInt(tokenAmount.decimals) === 0,
    );
    return Promise.all(
      nftTokens.map((nftToken) =>
        limit(async () => {
          const mint = nftToken.account.data.parsed.info.mint;
          const pda = await MetadataProgram.Metadata.getPDA(
            new PublicKey(mint),
          );
          const metadataAccountInfo = await connection.getAccountInfo(pda);
          const attachedMetadata = new MetadataProgram.Metadata(
            pda,
            metadataAccountInfo!,
          );
          console.log({ attachedMetadata });
          return { nftToken, attachedMetadata };
        }),
      ),
    );
  };

export const useNFTs = (publicKey: PublicKey, connection: Connection) =>
  useSWR(`nfts-for-wallet-${publicKey}`, buildFetcher(publicKey, connection));
