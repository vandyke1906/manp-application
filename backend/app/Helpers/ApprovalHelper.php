<?php

namespace App\Helpers;

use App\Models\Application;
use App\Models\Approval;
use App\Constants\Roles;

use Illuminate\Support\Facades\Log;

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

    public static function getNextApprovalRole(int $currentRole)
    {        
        return self::$sequence[$currentRole] ?? null;
    }

    public static function processApproval(int $applicationId): void
    {
        // Get the latest approval decision
        $latestApproval = Approval::where('application_id', $applicationId)->latest('id')->first();
        if (!$latestApproval) return;

        // Determine next steps based on approval status
        if ($latestApproval->status === 'approved') {
            $nextRole = ApprovalHelper::getNextApprovalRole($latestApproval->approving_role);
            if ($nextRole) {
                Approval::create([
                    'application_id' => $applicationId,
                    'approving_role' => $nextRole,
                    'status' => 'pending'
                ]);
            } else {
                $latestApproval->update(['status' => 'completed']);
            }
        } elseif ($latestApproval->status === 'rejected') {
            Approval::create([
                'application_id' => $applicationId,
                'approving_role' => $latestApproval->approving_role,
                'status' => 'pending' // Allow re-submission
            ]);
        }
    }
}