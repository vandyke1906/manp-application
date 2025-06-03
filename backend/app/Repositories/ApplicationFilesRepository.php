<?php

namespace App\Repositories;
use App\Models\ApplicationFiles;
use App\Interfaces\ApplicationFilesInterface;

class ApplicationFilesRepository implements ApplicationFilesInterface
{
    public function __construct(){}

    public function index(){
        return ApplicationFiles::all();
    }

    public function getById($id){
       return ApplicationFiles::findOrFail($id);
    }

    public function getByApplicationId($appId){
       return ApplicationFiles::where('application_id',$appId)->get();
    }
    
   public function getByApplicationAppIdAndName($id, $name){
       return ApplicationFiles::where('application_id',$id)->where('name', $name)->firstOrFail();
   
    }

    public function store(array $data){
       return ApplicationFiles::create($data);
    }

    public function update(array $data,$id){
       return ApplicationFiles::whereId($id)->update($data);
    }
    
    public function delete($id){
        ApplicationFiles::destroy($id);
    }
}
