<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\EmployeeCertificate;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DirectoryController extends BmsController
{
    /**
     * Employee directory. Every employee is scoped to the viewer's units: a
     * director only sees staff who belong to a unit they coordinate (plus
     * themselves). Previously the query only filtered when a unit filter was
     * supplied, so any directory.view holder could enumerate the whole company.
     */
    public function index(Request $request)
    {
        $filters = $request->validate([
            'business_unit_id' => 'nullable|exists:business_units,id',
            'search' => 'nullable|string|max:100',
            'active' => 'nullable|in:0,1',
        ]);
        if (!empty($filters['business_unit_id'])) {
            $this->access->authorizeUnit((int) $filters['business_unit_id']);
        }

        $query = User::with(['work_degrees_id_fun', 'businessUnits:id,name', 'user_details_id_fun'])
            ->whereNull('deleted_at')
            ->orderBy('firstname')->orderBy('username');

        $visibleUnitIds = $this->access->visibleUnitIds();
        if ($visibleUnitIds !== null) {
            $query->where(function ($scoped) use ($visibleUnitIds) {
                $scoped->whereHas('businessUnits', fn ($q) => $q->whereIn('business_units.id', $visibleUnitIds))
                    ->orWhere('id', $this->access->user()->id);
            });
        }
        if (array_key_exists('active', $filters) && $filters['active'] !== null) {
            $query->where('active', (int) $filters['active']);
        }
        if (!empty($filters['business_unit_id'])) {
            $query->whereHas('businessUnits', fn ($q) => $q->where('business_units.id', $filters['business_unit_id']));
        }
        if (!empty($filters['search'])) {
            $term = '%'.$filters['search'].'%';
            $query->where(function ($q) use ($term) {
                $q->where('username', 'like', $term)->orWhere('firstname', 'like', $term)
                    ->orWhere('lastname', 'like', $term)->orWhere('email', 'like', $term);
            });
        }

        $employees = $query->get(['id', 'username', 'firstname', 'lastname', 'email', 'photoURL', 'work_degrees_id', 'user_details_id', 'active'])
            ->map(function ($user) use ($visibleUnitIds) {
                $degree = $user->work_degrees_id_fun;
                $certificates = EmployeeCertificate::with('unit:id,name')->where('user_id', $user->id)
                    ->when($visibleUnitIds !== null, fn ($q) => $q->whereIn('business_unit_id', $visibleUnitIds))
                    ->get();

                return [
                    'id' => $user->id,
                    'name' => trim($user->firstname.' '.$user->lastname) ?: $user->username,
                    'username' => $user->username,
                    'email' => $user->email,
                    'job_title' => $degree->work_degree_name ?? $degree->name ?? null,
                    'photo_url' => $user->photoURL ? '/api/bms/employees/'.$user->id.'/photo' : null,
                    'units' => $user->businessUnits,
                    'hiring_date' => $user->user_details_id_fun->hiringDate ?? null,
                    'active' => (bool) $user->active,
                    'certificates' => $certificates,
                ];
            })->values();

        return $this->ok($employees);
    }

    public function certificate(Request $request)
    {
        $data = $request->validate(['user_id' => 'required|exists:users,id', 'business_unit_id' => 'nullable|exists:business_units,id', 'name' => 'required|string|max:200', 'issuer' => 'nullable|string|max:200', 'issued_at' => 'nullable|date', 'expires_at' => 'nullable|date|after_or_equal:issued_at', 'file' => 'required|file|mimes:pdf,png,jpg,jpeg|max:10240']);
        if (!empty($data['business_unit_id'])) $this->access->authorizeUnit((int) $data['business_unit_id']); else abort_unless($this->access->hasGlobalUnitScope(), 403, 'Select a unit within your access scope.');
        $this->authorizeEmployee((int) $data['user_id']);
        $file = $request->file('file');
        $certificate = EmployeeCertificate::create(['user_id' => $data['user_id'], 'business_unit_id' => $data['business_unit_id'] ?? null, 'name' => $data['name'], 'issuer' => $data['issuer'] ?? null, 'issued_at' => $data['issued_at'] ?? null, 'expires_at' => $data['expires_at'] ?? null, 'original_name' => $file->getClientOriginalName(), 'file_path' => $file->store('bms/certificates', 'local'), 'uploaded_by' => $this->access->user()->id]);
        $this->audit->record($certificate, 'employee.certificate_added', [], $certificate->toArray());

        return $this->ok($certificate->load(['employee:id,username', 'unit:id,name']), 'Certificate attached', 201);
    }

    public function download(EmployeeCertificate $certificate)
    {
        if ($certificate->business_unit_id) $this->access->authorizeUnit((int) $certificate->business_unit_id);
        $this->authorizeEmployee((int) $certificate->user_id);
        abort_unless(Storage::disk('local')->exists($certificate->file_path), 404);

        return Storage::disk('local')->download($certificate->file_path, \App\Services\BMS\SafeFilename::forDownload($certificate->original_name));
    }

    private function authorizeEmployee(int $userId): void
    {
        $visible = $this->access->visibleUnitIds();
        if ($visible === null) return;
        $belongs = User::whereKey($userId)->whereHas('businessUnits', fn ($q) => $q->whereIn('business_units.id', $visible))->exists();
        abort_unless($belongs || $userId === $this->access->user()->id, 403, 'This employee is outside your assigned unit scope.');
    }
}
