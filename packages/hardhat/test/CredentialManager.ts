import { ethers } from "hardhat";
import { CredentialManager, AuthContract } from "../typechain-types";
import { expect } from "chai";

describe("CredentialManager", function () {
  let credentialManager: CredentialManager;
  let authContract: AuthContract;

  beforeEach(async function () {
    const authContractFactory = await ethers.getContractFactory("AuthContract");
    authContract = await authContractFactory.deploy();
    authContract.waitForDeployment();
    const credentialManagerFactory = await ethers.getContractFactory("CredentialManager");
    credentialManager = await credentialManagerFactory.deploy(authContract);
    await credentialManager.waitForDeployment();
  });

  it("should issue a credential", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await expect(credentialManager.connect(addr1).issueCredential("title", "data", addr2)).to.emit(
      credentialManager,
      "CredentialIssued",
    );
  });

  it("should revert for issue credential if user is not valid", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await expect(credentialManager.connect(addr1).issueCredential("title", "data", addr2)).to.be.revertedWith(
      "Only valid individual address",
    );
  });

  it("should create credential with valid issuer address", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await credentialManager.connect(addr2).createCredential("title", addr1, "data");
    const credentials = await credentialManager.connect(addr2).viewUserToCredentials(addr2);
    expect(credentials.length).to.equal(1);
  });

  it("should revert for create credential if issuer is not valid", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr2).register(2);

    await expect(credentialManager.connect(addr2).createCredential("title", addr1, "data")).to.be.revertedWith(
      "Invalid issuer address",
    );
  });

  it("should revert for create credential if organization tries to create", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    await expect(credentialManager.connect(addr1).createCredential("title", addr1, "data")).to.be.revertedWith(
      "Only individual users can create credentials",
    );
  });

  it("should show user credentials as empty on init", async () => {
    const [, , addr2] = await ethers.getSigners();
    await authContract.connect(addr2).register(2);

    const credentials = await credentialManager.connect(addr2).viewUserToCredentials(addr2);
    expect(credentials.length).to.equal(0);
  });

  it("should show issuer credentials as empty on init", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);

    const credentials = await credentialManager.connect(addr1).viewIssuerToCredentials(addr1);
    expect(credentials.length).to.equal(0);
  });

  it("should view a single credential", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await credentialManager.connect(addr2).createCredential("title", addr1, "data");
    const credential = await credentialManager.connect(addr2).viewCredential(1);
    expect(credential.title).to.equal("title");
  });

  it("should update a credential", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await credentialManager.connect(addr2).createCredential("title", addr1, "data");
    await credentialManager.connect(addr2).updateCredential(1, "new title", addr1, "new data");
    const credential = await credentialManager.connect(addr2).viewCredential(1);
    expect(credential.title).to.equal("new title");
  });

  it("should revert for update credential if updater is not owner", async () => {
    const [, addr1, addr2, addr3] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);
    await authContract.connect(addr3).register(2);

    await credentialManager.connect(addr2).createCredential("title", addr1, "data");
    await expect(
      credentialManager.connect(addr3).updateCredential(1, "new title", addr1, "new data"),
    ).to.be.revertedWith("You are not the owner of this credential");
  });
});
