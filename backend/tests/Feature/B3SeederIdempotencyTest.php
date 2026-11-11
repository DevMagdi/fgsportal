<?php

namespace Tests\Feature;

use App\Models\BMS\BmsRole;
use App\Models\User;
use Database\Seeders\BmsPhaseOneSeeder;
use Tests\BmsTestCase;

class B3SeederIdempotencyTest extends BmsTestCase
{
    public function test_B3_seeder_twice_preserves_role_assignments_and_row_counts(): void
    {
        $user = $this->actingAsRole('unit_director');
        $role = BmsRole::where('slug', 'unit_director')->firstOrFail();
        $this->assertDatabaseHas('bms_role_user', ['user_id' => $user->id, 'role_id' => $role->id]);

        (new BmsPhaseOneSeeder())->run();
        $counts = [BmsRole::count(), User::findOrFail($user->id)->bmsRoles()->count()];
        (new BmsPhaseOneSeeder())->run();

        $this->assertSame($counts, [BmsRole::count(), $user->fresh()->bmsRoles()->count()]);
        $this->assertDatabaseHas('bms_role_user', ['user_id' => $user->id, 'role_id' => $role->id]);
    }
}
