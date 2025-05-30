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
        $details =[
            'name' => $request->name,
            'description' => $request->description,
        ];
        DB::beginTransaction();
        try{
             $obj = $this->interface->store($details);

             DB::commit();
             return ApiResponseClass::sendResponse(new ApplicationResource($obj),'Application added successfully.',201);

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
