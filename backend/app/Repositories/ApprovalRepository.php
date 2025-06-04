<?php

namespace App\Repositories;
use App\Models\Approval;
use App\Interfaces\ApprovalInterface;

class ApprovalRepository implements ApprovalInterface
{
    public function __construct() {}

    public function index(){
        return Approval::all();
    }

    public function getById($id){
       return Approval::findOrFail($id);
    }

    public function getByApplicationId($id){
       return Approval::where('application_id',$id)->get();
    }

    public function store(array $data){
       return Approval::create($data);
    }

    public function update(array $data,$id){
       return Approval::whereId($id)->update($data);
    }
    
    public function delete($id){
       Approval::destroy($id);
    }
}
