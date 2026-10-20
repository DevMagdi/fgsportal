<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBranchDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('branch_details', function (Blueprint $table) {
            $table->bigIncrements('id');
          
            $table->text('branch_description')->nullable();
            $table->double('branch_lat')->nullable();
            $table->double('branch_lng')->nullable();
            $table->string('branch_address',60); 
            $table->string('branch_email',50); 
            $table->text('branch_phone'); 
  
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
        Schema::dropIfExists('branch_details');
    }
}
