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


class AuthController extends Controller
{
    private AuthInterface $interface;

    public function __construct(AuthInterface $obj){
        $this->interface = $obj;
    }
    
    public function register(UserRegisterRequest $request)
    {
        $data =[
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => "user"
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

    public function login(LoginRequest $request)
    {
        try {
            $data =[
                'email' => $request->email,
                'password' => $request->password,
            ];
            $result = $this->interface->login($data);

            if(!$request->tokenize){
                $request->session()->regenerate();
            }
            return ApiResponseClass::sendResponse(new AuthResource($result),'Login successful.', 201);

        }catch(\Exception $ex){
            $errorData = ['email' => $request->email];
            return ApiResponseClass::sendResponse($errorData, $ex->getMessage(), 401, false);
        }
    }

    public function logout(Request $request){
        $token = $request->token;
        if (!$token) {
            throw new \ErrorException("Token not provided");
        }
        $user = Auth::user();
        if ($user) {
            Auth::logout();
            return ApiResponseClass::sendResponse([],'Logout successful.', 201);
        }
        return ApiResponseClass::sendResponse([], "Invalid token,", 401, false);
    }

    public function authCheck(Request $request){
        $checked = Auth::check();
        Log::debug($checked);
        $result = [ "authenticated" => $checked];
        if ($checked) {
            return ApiResponseClass::sendResponse($result ,'Authenticated.', 201);
        }
        return ApiResponseClass::sendResponse($result , "Failed,", 401, false);
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
