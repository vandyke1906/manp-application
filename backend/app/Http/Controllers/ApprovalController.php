<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Http\Requests\StoreApprovalRequest;
use App\Http\Requests\UpdateApprovalRequest;

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
        //
    }

    public function store(StoreApprovalRequest $request)
    {
        //
    }

    public function show(Approval $approval)
    {
        //
    }

    public function edit(Approval $approval)
    {
        //
    }

    public function update(UpdateApprovalRequest $request, Approval $approval)
    {
        //
    }

    public function destroy(Approval $approval)
    {
        //
    }
}
