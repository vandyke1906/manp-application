<?php

namespace App\Repositories;
use App\Models\Zoning;
use App\Interfaces\ZoningInterface;

class ZoningRepository implements ZoningInterface
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function index(){
        return Zoning::all();
    }

    public function getById($id){
       return Zoning::findOrFail($id);
    }

    public function store(array $data){
       return Zoning::create($data);
    }

    public function update(array $data,$id){
       return Zoning::whereId($id)->update($data);
    }
    
    public function delete($id){
       Zoning::destroy($id);
    }
}
