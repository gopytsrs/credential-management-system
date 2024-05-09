//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "./AuthContract.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A smart contract that is used for organization account related function
 * @author Sean Goh
 * @notice Mainly used for the CRUD operations of organization profile
 */
contract OrganizationAccount {
	mapping(address => Profile) organizationToProfile;

	AuthContract public authContract;

	/**
	 * @notice Initialise the auth contract so that its functionality can be used in OrganizationAccount
	 * @param _authContractAddress The address of the auth contract
	 */
	constructor(address _authContractAddress) {
		authContract = AuthContract(_authContractAddress);
	}

	/**
	 * @notice Modifier to ensure only organizations can perform certain actions
	 */
	modifier onlyOrganization() {
		// console.log(
		// 	"The account type is",
		// 	uint(authContract.addrToUsers(msg.sender)),
		// 	msg.sender
		// );
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Organization,
			"Only organization can perform this action"
		);
		_;
	}

	struct Profile {
		bool exists;
		string name;
		string email;
		string website;
		string phoneNumber;
	}

	/**
	 * @notice View profile for organization user
	 */
	function viewProfile()
		public
		view
		onlyOrganization
		returns (Profile memory)
	{
		// console.log("Viewing profile", msg.sender);
		require(
			organizationToProfile[msg.sender].exists == true,
			"Organization does not exist"
		);
		return organizationToProfile[msg.sender];
	}

	/**
	 * @notice Create or Update profile for organization user
	 * @param _name Name to create or update to
	 * @param _email Email to create or update to
	 * @param _website Website to create or update to
	 * @param _phoneNumber phoneNumber to create or update to
	 */
	function createOrUpdateProfile(
		string memory _name,
		string memory _email,
		string memory _website,
		string memory _phoneNumber
	) public onlyOrganization {
		if (organizationToProfile[msg.sender].exists == true) {
			organizationToProfile[msg.sender].name = _name;
			organizationToProfile[msg.sender].email = _email;
			organizationToProfile[msg.sender].website = _website;
			organizationToProfile[msg.sender].phoneNumber = _phoneNumber;
		} else {
			Profile memory _profile = Profile(
				true,
				_name,
				_email,
				_website,
				_phoneNumber
			);
			organizationToProfile[msg.sender] = _profile;
		}
	}

	/**
	 * @notice Delete profile for organization user
	 */
	function deleteProfile() public onlyOrganization {
		require(
			organizationToProfile[msg.sender].exists == true,
			"Organization does not exist"
		);
		delete organizationToProfile[msg.sender];
	}
}
