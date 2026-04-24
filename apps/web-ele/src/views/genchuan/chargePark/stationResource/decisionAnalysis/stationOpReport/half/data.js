import {
  detailFields as baseDetailFields,
  formFields as baseFormFields,
  pageConfig as basePageConfig,
  searchFields as baseSearchFields,
  tableColumns as baseTableColumns,
} from '../table/data.js';

export const REPORT_TYPE = 'half';

export const pageConfig = {
  ...basePageConfig,
  title: '场站资源半年报',
  exportName: '场站资源半年报.xlsx',
  enableGenerate: true,
  generateButtonText: '生成半年报',
};

export const searchFields = baseSearchFields;
export const formFields = baseFormFields;

export const tableColumns = baseTableColumns;
export const detailFields = baseDetailFields;
