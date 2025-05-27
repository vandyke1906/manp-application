<?php

namespace App\Repositories;
use App\Models\Capitalization;
use App\Interfaces\CapitalizationInterface;

class CapitalizationRepository implements CapitalizationInterface
{
    public function __construct()
    {
    }

    public function index(){
        return Capitalization::all();
    }

    public function getById($id){
       return Capitalization::findOrFail($id);
    }

    public function store(array $data){
       return Capitalization::create($data);
    }

    public function update(array $data,$id){
       return Capitalization::whereId($id)->update($data);
    }
    
    public function delete($id){
        Capitalization::destroy($id);
    }
}
