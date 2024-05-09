import { ethers } from "hardhat";
import { OrganizationAccount, AuthContract } from "../typechain-types";
import { expect } from "chai";

describe("organizationAccount", function () {
  let OrganizationAccount: OrganizationAccount;
  let authContract: AuthContract;

  beforeEach(async function () {
    const authContractFactory = await ethers.getContractFactory("AuthContract");
    authContract = await authContractFactory.deploy();
    authContract.waitForDeployment();
    const OrganizationAccountFactory = await ethers.getContractFactory("OrganizationAccount");
    OrganizationAccount = await OrganizationAccountFactory.deploy(authContract);
    await OrganizationAccount.waitForDeployment();
  });

  it("should revert for view profile if profile does not exists", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await expect(OrganizationAccount.connect(addr1).viewProfile()).to.be.revertedWith("Organization does not exist");
  });

  it("should create a profile", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await OrganizationAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone", "website");
    const profile = await OrganizationAccount.connect(addr1).viewProfile();
    expect(profile).to.deep.equal([true, "name", "email", "phone", "website"]);
  });

  it("should update a profile", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await OrganizationAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone", "website");
    await OrganizationAccount.connect(addr1).createOrUpdateProfile("name2", "email2", "phone2", "website2");
    const profile = await OrganizationAccount.connect(addr1).viewProfile();
    expect(profile).to.deep.equal([true, "name2", "email2", "phone2", "website2"]);
  });

  it("should revert if caller is not organization", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);

    await expect(
      OrganizationAccount.connect(addr1).createOrUpdateProfile("name", "email", "phone", "website"),
    ).to.be.revertedWith("Only organization can perform this action");
  });
});
