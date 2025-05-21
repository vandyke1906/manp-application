<?php

namespace App\Repositories;
use App\Models\User;
use App\Interfaces\AuthInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;

class UserRepository implements AuthInterface
{
    public function __construct()
    {
    }

    
    public function index(){
        return User::latest()->get();
    }

    public function register(array $data){
        $data["password"] = Hash::make($data["password"]);
        return User::create($data);
    }

    public function login(array $data){
        try {
            $user = User::where('email', $data["email"])->first();
            if(!$user || !Hash::check($data["password"], $user->password)){
                throw new \ErrorException('Invalid Credentials.');
            }
            
            $token = $user->createToken('manp-token')->plainTextToken;
            $result = (object)[
                "name" => $user->name, 
                "email" => $user->email, 
                "role" => $user->role, 
                "token" => $token
            ];
            return $result;
        }catch(\Exception $ex){
            throw new \ErrorException($ex->getMessage());
        }
    }

    public function logout(array $data){
    }

    public function authCheck(){

    }
}
