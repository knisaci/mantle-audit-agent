// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title AuditRegistry
/// @notice On-chain registry for AI-generated smart contract audits on Mantle
/// @dev Deployed by MantleAudit agent (ERC-8004 ID: 46241)
contract AuditRegistry {
    struct Audit {
        string contractHash;
        string reportHash;
        uint256 riskScore;
        uint256 agentTokenId;
        uint256 timestamp;
    }

    uint256 public auditCount;
    mapping(uint256 => Audit) public audits;

    event AuditSubmitted(
        uint256 indexed auditId,
        string contractHash,
        uint256 riskScore,
        uint256 agentTokenId,
        uint256 timestamp
    );

    /// @notice Submit a new audit result on-chain
    function submitAudit(
        string calldata contractHash,
        string calldata reportHash,
        uint256 riskScore,
        uint256 agentTokenId
    ) external returns (uint256) {
        require(riskScore <= 100, "Risk score must be 0-100");
        require(bytes(contractHash).length > 0, "Contract hash required");
        require(bytes(reportHash).length > 0, "Report hash required");

        uint256 auditId = ++auditCount;

        audits[auditId] = Audit({
            contractHash: contractHash,
            reportHash: reportHash,
            riskScore: riskScore,
            agentTokenId: agentTokenId,
            timestamp: block.timestamp
        });

        emit AuditSubmitted(auditId, contractHash, riskScore, agentTokenId, block.timestamp);

        return auditId;
    }

    /// @notice Retrieve a stored audit by ID
    function getAudit(uint256 auditId) external view returns (Audit memory) {
        require(auditId > 0 && auditId <= auditCount, "Audit not found");
        return audits[auditId];
    }
}
