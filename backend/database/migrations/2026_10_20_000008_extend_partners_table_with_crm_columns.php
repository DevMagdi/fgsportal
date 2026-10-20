<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ExtendPartnersTableWithCrmColumns extends Migration
{
    /**
     * The original partners migration only modelled name/address/description;
     * the CRM PartnerController additionally persists contact, industry and
     * organisation columns. Adds them when missing so account creation works
     * on a clean database.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('partners')) {
            return;
        }

        Schema::table('partners', function (Blueprint $table) {
            if (!Schema::hasColumn('partners', 'phone')) {
                $table->string('phone', 30)->nullable();
            }
            if (!Schema::hasColumn('partners', 'email')) {
                $table->string('email', 100)->nullable();
            }
            if (!Schema::hasColumn('partners', 'partner_industry_id')) {
                $table->bigInteger('partner_industry_id')->unsigned()->nullable();
            }
            if (!Schema::hasColumn('partners', 'is_org')) {
                $table->integer('is_org')->default(0);
            }
            if (!Schema::hasColumn('partners', 'country')) {
                $table->string('country', 50)->nullable();
            }
            if (!Schema::hasColumn('partners', 'website')) {
                $table->string('website')->nullable();
            }
            if (!Schema::hasColumn('partners', 'organize_type_id')) {
                $table->bigInteger('organize_type_id')->unsigned()->nullable();
            }
            if (!Schema::hasColumn('partners', 'sales_id')) {
                $table->bigInteger('sales_id')->unsigned()->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (!Schema::hasTable('partners')) {
            return;
        }

        Schema::table('partners', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'email',
                'partner_industry_id',
                'is_org',
                'country',
                'website',
                'organize_type_id',
                'sales_id',
            ]);
        });
    }
}
