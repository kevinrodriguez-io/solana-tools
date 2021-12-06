import { Connection, PublicKey } from '@solana/web3.js';
import useSWR from 'swr/immutable';
import { getCandyMachineCreatorAccounts } from 'lib/metaplex-sdk/candyMachine';
import * as Metaplex from '@metaplex/js';
const MetadataProgram = Metaplex.programs.metadata;

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
    return mintAccounts.map((i) => i.meta.data.mint);
  };

export const useCandyMachineMints = (
  candyMachineId: string,
  connection: Connection,
) =>
  useSWR(
    `candyMachineId-mints-${candyMachineId}`,
    buildFetcher(new PublicKey(candyMachineId), connection),
  );
