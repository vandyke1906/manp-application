<?php

namespace App\Repositories;
use App\Models\Application;
use App\Interfaces\ApplicationInterface;

use App\Constants\Roles;
use Illuminate\Support\Facades\Log;

class ApplicationRepository implements ApplicationInterface
{
    public function __construct()
    {
    }

    public function index($user){
        switch($user->role){
            case Roles::PROPONENTS: {
                // $data =Application::where("user_id", $user->id)->values();
                // Log::debug($data); //TODO
                return [];
            }
            case Roles::RPS_TEAM: 
            case Roles::MANAGER: 
            case Roles::ADMINISTRATOR: {
                return Application::all();
            }
            default: return [];
        }
    }

    public function getById($id){
       return Application::findOrFail($id);
    }

    public function store(array $data){
       return Application::create($data);
    }

    public function update(array $data,$id){
       return Application::whereId($id)->update($data);
    }
    
    public function delete($id){
        Application::destroy($id);
    }
}
