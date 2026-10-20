<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContactLeadsTable extends Migration
{
    /**
     * Leads/deals built on top of contacts (ContactLead model). Columns
     * derived from the model fillable and ContactLeadController writes.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('contact_leads')) {
            return;
        }

        Schema::create('contact_leads', function (Blueprint $table) {
            $table->bigIncrements('id');

            // campagin_id has no FK: the campagins table is part of the legacy
            // schema without a migration; the controller defaults it to 1.
            $table->bigInteger('campagin_id')->nullable();
            $table->bigInteger('sales_id')->unsigned()->nullable();
            $table->foreign('sales_id')->references('id')->on('users');
            $table->bigInteger('user_creator_id')->unsigned()->nullable();
            $table->foreign('user_creator_id')->references('id')->on('users');

            $table->bigInteger('lead_sub_status_id')->unsigned()->nullable();
            $table->foreign('lead_sub_status_id')->references('id')->on('contact_lead_sub_statuses');
            $table->bigInteger('lead_type_id')->unsigned()->nullable();
            $table->foreign('lead_type_id')->references('id')->on('contact_lead_types');
            $table->bigInteger('product_id')->unsigned()->nullable();
            $table->foreign('product_id')->references('id')->on('products');
            $table->bigInteger('contact_id')->unsigned()->nullable();
            $table->foreign('contact_id')->references('id')->on('contacts');

            $table->string('label', 100)->nullable();
            $table->decimal('cost', 12, 2)->nullable();
            $table->integer('seen')->default(0);
            $table->boolean('isLead')->default(false);
            $table->boolean('transfer')->default(false);
            $table->date('expected_close_date')->nullable();
            $table->date('actual_closing_date')->nullable();
            $table->text('notes')->nullable();
            $table->string('title', 150)->nullable();
            $table->string('currency', 10)->nullable();

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
        Schema::dropIfExists('contact_leads');
    }
}
