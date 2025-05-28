<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

use App\Models\BusinessNature;
use App\Models\ApplicantType;
use App\Models\BusinessStatus;
use App\Models\Capitalization;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->foreignIdFor(User::class);
            $table->string('business_name');
            $table->foreignIdFor(BusinessNature::class);
            $table->foreignIdFor(ApplicantType::class);
            $table->longText('business_address');
            $table->foreignIdFor(BusinessStatus::class);
            $table->foreignIdFor(Capitalization::class);
            $table->string('status')->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
