<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { confirm, useVbenDrawer } from '@vben/common-ui';
import { isEmpty } from '@vben/utils';
import { ElLoading, ElMessage, ElDialog, ElUpload } from 'element-plus';
import screenfull from 'screenfull';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  getAllPage,
  createObject,
  updateObject,
  deleteObject,
  getStatusCount,
  importObjects,
  getUserSimpleList,
  getAreaSimpleList,
  getObjectTypeSimpleList,
  getRelatedObjectSimpleList,
} from '#/api/genchuan/dataHub/evaluation/system/objects/index.js';

import garageDetailDrawer from './detail.vue';
import {
  textObj,
  useFormSchema,
  useGridColumns,
  useQuerySchema,
  importFields,
} from './data';

const props = defineProps({
  secondShow: { type: Boolean, default: false },
  arrowShow: { type: Boolean, default: false },
  arrowState: { type: Boolean, default: false },
});
const emit = defineEmits(['arrow-change', 'refresh-chart']);

const getTitle = computed(() => {
  return formData.value?.id ? textObj.editText : textObj.addText;
});

// 搜索参数
const searchParams = ref({});

// 搜索抽屉
const [Drawer, drawerApi] = useVbenDrawer({
  modal: false,
  appendToMain: true,
  footer: false,
  onCancel() { drawerApi.close(); },
  async onOpenChange() {},
});

// 新增/编辑表单数据（用于计算标题）
const formData = ref();

// 表单实例
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 加载表单下拉选项的方法
const loadFormOptions = async () => {
  try {
    const [areaList, typeList, userList, relatedList] = await Promise.all([
      getAreaSimpleList(),
      getObjectTypeSimpleList(),
      getUserSimpleList(),
      getRelatedObjectSimpleList(),
    ]);

    await formApi.updateSchema([
      {
        fieldName: 'areaCode',
        componentProps: { options: Array.isArray(areaList) ? areaList : [] },
      },
      {
        fieldName: 'objectTypeId',
        componentProps: { options: Array.isArray(typeList) ? typeList : [] },
      },
      {
        fieldName: 'managerId',
        componentProps: { options: Array.isArray(userList) ? userList : [] },
      },
      {
        fieldName: 'relatedId',
        componentProps: { options: Array.isArray(relatedList) ? relatedList : [] },
      },
    ]);
  } catch (error) {
    console.error('加载下拉选项失败', error);
    ElMessage.error('加载下拉选项失败，请重试');
    await formApi.updateSchema([
      { fieldName: 'areaCode', componentProps: { options: [] } },
      { fieldName: 'objectTypeId', componentProps: { options: [] } },
      { fieldName: 'managerId', componentProps: { options: [] } },
      { fieldName: 'relatedId', componentProps: { options: [] } },
    ]);
  }
};

// ========== 新增：自定义唯一性验证函数 ==========
const validateNameUnique = (rule, value, callback) => {
  // 如果名称为空，由 required 规则处理
  if (!value) {
    return callback();
  }

  // 获取当前表单的 areaCode
  const formValues = formApi.form.values;
  const areaCode = formValues.areaCode;

  // 如果区域未选，暂时不验证（等区域选了再触发表单校验）
  if (!areaCode) {
    return callback();
  }

  // 获取当前编辑项的 id（新增时为 undefined）
  const currentId = formDrawerApi.getData()?.id;

  // 在已加载的表格数据中查找重复项
  const duplicate = dataObj.list.find(item => {
    // 排除当前编辑项
    if (currentId && item.id === currentId) return false;
    // 比较区域编码和对象名称（注意表格数据中包含 areaCode 原始字段）
    return item.areaCode === areaCode && item.name === value;
  });

  if (duplicate) {
    callback(new Error('该区域内对象名称已存在，请重新输入'));
  } else {
    callback();
  }
};
// ==============================================

// 抽屉打开/关闭时的处理函数
const onOpenChange = async (isOpen) => {
  if (isOpen) {
    await loadFormOptions();
    const drawerData = formDrawerApi.getData() || {};
    formData.value = drawerData;
    if (drawerData.id) {
      await formApi.setValues(drawerData);
    } else {
      formApi.resetForm();
    }

    // ========== 新增：为 name 字段添加自定义唯一性验证 ==========
    await formApi.updateSchema([
      {
        fieldName: 'name',
        rules: [
          'required',
          { validator: validateNameUnique, trigger: 'blur' } // 触发时机可根据需要调整
        ]
      }
    ]);
    // =======================================================
  }
};

