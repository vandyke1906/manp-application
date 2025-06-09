<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use Illuminate\Http\Request;
use App\Http\Requests\StoreApprovalRequest;
use App\Http\Requests\UpdateApprovalRequest;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\ApprovalInterface;
use App\Http\Resources\ApprovalResource;

class ApprovalController extends Controller
{
    private ApprovalInterface $interface;

    public function __construct(ApprovalInterface $obj){
        $this->interface = $obj;
    }

    public function index()
    {
    }
    
    public function getByApplicationId($id){

    }

    public function create()
    {
        
    }

    public function store(StoreApprovalRequest $request)
    {
        $details =[
            'application_id' => $request->application_id,
            'comment' => $request->comment,
            'status' => $request->status,
            'user_id' => $request->user()->id,
            'approving_role' => $request->user()->role,
            'approved_at' => Carbon::now(),
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);
             DB::commit();
             return ApiResponseClass::sendResponse(new ApprovalResource($obj),'Approval added successfully.',201);

        }catch(\Exception $ex){
            if( $ex->getCode() == 999)
                 return ApiResponseClass::sendResponse([],$ex->getMessage(),404);
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show(Approval $approval){ }

    public function edit(Approval $approval){ }

    public function update(UpdateApprovalRequest $request, Approval $approval){ }

    public function destroy(Approval $approval) {}

    

   public function confirmDocumentsSubmission(Request $request, $id){
        $details =[
            'application_id' => $id,
            'user_id' => $request->user()->id,
            'approved_at' => Carbon::now(),
            'status' => "in_review"
        ];
        DB::beginTransaction();
        try{
             $isConfirm = $this->interface->confirmSubmission($details);
             DB::commit();
             if($isConfirm)
                return ApiResponseClass::sendResponse([],'Documents received, status updated.',201);
            return ApiResponseClass::sendResponse([],'Application Error.',404);
        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }
}
