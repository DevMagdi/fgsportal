<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CompleteBmsBrdTables extends Migration
{
    public function up()
    {
        Schema::table('business_units', function (Blueprint $table) {
            $table->text('key_messages')->nullable()->after('services');
        });
        Schema::table('unit_tasks', function (Blueprint $table) {
            $table->date('completion_date')->nullable()->after('due_date');
        });
        Schema::create('bms_meetings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->string('title');
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->string('meeting_type')->default('internal');
            $table->string('location')->nullable();
            $table->string('status')->default('scheduled');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->index(['starts_at', 'ends_at']);
        });
        Schema::create('bms_meeting_attendees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_meeting_id')->constrained('bms_meetings')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('external_name')->nullable();
            $table->string('external_email')->nullable();
            $table->string('response')->default('pending');
            $table->string('response_token',80)->nullable()->unique();
            $table->string('delivery_status')->default('pending');
            $table->timestamp('invited_at')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_minutes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_meeting_id')->unique()->constrained('bms_meetings')->cascadeOnDelete();
            $table->text('discussion');
            $table->text('decisions')->nullable();
            $table->json('actions')->nullable();
            $table->string('linked_type')->nullable();
            $table->unsignedBigInteger('linked_id')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->index(['linked_type', 'linked_id']);
        });
        Schema::create('bms_development_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->constrained('business_units')->cascadeOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('item_type')->default('course');
            $table->string('status')->default('planned');
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_opportunity_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_opportunity_id')->constrained('bms_opportunities')->cascadeOnDelete();
            $table->string('document_type');
            $table->string('original_name');
            $table->string('file_path');
            $table->unsignedInteger('version')->default(1);
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
        });
        Schema::create('bms_pipeline_stages', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('name_ar')->nullable();
            $table->unsignedInteger('sequence')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        Schema::create('bms_leads', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('entity_type');
            $table->string('sector')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('stage')->default('identified');
            $table->string('contact_status')->default('not_contacted');
            $table->string('ecosystem_plan')->nullable();
            $table->string('lab_scenario')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('last_contacted_at')->nullable();
            $table->foreignId('converted_opportunity_id')->nullable()->constrained('bms_opportunities')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['business_unit_id', 'stage']);
        });
        Schema::create('bms_lab_study_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_lead_id')->constrained('bms_leads')->cascadeOnDelete();
            $table->string('title');
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('planned');
            $table->date('due_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_lead_interactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_lead_id')->constrained('bms_leads')->cascadeOnDelete();
            $table->string('interaction_type')->default('contact');
            $table->dateTime('happened_at');
            $table->text('outcome');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
        Schema::create('bms_hiring_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->constrained('business_units')->cascadeOnDelete();
            $table->string('job_title');
            $table->text('specification');
            $table->string('status')->default('submitted');
            $table->foreignId('requested_by')->constrained('users');
            $table->foreignId('hr_owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('first_working_day')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_hiring_request_id')->constrained('bms_hiring_requests')->cascadeOnDelete();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('cv_path')->nullable();
            $table->string('status')->default('cv_received');
            $table->dateTime('interview_at')->nullable();
            $table->text('interview_notes')->nullable();
            $table->string('interview_decision')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_onboarding_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_hiring_request_id')->constrained('bms_hiring_requests')->cascadeOnDelete();
            $table->foreignId('employee_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('department');
            $table->string('title');
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_procurement_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->string('item');
            $table->unsignedInteger('quantity');
            $table->text('purpose');
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->foreignId('requested_by')->constrained('users');
            $table->string('status')->default('submitted');
            $table->text('finance_comment')->nullable();
            $table->boolean('budget_confirmed')->default(false);
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_procurement_quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_procurement_request_id')->constrained('bms_procurement_requests')->cascadeOnDelete();
            $table->string('vendor');
            $table->decimal('amount', 15, 2);
            $table->string('currency', 10)->default('SAR');
            $table->string('original_name')->nullable();
            $table->string('file_path')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('event_type');
            $table->dateTime('event_date');
            $table->string('venue')->nullable();
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->foreignId('requested_by')->constrained('users');
            $table->string('status')->default('submitted');
            $table->text('announcement_plan')->nullable();
            $table->text('visitor_protocol')->nullable();
            $table->timestamps();
        });
        Schema::create('bms_event_checklist_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_event_id')->constrained('bms_events')->cascadeOnDelete();
            $table->string('title');
            $table->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
        Schema::create('bms_procedures', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category')->default('pr_protocol');
            $table->text('content');
            $table->boolean('is_published')->default(true);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
        Schema::create('bms_documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_key');
            $table->string('name');
            $table->string('category');
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->unsignedInteger('version')->default(1);
            $table->boolean('is_latest')->default(true);
            $table->boolean('is_published')->default(true);
            $table->string('original_name');
            $table->string('file_path');
            $table->string('mime_type')->nullable();
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
            $table->index(['document_key', 'is_latest']);
        });
        Schema::create('bms_employee_certificates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('business_unit_id')->nullable()->constrained('business_units')->nullOnDelete();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->string('original_name');
            $table->string('file_path');
            $table->foreignId('uploaded_by')->constrained('users');
            $table->timestamps();
        });
        Schema::create('bms_unit_kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_unit_id')->constrained('business_units')->cascadeOnDelete();
            $table->string('name');
            $table->decimal('target', 15, 2)->nullable();
            $table->decimal('actual', 15, 2)->default(0);
            $table->string('unit_label')->nullable();
            $table->date('period_start');
            $table->date('period_end');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
            $table->index(['business_unit_id', 'period_start', 'period_end']);
        });
        Schema::create('bms_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bms_opportunity_id')->constrained('bms_opportunities')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('alert_type');
            $table->string('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
            $table->unique(['bms_opportunity_id','user_id','alert_type'], 'bms_alert_recipient_unique');
        });
        Schema::create('bms_social_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('platform');
            $table->unsignedBigInteger('followers')->default(0);
            $table->unsignedInteger('posts')->default(0);
            $table->unsignedBigInteger('engagement')->default(0);
            $table->date('period_start');
            $table->date('period_end');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->unique(['platform', 'period_start', 'period_end'], 'bms_social_period_unique');
        });
    }

    public function down()
    {
        Schema::table('business_units', function (Blueprint $table) {
            $table->dropColumn('key_messages');
        });
        Schema::table('unit_tasks', function (Blueprint $table) {
            $table->dropColumn('completion_date');
        });
        foreach (['bms_social_metrics','bms_alerts','bms_unit_kpis','bms_employee_certificates','bms_documents','bms_procedures','bms_event_checklist_items','bms_events','bms_procurement_quotations','bms_procurement_requests','bms_onboarding_items','bms_candidates','bms_hiring_requests','bms_lead_interactions','bms_lab_study_items','bms_leads','bms_pipeline_stages','bms_opportunity_documents','bms_development_items','bms_minutes','bms_meeting_attendees','bms_meetings'] as $table) {
            Schema::dropIfExists($table);
        }
    }
}
