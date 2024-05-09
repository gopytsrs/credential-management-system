//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Import local contracts
import "./AuthContract.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title A smart contract that is used for managing credentials
 * @author Sean Goh
 * @notice This contract manages CRUD operations for Individual Users and issuing of credentials by Organization users
 */
contract CredentialManager {
	struct Credential {
		uint256 id;
		string title; // Title of the credential
		address issuerAddress;
		address ownerAddress;
		string data; // Data associated with the credential
	}

	mapping(uint256 => Credential) public idToCredentials; // Mapping of all credentials by their ID
	mapping(uint256 => uint256) public credentialIdToIndividualIndex; // Mapping of credential ID to index in userToCredentials
	mapping(uint256 => uint256) public credentialIdToIssuerIndex; // Mapping of credential ID to index in issuerToCredentials
	mapping(address => Credential[]) public userToCredentials; // Mapping of user addresses to their credential IDs
	mapping(address => Credential[]) public issuerToCredentials; // Mapping of issuer addresses to their credential IDs
	uint256 public credentialCount; // Total count of credentials

	AuthContract public authContract; // Reference to AuthContract

	/**
	 * @notice Event to emit when a new credential is created by an individual user
	 * @param credentialId The id of the credential
	 * @param owner The address of the individual user who created the credential
	 * @param title The title of the credential
	 * @param data The data of the credential
	 */
	event CredentialCreated(
		uint256 indexed credentialId,
		address indexed owner,
		string title,
		string data
	);

	/**
	 * @notice Event to emit when an organization issues a credential to an individual
	 * @param credentialId The id of the credential
	 * @param owner The address of the individual who will own the credential
	 * @param issuer The address of the organization who issued the credential
	 * @param title The title of the credential
	 * @param data The data of the credential
	 */
	event CredentialIssued(
		uint256 indexed credentialId,
		address indexed owner,
		address indexed issuer,
		string title,
		string data
	);

	/**
	 * @notice Event to emit when a credential is updated by an individual user
	 * @param credentialId The id of the credential
	 * @param newData The new data that the credential is updated with
	 */
	event CredentialUpdated(uint256 indexed credentialId, string newData);

	/**
	 * @notice Event to emit when a credential is deleted by an individual user
	 * @param credentialId The id of the credential
	 */
	event CredentialDeleted(uint256 indexed credentialId);

	/**
	 * @notice Initialised the auth contract to use its functionality within CredentialManager
	 * @param _authContract The address of the auth contract
	 */
	constructor(AuthContract _authContract) {
		authContract = _authContract;
	}

	/**
	 * @notice Modifier to ensure only individuals can perform certain actions
	 */
	modifier onlyIndividual() {
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Individual,
			"Only individual users can create credentials"
		);
		_;
	}

	/**
	 * @notice Modifier to ensure only organizations can perform certain actions
	 */
	modifier onlyOrganization() {
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Organization,
			"Only organization users can create credentials"
		);
		_;
	}

	/**
	 * @notice Modifier to ensure only null(address(0)) or valid issuer address
	 */
	modifier onlyNullOrValidIssuerAddress(address issuerAddress) {
		require(
			issuerAddress == address(0) || // Null issuer address is allowed
				(authContract.addrToUsers(issuerAddress) ==
					AuthContract.UserType.Organization && // Issuer must be an organization
					issuerAddress != msg.sender), // Issuer must not be the same as the credential owner
			"Invalid issuer address"
		);
		_;
	}

	/**
	 * @notice Modifier to ensure only valid credential ids
	 */
	modifier onlyValidCredentialId(uint256 _credentialId) {
		require(
			_credentialId > 0 && _credentialId <= credentialCount,
			"Invalid credential ID"
		);
		_;
	}

	/**
	 * @notice Modifier to ensure only credential owners can perform certain actions
	 */
	modifier onlyCredentialOwner(uint256 _credentialId) {
		require(
			idToCredentials[_credentialId].ownerAddress == msg.sender,
			"You are not the owner of this credential"
		);
		_;
	}

	/**
	 * @notice Modifier to ensure only valid individual address
	 */
	modifier onlyValidIndividualAddress(address userAddress) {
		require(
			authContract.addrToUsers(userAddress) ==
				AuthContract.UserType.Individual,
			"Only valid individual address"
		);
		_;
	}

	/**
	 * @notice Allow an organization user to issue a credential to an individual user
	 * @param _title Thet title of the credential
	 * @param _data The data of the credential
	 * @param _userAddress The address of the user the credential is being issued to
	 * @dev May need refactoring in the pushing, currently we are hacking to get O(1) delete, same for create credential
	 */
	function issueCredential(
		string memory _title,
		string memory _data,
		address _userAddress
	) public onlyOrganization onlyValidIndividualAddress(_userAddress) {
		credentialCount++;
		Credential memory _credential = Credential(
			credentialCount,
			_title,
			msg.sender,
			_userAddress,
			_data
		);
		idToCredentials[credentialCount] = _credential;
		userToCredentials[_userAddress].push(_credential);
		credentialIdToIndividualIndex[credentialCount] =
			userToCredentials[_userAddress].length -
			1;
		issuerToCredentials[msg.sender].push(_credential);
		credentialIdToIssuerIndex[credentialCount] =
			issuerToCredentials[msg.sender].length -
			1;
		emit CredentialIssued(
			credentialCount,
			_userAddress,
			msg.sender,
			_title,
			_data
		);
	}

	/**
	 * @notice Allow user to create a new credential
	 * @param _title The title of the credential
	 * @param _issuerAddress The address of the issuer, provided if known and valid else default 0
	 * @param _data The data string of the credential
	 */
	function createCredential(
		string memory _title,
		address _issuerAddress,
		string memory _data
	) public onlyIndividual onlyNullOrValidIssuerAddress(_issuerAddress) {
		credentialCount++;
		Credential memory _credential = Credential(
			credentialCount,
			_title,
			_issuerAddress,
			msg.sender,
			_data
		);
		idToCredentials[credentialCount] = _credential;
		userToCredentials[msg.sender].push(_credential);
		credentialIdToIndividualIndex[credentialCount] =
			userToCredentials[msg.sender].length -
			1;
		if (_issuerAddress != address(0)) {
			issuerToCredentials[_issuerAddress].push(_credential);
			credentialIdToIssuerIndex[credentialCount] =
				issuerToCredentials[_issuerAddress].length -
				1;
		}
		emit CredentialCreated(credentialCount, msg.sender, _title, _data);
	}

	/**
	 * @notice Allow an individual user to view all their credentials
	 * @param _user address of the user
	 */
	function viewUserToCredentials(
		address _user
	) public view returns (Credential[] memory) {
		return userToCredentials[_user];
	}

	function viewIssuerToCredentials(
		address _issuer
	) public view returns (Credential[] memory) {
		return issuerToCredentials[_issuer];
	}

	/**
	 * @param _credentialId The id of the credential
	 * @return The credential object
	 */
	function viewCredential(
		uint256 _credentialId
	)
		public
		view
		onlyValidCredentialId(_credentialId)
		returns (Credential memory)
	{
		Credential memory credential = idToCredentials[_credentialId];
		return credential;
	}

	/**
	 * @notice Allows an individual user to update the data associated with a credential
	 * @param _credentialId The credential id
	 * @param _newTitle The title of the credential
	 * @param _newIssuerAddress The new address, 0 by default
	 * @param _newData The new data
	 */
	function updateCredential(
		uint256 _credentialId,
		string memory _newTitle,
		address _newIssuerAddress,
		string memory _newData
	)
		public
		onlyIndividual
		onlyNullOrValidIssuerAddress(_newIssuerAddress)
		onlyValidCredentialId(_credentialId)
		onlyCredentialOwner(_credentialId)
	{
		idToCredentials[_credentialId].title = _newTitle;
		idToCredentials[_credentialId].issuerAddress = _newIssuerAddress;
		idToCredentials[_credentialId].data = _newData;
		uint256 index = credentialIdToIndividualIndex[_credentialId];
		userToCredentials[msg.sender][index].title = _newTitle;
		userToCredentials[msg.sender][index].issuerAddress = _newIssuerAddress;
		userToCredentials[msg.sender][index].data = _newData;
		emit CredentialUpdated(_credentialId, _newData);
	}

	/**
	 * @notice Allow an individual user to delete a credential
	 * @param _credentialId The id of the credential
	 */
	function deleteCredential(
		uint256 _credentialId
	)
		public
		onlyIndividual
		onlyValidCredentialId(_credentialId)
		onlyCredentialOwner(_credentialId)
	{
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Individual,
			"Only individual users can create credentials"
		);
		uint256 index = credentialIdToIndividualIndex[_credentialId];
		userToCredentials[msg.sender][index] = userToCredentials[msg.sender][
			userToCredentials[msg.sender].length - 1
		];
		userToCredentials[msg.sender].pop();
		if (idToCredentials[_credentialId].issuerAddress != address(0)) {
			uint256 issuerIndex = credentialIdToIssuerIndex[_credentialId];
			issuerToCredentials[idToCredentials[_credentialId].issuerAddress][
				issuerIndex
			] = issuerToCredentials[
				idToCredentials[_credentialId].issuerAddress
			][
				issuerToCredentials[
					idToCredentials[_credentialId].issuerAddress
				].length - 1
			];
			issuerToCredentials[idToCredentials[_credentialId].issuerAddress]
				.pop();
		}
		delete idToCredentials[_credentialId];
		emit CredentialDeleted(_credentialId);
	}
}
