import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class ExportExcelService {
  exportexcel(element: any, fileName: string, columnWidth = 20): void {
    if (!element) return;
    const book = new Workbook();
    const sheet = book.addWorksheet('Sheet1');
    (Array.from(element.rows) as HTMLTableRowElement[]).forEach(row => {
      sheet.addRow(Array.from(row.cells).map(cell => cell.innerText));
    });
    sheet.columns.forEach(column => { column.width = columnWidth; });
    void book.xlsx.writeBuffer().then(buffer => {
      saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
    });
  }
}
