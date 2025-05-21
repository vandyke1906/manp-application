<?php

namespace App\Http\Controllers;

use App\Models\Proponent;
use App\Http\Requests\StoreProponentRequest;
use App\Http\Requests\UpdateProponentRequest;
use App\Interfaces\ProponentRepositoryInterface;
use App\Http\Resources\ProponentResource;
use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;

use Illuminate\Support\Facades\Log;

class ProponentController extends Controller
{

    private ProponentRepositoryInterface $proponentRepositryInterface;

    public function __construct(ProponentRepositoryInterface $interface)
    {
        $this->proponentRepositryInterface = $interface;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = $this->proponentRepositryInterface->index()->sortBy('name')->values();;
        return ApiResponseClass::sendResponse(ProponentResource::collection($data),'',200);
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
    public function store(StoreProponentRequest $request)
    {    
        $details =[
            'name' => $request->name,
            'contact_number' => $request->contact_number,
            'email_address' => $request->email_address,
            'establishment' => $request->establishment,
            'address' => $request->address,
            'area_occupied' => $request->area_occupied,
            'capital_declaration' => $request->capital_declaration,
            'zoning_id' => $request->zoning_id,
            'business_type_id' => $request->business_type_id
        ];
        Log::info('Request data: ', $request->all());
        DB::beginTransaction();
        try{
             $proponent = $this->proponentRepositryInterface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new ProponentResource($proponent),'Proponent added successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $proponent = $this->proponentRepositryInterface->getById($id);

        return ApiResponseClass::sendResponse(new ProponentResource($proponent),'',200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proponent $proponent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProponentRequest $request, $id)
    {
        $updateDetails =[
            'name' => $request->name,
            'contact_number' => $request->contact_number,
            'establishment' => $request->establishment,
            'address' => $request->address,
            'area_occupied' => $request->area_occupied,
            'capital_declaration' => $request->capital_declaration,
            'zoning_id' => $request->zoning_id,
            'business_type_id' => $request->business_type_id
        ];
        DB::beginTransaction();
        try{
             $object = $this->proponentRepositryInterface->update($updateDetails,$id);

             DB::commit();
             return ApiResponseClass::sendResponse($object, 'Proponent details updated successfully.',201);

        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $this->proponentRepositryInterface->delete($id);
        return ApiResponseClass::sendResponse($id,'Proponent deleted successfully.',201);
    }
}
