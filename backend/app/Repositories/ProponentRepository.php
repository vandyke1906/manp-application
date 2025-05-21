<?php

namespace App\Repositories;
use App\Models\Proponent;
use App\Interfaces\ProponentRepositoryInterface;

class ProponentRepository implements ProponentRepositoryInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index(){
        return Proponent::all();
    }

    public function getById($id){
       return Proponent::findOrFail($id);
    }

    public function store(array $data){
       return Proponent::create($data);
    }

    public function update(array $data,$id){
       return Proponent::whereId($id)->update($data);
    }
    
    public function delete($id){
       Proponent::destroy($id);
    }
}
