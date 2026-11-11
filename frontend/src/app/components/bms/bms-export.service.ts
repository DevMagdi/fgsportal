import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

@Injectable()
export class BmsExportService {
  excel(sheets: { name: string, rows: any[] }[], filename: string): void {
    void this.writeExcel(sheets, filename);
  }

  private async writeExcel(sheets: { name: string, rows: any[] }[], filename: string): Promise<void> {
    const book = new Workbook();
    sheets.forEach(sheet => {
      const rows = sheet.rows.length ? sheet.rows : [{ Message: 'No data' }];
      const worksheet = book.addWorksheet(sheet.name.substring(0, 31), {
        views: [{ rightToLeft: /[\u0600-\u06FF]/.test(JSON.stringify(rows)) }],
      });
      worksheet.columns = Object.keys(rows[0]).map(key => ({ header: key, key, width: 24 }));
      rows.forEach(row => worksheet.addRow(row));
    });
    const buffer = await book.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${filename}.xlsx`);
  }

  /** Browser-rendered PDF preserves Arabic shaping and RTL instead of Helvetica placeholders. */
  pdf(title: string, rows: any[], filename: string): void {
    const host = document.createElement('div');
    const rtl = /[\u0600-\u06FF]/.test(title + JSON.stringify(rows));
    host.dir = rtl ? 'rtl' : 'ltr';
    host.style.cssText = 'position:fixed;left:-10000px;top:0;width:760px;padding:28px;background:#fff;color:#2A2745;font-family:Cairo,Arial,sans-serif;font-size:12px;';
    const heading = document.createElement('div');
    heading.style.cssText = 'display:flex;align-items:center;gap:14px;border-bottom:2px solid #45436E;padding-bottom:14px;margin-bottom:20px;';
    const logo = document.createElement('img'); logo.src = 'assets/img/alphaiota-logo.png'; logo.width = 48; logo.height = 48; logo.alt = 'Alphaiota';
    const text = document.createElement('div');
    const brand = document.createElement('strong'); brand.textContent = 'Alphaiota · BMS'; brand.style.cssText = 'display:block;color:#45436E;font-size:13px;margin-bottom:5px;';
    const h1 = document.createElement('h1'); h1.textContent = title; h1.style.cssText = 'font-size:22px;margin:0;color:#2A2745;';
    text.append(brand, h1); heading.append(logo, text); host.appendChild(heading);
    if (!rows.length) {
      const empty = document.createElement('p'); empty.textContent = rtl ? 'لا توجد بيانات' : 'No data'; host.appendChild(empty);
    } else {
      const table = document.createElement('table'); table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:auto;';
      const thead = document.createElement('thead'); const header = document.createElement('tr');
      Object.keys(rows[0]).forEach(key => { const th = document.createElement('th'); th.textContent = key; th.style.cssText = 'background:#F5F3F0;color:#45436E;padding:9px;border:1px solid #DBCEBF;text-align:start;'; header.appendChild(th); });
      thead.appendChild(header); table.appendChild(thead); const body = document.createElement('tbody');
      rows.slice(0, 1000).forEach(row => { const tr = document.createElement('tr'); Object.keys(rows[0]).forEach(key => { const td = document.createElement('td'); const value = row[key]; td.textContent = value === null || value === undefined || value === '' ? '-' : String(value); td.style.cssText = 'padding:8px;border:1px solid #e6e2df;vertical-align:top;word-break:break-word;'; tr.appendChild(td); }); body.appendChild(tr); });
      table.appendChild(body); host.appendChild(table);
    }
    document.body.appendChild(host);
    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    doc.html(host, {
      callback: output => { output.save(`${filename}.pdf`); host.remove(); },
      margin: [12, 12, 12, 12], autoPaging: 'text', x: 0, y: 0, width: 196, windowWidth: 816,
      html2canvas: { scale: 0.75, useCORS: true, logging: false },
    } as any);
  }
}
