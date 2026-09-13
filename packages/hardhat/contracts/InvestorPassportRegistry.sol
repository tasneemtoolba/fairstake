// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InvestorPassportRegistry
 * @notice Sepolia anchor for ENS-shaped investor credentials (FairStake passport).
 *         Text-record keys mirror ENSv2 EAC fields until subname is minted on ENS.
 */
contract InvestorPassportRegistry is Ownable {
    struct Passport {
        string ensName;
        uint256 maxCommitUsd;
        uint256 expiresAt;
        bool humanVerified;
        bytes32 worldNullifier;
    }

    mapping(address => Passport) public passports;

    event PassportIssued(
        address indexed holder,
        string ensName,
        uint256 maxCommitUsd,
        uint256 expiresAt,
        bytes32 worldNullifier
    );

    constructor(address initialOwner) Ownable(initialOwner) {}

    function issuePassport(
        address holder,
        string calldata ensName,
        uint256 maxCommitUsd,
        uint256 expiresAt,
        bytes32 worldNullifier
    ) external onlyOwner {
        passports[holder] = Passport({
            ensName: ensName,
            maxCommitUsd: maxCommitUsd,
            expiresAt: expiresAt,
            humanVerified: true,
            worldNullifier: worldNullifier
        });
        emit PassportIssued(holder, ensName, maxCommitUsd, expiresAt, worldNullifier);
    }
}
