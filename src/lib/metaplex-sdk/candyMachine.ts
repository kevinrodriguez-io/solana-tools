import { Connection, PublicKey } from '@solana/web3.js';
import * as Metaplex from '@metaplex/js';

const MetadataProgram = Metaplex.programs.metadata;

export const getCandyMachineCreatorAccounts = async (
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
