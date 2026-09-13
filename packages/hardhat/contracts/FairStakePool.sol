// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title FairStakePool
 * @notice Human-gated investment pool for fair-launch style USDC commits on Arc.
 *         World Selfie verification is recorded off-chain and written on-chain by the verifier.
 *         ENS investor credentials (max commit, expiry) are mirrored here for execution gating.
 */
contract FairStakePool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Round {
        uint256 maxCommitPerInvestor;
        uint256 totalCap;
        uint256 totalCommitted;
        uint256 endTime;
        bool active;
        address paymentToken; // address(0) = native USDC (msg.value)
    }

    struct InvestorCredential {
        bool verified;
        uint256 maxCommit;
        uint256 expiresAt;
        bytes32 nullifierHash;
    }

    uint256 public roundCount;
    mapping(uint256 => Round) public rounds;
    mapping(address => InvestorCredential) public credentials;
    mapping(bytes32 => bool) public usedNullifiers;
    mapping(uint256 => mapping(address => uint256)) public committed;

    event RoundCreated(uint256 indexed roundId, uint256 maxCommitPerInvestor, uint256 totalCap, uint256 endTime);
    event CredentialSet(
        address indexed investor,
        bool verified,
        uint256 maxCommit,
        uint256 expiresAt,
        bytes32 nullifierHash
    );
    event Committed(address indexed investor, uint256 indexed roundId, uint256 amount);
    event Refunded(address indexed investor, uint256 indexed roundId, uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    function createRound(
        uint256 maxCommitPerInvestor,
        uint256 totalCap,
        uint256 durationSeconds,
        address paymentToken
    ) external onlyOwner returns (uint256 roundId) {
        roundId = ++roundCount;
        rounds[roundId] = Round({
            maxCommitPerInvestor: maxCommitPerInvestor,
            totalCap: totalCap,
            totalCommitted: 0,
            endTime: block.timestamp + durationSeconds,
            active: true,
            paymentToken: paymentToken
        });
        emit RoundCreated(roundId, maxCommitPerInvestor, totalCap, rounds[roundId].endTime);
    }

    /// @dev Called by backend after World Selfie Check + ENS credential issuance.
    function setCredential(
        address investor,
        bool verified,
        uint256 maxCommit,
        uint256 expiresAt,
        bytes32 nullifierHash
    ) external onlyOwner {
        require(!usedNullifiers[nullifierHash], "Nullifier already used");
        usedNullifiers[nullifierHash] = true;
        credentials[investor] = InvestorCredential({
            verified: verified,
            maxCommit: maxCommit,
            expiresAt: expiresAt,
            nullifierHash: nullifierHash
        });
        emit CredentialSet(investor, verified, maxCommit, expiresAt, nullifierHash);
    }

    function commit(uint256 roundId, uint256 amount) external payable nonReentrant {
        Round storage round = rounds[roundId];
        require(round.active, "Round inactive");
        require(block.timestamp < round.endTime, "Round ended");

        InvestorCredential storage cred = credentials[msg.sender];
        require(cred.verified, "Human not verified");
        require(block.timestamp < cred.expiresAt, "Credential expired");
        require(amount > 0, "Zero amount");
        require(amount <= cred.maxCommit, "Over credential cap");
        require(amount <= round.maxCommitPerInvestor, "Over round cap");
        require(committed[roundId][msg.sender] + amount <= round.maxCommitPerInvestor, "Over investor round cap");
        require(round.totalCommitted + amount <= round.totalCap, "Round full");

        if (round.paymentToken == address(0)) {
            require(msg.value == amount, "Native amount mismatch");
        } else {
            require(msg.value == 0, "No native value");
            IERC20(round.paymentToken).safeTransferFrom(msg.sender, address(this), amount);
        }

        committed[roundId][msg.sender] += amount;
        round.totalCommitted += amount;
        emit Committed(msg.sender, roundId, amount);
    }

    function closeRound(uint256 roundId) external onlyOwner {
        rounds[roundId].active = false;
    }

    receive() external payable {}
}
