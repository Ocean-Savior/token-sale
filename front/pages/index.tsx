import Head from "next/head";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import auctionArtifact from "../web3/abi/tokenSale.json";

export default function Home() {
  const [account, setAccount] = useState("0x0000");

  const [isConnected, setIsConnected] = useState(false);

  const [tokenBalance, setTokenBalance] = useState(0);

  const [bnbBalance, setBnbBalance] = useState(0);

  const [price, setPrice] = useState(0);

  const [maxAllocation, setMaxAllocation] = useState(0);

  const weiToBnb = 1000000000000000000;

  let provider: any;

  let signer: any;

  let contract: any;

  let contractWithSigner: any;

  useEffect(() => {

  });

  async function connectWallet() {
    if (window.ethereum == null) {
      console.log("MetaMask not installed");
    } else {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum);

        const address = await provider.send("eth_requestAccounts", []);

        setAccount(address[0]);

        signer = provider.getSigner();

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS?.toString();

        contract = new ethers.Contract(
          contractAddress!,
          auctionArtifact,
          signer
        );

        contractWithSigner = contract.connect(signer);

        const tokenPrice = await contract.price();

        const allocation = await contract.maxAllocation();

        const bal = await provider.getBalance(account.toString());
      
        const tBalance = await contractWithSigner.getTokensBalance();    
        
        setMaxAllocation((allocation.toString()) / weiToBnb);
        setPrice((tokenPrice.toNumber()) / weiToBnb);
        setBnbBalance((bal.toString()) / weiToBnb);
        setTokenBalance(tBalance.toString() / weiToBnb);

        setIsConnected(true);

        console.log(signer);
        console.log(provider);

        // contract.changeTokenPrice(1000);
      } catch (error) {
        console.log("Error connection...");
        console.log(error);
      }
    }
  }

  // const contractAddress = process.env.CONTRACT;

  // const balance = contract.balanceOf("ethers.eth")

  // const price = daiContract.price();

  // console.log(balance);

  return (
    <>
      <Head>
        <title>Token Sale</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="bg-black w-full h-screen flex items-center justify-center">
          <div className="absolute top-6 right-6">
            <Button variant="outlined" onClick={connectWallet}>
              {!isConnected ? "Connect wallet" : account}
            </Button>
          </div>
          <div className="flex flex-row gap-6">
            <div className="w-[450px] flex flex-col gap-8 relative h-[300px] text-center border-[1px] border-blue-700 rounded-[18px]">
              <h4 className="mt-8 text-xl text-blue-600">
                Your balance in BNB: {bnbBalance}BNB
              </h4>

              <h4 className="text-xl text-blue-600">1 token = {price} BNB</h4>

              <h4 className="text-xl text-blue-600">Max allocation {maxAllocation} BNB</h4>

              <h4 className="text-xl text-blue-600">
                Your balance: {tokenBalance} tokens
              </h4>
            </div>

            <div className="w-[450px] h-[300px] text-center border-[1px] border-blue-700 rounded-[18px]">
              {!isConnected ? (
                <h1 className="text-center text-blue-600 text-3xl mt-[30%] justify-center">
                  Please connect your wallet
                </h1>
              ) : (
                <div className="relative h-full">
                  <div className="flex flex-col gap-4 my-16 mx-8 text-center">
                    <input
                      className="border-[1px] text-center text-blue-600 border-blue-600 h-10 rounded-sm bg-transparent px-5"
                      placeholder="Amount in BNB"
                      type="text"
                    />
                    <Button
                      className="border-[1px] border-blue-600"
                      variant="contained"
                    >
                      Buy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
