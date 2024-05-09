import { ethers } from "hardhat";
import { RequestManager, AuthContract } from "../typechain-types";
import { expect } from "chai";

describe("RequestManager", function () {
  let requestManager: RequestManager;
  let authContract: AuthContract;

  beforeEach(async function () {
    const authContractFactory = await ethers.getContractFactory("AuthContract");
    authContract = await authContractFactory.deploy();
    authContract.waitForDeployment();
    const requestManagerFactory = await ethers.getContractFactory("RequestManager");
    requestManager = await requestManagerFactory.deploy(authContract);
    await requestManager.waitForDeployment();
  });

  it("should revert for create request if caller is not organization", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);
    await authContract.connect(addr2).register(2);

    await expect(requestManager.connect(addr1).createRequest("purpose", "title", addr2)).to.be.revertedWith(
      "Only organization can perform this action",
    );
  });

  it("should create a request", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await requestManager.connect(addr1).createRequest("purpose", "title", addr2);
    const incomingRequests = await requestManager.connect(addr2).viewUserPendingRequests();
    expect(incomingRequests.length).to.equal(1);
    const outGoingRequests = await requestManager.connect(addr1).viewPendingRequests();
    expect(outGoingRequests.length).to.equal(1);
  });

  it("should view pending requests for org", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    const pendingRequests = await requestManager.connect(addr1).viewPendingRequests();
    expect(pendingRequests).to.deep.equal([]);
  });

  it("should view incoming requests for individual", async () => {
    const [, addr1] = await ethers.getSigners();
    await authContract.connect(addr1).register(2);
    const incomingRequests = await requestManager.connect(addr1).viewUserPendingRequests();
    expect(incomingRequests).to.deep.equal([]);
  });

  it("should revert for accept request if caller not individual", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await requestManager.connect(addr1).createRequest("purpose", "title", addr2);
    await expect(requestManager.connect(addr1).acceptRequest(BigInt(2), BigInt(0))).to.be.revertedWith(
      "Only individual users can perform this action",
    );
  });

  it("should revert for reject request if caller not individual", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await requestManager.connect(addr1).createRequest("purpose", "title", addr2);
    await expect(requestManager.connect(addr1).rejectRequest(BigInt(2))).to.be.revertedWith(
      "Only individual users can perform this action",
    );
  });

  it("should remove a request", async () => {
    const [, addr1, addr2] = await ethers.getSigners();
    await authContract.connect(addr1).register(1);
    await authContract.connect(addr2).register(2);

    await requestManager.connect(addr1).createRequest("purpose", "title", addr2);
    await requestManager.connect(addr2).rejectRequest(BigInt(0));
    const pendingRequests = await requestManager.connect(addr2).viewUserPendingRequests();
    const outgoingRequests = await requestManager.connect(addr1).viewPendingRequests();
    expect(pendingRequests.length).to.equal(0);
    expect(outgoingRequests.length).to.equal(0);
  });
});
