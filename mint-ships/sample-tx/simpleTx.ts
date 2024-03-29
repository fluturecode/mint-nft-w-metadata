import { payer, testWallet, connection } from "../lib/vars";
import { explorerURL, printConsoleSeparator } from "../lib/helpers";

import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js"

(async () => {
  
  console.log("Payer address:", payer.publicKey.toBase58());
  console.log("Test wallet address:", testWallet.publicKey.toBase58());

  const currentBalance = await connection.getBalance(payer.publicKey);
  console.log("Current balance of 'payer' (in lamports):", currentBalance);
  console.log("Current balance of 'payer' (in SOL):", currentBalance / LAMPORTS_PER_SOL);

  if (currentBalance <= LAMPORTS_PER_SOL) {
    console.log("Low balance, requesting airdrop...");
    await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
  }

  const keypair = Keypair.generate();

  console.log("New keypair generated:", keypair.publicKey.toBase58());

  // on-chain space allocated (in # of bytes)
  const space = 0;

  const lamports = await connection.getMinimumBalanceForRentExemption(space);

  console.log("Total lamports:", lamports);

  //create instruction
  const createAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: keypair.publicKey,
    lamports,
    space,
    programId: SystemProgram.programId,
  });

  let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);

  const message = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash,
    instructions: [createAccountIx],
  }).compileToV0Message();

  const tx = new VersionedTransaction(message);

  tx.sign([payer]);

  console.log("tx after signing:", tx);

  const sig = await connection.sendTransaction(tx);

  const subId = connection.onSignatureWithOptions(
    sig,
    val => {
      console.log("onSignature: triggered");
      console.log(val);
    },
    {
      commitment: "processed",
      // enableReceivedNotification: true,
    },
  );

  printConsoleSeparator();

  console.log("Transactin completed.");
  console.log(explorerURL({ txSignature: sig }));


})