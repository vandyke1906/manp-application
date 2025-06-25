<?php

namespace App\Interfaces;

interface AuthInterface
{
    public function index();
    public function register(array $data);
    public function login(array $data);
    public function logout(array $data);
    public function authCheck(array $data);
    public function refreshToken(array $data);
    public function sendVerificationEmail();
    public function verifyCode();
    public function verify($id, $hash);
    public function sendResetPassword($email);
    public function resetPassword($email, $hash, $password);
}
