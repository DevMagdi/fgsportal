import { BMS_COLLECTIONS, BMS_MODULE_KEYS } from './bms-catalog';
import { BMS_EXTRA_LABELS } from './bms-translations';
import * as fs from 'fs';
import * as path from 'path';

describe('BMS BRD catalogue',()=>{
  it('exposes the core platform and every BRD workflow exactly once',()=>{
    expect(BMS_MODULE_KEYS.length).toBe(16);
    expect(new Set(BMS_MODULE_KEYS).size).toBe(BMS_MODULE_KEYS.length);
    ['dashboard','plans','my-tasks','opportunities','products','meetings','leads','recruitment','procurement','events','documents','employees','reports'].forEach(key=>expect(BMS_MODULE_KEYS).toContain(key));
  });
  it('uses real API endpoints and permission gates for every collection',()=>{
    Object.keys(BMS_COLLECTIONS).forEach(key=>{
      const config=BMS_COLLECTIONS[key];
      expect(config.key).toBe(key);expect(config.endpoint.length).toBeGreaterThan(2);expect(config.manage).toContain('.manage');expect(config.columns.length).toBeGreaterThan(2);
    });
  });
  it('requires the BRD mandatory recruitment, procurement and document fields',()=>{
    expect(BMS_COLLECTIONS.recruitment.fields.find(f=>f.key==='job_title')?.required).toBe(true);
    expect(BMS_COLLECTIONS.recruitment.fields.find(f=>f.key==='specification')?.required).toBe(true);
    expect(BMS_COLLECTIONS.procurement.fields.find(f=>f.key==='quantity')?.required).toBe(true);
    expect(BMS_COLLECTIONS.documents.fields.find(f=>f.key==='file')?.type).toBe('file');
  });
  it('supports both lab scenarios and permission-scoped lead stages',()=>{
    const scenario=BMS_COLLECTIONS.leads.fields.find(f=>f.key==='lab_scenario');
    expect(scenario?.options?.map(o=>o.value)).toContain('university_partnership');
    expect(scenario?.options?.map(o=>o.value)).toContain('build_from_scratch');
    expect(BMS_COLLECTIONS.leads.fields.find(f=>f.key==='stage')?.options?.length).toBe(7);
  });
  it('keeps database tables and protected API routes for all later-phase workflows',()=>{
    const migration=fs.readFileSync(path.resolve(process.cwd(),'../backend/database/migrations/2026_11_11_000002_complete_bms_brd_tables.php'),'utf8');
    ['bms_meetings','bms_minutes','bms_leads','bms_hiring_requests','bms_onboarding_items','bms_procurement_requests','bms_events','bms_documents','bms_employee_certificates','bms_unit_kpis','bms_social_metrics','bms_alerts'].forEach(table=>expect(migration).toContain("Schema::create('"+table+"'"));
    const routes=fs.readFileSync(path.resolve(process.cwd(),'../backend/routes/api.php'),'utf8');
    ['/meetings','/leads','/recruitment','/procurement','/events','/documents','/directory','/reports/monthly','/reports/quarterly','/reports/social','/alerts'].forEach(uri=>expect(routes).toContain("'"+uri+"'"));
  });
  it('provides English and Arabic labels for all configured form fields',()=>{
    Object.values(BMS_COLLECTIONS).forEach(config=>{
      ['title','subtitle'].forEach(key=>{
        expect(BMS_EXTRA_LABELS.en[(config as any)[key]]).toBeTruthy();expect(BMS_EXTRA_LABELS.ar[(config as any)[key]]).toBeTruthy();
      });
      const baseLabels=['unit','owner','title','type','status','stage','dueDate','name'];
      config.fields.forEach(field=>['en','ar'].forEach(language=>{if(!BMS_EXTRA_LABELS[language][field.label])expect(baseLabels).toContain(field.label);}));
    });
  });
});
