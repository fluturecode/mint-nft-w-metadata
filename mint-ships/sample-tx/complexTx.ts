import { payer, testWallet, connection, STATIC_PUBLICKEY } from "@/lib/vars";
import { explorerURL, printConsoleSeparator } from "@/lib/helpers";

import { SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

(async () => {
  console.log("Payer address:", payer.publicKey.toBase58());
  console.log("Test wallet address:", testWallet.publicKey.toBase58());

  const space = 0; // on-chain space to allocated (in number of bytes)

  // request the cost (in lamports) to allocate `space` number of bytes on chain
  const balanceForRentExemption = await connection.getMinimumBalanceForRentExemption(space);

  const createTestAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: testWallet.publicKey,
    lamports: balanceForRentExemption + 2_000_000,
    space,
    programId: SystemProgram.programId,
  });

  // create an instruction to transfer lamports
  const transferToTestWalletIx = SystemProgram.transfer({
    lamports: balanceForRentExemption + 100_000,
    fromPubkey: payer.publicKey,
    toPubkey: testWallet.publicKey,
    programId: SystemProgram.programId,
  });

  // create an other instruction to transfer lamports
  const transferToStaticWalletIx = SystemProgram.transfer({
    lamports: 100_000,
    fromPubkey: payer.publicKey,
    toPubkey: STATIC_PUBLICKEY,
    programId: SystemProgram.programId,
  });

  let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

  // create a transaction message
  const message = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash,
    instructions: [
      transferToStaticWalletIx,
      transferToTestWalletIx,
      createTestAccountIx,
      transferToStaticWalletIx,
    ],
  }).compileToV0Message();

  const tx = new VersionedTransaction(message);

  console.log("tx before signing:", tx);

  tx.sign([payer, testWallet]);

  const sig = await connection.sendTransaction(tx);

  printConsoleSeparator();

  console.log("Transaction completed.");
  console.log(explorerURL({ txSignature: sig }));
})();
