<?php

namespace App\Repositories;
use App\Models\User;
use App\Interfaces\AuthInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;
use App\Constants\Roles;
use Illuminate\Support\Str;
use App\Jobs\SendVerificationEmail;
use App\Jobs\SendVerificationLink;
use Illuminate\Support\Facades\Session;

class UserRepository implements AuthInterface
{
    public function __construct()
    {
    }

    
    public function index(){
        return User::latest()->get();
    }

    public function register(array $data){
        $role = Roles::PROPONENTS;
        $data["password"] = Hash::make($data["password"]);
        $data["role"] = $role;
        $data["verification_code"] = Str::random(6);
        $user = User::create($data);
        // dispatch(new SendVerificationEmail($user->email, $user->verification_code));
        dispatch(new SendVerificationLink($user->email, $user));
        return $user;
    }

    public function loginSession(array $data){
        try {
            $user = User::where('email', $data["email"])->first();
            if (!$user || !Hash::check($data["password"], $user->password)) {
                throw new \ErrorException('Invalid Credentials.');
            }

            // Authenticate user via Laravel's session-based authentication
            Auth::login($user); // This replaces token-based authentication
            
            // Regenerate session for security
            session()->regenerate();

            return (object)[
                "name" => $user->name, 
                "email" => $user->email, 
                "role" => $user->role, 
                "verified" => isset($user->email_verified_at)
            ];
        } catch (\Exception $ex) {
            throw new \ErrorException($ex->getMessage());
        }
    }

    public function login(array $data){
        try {
            $user = User::where('email', $data["email"])->first();
            if(!$user || !Hash::check($data["password"], $user->password)){
                throw new \ErrorException('Invalid Credentials.');
            }
            
            $token = $user->createToken('manp-token')->plainTextToken;
            $refreshToken = $user->createToken('refresh_token')->plainTextToken;// Set refresh token in HttpOnly cookie
            $result = null;
            if(isset($user->email_verified_at)){
                $result = (object)[
                    "first_name" => $user->first_name, 
                    "middle_name" => $user->middle_name, 
                    "last_name" => $user->last_name, 
                    "suffix" => $user->suffix, 
                    "full_name" => $user->full_name, 
                    "email" => $user->email, 
                    "role" => $user->role, 
                    "token" => $token,
                    "refreshToken" => $refreshToken,
                    "verified" => true
                ];
            } else {
                $result = (object)[
                    "first_name" => $user->first_name, 
                    "middle_name" => $user->middle_name, 
                    "last_name" => $user->last_name, 
                    "suffix" => $user->suffix, 
                    "full_name" => $user->full_name, 
                    "email" => $user->email, 
                    "role" => $user->role, 
                    "verified" => false
                ];
            }
            // $result->cookie = $cookie;
            return $result;
        }catch(\Exception $ex){
            throw new \ErrorException($ex->getMessage());
        }
    }

    public function logout(array $data){}
    public function authCheck(array $data){}
    public function refreshToken(array $data){}
    public function sendVerificationEmail(){}
    public function verifyCode(){}
    public function verify($id, $hash){
        $user = User::findOrFail($id);
        if (!hash_equals(sha1($user->email), $hash)) return null;

        $token = $user->createToken("manp-token")->plainTextToken;
        $result = (object)[
            "first_name" => $user->first_name, 
            "middle_name" => $user->middle_name, 
            "last_name" => $user->last_name, 
            "suffix" => $user->suffix, 
            "full_name" => $user->full_name, 
            "email" => $user->email, 
            "role" => $user->role, 
            "token" => $token,
            "refreshToken" => ""
        ];
        // if ($user->hasVerifiedEmail())
        //     return $result;
        // Mark email as verified
        $user->markEmailAsVerified();
        $user->verified = true;
        return $result;
    }
}
