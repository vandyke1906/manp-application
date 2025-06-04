<?php

namespace App\Repositories;
use App\Models\ApplicantType;
use App\Interfaces\ApplicantTypeInterface;

class ApplicantTypeRepository implements ApplicantTypeInterface
{
    public function __construct()
    {
    }

    public function index(){
        return ApplicantType::all();
    }

    public function getById($id){
       return ApplicantType::findOrFail($id);
    }

    public function getByIds($ids){
        return ApplicantType::whereIn('id', $ids)->get();
    }

    public function store(array $data){
       return ApplicantType::create($data);
    }

    public function update(array $data,$id){
       return ApplicantType::whereId($id)->update($data);
    }
    
    public function delete($id){
        ApplicantType::destroy($id);
    }
}
