<?php

namespace App\Http\Controllers;

use App\Models\ApplicantType;
use Illuminate\Http\Request;
use App\Http\Requests\StoreApplicantTypeRequest;
use App\Http\Requests\UpdateApplicantTypeRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\ApplicantTypeInterface;
use App\Http\Resources\ApplicantTypeResource;

class ApplicantTypeController extends Controller
{
    private ApplicantTypeInterface $interface;

    public function __construct(ApplicantTypeInterface $obj){
        $this->interface = $obj;
    }

    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(ApplicantTypeResource::collection($data),'',200);
    }

    public function create()
    {
    }

    public function store(StoreApplicantTypeRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new ApplicantTypeResource($obj),'ApplicantType classification added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new ApplicantTypeResource($obj),'',200);
    }

    public function getByIds(Request $request)
    {
        $idRequest = $request->query('ids'); 
        $ids = explode(',', $idRequest);
        $obj = $this->interface->getByIds($ids);
        return ApiResponseClass::sendResponse($obj,'',200);
    }

    public function edit(ApplicantType $ApplicantType)
    {
    }

    public function update(UpdateApplicantTypeRequest $request, $id)
    {
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'ApplicantType classification updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'ApplicantType classification deleted successfully.',201);
    }
}
