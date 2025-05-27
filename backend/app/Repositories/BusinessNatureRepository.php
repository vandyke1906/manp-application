<?php

namespace App\Repositories;
use App\Models\BusinessNature;
use App\Interfaces\BusinessNatureInterface;

class BusinessNatureRepository implements BusinessNatureInterface
{
    public function __construct()
    {
    }

    public function index(){
        return BusinessNature::all();
    }

    public function getById($id){
       return BusinessNature::findOrFail($id);
    }

    public function store(array $data){
       return BusinessNature::create($data);
    }

    public function update(array $data,$id){
       return BusinessNature::whereId($id)->update($data);
    }
    
    public function delete($id){
        BusinessNature::destroy($id);
    }
}
