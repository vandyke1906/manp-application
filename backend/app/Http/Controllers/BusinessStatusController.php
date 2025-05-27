<?php

namespace App\Http\Controllers;

use App\Models\BusinessStatus;
use App\Http\Requests\StoreBusinessStatusRequest;
use App\Http\Requests\UpdateBusinessStatusRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\BusinessStatusInterface;
use App\Http\Resources\BusinessStatusResource;

class BusinessStatusController extends Controller
{
    private BusinessStatusInterface $interface;

    public function __construct(BusinessStatusInterface $obj){
        $this->interface = $obj;
    }

    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(BusinessStatusResource::collection($data),'',200);
    }

    public function create()
    {
    }

    public function store(StoreBusinessStatusRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new BusinessStatusResource($obj),'BusinessStatus classification added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new BusinessStatusResource($obj),'',200);
    }

    public function edit(BusinessStatus $BusinessStatus)
    {
    }

    public function update(UpdateBusinessStatusRequest $request, $id)
    {
        
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'BusinessStatus classification updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'BusinessStatus classification deleted successfully.',201);
    }
}
