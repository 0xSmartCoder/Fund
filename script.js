// imports
import { ethers } from "https:cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.esm.min.js";
import { ContractAddress, Abi } from "./constant.js";

document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("cbt");
  const fundButton = document.getElementById("fbt");
  const getBalanceButton = document.getElementById("getbt");
  const withDrawlButton = document.getElementById("witbt");
  connectButton.onclick = connect;
  fundButton.onclick = Fund;
  getBalanceButton.onclick = getBalance;
  withDrawlButton.onclick  = withDrawl
});

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("connected Successfully");
      document.getElementById("cbt").innerHTML = "Connected";
    } catch (error) {
      console.log(`error not connected!.. ${error}`);
    }
  } else {
    document.getElementById("cbt").innerHTML = "MetaMask Not Found";
  }
}

async function Fund() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const ethAmount = document.getElementById("ids").value
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(ContractAddress, Abi, signer);
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount)
      });
      await transactionResponse.wait();

      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(`error! ${error}`);
    }
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining transaction: ${transactionResponse.hash}`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve(transactionReceipt);
    });
  });
}

async function getBalance(){
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const getbal  = await provider.getBalance(ContractAddress);
    console.log(ethers.utils.formatEther(getbal));
  }
  
}

async function withDrawl() {
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, Abi, signer);
    try{
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine (transactionResponse, provider)
    }catch (error){console.log("error while withdraw", error)}
  }}
