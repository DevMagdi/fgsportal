<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContractSupportsTableV2 extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('contract_supports')) {
            return;
        }

        Schema::create('contract_supports', function (Blueprint $table) {
            $table->bigIncrements('id');
        
            $table->text('notes');
        
            $table->bigInteger('user_creator_id')->unsigned();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('manager_id')->unsigned()->nullable();
            $table->foreign('manager_id')->references('id')->on('users');

            $table->bigInteger('project_manager_id')->unsigned()->nullable();
            $table->foreign('project_manager_id')->references('id')->on('users');
            
            $table->bigInteger('contract_type_id')->unsigned();
            $table->foreign('contract_type_id')->references('id')->on('contract_types');
            
 
            $table->bigInteger('partner_id')->unsigned();
            $table->foreign('partner_id')->references('id')->on('partners');

            $table->bigInteger('product_id')->unsigned();
            $table->foreign('product_id')->references('id')->on('products');

            $table->bigInteger('contract_status_id')->unsigned();
            $table->foreign('contract_status_id')->references('id')->on('contract_statuses');

            $table->date('contract_start_date',12);
            $table->date('contract_end_date',12);


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
        Schema::dropIfExists('contract_supports');
    }
}
