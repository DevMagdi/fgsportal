<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnnualRequestAttachesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('annual_request_attaches', function (Blueprint $table) {
            $table->bigIncrements('id');
        
            $table->text('attach_name');
        

            $table->bigInteger('annual_request_id')->unsigned();
            $table->foreign('annual_request_id')->references('id')->on('annual_requests');
            
          
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
        Schema::dropIfExists('annual_request_attaches');
    }
}
