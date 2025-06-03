<?php

namespace App\Interfaces;

interface ApplicationFilesInterface
{
    public function index();
	public function getById($id);
	public function getByApplicationId($id);
	public function getByApplicationAppIdAndName($appId, $name);
	public function store(array $data);
	public function update(array $data,$id);
    public function delete($id);
}
