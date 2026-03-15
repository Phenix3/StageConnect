<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('saved_offers', function (Blueprint $table) {
            $table->foreignId('student_id')->constrained('student_profiles')->cascadeOnDelete();
            $table->foreignId('offer_id')->constrained('offers')->cascadeOnDelete();
            $table->timestamp('created_at')->useCurrent();

            $table->primary(['student_id', 'offer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_offers');
    }
};
