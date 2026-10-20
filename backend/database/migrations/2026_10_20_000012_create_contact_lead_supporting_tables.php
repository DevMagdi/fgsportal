<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactLeadSupportingTables extends Migration
{
    /**
     * Supporting CRM tables: activities, attachments, costs and duplicate
     * markers for leads. None of them had tracked migrations historically.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('contact_lead_activities')) {
            Schema::create('contact_lead_activities', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->bigInteger('sales_id')->unsigned()->nullable();
                $table->foreign('sales_id')->references('id')->on('users');
                $table->bigInteger('contact_lead_id')->unsigned()->nullable();
                $table->foreign('contact_lead_id')->references('id')->on('contact_leads');
                $table->bigInteger('lead_sub_status_id')->unsigned()->nullable();
                // activity_type_id / activity_status_id reference lookup tables
                // without tracked migrations; kept as plain columns.
                $table->bigInteger('activity_type_id')->nullable();
                $table->bigInteger('activity_status_id')->nullable();
                $table->text('comment')->nullable();
                $table->dateTime('from_date')->nullable();
                $table->dateTime('to_date')->nullable();
                $table->string('visibility', 30)->nullable();
                $table->dateTime('activity_start_date')->nullable();
                $table->dateTime('activity_end_date')->nullable();
                $table->string('duration', 30)->nullable();
                $table->text('description')->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_attaches')) {
            Schema::create('contact_lead_attaches', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('contact_lead_attach', 191);
                $table->bigInteger('contact_lead_id')->unsigned()->nullable();
                $table->foreign('contact_lead_id')->references('id')->on('contact_leads');
                $table->bigInteger('user_creator_id')->unsigned()->nullable();
                $table->foreign('user_creator_id')->references('id')->on('users');
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_costs')) {
            Schema::create('contact_lead_costs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->bigInteger('lead_cost_type_id')->unsigned()->nullable();
                $table->foreign('lead_cost_type_id')->references('id')->on('contact_lead_cost_types');
                $table->bigInteger('contact_lead_id')->unsigned()->nullable();
                $table->foreign('contact_lead_id')->references('id')->on('contact_leads');
                $table->decimal('cost', 12, 2)->nullable();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('contact_lead_dublicates')) {
            Schema::create('contact_lead_dublicates', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->bigInteger('campagin_id')->nullable();
                $table->bigInteger('contact_id')->unsigned()->nullable();
                $table->foreign('contact_id')->references('id')->on('contacts');
                $table->bigInteger('branches_id')->nullable();
                $table->bigInteger('user_creator_id')->unsigned()->nullable();
                $table->foreign('user_creator_id')->references('id')->on('users');
                $table->bigInteger('partner_id')->unsigned()->nullable();
                $table->foreign('partner_id')->references('id')->on('partners');
                $table->text('notes')->nullable();
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
        Schema::dropIfExists('contact_lead_dublicates');
        Schema::dropIfExists('contact_lead_costs');
        Schema::dropIfExists('contact_lead_attaches');
        Schema::dropIfExists('contact_lead_activities');
    }
}
