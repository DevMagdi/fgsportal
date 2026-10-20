<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizationTypesTable extends Migration
{
    /**
     * CRM lookup table (OrganizationType model) used by partner accounts.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('organization_types')) {
            return;
        }

        Schema::create('organization_types', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('organize_type', 100);
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
        Schema::dropIfExists('organization_types');
    }
}
