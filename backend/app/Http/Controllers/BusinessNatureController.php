<?php

namespace App\Http\Controllers;

use App\Models\BusinessNature;
use App\Http\Requests\StoreBusinessNatureRequest;
use App\Http\Requests\UpdateBusinessNatureRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\BusinessNatureInterface;
use App\Http\Resources\BusinessNatureResource;

class BusinessNatureController extends Controller
{
    private BusinessNatureInterface $interface;

    public function __construct(BusinessNatureInterface $obj){
        $this->interface = $obj;
    }

    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(BusinessNatureResource::collection($data),'',200);
    }

    public function create()
    {
    }

    public function store(StoreBusinessNatureRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new BusinessNatureResource($obj),'BusinessNature classification added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new BusinessNatureResource($obj),'',200);
    }

    public function edit(BusinessNature $BusinessNature)
    {
    }

    public function update(UpdateBusinessNatureRequest $request, $id)
    {
        
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'BusinessNature classification updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'BusinessNature classification deleted successfully.',201);
    }
}
