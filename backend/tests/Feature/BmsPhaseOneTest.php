<?php
namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Product;
use App\Models\User;
use App\Services\BMS\BmsAccess;
use Database\Seeders\BmsPhaseOneSeeder;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class BmsPhaseOneTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['database.default'=>'sqlite','database.connections.sqlite'=>[
            'driver'=>'sqlite','database'=>':memory:','prefix'=>'','foreign_key_constraints'=>true,
        ]]);
        Schema::create('users',function(Blueprint $table){
            $table->id();$table->string('username');$table->string('email')->nullable();
            $table->string('password');$table->unsignedBigInteger('sub_departments_id')->nullable();
            $table->timestamps();$table->softDeletes();
        });
        Schema::create('departments',function(Blueprint $table){$table->id();$table->string('department_name');$table->timestamps();$table->softDeletes();});
        Schema::create('products',function(Blueprint $table){$table->id();$table->string('product_name');$table->timestamps();$table->softDeletes();});
        Schema::create('contact_leads',function(Blueprint $table){$table->id();$table->timestamps();$table->softDeletes();});
        $migration=base_path('database/migrations/2026_11_11_000001_create_bms_phase_one_tables.php');
        require_once $migration;(new \CreateBmsPhaseOneTables())->up();
    }

    private function user(string $name,int $department=2): User
    {
        return User::create(['username'=>$name,'email'=>$name.'@example.test','password'=>Hash::make('secret'),'sub_departments_id'=>$department]);
    }

    public function test_migration_and_seeder_provision_the_phase_one_foundation(): void
    {
        (new BmsPhaseOneSeeder())->run();
        $this->assertSame(5,BusinessUnit::count());
        $this->assertSame('Alpha Iota',BusinessUnit::where('slug','alpha-iota')->firstOrFail()->name);
        $this->assertSame(4,BusinessUnit::whereNotNull('parent_id')->count());
        $this->assertSame(7,BmsRole::count());
        $this->assertEqualsCanonicalizing(['Argus','Kraken'],Product::pluck('product_name')->all());
        foreach (['weekly_plans','unit_tasks','support_requests','bms_opportunities','bms_opportunity_stage_histories','product_phases','bms_audit_logs'] as $table) {
            $this->assertTrue(Schema::hasTable($table));
        }
    }

    public function test_operations_and_alpha_delta_permissions_are_separate(): void
    {
        (new BmsPhaseOneSeeder())->run();
        $operations=$this->user('operations');$delta=$this->user('delta');
        $operations->bmsRoles()->attach(BmsRole::where('slug','operations')->firstOrFail());
        $delta->bmsRoles()->attach(BmsRole::where('slug','alpha_delta')->firstOrFail());
        $access=app(BmsAccess::class);
        $this->assertTrue($access->can('opportunities.manage',$operations));
        $this->assertFalse($access->can('opportunities.decide',$operations));
        $this->assertTrue($access->can('opportunities.decide',$delta));
        $this->assertFalse($access->can('opportunities.manage',$delta));
        $this->assertFalse($access->can('opportunities.manage',$this->user('ordinary-user')));
    }

    public function test_unit_scope_allows_members_and_director_but_not_outsiders(): void
    {
        (new BmsPhaseOneSeeder())->run();
        $unit=BusinessUnit::where('slug','alpha-x')->firstOrFail();
        $member=$this->user('member');$director=$this->user('director');$outsider=$this->user('outsider');
        $unit->users()->attach($member);$unit->update(['director_id'=>$director->id]);
        $access=app(BmsAccess::class);
        $this->assertTrue($access->canAccessUnit($unit->id,$member));
        $this->assertTrue($access->canAccessUnit($unit->id,$director));
        $this->assertFalse($access->canAccessUnit($unit->id,$outsider));
    }
}
