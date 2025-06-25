<?php

namespace App\Http\Controllers;

use App\Models\ApplicationFiles;
use Illuminate\Http\Request;
use App\Http\Requests\Storeapplication_filesRequest;
use App\Http\Requests\Updateapplication_filesRequest;

use App\Classes\ApiResponseClass;
use App\Interfaces\ApplicationFilesInterface;
use \Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ApplicationFilesController extends Controller
{
    private ApplicationFilesInterface $interface;

    public function __construct(ApplicationFilesInterface $obj){
        $this->interface = $obj;

    }

    public function index(){ }
    public function create(){ }
    public function store(Storeapplication_filesRequest $request){ }
    public function show($id, Request $request) { }
    public function edit($id, Request $request) { }
    
    public function update(Updateapplication_filesRequest $request, $id)
    {
        $key = collect($request->allFiles())->keys()->first();
        $file = $request->file($key);

        if (!$file || !$file->isValid()) {
            return ApiResponseClass::sendResponse([], 'No valid file uploaded.', 422, false);
        }

        if ($file instanceof UploadedFile && !$file->getError()) {
            $mimeType = $file->getClientMimeType();
            $folder_business = Str::slug($request->business_name);
            $extension = $file->getClientOriginalExtension();
            $fileName = "{$key}.{$extension}";
            $filePath = $file->storeAs("application_files/{$folder_business}", $fileName);
            $data_file = [
                'file_name' => $fileName,
                'file_size' => $file->getSize(),
                'file_type' => $mimeType,
                'file_path' => $filePath,
            ];
            $this->interface->update($data_file, $id);
            return ApiResponseClass::sendResponse([],'Application file updated.',201);
        } else {
            Log::warning("Error uploading $key");
            return ApiResponseClass::sendResponse([], 'Upload Failed',500, false);
        }
    }
    public function destroy($id, Request $request){ }
}
