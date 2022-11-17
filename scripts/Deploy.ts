import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { ERC20__factory } from "../typechain-types";
dotenv.config();

async function main() {
    const accounts = await ethers.getSigners();
    const erc20TokenFactory = new ERC20_factory(accounts[0]);
    const erc20TokenContract = await erc20TokenFactory.deploy();
    await erc20TokenContract.deployed();
    console.log(`Contract deployed at address ${erc20TokenContract}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});