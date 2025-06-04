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
      $nextRole = ApprovalHelper::getNextApprovalRole($currentRole);

      // Set the approver role dynamically
      $data['role'] = $nextRole ?? $currentRole; // Use next role or retain current if final step

      // Create the approval record
      $approval = Approval::create($data);
      
      Log::debug($approval);

      // Process the approval sequence after creation
      ApprovalHelper::processApproval($data['application_id']);

      return $approval;

    }

    public function update(array $data,$id){
       return Approval::whereId($id)->update($data);
    }
    
    public function delete($id){
       Approval::destroy($id);
    }
}
