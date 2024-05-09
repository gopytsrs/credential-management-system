//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";
import "./AuthContract.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 *
 * @author Sean Goh
 */
/**
 * @title A smart contract that is used for managing data requests
 * @author Sean Goh
 * @notice This contract provides functionality to individual to accept,reject and view requests. And for organization to create and view requests
 */
contract RequestManager {
	enum RequestStatus {
		None,
		Pending,
		Approved,
		Rejected
	}

	struct Request {
		uint256 requestId;
		address requester; // An organization user
		address requestee; // An individual user
		string purpose;
		string title;
		RequestStatus status;
		uint256 credentialId;
	}

	mapping(address => Request[]) public organizationRequests;
	mapping(address => Request[]) public individualRequests;
	// Mapping to store the index of a request in the array
	mapping(address => mapping(uint256 => uint256))
		private individualRequestIndex;
	mapping(address => mapping(uint256 => uint256))
		private organizationRequestIndex;
	uint256 public requestCount;

	/**
	 * @notice Event emitted when request is created by an organization user
	 * @param requestId The id of the request
	 * @param individual The address of the individual
	 * @param organization The address of the organization
	 * @param purpose The purpose of the request
	 * @param title The title of the request
	 */
	event RequestCreated(
		uint256 indexed requestId,
		address indexed individual,
		address indexed organization,
		string purpose,
		string title
	);

	/**
	 * @notice Event emitted when request is accepted by individual user
	 * @param requestId The id of the request
	 * @param individual The address of the individual
	 * @param organization The address of the organization
	 * @param requestStatus The status to update to -> approved
	 * @param credentialId The id of the credential
	 * @param title The title of the request
	 * @param purpose The purpose of the request
	 */
	event RequestAccepted(
		uint256 indexed requestId,
		address indexed individual,
		address indexed organization,
		RequestStatus requestStatus,
		uint256 credentialId,
		string title,
		string purpose
	);

	/**
	 * @notice Event emitted when request is rejected by individual user
	 * @param requestId The id of the request
	 * @param individual The address of the individual
	 * @param organization The address of the organization
	 * @param requestStatus The status to update to -> rejected
	 * @param title The title of the request
	 * @param purpose The purpose of the request
	 */
	event RequestRejected(
		uint256 indexed requestId,
		address indexed individual,
		address indexed organization,
		RequestStatus requestStatus,
		string title,
		string purpose
	);

	AuthContract public authContract;

	/**
	 * @notice Initialised the auth contract to use its functionality within RequestManager
	 * @param _authContractAddress The address of the auth contract
	 */
	constructor(address _authContractAddress) {
		authContract = AuthContract(_authContractAddress); // Initialize AuthContract instance
	}

	/**
	 * @notice Modifier to ensure only organizations can perform certain actions
	 */
	modifier onlyOrganization() {
		require(
			authContract.addrToUsers(msg.sender) ==
				AuthContract.UserType.Organization,
			"Only organization can perform this action"
		);
		_;
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
	 * @notice Modifier to ensure only valid requests before performing action
	 */
	modifier onlyValidRequest(uint256 _requestId) {
		Request[] storage requests = individualRequests[msg.sender];
		uint256 requestIdx = individualRequestIndex[msg.sender][_requestId];
		// console.log("Request index is", requestIdx);
		require(requestIdx >= 0, "Request not found");
		require(
			requests[requestIdx].status == RequestStatus.Pending,
			"Request is not pending"
		);
		_;
	}

	/**
	 * @notice Allow an organization user to create a data request
	 * @param _purpose The purpose of the request
	 * @param _title The title of the request
	 * @param _individualAddress The address of the individual to create the request to
	 * @dev TODO: Update to require individual address/id
	 */
	function createRequest(
		string memory _purpose,
		string memory _title,
		address _individualAddress
	) public onlyOrganization {
		requestCount++;
		Request memory newRequest = Request(
			requestCount,
			msg.sender,
			_individualAddress,
			_purpose,
			_title,
			RequestStatus.Pending,
			0
		);
		organizationRequests[msg.sender].push(newRequest);
		organizationRequestIndex[msg.sender][requestCount] =
			organizationRequests[msg.sender].length -
			1;

		individualRequests[_individualAddress].push(newRequest);
		individualRequestIndex[_individualAddress][requestCount] =
			individualRequests[_individualAddress].length -
			1;

		emit RequestCreated(
			requestCount,
			_individualAddress,
			msg.sender,
			_purpose,
			_title
		);
	}

	/**
	 * @notice Allow an organization user to view pending requests
	 */
	function viewPendingRequests()
		public
		view
		onlyOrganization
		returns (Request[] memory)
	{
		return organizationRequests[msg.sender];
	}

	/**
	 * @notice Allow an individual user to accept an incoming request
	 * @param _requestId The id of the request
	 * @param _credentialId The id of the credential to provide
	 * @dev TODO: still needs refactoring
	 */
	function acceptRequest(
		uint256 _requestId,
		uint256 _credentialId
	) public onlyIndividual onlyValidRequest(_requestId) {
		uint256 index = individualRequestIndex[msg.sender][_requestId];
		Request memory request = individualRequests[msg.sender][index];
		removeRequest(msg.sender, request.requester, _requestId);
		emit RequestAccepted(
			_requestId,
			msg.sender,
			request.requester,
			RequestStatus.Approved,
			_credentialId,
			request.title,
			request.purpose
		);
	}

	/**
	 * @notice Allow an individual user to reject an incoming request
	 * @param _requestId The id of the request
	 * @dev TODO: still needs refactoring
	 */
	function rejectRequest(
		uint256 _requestId
	) public onlyIndividual onlyValidRequest(_requestId) {
		uint256 index = individualRequestIndex[msg.sender][_requestId];
		Request memory request = individualRequests[msg.sender][index];
		removeRequest(msg.sender, request.requester, _requestId);
		emit RequestRejected(
			_requestId,
			msg.sender,
			request.requester,
			RequestStatus.Rejected,
			request.title,
			request.purpose
		);
	}

	/**
	 * @notice Allow an individual user to view pending requests
	 */
	function viewUserPendingRequests()
		public
		view
		onlyIndividual
		returns (Request[] memory)
	{
		return individualRequests[msg.sender];
	}

	/**
	 * @notice Removes request from both organization and user storage
	 * @param _individualAddress The address of the individual in the request
	 * @param _organizationAddress The address of the organization in the request
	 * @param _requestId The id of the request to be removed
	 */
	function removeRequest(
		address _individualAddress,
		address _organizationAddress,
		uint256 _requestId
	) internal onlyIndividual {
		removeRequestFromUser(
			individualRequests[_individualAddress],
			individualRequestIndex[_individualAddress],
			_requestId
		);
		removeRequestFromUser(
			organizationRequests[_organizationAddress],
			organizationRequestIndex[_organizationAddress],
			_requestId
		);
	}

	/**
	 * @notice Removes a request from mapping and array of the individual and organization in O(1) time
	 * @param _requests The requests storage array of the individual or organization
	 * @param _requestIndex The requests index mapping of the individual or organization
	 * @param _requestId The id of the request to remove
	 */
	function removeRequestFromUser(
		Request[] storage _requests,
		mapping(uint256 => uint256) storage _requestIndex,
		uint256 _requestId
	) internal {
		require(_requests.length > 0, "No requests found");

		uint256 indexToRemove = _requestIndex[_requestId];
		require(indexToRemove >= 0, "Request not found");

		// Move the last element to the position of the element to be removed
		uint256 lastIndex = _requests.length - 1;
		if (indexToRemove < lastIndex) {
			_requests[indexToRemove] = _requests[lastIndex];
			uint256 lastRequestId = _requests[lastIndex].requestId;
			_requestIndex[lastRequestId] = indexToRemove;
		}

		// Remove the last element
		_requests.pop();
		delete _requestIndex[_requestId];
	}
}
