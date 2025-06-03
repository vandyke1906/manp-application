<?php

namespace App\Repositories;
use App\Models\ApplicantTypeApplications;
use App\Interfaces\ApplicantTypeApplicationInterface;

class ApplicantTypeApplicationRepository implements ApplicantTypeApplicationInterface
{
    public function __construct(){}

    public function index(){
        return ApplicantTypeApplications::all();
    }

    public function getById($id){
       return ApplicantTypeApplications::findOrFail($id);
    }

    public function getByApplicationId($appId){
       return ApplicantTypeApplications::where('application_id',$appId)->get();
    }

    public function store(array $data){
       return ApplicantTypeApplications::create($data);
    }

    public function update(array $data,$id){
       return ApplicantTypeApplications::whereId($id)->update($data);
    }
    
    public function delete($id){
        ApplicantTypeApplications::destroy($id);
    }
}
