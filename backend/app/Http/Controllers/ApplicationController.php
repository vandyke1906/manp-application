<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Classes\ApiResponseClass;
use App\Models\Application;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;

use Illuminate\Support\Facades\DB;
use App\Interfaces\ApplicationInterface;
use App\Http\Resources\ApplicationResource;

use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    private ApplicationInterface $interface;

    public function __construct(ApplicationInterface $obj){
        $this->interface = $obj;
    }

    public function index(Request $request)
    {
        $data = $this->interface->index($request->user())->values();
        return ApiResponseClass::sendResponse($data,'',200);
    }

    public function create()
    {
    }

    public function store(StoreApplicationRequest $request)
    {
        $user = (object)$request->user()->only(['id', 'first_name', 'middle_name', 'last_name', 'suffix', 'email']);
        $application_data =[
            'application_date' => $request->application_date,
            'first_name' => $user->first_name,
            'middle_name' => $user->middle_name,
            'last_name' => $user->last_name,
            'suffix' => $user->suffix,
            'email_address' => $user->email,
            'contact_number' => $request->telephone_number ? "{$request->mobile_number}, {$request->telephone_number}"  : "{$request->mobile_number}",
            'address' => $request->address,
            'user_id' => $user->id,
            // 'applicant_type_id' => $request->applicant_type_id,
            'application_type_id' => $request->application_type_id,
            'business_name' => $request->business_name,
            'business_address' => $request->business_address,
            'business_description' => $request->business_description,
            'business_nature_id' => $request->business_nature_id,
            'business_status_id' => $request->business_status_id,
            'capitalization_id' => $request->capitalization_id,
            'business_type_id' => $request->business_type_id,
        ];
        $application_files = [
            'proof_of_capitalization' => $request->proof_of_capitalization,
            'barangay_clearance' => $request->barangay_clearance,
            'birth_certificate_or_id' => $request->birth_certificate_or_id,
            'ncip_document' => $request->ncip_document,
            'fpic_certification' => $request->fpic_certification,
            'business_permit' => $request->business_permit, 
            'authorization_letter' => $request->authorization_letter, 
        ];
        DB::beginTransaction();
        try{
             $application = $this->interface->store($application_data);
             //$application->id
             DB::commit();
             return ApiResponseClass::sendResponse([],'Application added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new ApplicationResource($obj),'',200);
    }

    public function edit(Application $Application)
    {
    }

    public function update(UpdateApplicationRequest $request, $id)
    {
        
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'Application updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'Application deleted successfully.',201);
    }
}
