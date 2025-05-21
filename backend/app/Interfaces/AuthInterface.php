<?php

namespace App\Interfaces;

interface AuthInterface
{
    public function index();
    public function register(array $data);
    public function login(array $data);
    public function logout(array $data);
    public function authCheck();
}
