<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    // Login 
    public function Login(Request $request) 
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ])

        $user = User::where('email', $request->email)->first();

        if (!$user || Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        // Create token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role
            ],
            'token' => $token
        ]);
    }

    // Logout User Functionality    
    public function Logout(Request $request) {
        $request->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // Get Current Authenticated User
    public function me(Request $request) {
        return response()->json($request->user());
    }

}