// 新增/编辑抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  appendToMain: true,
  modal: false,
  onCancel() { formDrawerApi.close(); },
  async onConfirm() {
    const validateResult = await formApi.validate();
    if (!validateResult.valid) return;

    let values = formApi.form.values;
    // 手机号格式校验
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (values.managerPhone && !phoneRegex.test(values.managerPhone)) {
      ElMessage.error('联系电话格式不正确，应为11位手机号');
      return;
    }
    const drawerData = formDrawerApi.getData() || {};
    const id = drawerData.id;
    const isEdit = !!id;

    // 后续字段类型转换、提交等
    const numberFields = ['objectTypeId', 'managerId', 'relatedId'];
    numberFields.forEach(field => {
      if (values[field] !== undefined && values[field] !== null && values[field] !== '') {
        values[field] = Number(values[field]);
      }
    });

    const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.saving') });
    try {
      if (!isEdit) {
        await createObject({ ...values, statusId: 1 });
        ElMessage.success($t('ui.actionMessage.addSuccess'));
      } else {
        await updateObject({ id, ...values });
        ElMessage.success($t('ui.actionMessage.editSuccess'));
      }
      emit('refresh-chart'); // 触发图表刷新
      handleRefresh();
      fetchStatusCount();
      formDrawerApi.close();
    } catch (error) {
      console.error('保存失败', error);
      ElMessage.error(error.message || '保存失败');
    } finally {
      loadingInstance.close();
    }
  },
  onOpenChange,
});

/** 刷新表格 */
function handleRefresh() {
  gridApi.query();
}

