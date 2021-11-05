import { PublicKey } from '@solana/web3.js';

export const METAPLEX_PROGRAM_ID =
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

export const getMetadataPDA = async (publicKey: PublicKey) => {
  const metaplexPubkey = new PublicKey(METAPLEX_PROGRAM_ID);
  const seeds = [
    Buffer.from('metadata'),
    metaplexPubkey.toBuffer(),
    publicKey.toBuffer(),
  ];
  const [pda] = await PublicKey.findProgramAddress(seeds, metaplexPubkey);
  return pda;
};
