/* eslint-disable no-restricted-globals */
import * as Web3 from '@solana/web3.js';

addEventListener('message', (e) => {
  const keyPair = Web3.Keypair.generate();
  const publicKey = keyPair.publicKey.toBase58();
  const privateKey = [...keyPair.secretKey.values()];
  postMessage({ publicKey, privateKey });
});
