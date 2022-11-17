import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import { expect } from "chai";
import { EtherscanProvider } from "@ethersproject/providers";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const PROPOSALS = ["Raspberry", "Pistachio", "Vanilla"];

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
        bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}
async function main() {
    const provider = ethers.getDefaultProvider("goerli", { EtherscanProvider: process.env.ETHERSCAN_API_KEY });
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(
        `Connected to the account of address ${signer.address
        }\nThis account has a balance of ${balanceBN.toString()} Wei`
    );
    const args = process.argv;
    const proposals = args.slice(2);
    if (proposals.length <= 0) throw new Error("Not enough arguments");
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    let ballotContract: Ballot;
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(
        convertStringArrayToBytes32(proposals)
    );
    await ballotContract.deployed();
    console.log(
        `The contract was deployed at the address ${ballotContract.address}`
    );
    const chairperson = await ballotContract.chairperson();
    console.log(`The chairperson for this ballot is ${chairperson}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});