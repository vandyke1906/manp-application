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
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => $role
        ];
        DB::beginTransaction();
        try{
            $obj = $this->interface->register($data);
            Log::debug($obj);
            DB::commit();
            return ApiResponseClass::sendResponse(new RegistrationResource($obj),'User registered successfully.',201);
        }catch(\Exception $ex){
            return ApiResponseClass::rollback($ex);
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
       Log::debug($request);
       $user = $request->user(); // Get the authenticated user via token
       Log::debug($user);
        if ($user) {
            $user->tokens()->delete(); // Revoke all tokens for the user

            return ApiResponseClass::sendResponse([], 'Logout successful.', 200);
        }
        return ApiResponseClass::sendResponse([], 'Failed to logout.', 401, false);
    }


    public function authCheck(Request $request)
    {
        $user = $request->user(); // Get the authenticated user via Sanctum token
        $result = ["authenticated" => (bool) $user, "verified" => $user->verified ];
        if ($user) {
            return ApiResponseClass::sendResponse($result, 'Authenticated.', 200);
        }
        return ApiResponseClass::sendResponse($result, 'Failed.', 401, false);
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


    // public function login(LoginRequest $request)
    // {
    //     try {
    //         $user = User::where('email', $request->email)->first();
    //         if(!$user || !Hash::check($request->password, $user->password)){
    //             throw new \ErrorException('Invalid Credentials.');
    //         }

    //         $token = $user->createToken('manp')->plainTextToken;
    //         $data = [ 'user' => $user, 'token' => $token];
    //         return ApiResponseClass::sendResponse(new AuthResource($data),'Login successful.', 201);

    //     }catch(\Exception $ex){
    //         $errorData = ['email' => $request->email, 'message' =>  $ex->getMessage()];
    //         return ApiResponseClass::sendResponse($errorData,'Login successful.', 401, false);
    //     }
    // }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->interface->index());
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function register(Request $request)
    // {
    //     $fields = $request->validate([
    //         'name' => 'required|string',
    //         'email' => 'required|string|unique:users,email',
    //         'password' => 'required|string',
    //     ]);
    //     $user = User::create([
    //         'name' => $fields['name'],
    //         'email' => $fields['email'],
    //         'password' => bcrypt($fields['password']),
    //     ]);
    //     $token = $user->createToken('manp')->plainTextToken;
    //     $response = [ 'user' => $user, 'token' => $token ];
    //     return response($response, 201);
    // }

    // public function login(Request $request){
    //     $fields = $request->validate([
    //         'email' => 'required|string|unique:users,email',
    //         'password' => 'required|string',
    //     ]);

    //     $user = User::where('email', $fields['email'])->first();
    //     if(!$user || !Hash::check($fields['password'], $user->password)){
    //         return response(['message' => 'Bad Credentials', 401]);
    //     }

    //     $token = $user->createToken('manp')->plainTextToken;
    //     $response = [
    //         'success' => true,
    //         'message' => 'Login successful.',
    //         'token' => $token,
    //         'user' => $user,
    //     ];
    //     return response($response, 201);

    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
