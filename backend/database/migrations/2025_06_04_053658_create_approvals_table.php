<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Application;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Application::class)->constrained()->onDelete('cascade');
            $table->foreignIdFor(User::class)->nullable()->constrained()->nullOnDelete();
            $table->unsignedInteger('approving_role');
            $table->text('comment')->nullable(); 
            $table->enum('status', ['pending', 'approved', 'rejected', 'in_review', 'completed'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approvals');
    }
};
