import { expect } from "chai";
import { ethers } from "hardhat";
import { AuthContract } from "../typechain-types";

describe("AuthContract", function () {
  let authContract: AuthContract;

  beforeEach(async function () {
    const authContractFactory = await ethers.getContractFactory("AuthContract");
    authContract = await authContractFactory.deploy();
    await authContract.waitForDeployment();
  });

  it("Should default to None", async function () {
    const [owner] = await ethers.getSigners();
    expect(await authContract.addrToUsers(owner)).to.equal(0);
  });

  it("Should return the correct user type", async function () {
    await authContract.register(1); // Register with UserType.Organization (1)
    expect(await authContract.getUserType()).to.equal(1);
  });

  it("Should return true if user is registered", async function () {
    await authContract.register(2); // Register with UserType.Individual (2)
    expect(await authContract.isRegistered()).to.be.true;
  });

  it("Should revert if registering with none user type", async function () {
    await expect(authContract.register(0)).to.be.revertedWith("Register UserType must be Organization or Individual");
  });

  it("Should revert if registering an already registered user", async function () {
    await authContract.register(1); // Register with UserType.Organization (1)
    await expect(authContract.register(2)).to.be.revertedWith("User is already registered");
  });
});
