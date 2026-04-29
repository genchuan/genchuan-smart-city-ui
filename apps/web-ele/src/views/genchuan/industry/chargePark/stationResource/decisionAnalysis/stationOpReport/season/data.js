import {
  detailFields as baseDetailFields,
  formFields as baseFormFields,
  pageConfig as basePageConfig,
  searchFields as baseSearchFields,
  tableColumns as baseTableColumns,
} from '../table/data.js';

export const REPORT_TYPE = 'season';

export const pageConfig = {
  ...basePageConfig,
  title: '场站资源季报',
  exportName: '场站资源季报.xlsx',
  enableGenerate: true,
  generateButtonText: '生成季报',
};

export const searchFields = baseSearchFields;
export const formFields = baseFormFields;

export const tableColumns = baseTableColumns;
export const detailFields = baseDetailFields;
