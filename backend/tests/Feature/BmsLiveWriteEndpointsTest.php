<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\Bonus;
use App\Models\BMS\BrandDocument;
use App\Models\BMS\BusinessUnit;
use App\Models\BMS\Candidate;
use App\Models\BMS\DevelopmentItem;
use App\Models\BMS\HiringRequest;
use App\Models\BMS\Lead;
use App\Models\BMS\Opportunity;
use App\Models\BMS\PrEvent;
use App\Models\BMS\Procedure;
use App\Models\BMS\ProcurementRequest;
use App\Models\BMS\SupportRequest;
use App\Models\BMS\UnitTask;
use App\Models\BMS\WeeklyPlan;
use App\Models\User;
use App\Services\BMS\BmsAudit;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\BmsTestCase;

class BmsLiveWriteEndpointsTest extends BmsTestCase
{
    private function actor(array $abilities, array $unitIds = []): User
    {
        $actor = $this->makeUser();
        $role = BmsRole::create(['name' => 'Test permissions', 'slug' => 'test-'.Str::random(20), 'abilities' => $abilities]);
        $actor->bmsRoles()->attach($role->id, ['business_unit_id' => null]);
        if ($unitIds) $actor->businessUnits()->attach($unitIds);
        return $actor;
    }

    private function member(BusinessUnit $unit, array $attributes = []): User
    {
        $employee = $this->makeUser($attributes);
        $employee->businessUnits()->attach($unit->id);
        return $employee;
    }

    private function bonusData(BusinessUnit $unit, User $employee): array
    {
        return [
            'employee_id' => $employee->id, 'business_unit_id' => $unit->id, 'title' => 'Outstanding work',
            'amount' => 1250.50, 'currency' => 'SAR', 'awarded_on' => '2026-11-15', 'status' => 'draft', 'notes' => 'Project award',
        ];
    }

    private function opportunity(BusinessUnit $unit, User $owner): Opportunity
    {
        return Opportunity::create([
            'reference' => 'TEST-'.Str::random(12), 'title' => 'Opportunity', 'client_name' => 'Customer',
            'business_unit_id' => $unit->id, 'owner_id' => $owner->id, 'created_by' => $owner->id,
            'stage' => 'review', 'last_update_at' => now(),
        ]);
    }

    private function plan(BusinessUnit $unit, User $owner, string $week, string $status = 'draft'): WeeklyPlan
    {
        return WeeklyPlan::create(['business_unit_id' => $unit->id, 'week_start' => $week, 'created_by' => $owner->id, 'status' => $status]);
    }

    private function task(WeeklyPlan $plan, User $owner): UnitTask
    {
        return UnitTask::create(['weekly_plan_id' => $plan->id, 'business_unit_id' => $plan->business_unit_id, 'owner_id' => $owner->id, 'title' => 'Task']);
    }

    private function document(BusinessUnit $unit, User $owner, string $key, int $version, bool $latest): BrandDocument
    {
        $path = 'bms/documents/'.$key.'-'.$version.'.pdf';
        Storage::disk('local')->put($path, '%PDF-1.4');
        return BrandDocument::create([
            'document_key' => $key, 'name' => 'Document '.$version, 'category' => 'Guide', 'business_unit_id' => $unit->id,
            'version' => $version, 'is_latest' => $latest, 'is_published' => true,
            'original_name' => 'file.pdf', 'file_path' => $path, 'uploaded_by' => $owner->id,
        ]);
    }

