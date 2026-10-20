<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePartnerIndustriesTable extends Migration
{
    /**
     * CRM lookup table (PartnerIndustry model) that predated the tracked
     * migrations and only existed in deployed databases.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('partner_industries')) {
            return;
        }

        Schema::create('partner_industries', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('partner_industry_name', 100)->unique();
            $table->softDeletes();
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
        Schema::dropIfExists('partner_industries');
    }
}
