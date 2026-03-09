<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('company_profiles')->cascadeOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('duration')->nullable();
            $table->string('city')->nullable();
            $table->boolean('remote')->default(false);
            $table->enum('type', ['stage', 'alternance', 'emploi'])->default('stage');
            $table->enum('level_required', ['bac', 'bac+1', 'bac+2', 'bac+3', 'bac+4', 'bac+5', 'bac+8'])->nullable();
            $table->json('languages')->nullable();
            $table->enum('status', ['active', 'paused', 'expired', 'filled'])->default('active');
            $table->boolean('is_premium')->default(false);
            $table->date('expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
