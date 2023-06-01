import { payer, connection } from "@/lib/vars";
import {   buildTransaction,
  explorerURL,
  extractSignatureFromFailedTransaction,
  loadPublicKeysFromFile,
  printConsoleSeparator,
  savePublicKeyToFile,} from "@/lib/helpers";

import { Keypair, PublicKey, SystemProgram  } from "@solana/web3.js";
import { Metaplex, bundlrStorage, keypairIdentity } from "@metaplex-foundation/js";

import { faker } from "@faker-js/faker";
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction } from "@solana/spl-token";

import {
  PROGRAM_ID as METADATA_PROGRAM_ID,
  createCreateMetadataAccountV3Instruction,
} from "@metaplex-foundation/mpl-token-metadata";
function generateRandomName() {
  const adjectives = [
    "Fearless",
    "Dreadful",
    "Savage",
    "Fierce",
    "Ruthless",
    "Notorious",
    "Infamous",
    "Brave",
    "Cunning",
    "Bold",
  ];

  const nouns = [
    "Seadog",
    "Corsair",
    "Scallywag",
    "Buccaneer",
    "Swashbuckler",
    "Privateer",
    "Marauder",
    "Scourge",
    "Cutlass",
    "Jolly Roger",
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

  return `${randomAdjective} ${randomNoun}`;
}

(async () => {

  console.log("Payer address:", payer.publicKey.toBase58());

  // load the stored PublicKeys for ease of use
  let localKeys = loadPublicKeysFromFile();

  // ensure the desired script was already run
  if (!localKeys?.tokenMint)
    return console.warn("No local keys were found. Please run '3.createTokenWithMetadata.ts'");

  const tokenMint: PublicKey = localKeys.tokenMint;

  console.log("==== Local PublicKeys loaded ====");
  console.log("Token's mint address:", tokenMint.toBase58());
  console.log(explorerURL({ address: tokenMint.toBase58() }));
  
   // create an instance of Metaplex sdk for use
   const metaplex = Metaplex.make(connection)
   // set our keypair to use, and pay for the transaction
   .use(keypairIdentity(payer))
   // define a storage mechanism to upload with
   .use(
     bundlrStorage({
       address: "https://devnet.bundlr.network",
       providerUrl: "https://api.devnet.solana.com",
       timeout: 60000,
     }),
   );

  const collection_metadata = {
    name: "Will Not Sink",
    symbol: "WNS",
    description: faker.commerce.productDescription(),
    image: "https://www.grunge.com/img/gallery/the-most-famous-pirate-ships-in-history/intro-1656447227.webp",
  };
  const collection_upload_metadata = await metaplex.nfts().uploadMetadata(collection_metadata);
  const collection_response = await metaplex.nfts().create({
    uri: collection_upload_metadata.uri,
    name: collection_metadata.name,
    symbol: collection_metadata.symbol,
    isCollection: true,
    sellerFeeBasisPoints: 100,
  });

  console.log("Collection address", collection_response.nft.address.toBase58());

  const images = [
    "bafkreibtqt4mp4saddqsla7tjgnu6gvrkwrzxpu7mltkkwzjhhx6tyf7na",
    "bafkreido37di7kcynpjvcanujz4tgpbryvptv4gn3zhd3gtdihrgppswyi",
    "bafkreihbpnlicraewdc32qnpvgsj725da2b7qcqcy5rikcj2dgr6v5cxxy",
    "bafkreih2i5iqyz4zb6qjzmbf2dmu3lc6h6mnqedhqsyo5fovouwhjqiwka",
    "bafkreibfznm4xiu2yfchuf6budwnlwg7zkw36vt67eupjswmdxbfaxiwtm",
    "bafkreid74afcywoo2be5u63xu3ptveg3ge7pcrzaax4xwiznqdtoogk7ie",
    "bafkreievs5qe52kk2mqmsu65kznx7n6ivobrnqrz6uch7obt277t3b4zvu",
    "bafkreigdfqwuddqhggcbb3vq4mkanji24by234ydsk2jpc6qt4q4ek33ue",
    "bafkreierusunr54m56wb2ph3q6agnb5a73syk2javxkpsuheqedyduqupi",
    "bafkreihhbnshnnpwvw2cajiujnftewc3boi26p2lc6lpekgtufce6ruevq",
    "bafkreifklhhzudssq7hmiuimisei7lcux7bw37glvmkovhknmcf2cn4inm",
    "bafkreifdsucn63v5l3v4dyzdz4ib5k4dmsp4rzm64ierp7jbcavhvknfru",
    "bafkreidpuebkbeioom3xxsmrddhhlqrmcebbyxajav3sbnkkd4ak255wwi",
    "bafkreifkmgriy2anmum5af2ifkcg6pj6ce5eh3g7j4qk2j2llmjex5wwoq",
    "bafkreie4lfx4co2bw3szua3qht3t6f3ytcjmxokzkvrpa7ks32w7s46lyy",
    "bafkreiaquqs2tdonmeyt4gj6p4vliebzwu4set6qnyeyya7mebg3qasnri",
    "bafkreicf7pahjfldvpfh3zs2nxmmeg4ffqq7q5vnkfpm46wa3wgnyo7rie",
    "bafkreihfdejyxxifa6qqvsifk7naa6fycru3ndtri4nakj5hka2qvkqhim",
    "bafkreigkgge56j5chhuzwggczwcj75pi6jwkf62mivvjwgptdbbsnscxuq",
    "bafkreiedrwuogtjnxawcxsxz3c5z3h2swrmxe7te7ncmz53uipjvkf7kke",
    "bafkreifz2mjdilfcaxm2platlj4t7fsiasu2t7s6eeiof2iuymlaczm33u",
    "bafkreih3wqnmxxijzkkkbl24lv46ia4f3luyardtsvtsgrd2lcmnmweqia",
    "bafkreics4ixtau55it5dmnciukwcw3hgubfuowfhqagbdwvg3z2gknflze",
    "bafkreiahl7ufdcwnkagcd6wbirl6n42orcjf22aa5rbnyowstojsamdika",
    "bafkreigogp744lpbdnra7iaeaw3gpi6cnxo52bg4nigw4owitjlebetmau",
    "bafkreibkqz6tn6j6n4zlg5o5y6wcb3s5k5kvhpukdkbzwbhhweg6zlwz5q",
    "bafkreibnclnkx5n7kqa2iwmadaqhpls43csepnxk3bn2e3b5npop7jael4",
    "bafkreia4sdzap5a3kz6taiysdpb3nuo5umnyxm5ap7jwphqaedq6htbfg4",
    "bafkreiedqconadnozvmzjccqougxl2owwlyu5sywtaqspqtjyaxuof67aq",
    "bafkreicl4fl4ieffty3qgucx7xtjrdcg7e2f65cmipal2hpcs6bnwori74",
    "bafkreidslcs6bvqafikjuwccryvx444mheesmoxifo7nspof6syr4uzmtq",
    "bafkreicumoxi3uyhwjce5rkazmmzf2uniyy3zo7g6lmjejn3cotel55iqy",
  ];

  for (let i = 0; i < 32; i++) {
    console.log(`==== Creating Ship ${i + 1} ====`);
    /**
     * define our ship's JSON metadata
     * checkout: https://nft.storage/ to help store images
     */
    const imageLink = `https://${images[i % images.length]}.ipfs.nftstorage.link/`;

    const metadata = {
      name: generateRandomName(),
      symbol: "SHIP",
      description: faker.commerce.productDescription(),
      image: imageLink,
    };
    // another ship: "https://bafybeiblld2wlxyivlivnhaqbcixhzxrodjzrycjkitz3kdmzj65gebwxe.ipfs.nftstorage.link/"
    // Captain Rajovenko: ""

    // upload the JSON metadata
    const { uri } = await metaplex.nfts().uploadMetadata(metadata);

    // create a new nft using the metaplex sdk
    let keepTrying;
    let tries = 0;
    do {
      try {
        const { nft, response } = await metaplex.nfts().create({
          uri,
          name: metadata.name,
          symbol: metadata.symbol,

          // `sellerFeeBasisPoints` is the royalty that you can define on nft
          sellerFeeBasisPoints: 500, // Represents 5.00%.

          //
          isMutable: true,

          //
          collection: collection_response.nft.address,
        });
        printConsoleSeparator(`NFT created: ${nft.address.toBase58()}`);
        console.log(explorerURL({ txSignature: response.signature }));

        // Verify collection ownership
        const verify_response = await metaplex.nfts().verifyCollection({
          collectionMintAddress: collection_response.nft.address,
          mintAddress: nft.address,
        });
        keepTrying = false;
      } catch (err) {
        console.log(`Minting failed with error ${(err as Error).message} Trying ${5 - tries} more time`);
        if (tries > 5) {
          keepTrying = false;
          return;
        } else {
          tries++;
          await new Promise((resolve) => setTimeout(resolve, 5000))
          keepTrying = true;
        }
      }
    } while (keepTrying);
  }

  const tokenConfigs = [
    {
      decimals: 2,
      name: "Seven Seas Gold",
      symbol: "GOLD",
      uri: "https://thisisnot.arealurl/info.json",
    },
  ];

  const mintKeypair = Keypair.generate();

  for (const tokenConfig of tokenConfigs) {
    console.log("Creating", tokenConfig);
    const createMintAccountInstruction = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
      programId: TOKEN_PROGRAM_ID,
    });

    const initializeMintInstruction = createInitializeMint2Instruction(
      mintKeypair.publicKey,
      tokenConfig.decimals,
      payer.publicKey,
      payer.publicKey,
    );

    const metadataAccount = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), METADATA_PROGRAM_ID.toBuffer(), mintKeypair.publicKey.toBuffer()],
      METADATA_PROGRAM_ID,
    )[0];

    console.log("Metadata address:", metadataAccount.toBase58());

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mintKeypair.publicKey,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            creators: null,
            name: tokenConfig.name,
            symbol: tokenConfig.symbol,
            uri: tokenConfig.uri,
            sellerFeeBasisPoints: 0,
            collection: null,
            uses: null,
          },
          collectionDetails: null,
          isMutable: true,
        },
      },
    );

    const tx = await buildTransaction({
      connection,
      payer: payer.publicKey,
      signers: [payer, mintKeypair],
      instructions: [
        createMintAccountInstruction,
        initializeMintInstruction,
        createMetadataInstruction,
      ],
    });

    try {
      // actually send the transaction
      const sig = await connection.sendTransaction(tx);

      // print the explorer url
      console.log("Transaction completed.");
      console.log(explorerURL({ txSignature: sig }));

      // locally save our addresses for the demo
      savePublicKeyToFile("tokenMint", mintKeypair.publicKey);
    } catch (err) {
      console.error("Failed to send transaction:");
      console.log(tx);

      // attempt to extract the signature from the failed transaction
      const failedSig = await extractSignatureFromFailedTransaction(connection, err);
      if (failedSig) console.log("Failed signature:", explorerURL({ txSignature: failedSig }));

      throw err;
    }
  }

  return;

})();