    public function test_bonus_contract_crud_validation_and_unit_scope(): void
    {
        $a = $this->makeUnit();
        $b = $this->makeUnit();
        $employeeA = $this->member($a, ['firstname' => 'Amina', 'lastname' => 'Ali']);
        $employeeB = $this->member($b);
        $managerA = $this->actor(['bonuses.view', 'bonuses.manage'], [$a->id]);
        $readerA = $this->actor(['bonuses.view'], [$a->id]);
        $hr = $this->actingAsRole('hr');

        $created = $this->postBms('bonuses', $this->bonusData($a, $employeeA), $managerA)
            ->assertCreated()->assertJsonPath('status', 201)->assertJsonPath('data.employee.name', 'Amina Ali')
            ->assertJsonPath('data.unit.id', $a->id)->assertJsonPath('data.awarded_on', '2026-11-15');
        $id = $created->json('data.id');
        $this->assertIsFloat($created->json('data.amount'));
        $this->assertSame(1250.5, $created->json('data.amount'));
        $otherId = $this->postBms('bonuses', $this->bonusData($b, $employeeB), $hr)->assertCreated()->json('data.id');

        $this->getBms('bonuses', $managerA)->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $id);
        $this->getBms('bonuses', $hr)->assertOk()->assertJsonCount(2, 'data');
        $this->postBms('bonuses', $this->bonusData($b, $employeeB), $managerA)->assertForbidden();
        $this->postBms('bonuses', $this->bonusData($a, $employeeB), $managerA)->assertForbidden();
        $this->postBms('bonuses', $this->bonusData($a, $employeeB), $hr)->assertStatus(422);
        $this->postBms('bonuses', array_merge($this->bonusData($a, $employeeA), ['amount' => -1]), $managerA)->assertStatus(422);
        $this->postBms('bonuses', array_merge($this->bonusData($a, $employeeA), ['amount' => '1.234']), $managerA)->assertStatus(422);
        $this->postBms('bonuses', array_merge($this->bonusData($a, $employeeA), ['status' => 'invalid']), $managerA)->assertStatus(422);
        $this->postBms('bonuses', $this->bonusData($a, $employeeA), $readerA)->assertForbidden();
        $this->putBms('bonuses/'.$otherId, ['title' => 'Cross-unit'], $managerA)->assertForbidden();
        $this->deleteBms('bonuses/'.$otherId, $managerA)->assertForbidden();
        $this->putBms('bonuses/'.$id, ['business_unit_id' => $b->id, 'employee_id' => $employeeB->id], $managerA)->assertForbidden();
        $this->putBms('bonuses/'.$id, ['employee_id' => $employeeB->id], $managerA)->assertForbidden();
        $this->putBms('bonuses/'.$id, ['employee_id' => $employeeB->id], $hr)->assertStatus(422);
        $this->putBms('bonuses/'.$id, ['amount' => 500, 'currency' => 'usd', 'status' => 'approved', 'notes' => 'Approved'], $managerA)
            ->assertOk()->assertJsonPath('data.currency', 'USD')->assertJsonPath('data.status', 'approved');

        // Historical awards do not become uneditable if the employee later leaves the unit.
        $employeeA->businessUnits()->detach($a->id);
        $this->putBms('bonuses/'.$id, ['employee_id' => $employeeA->id, 'business_unit_id' => $a->id, 'notes' => 'Historical'], $managerA)->assertOk();
        $this->deleteBms('bonuses/'.$id, $managerA)->assertOk()->assertJsonPath('data', null);
        $this->assertSoftDeleted('bms_bonuses', ['id' => $id]);
        $this->assertDatabaseHas('bms_audit_logs', ['auditable_type' => Bonus::class, 'auditable_id' => $id, 'event' => 'bonus.deleted']);
        $this->getBms('bonuses', $managerA)->assertOk()->assertJsonCount(0, 'data');

