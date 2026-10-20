<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {    
        Schema::create('user_details', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('emergancyPhoneNumber',30)->nullable(); 
            $table->string('emergancyPhoneNumberName',30)->nullable(); 
            $table->string('emergancyPhoneNumberRelation',30)->nullable(); 
            $table->string('socialSecureityNumber',50)->nullable(); 
            $table->string('address',70)->nullable(); 
            $table->date('birthDate')->nullable(); 
            $table->date('hiringDate')->nullable(); 
            $table->date('contractStartDate')->nullable(); 
            $table->date('contractEndDate')->nullable(); 
            $table->string('maritalStatus',20)->nullable(); 
            $table->string('certificate',20)->nullable(); 
            $table->date('graduation_year')->nullable(); 
            $table->string('university',100)->nullable(); 
            $table->integer('need_paper')->default(1);
            $table->integer('full_information')->default(1);
            $table->integer('change_password')->default(1);
            $table->softDeletes(); // <-- This will add a deleted_at field
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_details');
    }
}
