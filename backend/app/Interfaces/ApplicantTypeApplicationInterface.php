<?php

namespace App\Interfaces;

interface ApplicantTypeApplicationInterface
{	
    public function index();
	public function getById($id);
	public function getByApplicationId($id);
	public function store(array $data);
	public function update(array $data,$id);
    public function delete($id);
}
