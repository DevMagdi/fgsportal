<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBmsPhaseOneTables extends Migration
{
    public function up()
    {
        Schema::create('business_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->json('services')->nullable();
            $table->foreignId('director_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('business_unit_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['business_unit_id', 'user_id']);
        });

        Schema::create('bms_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->json('abilities');
            $table->timestamps();
        });

        Schema::create('bms_role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('business_unit_id')->nullable()->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['bms_role_id', 'user_id', 'business_unit_id'], 'bms_role_user_unique');
        });

        Schema::create('weekly_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnDelete();
            $table->date('week_start');
            $table->text('objectives')->nullable();
            $table->text('next_week_plan')->nullable();
            $table->string('status')->default('draft');
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('submitted_by')->nullable()->constrained('users');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->unique(['business_unit_id', 'week_start']);
        });

        Schema::create('unit_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weekly_plan_id')->constrained()->cascadeOnDelete();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('in_progress');
            $table->unsignedTinyInteger('progress')->default(0);
            $table->text('blockers')->nullable();
            $table->date('due_date')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        Schema::create('support_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weekly_plan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained('departments')->cascadeOnDelete();
            $table->foreignId('requested_by')->constrained('users');
            $table->string('title');
            $table->text('details');
            $table->string('status')->default('pending');
            $table->text('response')->nullable();
            $table->foreignId('responded_by')->nullable()->constrained('users');
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });

        Schema::create('bms_opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('title');
            $table->string('client_name');
            $table->string('type')->default('opportunity');
            $table->foreignId('business_unit_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('contact_lead_id')->nullable()->constrained('contact_leads')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->string('stage')->default('qualification');
            $table->decimal('value', 15, 2)->nullable();
            $table->string('currency', 10)->default('EGP');
            $table->date('submission_date')->nullable();
            $table->date('expected_close_date')->nullable();
            $table->timestamp('last_update_at');
            $table->string('go_no_go')->default('pending');
            $table->text('decision_reason')->nullable();
            $table->foreignId('decided_by')->nullable()->constrained('users');
            $table->timestamp('decided_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['stage', 'last_update_at']);
        });

        Schema::create('bms_opportunity_stage_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_opportunity_id')->constrained()->cascadeOnDelete();
            $table->string('from_stage')->nullable();
            $table->string('to_stage');
            $table->text('note')->nullable();
            $table->foreignId('changed_by')->constrained('users');
            $table->timestamps();
        });

        Schema::create('product_business_unit', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('business_unit_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['product_id', 'business_unit_id']);
        });

        Schema::create('product_phases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('sequence')->default(1);
            $table->string('status')->default('not_started');
            $table->text('blockers')->nullable();
            $table->text('data_needs')->nullable();
            $table->text('support_needs')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->unique(['product_id', 'sequence']);
        });

        Schema::create('bms_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('auditable_type');
            $table->unsignedBigInteger('auditable_id');
            $table->string('event');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->text('reason')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
            $table->index(['auditable_type', 'auditable_id']);
        });
    }

    public function down()
    {
        foreach ([
            'bms_audit_logs', 'product_phases', 'product_business_unit',
            'bms_opportunity_stage_histories', 'bms_opportunities', 'support_requests',
            'unit_tasks', 'weekly_plans', 'bms_role_user', 'bms_roles',
            'business_unit_user', 'business_units',
        ] as $table) {
            Schema::dropIfExists($table);
        }
    }
}
