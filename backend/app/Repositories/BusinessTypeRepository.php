<?php

namespace App\Repositories;
use App\Models\BusinessType;
use App\Interfaces\BusinessTypeInterface;

class BusinessTypeRepository implements BusinessTypeInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index(){
        return BusinessType::all();
    }

    public function getById($id){
       return BusinessType::findOrFail($id);
    }

    public function store(array $data){
       return BusinessType::create($data);
    }

    public function update(array $data,$id){
       return BusinessType::whereId($id)->update($data);
    }
    
    public function delete($id){
       BusinessType::destroy($id);
    }
}
