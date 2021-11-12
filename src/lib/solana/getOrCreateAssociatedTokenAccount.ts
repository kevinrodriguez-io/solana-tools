import { AccountInfo, Token } from "@solana/spl-token";
import { SendTransactionOptions } from "@solana/wallet-adapter-base";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";

export const getOrCreateAssociatedAccountInfoWithWallet = async (
  connection: Connection,
  sendTransaction: (
    transaction: Transaction,
    connection: Connection,
    options?: SendTransactionOptions | undefined,
  ) => Promise<string>,
  {
    token,
    payer,
    address,
  }: { token: Token; address: PublicKey; payer: PublicKey },
) => {
  // This is a great example on how to derive program addresses (PDA),
  // also a common pattern across solana programs.
  // In solana, an address for the wallet is handled by the spl program
  // if it doesn't exists, it will be created.
  // You can check the implementation of getAssociatedTokenAddress in:
  // https://github.com/solana-labs/solana-program-library/blob/master/token/js/client/token.js#L2277
  const associatedAddress = await Token.getAssociatedTokenAddress(
    token.associatedProgramId,
    token.programId,
    token.publicKey,
    address!,
  );
  let associatedAccount: AccountInfo;
  try {
    associatedAccount = await token.getAccountInfo(associatedAddress);
  } catch (error) {
    const associatedTokenAccountInstruction =
      Token.createAssociatedTokenAccountInstruction(
        token.associatedProgramId,
        token.programId,
        token.publicKey,
        associatedAddress,
        address,
        payer,
      );
    const transactionId = await sendTransaction(
      new Transaction().add(associatedTokenAccountInstruction),
      connection,
    );
    await connection.confirmTransaction(transactionId);
    associatedAccount = await token.getAccountInfo(associatedAddress);
  }
  return associatedAccount;
};
