<?php

namespace App\Helpers;

use App\Models\Application;
use App\Models\Approval;
use App\Constants\Roles;

class ApprovalHelper
{
    // Define the approval sequence
    protected static array $sequence = [
        Roles::RPS_TEAM     => Roles::MANAGER,
        // Roles::MANAGER      => Roles::ADMINISTRATOR, // Optional final step
    ];

    /**
     * Get the current approval role for an application.
     *
     * @param int $applicationId
     * @return int|null
     */
    public static function getCurrentApprovalRole(int $applicationId): ?int
    {
        $approval = Approval::where('application_id', $applicationId)
                            ->where('status', 'pending')
                            ->orderBy('id', 'asc')
                            ->first();

        return $approval ? $approval->approving_role : Roles::RPS_TEAM; // Default to RPS if no approvals exist
    }

    /**
     * Get the next approval role based on the current approver's role.
     *
     * @param int $currentRole
     * @return int|null Next role or null if final step reached
     */
    public static function getNextApprovalRole(int $currentRole): ?int
    {
        return self::$sequence[$currentRole] ?? null;
    }

    public static function processApproval(int $applicationId): void
    {
        // Get the latest approval decision
        $latestApproval = Approval::where('application_id', $applicationId)
            ->latest('id')
            ->first();

        if (!$latestApproval) {
            return; // No approvals exist, exit early
        }

        // Determine next steps based on approval status
        if ($latestApproval->status === 'approved') {
            $nextRole = self::getNextApprovalRole($latestApproval->approving_role);

            if ($nextRole) {
                // Proceed to next approval step
                Approval::create([
                    'application_id' => $applicationId,
                    'approving_role' => $nextRole,
                    'status' => 'pending'
                ]);
            } else {
                // Final approval step reached, update the last approval as 'approved'
                $latestApproval->update(['status' => 'finalized']);
            }
        } elseif ($latestApproval->status === 'rejected') {
            // Approval rejected—retain current role and set status
            Approval::create([
                'application_id' => $applicationId,
                'approving_role' => $latestApproval->approving_role,
                'status' => 'pending'
            ]);
        }
    }
}