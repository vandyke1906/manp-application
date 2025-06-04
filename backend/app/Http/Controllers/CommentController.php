<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;

use Illuminate\Support\Facades\DB;
use App\Classes\ApiResponseClass;
use App\Interfaces\CommentInterface;
use App\Http\Resources\CommentResource;

class CommentController extends Controller
{
    private CommentInterface $interface;

    public function __construct(CommentInterface $obj){
        $this->interface = $obj;
    }
    
    public function getByApplicationId($id){

    }

    public function index()
    {
        //
    }

    public function create()
    {
        //
    }

    public function store(StoreCommentRequest $request)
    {
        //
    }

    public function show(Comment $comment)
    {
        //
    }

    public function edit(Comment $comment)
    {
        //
    }

    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        //
    }

    public function destroy(Comment $comment)
    {
        //
    }
}
