import * as XLSX from 'xlsx';

function getFieldLabel(field) {
  const requiredMark = field.required ? '*' : '';
  return `${field.label || field.field}${requiredMark}`;
}

export function downloadImportTemplateFallback({
  fields = [],
  fileName = '导入模板.xlsx',
  sheetName = '导入模板',
} = {}) {
  const headers = fields.map((field) => getFieldLabel(field)).filter(Boolean);
  const tips = fields
    .map((field) => field.placeholder || '')
    .filter((_, index) => headers[index]);
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers.length > 0 ? headers : ['名称*'],
    tips,
  ]);
  worksheet['!cols'] = headers.map((header) => ({
    wch: Math.max(String(header).length + 8, 18),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}
