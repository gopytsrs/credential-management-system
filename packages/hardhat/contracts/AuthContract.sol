//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A smart contract that is used for authentication related functions
 * @author Sean Goh
 * @notice Responsible for creation and storage of user types
 */
contract AuthContract {
	enum UserType {
		None,
		Organization,
		Individual
	}

	mapping(address => UserType) public addrToUsers;

	/**
	 * @notice Event emitted when a user registers
	 * @param user The address of the user who registered
	 * @param userType The type of the user who registered
	 */
	event UserRegistered(address indexed user, UserType userType);

	/**
	 * @notice Registers a new user who connects their wallet
	 * @param _userType The type of the user registering
	 */
	function register(UserType _userType) external {
		require(
			addrToUsers[msg.sender] == UserType.None,
			"User is already registered"
		);
		require(
			_userType != UserType.None,
			"Register UserType must be Organization or Individual"
		);
		addrToUsers[msg.sender] = _userType;
		emit UserRegistered(msg.sender, _userType);
	}

	/**
	 * @notice Gets the type of the user who calls the function
	 */
	function getUserType() external view returns (UserType) {
		// console.log("Address that called it is", msg.sender);
		// console.log("user type is", uint(addrToUsers[msg.sender]));
		// require(
		// 	addrToUsers[msg.sender] != UserType.None,
		// 	"User has not registered"
		// );
		return addrToUsers[msg.sender];
	}

	/**
	 * @notice Gets the registration status of the user who calls the function
	 */
	function isRegistered() external view returns (bool) {
		return addrToUsers[msg.sender] != UserType.None;
	}
}
