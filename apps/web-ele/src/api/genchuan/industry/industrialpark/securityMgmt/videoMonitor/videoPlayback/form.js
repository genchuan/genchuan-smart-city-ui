// 文件2: src/views/genchuan/industrialPark/securityMgmt/videoPlayback/form.js
// 筛选表单 schema（用于列表页搜索）
export function useFormSchema() {
  return [
    {
      fieldName: 'cameraName',
      label: '摄像头名称',
      component: 'Input',
      componentProps: { placeholder: '请输入摄像头名称', clearable: true },
      labelWidth: '100',
    },
    {
      fieldName: 'videoTimeRange',
      label: '录像时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        rangeSeparator: '-',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        clearable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'storeStatus',
      label: '存储状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        options: [
          { label: '正常', value: '正常' },
          { label: '已过期', value: '已过期' },
        ],
        clearable: true,
      },
      labelWidth: '100',
    },
  ];
}

// 表格列定义
export function getColumns() {
  const baseColumns = [{ type: 'checkbox', width: 40 }];

  const columns = [
    { field: 'cameraName', title: '摄像头名称', minWidth: 140, slots: { default: 'cameraName' } },
    { field: 'videoTime', title: '录像时间', minWidth: 180, slots: { default: 'videoTime' } },
    { field: 'videoDuration', title: '录像时长(秒)', minWidth: 120 },
    { field: 'fileSize', title: '文件大小(KB)', minWidth: 120 },
    { field: 'storeStatus', title: '存储状态', minWidth: 100, slots: { default: 'storeStatus' } },
    { field: 'queryTime', title: '检索时间', minWidth: 180, slots: { default: 'queryTime' } },
    { field: 'exportRecord', title: '导出记录', minWidth: 120, slots: { default: 'exportRecord' } },
    { field: 'handleUser', title: '操作人', minWidth: 100, slots: { default: 'handleUser' } },
    { field: 'creator', title: '创建人', minWidth: 120, slots: { default: 'creator' } },
    { field: 'createTime', title: '创建时间', minWidth: 180, slots: { default: 'createTime' } },
    { field: 'updateTime', title: '更新时间', minWidth: 180, slots: { default: 'updateTime' } },
  ];

  const allColumns = [...baseColumns, ...columns];
  allColumns.push({
    title: '操作',
    width: 280,
    fixed: 'right',
    slots: { default: 'actions' },
  });
  return allColumns;
}

// 检索表单 schema（时间范围、摄像头、区域）
export function useSearchFormSchema() {
  return [
    {
      fieldName: 'timeRange',
      label: '时间范围',
      component: 'DatePicker',
      componentProps: {
        type: 'datetimerange',
        rangeSeparator: '-',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        format: 'YYYY-MM-DD HH:mm:ss',
        valueFormat: 'x',
        clearable: true,
      },
      rules: 'required',
      labelWidth: '100',
    },
    {
      fieldName: 'cameraId',
      label: '摄像头',
      component: 'Select',
      componentProps: {
        placeholder: '请选择摄像头',
        options: [], // 动态加载，可通过接口获取
        clearable: true,
        filterable: true,
      },
      labelWidth: '100',
    },
    {
      fieldName: 'area',
      label: '安装区域',
      component: 'Input',
      componentProps: { placeholder: '请输入安装区域', clearable: true },
      labelWidth: '100',
    },
  ];
}

// 文本常量
export const textObj = {
  searchText: '检索',
  fastForwardText: '快进',
  slowMotionText: '慢放',
  snapText: '截图',
  exportText: '导出',
  refreshText: '刷新',
  deleteText: '删除',
  confirmText: '确认',
  playText: '播放',
  excelName: '录像回放列表',
};

// 时间戳格式化函数
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(parseInt(timestamp));
  if (isNaN(date.getTime())) return timestamp;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
