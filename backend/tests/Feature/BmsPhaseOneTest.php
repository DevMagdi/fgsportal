<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\BMS\BusinessUnit;
use App\Models\Product;
use App\Services\BMS\BmsAccess;
use Database\Seeders\BmsPhaseOneSeeder;
use Tests\BmsTestCase;

class BmsPhaseOneTest extends BmsTestCase
{
    public function test_migration_and_seeder_provision_the_phase_one_foundation(): void
    {
        $this->assertSame(5, BusinessUnit::count());
        $this->assertSame('Alpha Iota', BusinessUnit::where('slug', 'alpha-iota')->firstOrFail()->name);
        $this->assertSame(4, BusinessUnit::whereNotNull('parent_id')->count());
        $this->assertEqualsCanonicalizing(array_keys(BmsPhaseOneSeeder::ROLES), BmsRole::pluck('slug')->all());
        $this->assertEqualsCanonicalizing(['Argus', 'Kraken'], Product::pluck('product_name')->all());
    }

    public function test_operations_and_alpha_delta_permissions_are_separate(): void
    {
        $operations = $this->actingAsRole('operations');
        $delta = $this->actingAsRole('alpha_delta');
        $access = app(BmsAccess::class);
        $this->assertTrue($access->can('opportunities.manage', $operations));
        $this->assertFalse($access->can('opportunities.decide', $operations));
        $this->assertTrue($access->can('opportunities.decide', $delta));
        $this->assertFalse($access->can('opportunities.manage', $delta));
    }

    public function test_unit_scope_allows_members_and_director_but_not_outsiders(): void
    {
        $unit = BusinessUnit::where('slug', 'alpha-x')->firstOrFail();
        $member = $this->makeUser();
        $director = $this->makeUser();
        $outsider = $this->makeUser();
        $unit->users()->attach($member);
        $unit->update(['director_id' => $director->id]);
        $access = app(BmsAccess::class);
        $this->assertTrue($access->canAccessUnit($unit->id, $member));
        $this->assertTrue($access->canAccessUnit($unit->id, $director));
        $this->assertFalse($access->canAccessUnit($unit->id, $outsider));
    }
}
