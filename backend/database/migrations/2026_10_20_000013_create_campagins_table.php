<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reconstructed migration for the legacy `campagins` table (the misspelling
 * is intentional — it matches App\Models\Campagin::$table). Contact leads
 * reference campaigns through contact_leads.campagin_id and the lead API
 * casts the campaign name into every response, so the table must exist on
 * fresh installs. Columns mirror the model's $fillable; lookups whose tables
 * are still legacy-only (ads_platform_id, branches_id, campagin_status_id)
 * stay as plain columns without foreign keys.
 */
class CreateCampaginsTable extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('campagins')) {
            return;
        }

        Schema::create('campagins', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('product_id')->nullable();
            $table->unsignedBigInteger('ads_platform_id')->nullable();
            $table->string('campagin_name', 100);
            $table->string('campagin_title', 150)->nullable();
            $table->unsignedBigInteger('user_creator_id')->nullable();
            $table->text('campagin_description')->nullable();
            $table->decimal('campagin_cost', 12, 2)->nullable();
            $table->unsignedBigInteger('branches_id')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->unsignedBigInteger('campagin_status_id')->nullable();
            $table->decimal('campagin_expected', 12, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
            $table->foreign('user_creator_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('campagins');
    }
}
