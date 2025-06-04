<?php

namespace App\Repositories;
use App\Models\Comment;
use App\Interfaces\CommentInterface;

class CommentRepository implements CommentInterface
{
    public function __construct(){}
    

    public function index(){
        return Comment::all();
    }

    public function getById($id){
       return Comment::findOrFail($id);
    }

    public function getByApplicationId($id){
       return Comment::where('application_id',$id)->get();
    }

    public function store(array $data){
       return Comment::create($data);
    }

    public function update(array $data,$id){
       return Comment::whereId($id)->update($data);
    }
    
    public function delete($id){
       Comment::destroy($id);
    }
}
