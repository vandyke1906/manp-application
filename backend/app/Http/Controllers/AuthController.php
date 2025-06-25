<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\UserRegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Classes\ApiResponseClass;
use App\Interfaces\AuthInterface;
use App\Http\Resources\AuthResource;
use App\Http\Resources\RegistrationResource;
use App\Constants\Roles;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationEmail;
use App\Jobs\SendVerificationLink;


class AuthController extends Controller
{
    private AuthInterface $interface;

    public function __construct(AuthInterface $obj){
        $this->interface = $obj;
    }
    
    public function register(UserRegisterRequest $request)
    {
        $role = Roles::PROPONENTS;
        $data =[
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'suffix' => $request->suffix,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $role
        ];
        DB::beginTransaction();
        try{
            $obj = $this->interface->register($data);
            DB::commit();
            return ApiResponseClass::sendResponse(new RegistrationResource($obj),'User registered successfully.',201);
        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
        }
    }

    public function loginSession(LoginRequest $request)
    {
        try {
            $data = [
                'email' => $request->email,
                'password' => $request->password,
            ];
            
            $result = $this->interface->login($data);

            return ApiResponseClass::sendResponse(
                new AuthResource($result),
                $result->verified ? 'Login successful.' : 'Required verification.',
                $result->verified ? 200 : 201
            );
        } catch (\Exception $ex) {
            $errorData = ['email' => $request->email];
            return ApiResponseClass::sendResponse($errorData, $ex->getMessage(), 401, false);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data =[
                'email' => $request->email,
                'password' => $request->password,
            ];
            $result = $this->interface->login($data);
            // $cookie = null;
            // if(isset($result->refreshToken))
            //     $cookie = cookie('refresh_token', $result->refreshToken, 60 * 24 * 7, '/', null, true, true); // Secure HttpOnly cookie
            if($result->verified){
                return ApiResponseClass::sendResponse(new AuthResource($result),'Login successful.', 200);
            } else {
                return ApiResponseClass::sendResponse(new AuthResource($result),'Required verification.', 201);
            }

        }catch(\Exception $ex){
            $errorData = ['email' => $request->email];
            return ApiResponseClass::sendResponse($errorData, $ex->getMessage(), 401, false);
        }
    }

    public function logout(Request $request){
       $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();

            return ApiResponseClass::sendResponse([], 'Logout successful.', 200);
        }
        return ApiResponseClass::sendResponse([], 'Failed to logout.', 401, false);
    }


    public function authCheck(Request $request){
        $user = $request->user();
        $result = null;
        if ($user) {
            if(isset($user->email_verified_at)){
                $result = (object)[
                    "first_name" => $user->first_name, 
                    "middle_name" => $user->middle_name, 
                    "last_name" => $user->last_name, 
                    "suffix" => $user->suffix, 
                    "full_name" => $user->full_name, 
                    "mobile" => $user->mobile, 
                    "suffix" => $user->suffix, 
                    "suffix" => $user->suffix, 
                    "suffix" => $user->suffix, 
                    "email" => $user->email, 
                    "role" => $user->role, 
                    "token" => $request->bearerToken(),
                    "verified" => true
                ];
            } else {
                $result = (object)[
                    "first_name" => $user->first_name, 
                    "middle_name" => $user->middle_name, 
                    "last_name" => $user->last_name, 
                    "suffix" => $user->suffix, 
                    "email" => $user->email, 
                    "role" => $user->role, 
                    "verified" => false
                ];
            }
            return ApiResponseClass::sendResponse($result, 'Authenticated.', 200);
        } else {
            return ApiResponseClass::sendResponse($result, 'Invalid token or unauthorized.', 401, false);
        }
    }

    public function refreshToken(Request $request)
    {
        $user = $request->user();
        if ($user) {
            $user->currentAccessToken()->delete();
            $newToken = $user->createToken('manp-token')->plainTextToken;
            if($newToken)
                return ApiResponseClass::sendResponse($newToken, 'Authenticated.', 200);
        }
        return ApiResponseClass::sendResponse([], 'Unauthorized Access.', 401, false);
    }



    public function sendVerificationEmail(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return ApiResponseClass::sendResponse([], 'User not found', 404, false);
        }
        $verification_code = Str::random(6);
        $user->update(['verification_code' => $verification_code]);
        Mail::to($user->email)->send(new VerificationEmail($verification_code));
        return ApiResponseClass::sendResponse([], 'Verification email sent.', 200);
    }

    public function sendVerificationLink(Request $request)
    {
        $user = User::where('email', $request->email)->first();
        // $user = User::where('email', $request->email)->whereNull('email_verified_at')->first();
        if (!$user) {
            return ApiResponseClass::sendResponse([], 'User not found.', 200, false);
        }
        if(is_null($user->email_verified_at)){
        dispatch(new SendVerificationLink($user->email, $user));
        return ApiResponseClass::sendResponse([], 'Verification link sent. Please check your email', 200);
        }
        return ApiResponseClass::sendResponse([], 'User already verified. Continue sign in.', 200);
    }

    public function verify(Request $request, $id, $hash)
    {
        $result = $this->interface->verify($id, $hash);
        if(!$result)
            return ApiResponseClass::sendResponse([], 'Invalid verification link.', 403);
        return ApiResponseClass::sendResponse($result, 'Email verified successfully.', 200);
    }


    public function verifyCode(Request $request)
    {        
        $user = User::where('email', $request->email)->first();
        if ($user) {
            if (trim($user->verification_code) === trim($request->verification_code)) {
                $user->update(['email_verified_at' => now(), 'verification_code' => null]);
                return response()->json(['success' => true, 'message' => 'Verification successful']);
            } else {
                return response()->json(['success' => false, 'message' => 'Invalid code'], 400);
            }
        }
        return response()->json(['success' => false, 'message' => 'Invalid Email.'], 400);
    }

    public function index()
    {
        return response()->json($this->interface->index());
    }
    
    public function profile(Request $request){
        $user = $request->user()->only(['first_name', 'middle_name', 'last_name', 'suffix','mobile_number', 'email','telephone_number', 'address']);
        if (!$user)
            return ApiResponseClass::sendResponse([], 'User not found', 404, false);
        return ApiResponseClass::sendResponse($user, 'Success', 200);
    }
    public function sendResetPassword(Request $request){
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $this->interface->sendResetPassword($request->email);
            return response()->json(['success' => true, 'message' => 'Reset password link sent!']);
        }
        return response()->json(['success' => false, 'message' => 'Invalid Email.'], 400);
    }
    public function resetPassword(Request $request, $email, $hash){
        if (!$request->hasValidSignature()) {
            return response()->json(['message' => 'Invalid or expired link.'], 403);
        }
        $request->validate(['password' => 'required|string|min:8|confirmed']);
        
        $result = $this->interface->resetPassword($email, $hash, $request->password);
        if($result)
            return ApiResponseClass::sendResponse([], 'Password updated!', 200);
        return ApiResponseClass::sendResponse([], 'Invalid token.', 403);

    }
    public function store(Request $request){}
    public function show(string $id){}
    public function edit(string $id){}
    public function update(Request $request, string $id){}
    public function destroy(string $id){}
}
