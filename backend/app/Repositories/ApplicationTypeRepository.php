<?php

namespace App\Repositories;
use App\Models\ApplicationType;
use App\Interfaces\ApplicationTypeInterface;

class ApplicationTypeRepository implements ApplicationTypeInterface
{
    public function __construct()
    {
    }

    public function index(){
        return ApplicationType::all();
    }

    public function getById($id){
       return ApplicationType::findOrFail($id);
    }

    public function store(array $data){
       return ApplicationType::create($data);
    }

    public function update(array $data,$id){
       return ApplicationType::whereId($id)->update($data);
    }
    
    public function delete($id){
        ApplicationType::destroy($id);
    }
}
