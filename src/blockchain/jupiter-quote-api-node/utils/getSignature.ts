import * as bs58 from "bs58";
import { Transaction, VersionedTransaction } from "@solana/web3.js";

export function getSignature(
  transaction: Transaction | VersionedTransaction
): string {
  const signature =
    "signature" in transaction
      ? transaction.signature
      : transaction.signatures[0];

  if (!signature) {
    console.log(
      "Missing transaction signature, the transaction was not signed by the fee payer: ", signature
    );
  }
  return bs58.encode(signature);
}
