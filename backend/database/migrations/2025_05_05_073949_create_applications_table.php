<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use App\Models\User;
use App\Models\ApplicationType;
use App\Models\BusinessNature;
use App\Models\ApplicantType;
use App\Models\BusinessStatus;
use App\Models\Capitalization;
use App\Models\BusinessType;
use App\Models\Zoning;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->date('application_date');
            $table->string('first_name');
            $table->string('middle_name');
            $table->string('last_name');
            $table->string('suffix')->nullable();
            $table->string('email_address');
            $table->string('contact_number');
            $table->string('address');
            $table->foreignIdFor(ApplicationType::class);
            $table->string('application_number')->unique();
            $table->foreignIdFor(User::class);
            $table->string('business_name');
            $table->longText('business_address');
            $table->longText('business_description');
            $table->foreignIdFor(BusinessNature::class);
            $table->foreignIdFor(BusinessStatus::class);
            $table->foreignIdFor(Capitalization::class);
            $table->foreignIdFor(BusinessType::class)->nullable();
            $table->foreignIdFor(Zoning::class)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('applications');
    }
};
