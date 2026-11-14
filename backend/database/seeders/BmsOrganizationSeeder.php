<?php
namespace Database\Seeders;

use App\Models\BMS\CentralDepartment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

/**
 * Stage B1 reference data: the central departments that serve the whole
 * organization. They are independent of business units and of the legacy
 * `departments` table.
 *
 * Idempotent and non-destructive: a department is created only when its code
 * does not exist yet. An existing department is never modified, so a name,
 * head, status or legacy link changed by an administrator survives re-seeding.
 * No head and no member is seeded: people are assigned through the application.
 */
class BmsOrganizationSeeder extends Seeder
{
    /** code => [English name, Arabic name] */
    public const CENTRAL_DEPARTMENTS = [
        'hr' => ['Human Resources', 'الموارد البشرية'],
        'finance' => ['Finance', 'المالية'],
        'marketing' => ['Marketing', 'التسويق'],
        'central_it' => ['Central IT', 'تقنية المعلومات المركزية'],
        'legal_compliance' => ['Legal & Compliance', 'الشؤون القانونية والامتثال'],
    ];

    public function run(): void
    {
        if (!Schema::hasTable('bms_central_departments')) return;

        foreach (self::CENTRAL_DEPARTMENTS as $code => [$name, $nameAr]) {
            // Soft deletes are not used on this table; a department that was
            // deliberately removed by an administrator is recreated on the next
            // seed, exactly like the seeded business units are.
            if (CentralDepartment::where('code', $code)->exists()) continue;
            // A custom department may already use the same display name.
            if (CentralDepartment::where('name', $name)->exists()) continue;

            CentralDepartment::create(['code' => $code, 'name' => $name, 'name_ar' => $nameAr, 'is_active' => true]);
        }
    }
}
