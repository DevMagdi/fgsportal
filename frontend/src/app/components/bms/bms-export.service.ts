import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Injectable()
export class BmsExportService {
  excel(sheets: { name: string, rows: any[] }[], filename: string): void {
    const book = XLSX.utils.book_new();
    sheets.forEach(sheet => {
      const rows = sheet.rows.length ? sheet.rows : [{ Message: 'No data' }];
      const worksheet = XLSX.utils.json_to_sheet(rows);
      worksheet['!cols'] = Object.keys(rows[0]).map(() => ({ wch: 24 }));
      XLSX.utils.book_append_sheet(book, worksheet, sheet.name.substring(0, 31));
    });
    XLSX.writeFile(book, `${filename}.xlsx`);
  }
  pdf(title: string, rows: any[], filename: string): void {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text(title, 14, 18);
    doc.setFontSize(9); let y = 30;
    rows.forEach((row, index) => {
      const line = Object.keys(row).map(key => `${key}: ${row[key] === null || row[key] === undefined ? '-' : row[key]}`).join(' | ');
      const lines = doc.splitTextToSize(line, 180);
      if (y + lines.length * 5 > 282) { doc.addPage(); y = 18; }
      doc.text(lines, 14, y); y += lines.length * 5 + 3;
      if (index > 500) return;
    });
    if (!rows.length) doc.text('No data', 14, y);
    doc.save(`${filename}.pdf`);
  }
}
