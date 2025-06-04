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

        return $approval ? $approval->role : Roles::RPS_TEAM; // Default to RPS if no approvals exist
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

    /**
     * Process the approval sequence and update the application's approver role.
     *
     * @param int $applicationId
     * @return void
     */
    public static function processApproval(int $applicationId): void
    {
        // Get current approval role dynamically
        $currentRole = self::getCurrentApprovalRole($applicationId);
        $nextRole = self::getNextApprovalRole($currentRole);

        if ($nextRole) {
            // Move to the next approval step
            Application::where('id', $applicationId)->update(['current_approver_role' => $nextRole]);
        } else {
            // Final approval step reached
            Application::where('id', $applicationId)->update(['status' => 'approved']);
        }
    }
}