/** 普通导出（按当前搜索条件，导出全部）- 前端生成 Excel */
async function handleExport() {
  const loadingInstance = ElLoading.service({ text: '正在获取数据...' });
  try {
    // 构建查询参数（包含搜索条件 + 状态筛选）
    const params = {
      ...searchParams.value,
      pageNo: 1,
      pageSize: 1000, // 每页大小，可根据后端限制调整
    };
    if (activeName.value !== '全部') {
      params.statusId = activeName.value === '启用' ? 1 : 2;
    }

    let allData = [];
    let pageNo = 1;
    let hasMore = true;

    // 循环获取所有数据
    while (hasMore) {
      params.pageNo = pageNo;
      const res = await getAllPage(params);
      const { list, total } = res;
      if (list && list.length > 0) {
        // 格式化当前页数据
        const formattedList = formatList(list);
        allData = allData.concat(formattedList);
        pageNo++;
        // 如果当前页数据小于 pageSize，说明是最后一页
        if (list.length < params.pageSize) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    if (allData.length === 0) {
      ElMessage.warning('没有数据可导出');
      return;
    }

    // 获取表格列配置，并过滤掉不需要导出的列
    const allColumns = useGridColumns();
    const exportColumns = allColumns.filter(
      col => col.field && col.type !== 'checkbox' && col.title !== '操作'
    ).map(col => ({ field: col.field, title: col.title }));

    // 构建 Excel 数据：表头 + 数据行
    const wsData = [];
    // 添加表头（按表格列顺序）
    wsData.push(exportColumns.map(col => col.title));
    // 添加数据行
    allData.forEach(item => {
      const row = exportColumns.map(col => item[col.field] ?? '-');
      wsData.push(row);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '评价对象');

    // 根据当前标签生成文件名
    let fileName;
    if (activeName.value === '全部') {
      const areaName = (searchParams.value.areaName || '全部').replace(/[\\/:*?"<>|]/g, '_');
      fileName = `评价对象信息_${areaName}_${dayjs().format('YYYYMMDD')}.xlsx`;
    } else if (activeName.value === '启用') {
      fileName = `启用评价对象信息_${dayjs().format('YYYYMMDD')}.xlsx`;
    } else if (activeName.value === '停用') {
      fileName = `停用评价对象信息_${dayjs().format('YYYYMMDD')}.xlsx`;
    }

    XLSX.writeFile(wb, fileName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loadingInstance.close();
  }
}

/** 批量导出选中行（按列表字段导出，多 sheet Excel）- 直接从当前表格数据获取 */
async function handleBatchExport() {
  if (checkedIds.value.length === 0) {
    ElMessage.warning('请至少选择一条数据');
    return;
  }

  // 直接从当前表格数据中获取选中行
  const selectedRows = dataObj.list.filter(item => checkedIds.value.includes(item.id));
  if (selectedRows.length === 0) {
    ElMessage.warning('选中的数据不在当前页，请刷新后重试');
    return;
  }

  const loading = ElLoading.service({ text: '正在生成导出文件...' });
  const wb = XLSX.utils.book_new();

  // 获取导出列
  const allColumns = useGridColumns();
  const exportColumns = allColumns.filter(
    col => col.field && col.type !== 'checkbox' && col.title !== '操作'
  ).map(col => ({ field: col.field, title: col.title }));

  try {
    for (const row of selectedRows) {
      // row 已经是格式化后的数据（因为 dataObj.list 经过 formatList 处理）
      const formattedItem = row;

      // 构建导出行
      const rowForSheet = {};
      exportColumns.forEach(col => {
        rowForSheet[col.title] = formattedItem[col.field] ?? '-';
      });

      const ws = XLSX.utils.json_to_sheet([rowForSheet]);

      // 生成 sheet 名称
      let sheetName = (formattedItem.name || `对象_${formattedItem.id}`).replace(/[\\/:*?"<>|]/g, '_');
      if (sheetName.length > 31) sheetName = sheetName.substring(0, 28) + '...';
      let finalSheetName = sheetName;
      let counter = 1;
      while (wb.SheetNames.includes(finalSheetName)) {
        finalSheetName = `${sheetName}_${counter}`;
        counter++;
      }

      XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
    }

    if (wb.SheetNames.length === 0) {
      ElMessage.warning('没有有效数据可导出');
      return;
    }

    // 生成文件名：统一为“批量导出_日期.xlsx”（带时间戳）
    const fileName = `批量导出_${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    XLSX.writeFile(wb, fileName);
    ElMessage.success('导出成功');
  } catch (error) {
    console.error('批量导出失败', error);
    ElMessage.error(error.message || '导出失败');
  } finally {
    loading.close();
  }
}

/** 新增 */
function handleCreate() {
  formDrawerApi.setData({ title: textObj.addText }).open();
}

/** 编辑 */
function handleEdit(row) {
  formDrawerApi.setData({ title: textObj.editText, ...row }).open();
}

/** 删除 */
async function handleDelete(row) {
  await confirm($t('确定删除该评价对象吗？'));
  const loadingInstance = ElLoading.service({ text: $t('ui.actionMessage.deleting') });
  try {
    await deleteObject(row.id);
    ElMessage.success($t('ui.actionMessage.deleteSuccess'));
    emit('refresh-chart'); // 触发图表刷新
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 停用 */
async function handleDisable(row) {
  if (row.statusId !== 1) {
    ElMessage.warning(`当前状态不是启用，不能执行停用操作`);
    return;
  }
  await confirm('确定停用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '停用中...' });
  try {
    await updateObject({ id: row.id, statusId: 2 });
    ElMessage.success('已停用');
    emit('refresh-chart'); // 触发图表刷新
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 启用 */
async function handleEnable(row) {
  if (row.statusId !== 2) {
    ElMessage.warning(`当前状态不是停用，不能执行启用操作`);
    return;
  }
  await confirm('确定启用该评价对象吗？');
  const loadingInstance = ElLoading.service({ text: '启用中...' });
  try {
    await updateObject({ id: row.id, statusId: 1 });
    ElMessage.success('已启用');
    emit('refresh-chart'); // 触发图表刷新
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 批量状态变更（停用/启用） */
async function handleBatchStatusChange() {
  const targetStatus = activeName.value === '停用' ? '启用' : '停用';
  const targetStatusId = targetStatus === '启用' ? 1 : 2;
  await confirm(`确定将选中的对象${targetStatus}吗？`);

  const validIds = checkedIds.value.filter(id => {
    const row = dataObj.list.find(item => item.id === id);
    if (targetStatus === '启用') return row?.statusId === 2;
    else return row?.statusId === 1;
  });
  if (validIds.length === 0) {
    ElMessage.warning('选中的对象中没有可操作的数据');
    return;
  }

  const loadingInstance = ElLoading.service({ text: '处理中...' });
  try {
    await Promise.all(validIds.map(id => updateObject({ id, statusId: targetStatusId })));
    ElMessage.success(`批量${targetStatus}成功`);
    emit('refresh-chart'); // 触发图表刷新
    checkedIds.value = [];
    handleRefresh();
    fetchStatusCount();
  } finally {
    loadingInstance.close();
  }
}

/** 获取状态统计数据 */
async function fetchStatusCount() {
  try {
    const res = await getStatusCount();
    tabsData.value[0].count = res.totalCount || 0;
    tabsData.value[1].count = res.status1Count || res.enabled || 0;
    tabsData.value[2].count = res.status2Count || res.disabled || 0;
  } catch (error) {
    console.error('获取状态统计失败', error);
  }
}

// 选中 ID
const checkedIds = ref([]);
function handleRowCheckboxChange({ records }) {
  checkedIds.value = records.map(item => item.id);
}

// 表格数据对象
const dataObj = reactive({
  totalShow: false,
  detailObj: {},
  garageDetail: {},
  total: 0,
  currentPage: 1,
  pageSize: 10,
  list: [],
  editObj: {},
});

const changeTotalShow = () => {
  dataObj.totalShow = !dataObj.totalShow;
};

// 通用的列表格式化函数
function formatList(list) {
  return (list || []).map(item => {
    try {
      let createTime = '-';
      if (item.createTime != null) {
        try {
          createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          console.warn(`条目 ${item.id} createTime 格式化失败`, item.createTime, e);
        }
      }

      let updateTime = '-';
      const updateTimeField = item.updateTime ?? item.bizUpdateTime;
      if (updateTimeField != null) {
        try {
          updateTime = dayjs(updateTimeField).format('YYYY-MM-DD HH:mm:ss');
        } catch (e) {
          console.warn(`条目 ${item.id} updateTime 格式化失败`, updateTimeField, e);
        }
      }

      let changeLogShort = '-';                           // 1. 默认值设为 '-'
      if (item.changeLog != null) {                       // 2. 判断 changeLog 是否非 null
        try {
          const logStr = String(item.changeLog);          // 3. 强制转为字符串（避免直接调用 substring 报错）
          changeLogShort = logStr.length > 50            // 4. 判断长度
            ? logStr.substring(0, 50) + '...'            //   超过50则截断并加省略号
            : logStr;                                      //   否则原样赋值
        } catch (e) {
          console.warn(`条目 ${item.id} changeLog 处理失败`, item.changeLog, e);  // 5. 异常时仅打印警告，changeLogShort 保持 '-'
        }
      }

      return {
        ...item,
        areaName: item.areaName ?? '-',
        objectTypeName: item.objectTypeName ?? '-',
        managerName: item.managerName ?? '-',
        managerPhone: item.managerPhone ?? '-',
        relatedName: item.relatedName ?? '-',
        statusName: item.statusName ?? '-',
        createUserName: item.createUserName ?? '-',
        updateUserName: item.updateUserName ?? '-',
        createTime,
        updateTime,
        changeLogShort,
      };
    } catch (err) {
      console.error(`处理条目 ${item.id || 'unknown'} 时发生严重错误`, err, item);
      return {
        id: item.id,
        name: item.name || '数据异常',
        code: '-',
        areaName: '-',
        objectTypeName: '-',
        managerName: '-',
        managerPhone: '-',
        relatedName: '-',
        statusName: '-',
        createUserName: '-',
        updateUserName: '-',
        createTime: '-',
        updateTime: '-',
        changeLogShort: '数据解析错误',
      };
    }
  });
}

// 获取表格数据
const getTableData = async ({ page }) => {
  const params = {
    pageNo: page.currentPage,
    pageSize: page.pageSize,
    ...searchParams.value,
  };
  if (activeName.value !== '全部') {
    params.statusId = activeName.value === '启用' ? 1 : 2;
  }

  try {
    const res = await getAllPage(params);
    const { list, total } = res;
    const formattedList = formatList(list);
    dataObj.list = formattedList;
    dataObj.total = total;
    return dataObj;
  } catch (error) {
    const responseData = error?.response?.data;
    if (responseData?.data && Array.isArray(responseData.data.list)) {
      const { list, total } = responseData.data;
      const formattedList = formatList(list);
      dataObj.list = formattedList;
      dataObj.total = total;
      return dataObj;
    } else if (responseData && Array.isArray(responseData.list)) {
      const { list, total } = responseData;
      const formattedList = formatList(list);
      dataObj.list = formattedList;
      dataObj.total = total;
      return dataObj;
    }

    console.error('表格数据获取失败，错误详情：', error);
    dataObj.list = [];
    dataObj.total = 0;
    return dataObj;
  }
};

// 搜索表单
const [QueryForm, queryFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: { class: 'w-full' },
    formItemClass: 'col-span-2',
    labelWidth: 100,
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: useQuerySchema(),
  showCollapseButton: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: {
    content: '重置',
    onClick: () => {
      queryFormApi.resetForm();
      queryFormApi.submitForm();
    }
  }
});

function onSubmit(values) {
  searchParams.value = values;
  drawerApi.close();
  handleRefresh();
}

// 表格实例
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    keepSource: true,
    proxyConfig: {
      ajax: { query: async ({ page }) => getTableData({ page }) },
    },
    rowConfig: { keyField: 'id', isHover: true },
    pagerConfig: dataObj,
    toolbarConfig: {
      'class-name': 'common-tool-bar-config',
      refresh: true,
      search: true,
    },
    showOverflow: true,
  },
  gridEvents: {
    checkboxAll: handleRowCheckboxChange,
    checkboxChange: handleRowCheckboxChange,
  },
  showSearchForm: false,
});

// 标签页
const activeName = ref('全部');
const handleGarageOpenDetail = (row) => {
  dataObj.garageDetail = row;
  garageDetailRef.value.open();
};

const tabsData = ref([
  { label: '全部', name: '全部', count: 0 },
  { label: '启用', name: '启用', count: 0 },
  { label: '停用', name: '停用', count: 0 },
]);

const createLabel = (item) => `${item.label} (${item.count})`;

const handleClick = () => {
  handleRefresh();
};

const handleSerachShow = () => {
  drawerApi.open();
};

const handleFullShow = () => {
  screenfull.toggle();
};

const garageDetailRef = ref(null);

const arrowChange = () => {
  emit('arrow-change');
};

// 导入相关
const importDialogVisible = ref(false);
const importFile = ref(null);
const importLoading = ref(false);
const uploadRef = ref(null);

function handleImport() {
  importDialogVisible.value = true;
}

function handleFileChange(file) {
  importFile.value = file.raw;
  return false;
}

/** 前端生成导入模板 */
async function handleDownloadTemplate() {
  const loadingInstance = ElLoading.service({ text: '生成模板中...' });
  try {
    const headers = importFields.map(field => field.label);

    // 新增：备注行（每个单元格填充相同提示）
    const remarkRow = importFields.map(() =>
      '# 请在示例行下方填写真实数据，示例数据仅供参考，上传时将自动忽略备注和示例行'
    );

    // 示例数据保持不变
    const exampleData = {
      name: '示例上海市浦东新区人民医院',
      code: '示例OBJ_SH_PD',
      areaName: '上海市',
      objectTypeName: '事业单位',
      managerName: '李四',
      managerPhone: '13900139000',
      relatedName: '第二网格',
      statusId: 1,
    };
    const exampleRow = importFields.map(field => {
      if (field.key in exampleData) return exampleData[field.key];
      if (field.defaultValue !== undefined) return field.defaultValue;
      return '';
    });

    // 构建三行：表头、备注、示例
    const wsData = [headers, remarkRow, exampleRow];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, '模板');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '评价对象导入模板.xlsx';
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success('模板生成成功');
  } catch (error) {
    console.error('生成模板失败', error);
    ElMessage.error('模板生成失败，请重试');
  } finally {
    loadingInstance.close();
  }
}

// 上传处理
async function submitImport() {
  if (!importFile.value) {
    ElMessage.warning('请选择文件');
    return;
  }
  importLoading.value = true;
  try {
    const file = importFile.value;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    let newRows;
    if (rows.length >= 4) {
      // 有表头 + 备注 + 示例 + 用户数据 → 删除第2、3行，保留表头和第4行及以后
      newRows = [rows[0], ...rows.slice(3)];
    } else if (rows.length === 3) {
      // 只有表头、备注、示例，没有用户数据 → 只保留表头
      newRows = [rows[0]];
    } else {
      // 长度 ≤2，可能是用户自己准备的文件（只有表头和数据），直接保留原样
      newRows = rows;
    }

    // 重新生成 Excel 文件
    const newWorksheet = XLSX.utils.aoa_to_sheet(newRows);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, firstSheetName);
    const newFileArrayBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    const newFile = new File([newFileArrayBuffer], file.name, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const res = await importObjects(newFile);
    ElMessage.success(`导入成功`);
    emit('refresh-chart'); // 触发图表刷新
    importDialogVisible.value = false;
    handleRefresh();
    fetchStatusCount();
    if (uploadRef.value) {
      uploadRef.value.clearFiles();
    }
    importFile.value = null;
  } catch (error) {
    ElMessage.error(error.message || '导入失败');
  } finally {
    importLoading.value = false;
  }
}

// ---------- 钻取筛选功能 ----------
/** 点击字段进行筛选 */
function handleFieldClick(fieldName, value) {
  // 如果是状态筛选，同时将标签页切换为“全部”，避免与状态标签页冲突
  if (fieldName === 'statusName') {
    activeName.value = '全部';
  }
  // 直接更新 searchParams（保留其他已有条件）
  searchParams.value = { ...searchParams.value, [fieldName]: value };
  // 同步更新查询表单的值（便于查看当前条件）
  queryFormApi.setValues({ [fieldName]: value });
  // 手动刷新表格
  handleRefresh();
}

/** 清除字段筛选 */
function handleClearField(fieldName) {
  // 从 searchParams 中移除该字段
  const newParams = { ...searchParams.value };
  delete newParams[fieldName];
  searchParams.value = newParams;
  // 清空查询表单对应字段
  queryFormApi.setValues({ [fieldName]: '' });
  // 刷新表格
  handleRefresh();
}
// ---------------------------------

onMounted(() => {
  handleRefresh();
  fetchStatusCount();
});
</script>

<template>
  <div class="park-lot-table-new">
    <FormDrawer :title="getTitle">
      <Form />
    </FormDrawer>
    <garageDetailDrawer
      ref="garageDetailRef"
      :detail-obj="dataObj.garageDetail"
    />
    <Drawer title="搜索">
      <QueryForm class="query-form" />
    </Drawer>

    <Grid>
      <template #table-title>
        <div class="tabel-tabs" style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center">
          <!-- 原有的标签页 -->
          <div v-if="props.secondShow">
            <el-tabs
              v-model="activeName"
              class="demo-tabs"
              @tab-change="handleClick"
            >
              <el-tab-pane
                v-for="item in tabsData"
                :key="item.label"
                :label="createLabel(item)"
                :name="item.label"
              />
            </el-tabs>
          </div>

          <!-- 钻取筛选标签 -->
          <el-tag
            v-if="searchParams.code"
            type="primary"
            closable
            @close="handleClearField('code')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            对象编码：{{ searchParams.code }}
          </el-tag>
          <el-tag
            v-if="searchParams.areaName"
            type="primary"
            closable
            @close="handleClearField('areaName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            所属区域：{{ searchParams.areaName }}
          </el-tag>
          <el-tag
            v-if="searchParams.objectTypeName"
            type="primary"
            closable
            @close="handleClearField('objectTypeName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            对象类型：{{ searchParams.objectTypeName }}
          </el-tag>
          <el-tag
            v-if="searchParams.relatedName"
            type="primary"
            closable
            @close="handleClearField('relatedName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            关联网格/部门：{{ searchParams.relatedName }}
          </el-tag>
          <el-tag
            v-if="searchParams.statusName"
            type="primary"
            closable
            @close="handleClearField('statusName')"
            style="height: 32px; margin: 4px 0; line-height: 32px"
          >
            状态：{{ searchParams.statusName }}
          </el-tag>
        </div>
      </template>
      <template #toolbar-tools>
        <div class="common-toolbar-tools">
          <!-- 全部标签下的按钮 -->
          <template v-if="activeName === '全部'">
            <IconButton content="新增" icon-name="Plus" @click="handleCreate" />
            <IconButton content="导入" icon-name="Upload" @click="handleImport" />
            <IconButton content="导出" icon-name="download" @click="handleExport" />
          </template>

          <!-- 启用/停用标签下的按钮 -->
          <template v-else>
            <IconButton content="导出" icon-name="download" @click="handleExport" />
            <!-- 批量导出按钮（多 sheet Excel） -->
            <IconButton
              content="批量导出"
              icon-name="download"
              :disabled="isEmpty(checkedIds)"
              @click="handleBatchExport"
            />
          </template>

          <!-- 批量停用/启用按钮 -->
          <IconButton
            v-if="activeName !== '停用'"
            content="批量停用"
            icon-name="close"
            color="#F56C6C"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton
            v-if="activeName === '停用'"
            content="批量启用"
            icon-name="check"
            color="#67C23A"
            :disabled="isEmpty(checkedIds)"
            @click="handleBatchStatusChange"
          />
          <IconButton content="搜索" icon-name="search" @click="handleSerachShow" />
          <IconButton
            :content="props.arrowShow ? '展开' : '收缩'"
            :icon-name="props.arrowShow ? 'ArrowUp' : 'ArrowDown'"
            @click="arrowChange"
          />
          <IconButton content="全屏" icon-name="FullScreen" @click="handleFullShow" />
        </div>
      </template>
      <!-- 对象名称列插槽，点击打开详情 -->
      <template #name="{ row }">
        <el-text
          @click="handleGarageOpenDetail(row)"
          class="common-align"
          type="primary"
        >
          {{ row.name }}
        </el-text>
      </template>
      <!-- 钻取字段插槽 -->
      <template #code="{ row }">
        <el-text @click="handleFieldClick('code', row.code)" class="common-align" type="primary">
          {{ row.code }}
        </el-text>
      </template>
      <template #areaName="{ row }">
        <el-text @click="handleFieldClick('areaName', row.areaName)" class="common-align" type="primary">
          {{ row.areaName }}
        </el-text>
      </template>
      <template #objectTypeName="{ row }">
        <el-text @click="handleFieldClick('objectTypeName', row.objectTypeName)" class="common-align" type="primary">
          {{ row.objectTypeName }}
        </el-text>
      </template>
      <template #relatedName="{ row }">
        <el-text @click="handleFieldClick('relatedName', row.relatedName)" class="common-align" type="primary">
          {{ row.relatedName }}
        </el-text>
      </template>
      <template #statusName="{ row }">
        <el-text @click="handleFieldClick('statusName', row.statusName)" class="common-align" type="primary">
          {{ row.statusName }}
        </el-text>
      </template>
      <template #actions="{ row }">
        <div class="table-toolbar-tools" style="display: flex; align-items: center; justify-content: center; gap: 4px;">
          <IconButton content="详情" icon-name="View" @click="handleGarageOpenDetail(row)" />
          <IconButton content="编辑" icon-name="edit" @click="handleEdit(row)" />
          <IconButton content="删除" icon-name="delete" color="#F56C6C" @click="handleDelete(row)" />
          <IconButton v-if="row.statusId === 1" content="停用" icon-name="close" color="#F56C6C" @click="handleDisable(row)" />
          <IconButton v-if="row.statusId === 2" content="启用" icon-name="check" color="#67C23A" @click="handleEnable(row)" />
        </div>
      </template>
      <template #bottom>
        <div class="common-total" @click="changeTotalShow">
          <el-icon class="tabel-tab-icon" v-if="!dataObj.totalShow"><ArrowDown /></el-icon>
          <el-icon class="tabel-tab-icon" v-if="dataObj.totalShow"><ArrowUp /></el-icon>
          <span>本页统计：对象数量{{ dataObj.list.length }}，启用{{ dataObj.list.filter(v => v.statusId === 1).length }}，停用{{ dataObj.list.filter(v => v.statusId === 2).length }}</span>
        </div>
        <div class="common-total-bottom" v-if="dataObj.totalShow">
          <span>全部统计：对象总数{{ dataObj.total }}</span>
        </div>
      </template>
    </Grid>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialogVisible" title="批量导入" width="400px" destroy-on-close>
      <div style="margin-bottom: 16px; text-align: right;">
        <el-button type="primary" link @click="handleDownloadTemplate">下载模板</el-button>
      </div>
      <el-upload
        ref="uploadRef"
        action="#"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".xlsx,.xls"
      >
        <template #trigger>
          <el-button type="primary">选择 Excel 文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">只能上传 .xlsx 或 .xls 文件</div>
        </template>
      </el-upload>
      <template #footer>
        <span>
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="importLoading" @click="submitImport">确认导入</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
