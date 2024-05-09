import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys a contract named "AuthContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployAuthContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const authContract = await deploy("AuthContract", {
    from: deployer,
    // Contract constructor arguments
    args: [],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  console.log("[01_deploy_auth_contract.ts - deployAuthContract] AuthContract deployed succesfully!");

  // Deploy OrganizationAccount
  await deploy("OrganizationAccount", {
    from: deployer,
    args: [authContract.address],
    log: true,
    autoMine: true,
  });

  console.log("[01_deploy_auth_contract.ts - deployAuthContract] OrganizationAccount deployed succesfully!");

  // Deploy IndividualAccount
  await deploy("IndividualAccount", {
    from: deployer,
    args: [authContract.address],
    log: true,
    autoMine: true,
  });

  console.log("[01_deploy_auth_contract.ts - deployAuthContract] IndividualAccount contract deployed succesfully");

  // Deploy CredentialManager
  await deploy("CredentialManager", {
    from: deployer,
    args: [authContract.address],
    log: true,
    autoMine: true,
  });

  console.log("[01_deploy_auth_contract.ts - deployAuthContract] CredentialManager contract deployed succesfully");

  // Deploy RequestManager
  await deploy("RequestManager", {
    from: deployer,
    args: [authContract.address],
    log: true,
    autoMine: true,
  });

  console.log("[01_deploy_auth_contract.ts - deployAuthContract] RequestManager contract deployed succesfully");
};

export default deployAuthContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags AuthContract
deployAuthContract.tags = ["AuthContract"];
