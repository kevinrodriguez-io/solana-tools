import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Subject } from 'rxjs';
import * as SPLToken from '@solana/spl-token';
import { getOrCreateAssociatedAccountInfoWithWallet } from 'lib/solana/getOrCreateAssociatedTokenAccount';

export type PairTransactionState =
  | 'pending'
  | 'processing'
  | 'success'
  | 'error'
  | 'weird';

export type PairInformation = {
  id: string;
  mint: string;
  destinationWallet: string;
  txId: string | null;
  state: PairTransactionState;
  error: string | null;
};

type SendTransaction = ReturnType<typeof useWallet>['sendTransaction'];

type SendPairItemConfig = {
  walletPublicKey: PublicKey;
  connection: Connection;
  sendTransaction: SendTransaction;
};

export const sendPairItem = async (
  pair: PairInformation,
  { walletPublicKey, connection, sendTransaction }: SendPairItemConfig,
  logger?: Subject<string>,
) => {
  const { mint, destinationWallet } = pair;
  logger?.next(`[${pair.id}] - Sending Pair ${mint} - ${destinationWallet}.`);
  const token = new SPLToken.Token(
    connection,
    new PublicKey(mint),
    SPLToken.TOKEN_PROGRAM_ID,
    {
      publicKey: walletPublicKey,
      secretKey: new Uint8Array(0), // Disregard this, in fact it should be nullable.
    },
  );

  logger?.next(`[${pair.id}] - Get/Create ATA for ${walletPublicKey.toBase58()}.`);
  const source = await getOrCreateAssociatedAccountInfoWithWallet(
    connection,
    sendTransaction,
    {
      address: walletPublicKey,
      payer: walletPublicKey,
      token,
    },
  );

  logger?.next(`[${pair.id}] - Get/Create ATA for ${destinationWallet!}.`);
  const destination = await getOrCreateAssociatedAccountInfoWithWallet(
    connection,
    sendTransaction,
    {
      address: new PublicKey(destinationWallet),
      payer: walletPublicKey!,
      token,
    },
  );

  const transferInstruction = SPLToken.Token.createTransferInstruction(
    SPLToken.TOKEN_PROGRAM_ID,
    source.address,
    destination.address,
    walletPublicKey!,
    [],
    1,
  );

  const recentBlockhash = await connection.getRecentBlockhash();
  const transaction = new Transaction({
    feePayer: walletPublicKey!,
    recentBlockhash: recentBlockhash.blockhash,
  }).add(transferInstruction);

  const signature = await sendTransaction(transaction, connection);
  logger?.next(`[${pair.id}] - Pair ${mint} - ${destinationWallet} sent.`);
  return { ...pair, txId: signature, state: 'success' } as PairInformation;
};
