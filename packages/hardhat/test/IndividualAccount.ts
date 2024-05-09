import { ethers } from "hardhat";
import { IndividualAccount, AuthContract } from "../typechain-types";
import { expect } from "chai";

describe("individualAccount", function () {
  let individualAccount: IndividualAccount;
  let authContract: AuthContract;

  beforeEach(async function () {
    const authContractFactory = await ethers.getContractFactory("AuthContract");
    authContract = await authContractFactory.deploy();
    authContract.waitForDeployment();
    const individualAccountFactory = await ethers.getContractFactory("IndividualAccount");
    individualAccount = await individualAccountFactory.deploy(authContract);
    await individualAccount.waitForDeployment();
  });

  it("should revert for view profile if profile does not exists", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);

    await expect(individualAccount.connect(addr1).viewProfile()).to.be.revertedWith("Individual user does not exist");
  });

  it("should create a profile", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);

    await individualAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone");
    const profile = await individualAccount.connect(addr1).viewProfile();
    expect(profile).to.deep.equal([true, "name", "email", "phone"]);
  });

  it("should update a profile", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);

    await individualAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone");
    await individualAccount.connect(addr1).createOrUpdateProfile("name2", "email2", "phone2");
    const profile = await individualAccount.connect(addr1).viewProfile();
    expect(profile).to.deep.equal([true, "name2", "email2", "phone2"]);
  });

  it("should revert if caller is not individual", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await expect(individualAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone")).to.be.revertedWith(
      "Only individual users can perform this action",
    );
  });
});
