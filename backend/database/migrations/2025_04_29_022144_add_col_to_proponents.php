<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\BusinessType;
use App\Models\Zoning;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('proponents', function (Blueprint $table) {
            $table->foreignIdFor(BusinessType::class);
            $table->foreignIdFor(Zoning::class);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('proponents', function (Blueprint $table) {
            //
        });
    }
};
