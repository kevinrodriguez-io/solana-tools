/* eslint-disable no-restricted-globals */
import { PublicKey } from '@solana/web3.js';

const cryptoRand = () => {
  const array = new Uint8Array(4);
  crypto.getRandomValues(array);
  const dataView = new DataView(array.buffer);
  const uint = dataView.getUint32(0);
  const value = uint / (0xffffffff + 1); // 0xFFFFFFFF = uint32.MaxValue (+1 because Math.random is inclusive of 0, but not 1)
  return value;
};

const shuffle = (array) => {
  const shuffled = array.slice(0);
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(cryptoRand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

addEventListener('message', (e) => {
  try {
    const { nftMints, holderWallets } = e.data;
    for (let i = 0; i < 1_000_000; i++) {
      // Shuffle a million times.
      const nftMintsShuffled = shuffle(nftMints);
      const holderWalletsShuffled = shuffle(
        holderWallets.map((wallet) => ({
          wallet: wallet,
          hasAssignedMint: false,
        })),
      );
      const pairs = [];
      for (const [id, mint] of nftMintsShuffled.entries()) {
        const holder = holderWalletsShuffled.find((i) => !i.hasAssignedMint);
        if (holder) {
          pairs.push({
            id,
            mint: new PublicKey(mint).toBase58(),
            winnerWallet: new PublicKey(holder.wallet).toBase58(),
            state: 'pending',
            txId: null,
          });
          holder.hasAssignedMint = true;
        }
      }
      postMessage({ type: 'SUCCESS', pairs });
    }
  } catch (error) {
    postMessage({ type: 'ERROR', error });
  }
});
