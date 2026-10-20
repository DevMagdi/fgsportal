import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }


  exportexcel(element, fileName, columnWidth?: number): void {
    /* table id is passed over here */
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const range = ws['!ref'] ? XLSX.utils.decode_range(ws['!ref']) : null;
    if (range) {
      const totalColumns = range.e.c - range.s.c + 1;
      const width = columnWidth || 20;
      ws['!cols'] = Array.from({ length: totalColumns }, () => ({ wch: width }));
    }

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }



}
