<?php

namespace App\Repositories;
use App\Models\Application;
use App\Models\Approval;
use App\Interfaces\ApplicationInterface;

use App\Constants\Roles;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ApplicationRepository implements ApplicationInterface
{
    public function __construct()
    {
    }

    public function index($user){
        switch ($user->role) {
            case Roles::PROPONENTS: {
                return Application::withTrashed()->where("user_id", $user->id)
                ->with(['approvals' => function ($query) {
                    $query->where('status', '!=', 'pending')->latest('approved_at')->limit(1); 
                }])->get();
            }
            case Roles::RPS_TEAM:
            case Roles::MANAGER:
            case Roles::ADMINISTRATOR: {
                return Application::with(['approvals' => function ($query) {
                    $query->where('status', '!=', 'pending')->latest('approved_at')->limit(1); 
                }])->get();
            }
            default:
                return [];
        }
    }

    public function getById($id, $user=null){
        if(!$user){
            return Application::with(['approvals' => function ($query) {
                $query->where('status', '!=', 'pending')->orderBy('approved_at', 'desc');
            }, 'approvals.approver_name'])->findOrFail($id);
        }

        switch ($user->role) {
            case Roles::PROPONENTS: {
                return Application::withTrashed()->with(['approvals' => function ($query) {
                    $query->where('status', '!=', 'pending')->orderBy('approved_at', 'desc');
                }, 'approvals.approver_name'])->where('id', $id)->where('user_id', $user->id)->firstOrFail();
            }
            case Roles::RPS_TEAM:
            case Roles::MANAGER:
            case Roles::ADMINISTRATOR: {
                return Application::with(['approvals' => function ($query) {
                    $query->where('status', '!=', 'pending')->orderBy('approved_at', 'desc');
                }, 'approvals.approver_name'])->findOrFail($id);
            }
            default:
                return [];
        }
    }

    public function store(array $data){ 
        $lastApplication = Application::latest()->first();
        $nextId = $lastApplication ? $lastApplication->id + 1 : 1;
        $data["application_number"] = 'APP' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
        return Application::create($data);
    }

    public function update(array $data,$id){
       return Application::whereId($id)->update($data);
    }
    
    public function delete($id){
        $application = Application::findOrFail($id);
        if($application){
            $application->delete(); // This triggers soft delete if the model uses SoftDeletes
            //Approval::where('application_id',$id)->get();
             Approval::create([
                'application_id' => $id,
                'approving_role' => Roles::PROPONENTS,
                'user_id' => $application->user_id,
                'status' => 'cancelled', // Allow re-submission
                'approved_at' => Carbon::now(),
            ]);
            return true;
        }
        return false;
    }
}
