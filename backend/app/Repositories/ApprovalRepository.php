<?php

namespace App\Repositories;
use App\Models\Approval;
use App\Interfaces\ApprovalInterface;
use App\Helpers\ApprovalHelper;

use Illuminate\Support\Facades\Log;

class ApprovalRepository implements ApprovalInterface
{
    public function __construct() {}

    public function index(){
        return Approval::all();
    }

    public function getById($id){
       return Approval::findOrFail($id);
    }

    public function getByApplicationId($id){
       return Approval::where('application_id',$id)->get();
    }

    public function store(array $data){
      //  return Approval::create($data);
      // Get current approval role from helper
      $currentRole = ApprovalHelper::getCurrentApprovalRole($data['application_id']);
      if($currentRole != $data["approving_role"]){
             throw new \Exception("Not allowed to approve.", 999);
      }


      $nextRole = ApprovalHelper::getNextApprovalRole($currentRole);
      $data['role'] = $nextRole ?? $currentRole;

      // Find the latest pending approval and update it
      $latestApproval = Approval::where('application_id', $data['application_id'])->where('status', 'pending')->latest('id')->first();

      if ($latestApproval) {
         $latestApproval->update($data); // Update instead of creating a new record
      } else {
         // If no pending approval exists, create a new one
         $latestApproval = Approval::create($data);
      }

      
      // Process the approval sequence after creation
      ApprovalHelper::processApproval($data['application_id']);

      return $latestApproval;

    }

    public function update(array $data,$id){
       return Approval::whereId($id)->update($data);
    }
    
    public function delete($id){
       Approval::destroy($id);
    }

   public function confirmSubmission(array $data){
        $lastApproval = Approval::where("application_id", $data["application_id"])->latest()->first();
        if(!$lastApproval) return false;
        $lastApproval->update($data);
        $initialRole = ApprovalHelper::getCurrentApprovalRole($data['application_id']);
         Approval::create([
            'application_id' => $data["application_id"],
            'approving_role' => $initialRole,
            'status' => 'pending' // Allow re-submission
        ]);
        return true;
    }
}
