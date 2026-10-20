<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactLeadLookupTables extends Migration
{
    /**
     * CRM lookups for leads: statuses, sub-statuses, lead types and cost
     * types. These tables had no migrations and only existed in deployed
     * databases.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('contact_lead_statuses')) {
            Schema::create('contact_lead_statuses', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('contact_status_name', 100);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_sub_statuses')) {
            Schema::create('contact_lead_sub_statuses', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('contact_sub_status_name', 100);
                $table->bigInteger('contact_status_id')->unsigned();
                $table->foreign('contact_status_id')->references('id')->on('contact_lead_statuses');
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_types')) {
            Schema::create('contact_lead_types', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('lead_type_name', 100);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_cost_types')) {
            Schema::create('contact_lead_cost_types', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('lead_cost_type', 100);
                $table->string('type', 50)->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('contact_lead_cost_types');
        Schema::dropIfExists('contact_lead_types');
        Schema::dropIfExists('contact_lead_sub_statuses');
        Schema::dropIfExists('contact_lead_statuses');
    }
}
