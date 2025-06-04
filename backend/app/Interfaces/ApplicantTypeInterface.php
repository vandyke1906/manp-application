<?php

namespace App\Interfaces;

interface ApplicantTypeInterface
{
    public function index();
	public function getById($id);
	public function getByIds(array $id);
	public function store(array $data);
	public function update(array $data,$id);
    public function delete($id);
}
