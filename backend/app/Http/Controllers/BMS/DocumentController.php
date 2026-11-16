<?php
namespace App\Http\Controllers\BMS;

use App\Models\BMS\BrandDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class DocumentController extends BmsController
{
    public function index(Request $request)
    {
        $query=BrandDocument::with(['unit','uploader:id,username'])->where('is_published',true);
        if($request->boolean('latest_only',true))$query->where('is_latest',true);
        if($request->filled('business_unit_id'))$query->where('business_unit_id',$request->business_unit_id);
        if($request->filled('category'))$query->where('category',$request->category);
        if($request->filled('search'))$query->where('name','like','%'.$request->search.'%');
        return $this->ok($query->latest()->get());
    }
    public function store(Request $request)
    {
        $data=$request->validate(['name'=>'required|string|max:200','category'=>'required|string|max:100','business_unit_id'=>'nullable|exists:business_units,id','document_key'=>'nullable|string|max:160','file'=>'required|file|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx,png,jpg,jpeg,svg|max:20480','is_published'=>'sometimes|boolean']);
        $file=$request->file('file');
        $key=$data['document_key']??Str::slug(($data['business_unit_id']??'company').'-'.$data['category'].'-'.$data['name']);
        $document=DB::transaction(function()use($data,$file,$key){
            $version=(BrandDocument::where('document_key',$key)->max('version')?:0)+1;
            BrandDocument::where('document_key',$key)->where('is_latest',true)->update(['is_latest'=>false]);
            $document=BrandDocument::create(['document_key'=>$key,'name'=>$data['name'],'category'=>$data['category'],'business_unit_id'=>$data['business_unit_id']??null,'version'=>$version,'is_latest'=>true,'is_published'=>$data['is_published']??true,'original_name'=>$file->getClientOriginalName(),'file_path'=>$file->store('bms/documents','local'),'mime_type'=>$file->getClientMimeType(),'uploaded_by'=>$this->access->user()->id]);
            $this->audit->record($document,'document.published',[],$document->toArray());return $document;
        });
        return $this->ok($document->load(['unit','uploader:id,username']),'Latest document version published',201);
    }
    public function update(Request $request, BrandDocument $document)
    {
        $this->authorizeDocumentUnit($document->business_unit_id);
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:200',
            'category' => 'sometimes|required|string|max:100',
            'business_unit_id' => ['nullable', 'integer', Rule::exists('business_units', 'id')->whereNull('deleted_at')],
            'is_published' => 'sometimes|boolean',
        ]);
        if (array_key_exists('business_unit_id', $data)) $this->authorizeDocumentUnit($data['business_unit_id']);
        DB::transaction(function () use ($document, $data) {
            $old = $document->only(array_keys($data));
            $document->update($data);
            $this->audit->record($document, 'document.updated', $old, $document->only(array_keys($data)));
        });
        return $this->ok($document->load(['unit', 'uploader:id,username']));
    }
    public function destroy(BrandDocument $document)
    {
        $this->authorizeDocumentUnit($document->business_unit_id);
        $path = DB::transaction(function () use ($document) {
            $versions = BrandDocument::where('document_key', $document->document_key)
                ->orderByDesc('version')->orderByDesc('id')->lockForUpdate()->get();
            $current = $versions->firstWhere('id', $document->id);
            abort_unless($current, 404);
            $this->authorizeDocumentUnit($current->business_unit_id);
            $remaining = $versions->where('id', '!=', $current->id);
            $previous = $current->is_latest && !$remaining->contains('is_latest', true) ? $remaining->first() : null;
            if ($previous) $this->authorizeDocumentUnit($previous->business_unit_id);

            $old = $current->toArray();
            $current->delete();
            if ($previous) $previous->update(['is_latest' => true]);
            $this->audit->record($current, 'document.deleted', $old, []);
            return $current->file_path;
        });
        if ($path && !BrandDocument::where('file_path', $path)->exists()) Storage::disk('local')->delete($path);
        return $this->ok(null, 'Document deleted');
    }
    public function history(BrandDocument $document)
    {
        return $this->ok(BrandDocument::with('uploader:id,username')->where('document_key',$document->document_key)->orderByDesc('version')->get());
    }
    public function download(BrandDocument $document)
    {
        abort_unless($document->is_published,404);abort_unless(Storage::disk('local')->exists($document->file_path),404,'Document file not found.');
        return Storage::disk('local')->download($document->file_path,\App\Services\BMS\SafeFilename::forDownload($document->original_name));
    }
    private function authorizeDocumentUnit($unitId): void
    {
        if ($unitId !== null) $this->access->authorizeUnit((int) $unitId);
        else abort_unless($this->access->hasGlobalUnitScope(), 403, 'Company-wide documents require global scope.');
    }
}
