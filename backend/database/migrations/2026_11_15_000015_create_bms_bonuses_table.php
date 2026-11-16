<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBmsBonusesTable extends Migration
{
    public function up(): void
    {
        Schema::create('bms_bonuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('users');
            $table->foreignId('business_unit_id')->constrained('business_units');
            $table->string('title', 200);
            $table->decimal('amount', 15, 2);
            $table->string('currency', 10);
            $table->date('awarded_on');
            $table->string('status', 20)->default('draft');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['business_unit_id', 'awarded_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bms_bonuses');
    }
}
