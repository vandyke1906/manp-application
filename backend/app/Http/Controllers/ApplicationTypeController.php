<?php

namespace App\Http\Controllers;

use App\Models\ApplicationType;
use App\Http\Requests\StoreApplicationTypeRequest;
use App\Http\Requests\UpdateApplicationTypeRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\ApplicationTypeInterface;
use App\Http\Resources\ApplicationTypeResource;

class ApplicationTypeController extends Controller
{
    private ApplicationTypeInterface $interface;
    
    public function __construct(ApplicationTypeInterface $obj){
        $this->interface = $obj;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->interface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(ApplicationTypeResource::collection($data),'',200);
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
    public function store(StoreApplicationTypeRequest $request)
    {
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new ApplicationTypeResource($obj),'Application Type added successfully.',201);

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
        return ApiResponseClass::sendResponse(new ApplicationTypeResource($obj),'',200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ApplicationType $applicationType)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateApplicationTypeRequest $request, $id)
    {
        $updateDetails =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $data = $this->interface->update($updateDetails, $id);
             DB::commit();
             return ApiResponseClass::sendResponse($data, 'Application Type updated successfully.',201);

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
        return ApiResponseClass::sendResponse($id, 'Application Type deleted successfully.',204);
    }
}
