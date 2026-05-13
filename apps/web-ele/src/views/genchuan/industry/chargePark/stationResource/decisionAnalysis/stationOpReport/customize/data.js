import {
  detailFields as baseDetailFields,
  formFields as baseFormFields,
  pageConfig as basePageConfig,
  searchFields as baseSearchFields,
  tableColumns as baseTableColumns,
} from '../table/data.js';

export const REPORT_TYPE = 'customize';

export const pageConfig = {
  ...basePageConfig,
  title: '场站资源自定义报表',
  exportName: '场站周期报表.xlsx',
  enableGenerate: true,
  generateButtonText: '生成自定义报表',
};

export const searchFields = baseSearchFields;
export const formFields = baseFormFields;

export const tableColumns = baseTableColumns;
export const detailFields = baseDetailFields;
