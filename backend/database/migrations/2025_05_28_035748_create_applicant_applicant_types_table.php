<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\Application;
use App\Models\ApplicantType;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applicant_type_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Application::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(ApplicantType::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applicant_type_applications');
    }
};
