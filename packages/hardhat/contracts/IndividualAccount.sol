//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "./AuthContract.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A smart contract that is used for user account related function
 * @author Sean Goh
 * @notice Mainly used for the CRUD operations of organization profile
 */
contract IndividualAccount {
	mapping(address => Profile) individualToProfile;

	struct Profile {
		bool exists;
		string name;
		string email;
		string phoneNumber;
	}

	AuthContract public authContract;

	constructor(address _authContractAddress) {
		authContract = AuthContract(_authContractAddress); // Initialize AuthContract instance
	}

	/**
	 * @notice Modifier to ensure only individuals can perform certain actions
	 */
	modifier onlyIndividual() {
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Individual,
			"Only individual users can perform this action"
		);
		_;
	}

	/**
	 * @notice View Profile for individual user
	 */
	function viewProfile() public view onlyIndividual returns (Profile memory) {
		require(
			individualToProfile[msg.sender].exists,
			"Individual user does not exist"
		);
		return individualToProfile[msg.sender];
	}

	/**
	 * @notice Create or update profile for individual user
	 * @param _name Name to create or update to
	 * @param _email Email to create or update to
	 * @param _phoneNumber Phone number to create or update to
	 */
	function createOrUpdateProfile(
		string memory _name,
		string memory _email,
		string memory _phoneNumber
	) public onlyIndividual {
		if (individualToProfile[msg.sender].exists) {
			individualToProfile[msg.sender].name = _name;
			individualToProfile[msg.sender].email = _email;
			individualToProfile[msg.sender].phoneNumber = _phoneNumber;
		} else {
			Profile memory _profile = Profile(
				true,
				_name,
				_email,
				_phoneNumber
			);
			individualToProfile[msg.sender] = _profile;
		}
	}

	/**
	 * @notice Delete profile for individual user
	 */
	function deleteProfile() public onlyIndividual {
		require(
			individualToProfile[msg.sender].exists,
			"Individual user does not exist"
		);
		delete individualToProfile[msg.sender];
	}
}
