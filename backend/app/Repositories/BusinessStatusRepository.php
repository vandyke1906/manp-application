<?php

namespace App\Repositories;
use App\Models\BusinessStatus;
use App\Interfaces\BusinessStatusInterface;

class BusinessStatusRepository implements BusinessStatusInterface
{
    public function __construct()
    {
    }

    public function index(){
        return BusinessStatus::all();
    }

    public function getById($id){
       return BusinessStatus::findOrFail($id);
    }

    public function store(array $data){
       return BusinessStatus::create($data);
    }

    public function update(array $data,$id){
       return BusinessStatus::whereId($id)->update($data);
    }
    
    public function delete($id){
        BusinessStatus::destroy($id);
    }
}
