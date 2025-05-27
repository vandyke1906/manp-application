<?php

namespace App\Http\Controllers;

use App\Models\Capitalization;
use App\Http\Requests\StoreCapitalizationRequest;
use App\Http\Requests\UpdateCapitalizationRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\CapitalizationInterface;
use App\Http\Resources\CapitalizationResource;

class CapitalizationController extends Controller
{
    private CapitalizationInterface $interface;

    public function __construct(CapitalizationInterface $obj){
        $this->interface = $obj;
    }

    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(CapitalizationResource::collection($data),'',200);
    }

    public function create()
    {
    }

    public function store(StoreCapitalizationRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new CapitalizationResource($obj),'Capitalization classification added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new CapitalizationResource($obj),'',200);
    }

    public function edit(Capitalization $Capitalization)
    {
    }

    public function update(UpdateCapitalizationRequest $request, $id)
    {
        
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'Capitalization classification updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'Capitalization classification deleted successfully.',201);
    }
}
