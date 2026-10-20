<?php

namespace App\Http\Controllers\Settings\Module;

use App\Http\Controllers\Controller;
use App\Http\Controllers\ResponseTrait\ResponseApi;
use App\Models\CompanyModule;
use App\Models\Module;
use App\Services\ModuleService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    use ResponseApi;

    public function __construct(private ModuleService $moduleService)
    {
    }

    /**
     * GET /api/modules
     * Full catalogue of sellable modules plus the current company's status.
     */
    public function index()
    {
        try {
            return $this->acceptedResponseApi(
                $this->moduleService->modulesForUser(Auth::user()),
                'All modules retrieved successfully',
                200
            );
        } catch (\Exception $e) {
            return $this->badMethodErrorResponse(['message' => 'Server Error'], 'Server Error', 500);
        }
    }

    /**
     * GET /api/company/modules
     * Modules enabled for the current user's company.
     */
    public function companyModules()
    {
        try {
            $modules = array_values(array_filter(
                $this->moduleService->modulesForUser(Auth::user()),
                fn ($module) => $module['is_enabled']
            ));

            return $this->acceptedResponseApi($modules, 'Enabled company modules retrieved successfully', 200);
        } catch (\Exception $e) {
            return $this->badMethodErrorResponse(['message' => 'Server Error'], 'Server Error', 500);
        }
    }

    /**
     * POST /api/company/modules/enable
     * Body: { module_slug: "crm" } (or module_id)
     */
    public function enable(Request $request)
    {
        return $this->toggle($request, true);
    }

    /**
     * POST /api/company/modules/disable
     * Body: { module_slug: "crm" } (or module_id)
     */
    public function disable(Request $request)
    {
        return $this->toggle($request, false);
    }

    private function toggle(Request $request, bool $enable)
    {
        if (!$this->isAdministrator()) {
            return $this->badMethodErrorResponse(['message' => 'Forbidden'], 'Forbidden', 403);
        }

        $validator = Validator::make($request->all(), [
            'module_slug' => 'required_without:module_id|string|exists:modules,slug',
            'module_id' => 'required_without:module_slug|integer|exists:modules,id',
        ]);

        if ($validator->fails()) {
            return $this->validatorErrorResponseApi($validator->errors()->toArray(), 'Validator Errors', 400);
        }

        try {
            $module = $request->module_id
                ? Module::findOrFail($request->module_id)
                : Module::where('slug', $request->module_slug)->firstOrFail();

            if ((bool) $module->is_core) {
                return $this->badMethodErrorResponse(
                    ['message' => 'Core modules are always enabled and cannot be changed'],
                    'Core module cannot be modified',
                    422
                );
            }

            $company = $this->moduleService->resolveCompany(Auth::user());
            if (!$company) {
                return $this->notFoundResponse(['message' => 'No company provisioned for this user'], 'Company not found', 404);
            }

            $pivot = CompanyModule::firstOrNew([
                'company_id' => $company->id,
                'module_id' => $module->id,
            ]);

            $pivot->is_enabled = $enable;
            $pivot->enabled_at = $enable ? Carbon::now() : null;
            $pivot->save();

            $this->moduleService->forgetCache($company->id, $module->slug);

            return $this->acceptedResponseApi(
                $this->moduleService->modulesForUser(Auth::user()),
                $enable ? "Module [{$module->slug}] enabled" : "Module [{$module->slug}] disabled",
                200
            );
        } catch (\Exception $e) {
            return $this->badMethodErrorResponse(['message' => 'Server Error'], 'Server Error', 500);
        }
    }

    /**
     * Management/Administration sub-departments only (1 = Management, 4 = Administration).
     */
    private function isAdministrator(): bool
    {
        $user = Auth::user();

        return $user && in_array((int) $user->sub_departments_id, config('modules.admin_sub_departments', [1, 4]), true);
    }
}