        $ordinaryDirectoryViewer = $this->actingAsRole('unit_director', [$a->id]);
        $this->getBms('bonuses', $ordinaryDirectoryViewer)->assertForbidden();
        $this->putBms('bonuses/'.$otherId, [], $readerA)->assertForbidden();
    }

    public function test_bonus_role_grants_are_dedicated_non_destructive_and_reversible(): void
    {
        $hr = BmsRole::where('slug', 'hr')->firstOrFail();
        $this->assertContains('bonuses.view', $hr->abilities);
        $this->assertContains('bonuses.manage', $hr->abilities);
        $this->assertNotContains('bonuses.view', BmsRole::where('slug', 'employee')->firstOrFail()->abilities);
        $this->assertNotContains('bonuses.manage', BmsRole::where('slug', 'unit_director')->firstOrFail()->abilities);

        // Simulate an existing installation where a custom HR role already had view.
        (new \AddBmsBonusAbilities())->down();
        $hr->update(['abilities' => ['custom.permission', 'bonuses.view']]);
        (new \AddBmsBonusAbilities())->up();
        (new \AddBmsBonusAbilities())->up();
        $this->assertSame(['custom.permission', 'bonuses.view', 'bonuses.manage'], $hr->fresh()->abilities);
        $this->assertSame(['bonuses.manage'], DB::table('bms_bonus_ability_grants')->pluck('ability')->all());
        (new \AddBmsBonusAbilities())->down();
        $this->assertSame(['custom.permission', 'bonuses.view'], $hr->fresh()->abilities);

        // A replacement role reusing the slug did not receive the migration grant.
        (new \AddBmsBonusAbilities())->up();
        $hr->delete();
        $replacement = BmsRole::create(['name' => 'Replacement HR', 'slug' => 'hr', 'abilities' => ['custom.new', 'bonuses.manage']]);
        (new \AddBmsBonusAbilities())->down();
        $this->assertSame(['custom.new', 'bonuses.manage'], $replacement->fresh()->abilities);
    }

    public function test_bonus_blocks_deletion_of_a_unit_with_live_awards(): void
    {
        $unit = $this->makeUnit();
        $employee = $this->member($unit);
        $admin = $this->actingAsRole('system_admin');
        $id = $this->postBms('bonuses', $this->bonusData($unit, $employee), $admin)->assertCreated()->json('data.id');
        $employee->businessUnits()->detach($unit->id);
        $this->deleteBms('units/'.$unit->id, $admin)->assertStatus(422);
        $this->deleteBms('bonuses/'.$id, $admin)->assertOk();
        $this->deleteBms('units/'.$unit->id, $admin)->assertOk();
    }

    public function test_opportunity_notes_update_and_scoped_soft_delete(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $manager = $this->actor(['opportunities.view', 'opportunities.manage'], [$a->id]);
        $otherOwner = $this->member($b);
        $item = $this->opportunity($a, $manager);
        $outside = $this->opportunity($b, $otherOwner);
        Storage::disk('local')->put('bms/opportunities/doc.pdf', 'Opportunity document');
        $document = $item->documents()->create(['document_type' => 'other', 'original_name' => 'doc.pdf', 'file_path' => 'bms/opportunities/doc.pdf', 'uploaded_by' => $manager->id]);
        $this->getBms('opportunity-documents/'.$document->id.'/download', $manager)->assertOk();
        $this->putBms('opportunities/'.$item->id, ['title' => 'Opportunity', 'client_name' => 'Customer', 'notes' => 'New notes'], $manager)
            ->assertOk()->assertJsonPath('data.notes', 'New notes')->assertJsonPath('data.title', 'Opportunity');
        $this->putBms('opportunities/'.$item->id, ['notes' => 'New notes'], $manager)->assertStatus(422);
        $this->deleteBms('opportunities/'.$outside->id, $manager)->assertForbidden();
        $this->deleteBms('opportunities/'.$item->id, $manager)->assertOk();
        $this->getBms('opportunity-documents/'.$document->id.'/download', $manager)->assertNotFound();
        $this->assertSoftDeleted('bms_opportunities', ['id' => $item->id]);
        $this->assertDatabaseHas('bms_audit_logs', ['auditable_type' => Opportunity::class, 'auditable_id' => $item->id, 'event' => 'opportunity.deleted']);
    }

    public function test_plan_and_task_deletion_obeys_scope_and_submitted_plan_lock(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $manager = $this->actor(['plans.manage', 'plans.view', 'tasks.manage'], [$a->id]);
        $outsideManager = $this->actor(['plans.manage', 'tasks.manage'], [$b->id]);
        $draft = $this->plan($a, $manager, '2026-11-08');
        $task = $this->task($draft, $manager);
        $this->deleteBms('tasks/'.$task->id, $outsideManager)->assertForbidden();
        $this->deleteBms('weekly-plans/'.$draft->id, $outsideManager)->assertForbidden();
        $this->deleteBms('tasks/'.$task->id, $manager)->assertOk();
        $this->assertDatabaseMissing('unit_tasks', ['id' => $task->id]);

        $remaining = $this->task($draft, $manager);
        $support = SupportRequest::create(['weekly_plan_id' => $draft->id, 'business_unit_id' => $a->id, 'department_id' => 2, 'requested_by' => $manager->id, 'title' => 'Help', 'details' => 'Details']);
        $this->deleteBms('weekly-plans/'.$draft->id, $manager)->assertOk();
        $this->assertDatabaseMissing('weekly_plans', ['id' => $draft->id]);
        $this->assertDatabaseMissing('unit_tasks', ['id' => $remaining->id]);
        $this->assertDatabaseHas('support_requests', ['id' => $support->id, 'weekly_plan_id' => null]);

        $submitted = $this->plan($a, $manager, '2026-11-15', 'submitted');
        $lockedTask = $this->task($submitted, $manager);
        $this->deleteBms('weekly-plans/'.$submitted->id, $manager)->assertStatus(422);
        $this->deleteBms('tasks/'.$lockedTask->id, $manager)->assertStatus(422);
        $this->assertDatabaseHas('weekly_plans', ['id' => $submitted->id]);
        $this->assertDatabaseHas('unit_tasks', ['id' => $lockedTask->id]);
        // Existing status updates remain available after submission.
        $this->putBms('tasks/'.$lockedTask->id, ['status' => 'achieved'], $manager)->assertOk();
    }

    public function test_lead_recruitment_and_development_deletes_are_scoped_and_audited(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $manager = $this->actor(['leads.manage', 'recruitment.manage', 'development.manage'], [$a->id]);
        $owner = $this->member($a); $other = $this->member($b);
        $lead = Lead::create(['name' => 'Lead A', 'entity_type' => 'private', 'business_unit_id' => $a->id, 'owner_id' => $owner->id]);
        $study = $lead->studyItems()->create(['title' => 'Research']);
        $this->putBms('lab-study-items/'.$study->id, ['title' => 'Updated research'], $manager)->assertOk();
        $outsideLead = Lead::create(['name' => 'Lead B', 'entity_type' => 'private', 'business_unit_id' => $b->id, 'owner_id' => $other->id]);
        $hiring = HiringRequest::create(['business_unit_id' => $a->id, 'job_title' => 'Engineer', 'specification' => 'Details', 'requested_by' => $owner->id]);
        $outsideHiring = HiringRequest::create(['business_unit_id' => $b->id, 'job_title' => 'Other', 'specification' => 'Details', 'requested_by' => $other->id]);
        $dev = DevelopmentItem::create(['business_unit_id' => $a->id, 'title' => 'Training']);
        $outsideDev = DevelopmentItem::create(['business_unit_id' => $b->id, 'title' => 'Other']);
        Storage::disk('local')->put('bms/cvs/test.pdf', 'CV');
        $candidate = $hiring->candidates()->create(['name' => 'Candidate', 'cv_path' => 'bms/cvs/test.pdf']);
        $onboarding = $hiring->onboarding()->create(['department' => 'HR', 'title' => 'Onboarding']);
        foreach (['leads/'.$outsideLead->id, 'recruitment/'.$outsideHiring->id, 'development-items/'.$outsideDev->id] as $uri) {
            $this->deleteBms($uri, $manager)->assertForbidden();
        }
        $this->deleteBms('leads/'.$lead->id, $manager)->assertOk();
        $this->putBms('lab-study-items/'.$study->id, ['title' => 'After deletion'], $manager)->assertNotFound();
        $this->deleteBms('recruitment/'.$hiring->id, $manager)->assertOk();
        $this->deleteBms('development-items/'.$dev->id, $manager)->assertOk();
        $this->assertSoftDeleted('bms_leads', ['id' => $lead->id]);
        $this->assertDatabaseMissing('bms_hiring_requests', ['id' => $hiring->id]);
        $this->assertDatabaseMissing('bms_candidates', ['id' => $candidate->id]);
        $this->assertDatabaseMissing('bms_onboarding_items', ['id' => $onboarding->id]);
        $this->assertDatabaseMissing('bms_development_items', ['id' => $dev->id]);
        Storage::disk('local')->assertMissing('bms/cvs/test.pdf');
        foreach (['lead.deleted', 'hiring.deleted', 'development.deleted'] as $event) $this->assertDatabaseHas('bms_audit_logs', ['event' => $event]);
    }

    public function test_procurement_updates_deletes_and_cannot_bypass_finance_review_fields(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $requester = $this->actor(['procurement.manage'], [$a->id]);
        $other = $this->actor(['procurement.manage'], [$a->id]);
        $global = $this->actingAsRole('pr_marketing');
        $item = ProcurementRequest::create(['reference' => 'PR-1', 'item' => 'Laptop', 'quantity' => 1, 'purpose' => 'Work', 'business_unit_id' => $a->id, 'requested_by' => $requester->id]);
        $outside = ProcurementRequest::create(['reference' => 'PR-2', 'item' => 'Desk', 'quantity' => 1, 'purpose' => 'Work', 'business_unit_id' => $b->id, 'requested_by' => $requester->id]);
        $this->putBms('procurement/'.$item->id, ['item' => 'Other'], $other)->assertForbidden();
        $this->deleteBms('procurement/'.$item->id, $other)->assertForbidden();
        $this->putBms('procurement/'.$outside->id, ['item' => 'Other'], $requester)->assertForbidden();
        $this->putBms('procurement/'.$item->id, ['business_unit_id' => $b->id], $requester)->assertForbidden();
        $deletedUnit = $this->makeUnit();
        $deletedUnit->delete();
        $this->putBms('procurement/'.$item->id, ['business_unit_id' => $deletedUnit->id], $requester)->assertStatus(422);
        $this->putBms('procurement/'.$item->id, ['quantity' => 0], $requester)->assertStatus(422);
        $this->putBms('procurement/'.$item->id, ['quantity' => 4294967296], $requester)->assertStatus(422);
        $this->putBms('procurement/'.$item->id, ['item' => 'Laptop Pro', 'quantity' => 2, 'purpose' => 'Project', 'status' => 'approved', 'finance_comment' => 'Forged'], $requester)
            ->assertOk()->assertJsonPath('data.item', 'Laptop Pro')->assertJsonPath('data.status', 'submitted')->assertJsonPath('data.finance_comment', null);
        $this->putBms('procurement/'.$outside->id, ['item' => 'Global edit'], $global)->assertOk();
        // An approval must not be silently reused for a different item or quantity.
        $item->update(['status' => 'approved', 'budget_confirmed' => true, 'finance_comment' => 'Approved']);
        $this->putBms('procurement/'.$item->id, ['item' => 'Different item'], $requester)->assertStatus(422);
        $this->assertDatabaseHas('bms_procurement_requests', ['id' => $item->id, 'item' => 'Laptop Pro', 'status' => 'approved']);
        Storage::disk('local')->put('bms/quotations/q.pdf', 'Quotation');
        $quote = $item->quotations()->create(['vendor' => 'Vendor', 'amount' => 100, 'file_path' => 'bms/quotations/q.pdf']);
        $this->deleteBms('procurement/'.$item->id, $requester)->assertOk();
        $this->assertDatabaseMissing('bms_procurement_requests', ['id' => $item->id]);
        $this->assertDatabaseMissing('bms_procurement_quotations', ['id' => $quote->id]);
        Storage::disk('local')->assertMissing('bms/quotations/q.pdf');
    }

    public function test_event_and_procedure_deletes_and_procedure_update(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $manager = $this->actor(['events.manage', 'procedures.manage'], [$a->id]);
        $other = $this->actor(['events.manage'], [$b->id]);
        $event = PrEvent::create(['title' => 'Visit', 'event_type' => 'visit', 'event_date' => '2026-11-22 10:00:00', 'business_unit_id' => $a->id, 'requested_by' => $manager->id]);
        $outside = PrEvent::create(['title' => 'Other', 'event_type' => 'visit', 'event_date' => '2026-11-22 10:00:00', 'business_unit_id' => $b->id, 'requested_by' => $other->id]);
        $checklist = $event->checklist()->create(['title' => 'Photography']);
        $this->deleteBms('events/'.$outside->id, $manager)->assertForbidden();
        $this->deleteBms('events/'.$event->id, $manager)->assertOk();
        $this->assertDatabaseMissing('bms_event_checklist_items', ['id' => $checklist->id]);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'event.deleted', 'auditable_id' => $event->id]);

        $procedure = Procedure::create(['title' => 'Process', 'content' => 'Original', 'created_by' => $manager->id]);
        $this->putBms('procedures/'.$procedure->id, ['title' => 'Updated', 'content' => 'Revised', 'category' => null], $manager)
            ->assertOk()->assertJsonPath('data.title', 'Updated')->assertJsonPath('data.category', 'pr_protocol');
        $this->putBms('procedures/'.$procedure->id, ['content' => null], $manager)->assertStatus(422);
        $this->deleteBms('procedures/'.$procedure->id, $manager)->assertOk();
        $this->assertDatabaseMissing('bms_procedures', ['id' => $procedure->id]);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'procedure.deleted', 'auditable_id' => $procedure->id]);
    }

    public function test_document_updates_deletes_versions_and_checks_both_units(): void
    {
        $a = $this->makeUnit(); $b = $this->makeUnit();
        $manager = $this->actor(['documents.manage'], [$a->id]);
        $admin = $this->actingAsRole('system_admin');
        $old = $this->document($a, $admin, 'guide', 1, false);
        $latest = $this->document($a, $admin, 'guide', 2, true);
        $outside = $this->document($b, $admin, 'other', 1, true);
        $this->putBms('documents/'.$outside->id, ['name' => 'Outside'], $manager)->assertForbidden();
        $this->deleteBms('documents/'.$outside->id, $manager)->assertForbidden();
        $this->putBms('documents/'.$latest->id, ['business_unit_id' => $b->id], $manager)->assertForbidden();
        $this->putBms('documents/'.$latest->id, ['business_unit_id' => null], $manager)->assertForbidden();
        $deletedUnit = $this->makeUnit();
        $deletedUnit->delete();
        $this->putBms('documents/'.$latest->id, ['business_unit_id' => $deletedUnit->id], $manager)->assertStatus(422);
        $this->putBms('documents/'.$latest->id, ['name' => 'Renamed', 'category' => 'Policy'], $manager)
            ->assertOk()->assertJsonPath('data.name', 'Renamed')->assertJsonPath('data.version', 2);
        $this->deleteBms('documents/'.$latest->id, $manager)->assertOk();
        $this->assertDatabaseMissing('bms_documents', ['id' => $latest->id]);
        $this->assertTrue($old->fresh()->is_latest);
        Storage::disk('local')->assertMissing($latest->file_path);
        Storage::disk('local')->assertExists($old->file_path);
        $this->assertDatabaseHas('bms_audit_logs', ['event' => 'document.deleted', 'auditable_id' => $latest->id]);

        // Promotion of an older version must not mutate an inaccessible unit.
        $foreignOld = $this->document($b, $admin, 'mixed', 1, false);
        $localLatest = $this->document($a, $admin, 'mixed', 2, true);
        $this->deleteBms('documents/'.$localLatest->id, $manager)->assertForbidden();
        $this->assertDatabaseHas('bms_documents', ['id' => $localLatest->id, 'is_latest' => true]);
        $this->assertFalse($foreignOld->fresh()->is_latest);

        // A bound version can become latest while waiting for another delete.
        $first = $this->document($a, $admin, 'stale', 1, false);
        $second = $this->document($a, $admin, 'stale', 2, false);
        $stale = BrandDocument::findOrFail($second->id);
        $second->update(['is_latest' => true]);
        $this->actingAs($manager, 'user_api');
        $response = app(\App\Http\Controllers\BMS\DocumentController::class)->destroy($stale);
        $this->assertSame(200, $response->status());
        $this->assertTrue($first->fresh()->is_latest);
    }

    public function test_failed_audit_rolls_back_writes_and_preserves_files(): void
    {
        $unit = $this->makeUnit();
        $manager = $this->actor(['plans.manage', 'documents.manage', 'bonuses.manage'], [$unit->id]);
        $employee = $this->member($unit);
        $plan = $this->plan($unit, $manager, '2026-11-08');
        $task = $this->task($plan, $manager);
        $document = $this->document($unit, $manager, 'rollback', 1, true);
        $audit = \Mockery::mock(BmsAudit::class);
        $audit->shouldReceive('record')->andThrow(new \RuntimeException('Audit unavailable'));
        $this->app->instance(BmsAudit::class, $audit);

        $this->deleteBms('weekly-plans/'.$plan->id, $manager)->assertStatus(500);
        $this->assertDatabaseHas('weekly_plans', ['id' => $plan->id]);
        $this->assertDatabaseHas('unit_tasks', ['id' => $task->id]);
        $this->deleteBms('documents/'.$document->id, $manager)->assertStatus(500);
        $this->assertDatabaseHas('bms_documents', ['id' => $document->id]);
        Storage::disk('local')->assertExists($document->file_path);
        $this->postBms('bonuses', $this->bonusData($unit, $employee), $manager)->assertStatus(500);
        $this->assertDatabaseMissing('bms_bonuses', ['employee_id' => $employee->id]);
    }

    public function test_every_new_route_requires_its_dedicated_ability_with_real_jwt(): void
    {
        $unit = $this->makeUnit();
        $admin = $this->actingAsRole('system_admin');
        $employee = $this->actingAsRole('employee', [$unit->id]);
        $bonus = Bonus::create($this->bonusData($unit, $employee));
        $opp = $this->opportunity($unit, $admin);
        $plan = $this->plan($unit, $admin, '2026-11-08');
        $task = $this->task($plan, $employee);
        $lead = Lead::create(['name' => 'Lead', 'entity_type' => 'private', 'business_unit_id' => $unit->id, 'owner_id' => $admin->id]);
        $hiring = HiringRequest::create(['business_unit_id' => $unit->id, 'job_title' => 'Job', 'specification' => 'Spec', 'requested_by' => $admin->id]);
        $dev = DevelopmentItem::create(['business_unit_id' => $unit->id, 'title' => 'Development']);
        $proc = ProcurementRequest::create(['reference' => 'PR-denied', 'item' => 'Item', 'quantity' => 1, 'purpose' => 'Purpose', 'business_unit_id' => $unit->id, 'requested_by' => $admin->id]);
        $event = PrEvent::create(['title' => 'Event', 'event_type' => 'other', 'event_date' => '2026-11-22 10:00:00', 'business_unit_id' => $unit->id, 'requested_by' => $admin->id]);
        $doc = $this->document($unit, $admin, 'denied', 1, true);
        $procedure = Procedure::create(['title' => 'Procedure', 'content' => 'Content', 'created_by' => $admin->id]);
        $routes = [
            ['GET', 'bonuses'], ['POST', 'bonuses'], ['PUT', 'bonuses/'.$bonus->id], ['DELETE', 'bonuses/'.$bonus->id],
            ['PUT', 'opportunities/'.$opp->id], ['DELETE', 'opportunities/'.$opp->id],
            ['DELETE', 'weekly-plans/'.$plan->id], ['DELETE', 'tasks/'.$task->id],
            ['DELETE', 'leads/'.$lead->id], ['DELETE', 'recruitment/'.$hiring->id], ['DELETE', 'development-items/'.$dev->id],
            ['PUT', 'procurement/'.$proc->id], ['DELETE', 'procurement/'.$proc->id], ['DELETE', 'events/'.$event->id],
            ['PUT', 'documents/'.$doc->id], ['DELETE', 'documents/'.$doc->id],
            ['PUT', 'procedures/'.$procedure->id], ['DELETE', 'procedures/'.$procedure->id],
        ];
        foreach ($routes as [$method, $uri]) {
            $response = $this->json($method, '/api/bms/'.$uri, [], $this->jwtHeaders($employee));
            $this->assertSame(403, $response->getStatusCode(), $method.' '.$uri.' must require its ability');
        }
        $this->getJson('/api/bms/bonuses')->assertStatus(404); // Existing JWT middleware's missing-token response.
    }
}
