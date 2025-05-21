<?php

namespace App\Http\Controllers;

use App\Models\BusinessType;
use App\Http\Requests\StoreBusinessTypeRequest;
use App\Http\Requests\UpdateBusinessTypeRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\BusinessTypeInterface;
use App\Http\Resources\BusinessTypeResource;

class BusinessTypeController extends Controller
{
    private BusinessTypeInterface $interface;

    public function __construct(BusinessTypeInterface $obj){
        $this->interface = $obj;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(BusinessTypeResource::collection($data),'',200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBusinessTypeRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new BusinessTypeResource($obj),'Business Type added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $obj = $this->interface->getById($id);
        return ApiResponseClass::sendResponse(new BusinessTypeResource($obj),'',200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BusinessType $businessType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBusinessTypeRequest $request, $id)
    {
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails,$id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'Business Type updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->interface->delete($id);
        return ApiResponseClass::sendResponse($id, 'Proponent details deleted successfully.',201);
    }
}
